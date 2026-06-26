/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import Groq from "groq-sdk";
import dotenv from "dotenv";
import { GRAMMAR_LIBRARY } from "./src/components/tools/grammarLibraryData";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Groq lazily
let groqInstance: Groq | null = null;

function getGroq(): Groq {
  if (!groqInstance) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.warn("WARNING: GROQ_API_KEY is not defined. Calls to Groq endpoints will fall back to local responses or fail gracefully.");
    }
    groqInstance = new Groq({ 
      apiKey: apiKey || "MISSING_API_KEY",
    });
  }
  return groqInstance;
}

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", env: process.env.NODE_ENV });
});

app.post("/api/tutor", async (req, res) => {
  const { message, history, systemPrompt, currentSpeed, conversationMode, hobby, channel } = req.body;
  console.log(`[ALERTA NATIVA] Modo: ${conversationMode} | Velocidad: ${currentSpeed}`);

  // Si llega undefined o vacío, fuérzalo a 'basic'
  const mode = conversationMode || 'basic';

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    let speedLabel = '';

    let finalSystemPrompt = '';
    if (mode === 'native') {
      speedLabel = 'Native';
      finalSystemPrompt = `You are a highly articulate native English speaker with encyclopedic knowledge. Discuss any topic with sophistication — film, science, culture, history, philosophy — using varied vocabulary and natural grammatical structures.

ABSOLUTE BANS:
- Never repeat the same word or phrase across consecutive sentences.
- Do NOT use filler crutches like "always", "journey", "perfectly", "absolutely", "truly", "indeed", or similar padding.
- Do NOT include the user's name in every response. Use it sparingly and naturally, as a real person would.
- Never sound like a template, advertisement, or customer-service bot.

YOUR ONLY CONSTRAINT:
- Every response MUST contain between 7 and 25 words. Express a complete, fluid, and elegant idea within that range.
- If asked in Spanish, reply with perfectly fluent, natural, native-level Spanish — not broken translator output.

OUTPUT: Return ONLY the clean reply text. No quotes, no metadata, no markdown.`;
    } else if (mode === 'casual') {
      speedLabel = 'Casual';
      finalSystemPrompt = `You are a sharp, warm, and witty native English conversationalist. You can effortlessly chat about any topic — movies, music, tech, travel, daily life — with a relaxed and genuine tone.

ABSOLUTE BANS:
- Never echo the same vocabulary across replies. Vary your word choice.
- Do NOT use robotic crutch words like "always", "journey", "absolutely", "great", "perfect", "indeed".
- Do NOT overuse the user's name. Once every several messages is plenty.
- Never sound like a scripted language tutor. Be a real person.

YOUR ONLY CONSTRAINT:
- Every response MUST contain between 7 and 10 words. Keep it warm, punchy, and complete.
- If asked in Spanish, reply with natural, fluid, native-level Spanish.

OUTPUT: Return ONLY the clean reply text. No quotes, no metadata, no markdown.`;
    } else {
      let minWords = 0, maxWords = 0;
      const speed = parseFloat(currentSpeed) || 1.0;
      if (speed <= 0.60) {
        minWords = 7; maxWords = 10; speedLabel = '0.60x';
      } else if (speed <= 0.75) {
        minWords = 10; maxWords = 15; speedLabel = '0.75x';
      } else if (speed <= 0.88) {
        minWords = 15; maxWords = 20; speedLabel = '0.88x';
      } else {
        minWords = 20; maxWords = 25; speedLabel = '1.00x';
      }
      finalSystemPrompt = `You are an eloquent, knowledgeable native English speaker with broad expertise across culture, science, arts, technology, and everyday life. You sound like an intelligent adult having a natural conversation — never like a teacher, script, or robot.

ABSOLUTE BANS:
- Never repeat the same word or phrase in back-to-back sentences.
- Do NOT use generic filler words ever ("always", "journey", "great", "perfectly", "absolutely", "indeed", "truly", "wonderful").
- Do NOT insert the user's name unless it feels completely natural and you have not used it recently.
- No formulaic structures. Each response must feel fresh and spontaneous.

YOUR ONLY CONSTRAINT:
- Every response MUST contain between ${minWords} and ${maxWords} words. Write a complete, flowing, intellectually honest thought within that range.
- If asked in Spanish, reply with perfectly fluid, natural, native-level Spanish.

OUTPUT: Return ONLY the clean reply text. No quotes, no metadata, no markdown.`;
    }

    const messages: any[] = [
      {
        role: "system",
        content: finalSystemPrompt || systemPrompt || `Eres TECLINGO, un tutor pedagógico de inglés experto y compasivo para nuestra plataforma de aprendizaje de idiomas.
Tu conocimiento debe centrarse EXCLUSIVAMENTE En lo académico, alineado rigurosamente con el Marco Común Europeo de Referencia para las lenguas (MCER / CEFR), desde niveles A1 hasta C2.
Tus respuestas deben ser claras, detalladas, profesionales y con una estructura muy pedagógica.

Sigue estrictamente estas directrices:
1. Explica la regla de gramática sobre la que te pregunten detalladamente y con calidez pedagógica. Si te preguntan en español, contesta en español.
2. Proporciona SIEMPRE ejemplos prácticos en inglés formateados y destacados de forma elegante, junto con sus traducciones al español.
3. Si el usuario te hace preguntas que no sean de estudio académico de inglés (como debatir política o temas irrelevantes), guíalo amablemente de regreso a las reglas de inglés, gramática, oraciones o vocabulario.`
      }
    ];
    if (Array.isArray(history)) {
      history.forEach((h: any) => {
        if (h.role && h.parts && Array.isArray(h.parts)) {
          const role = h.role === 'assistant' ? 'assistant' : 'user';
          const content = h.parts.map((p: any) => p.text || p.content || "").join(" ");
          messages.push({ role, content });
        }
      });
    }
    messages.push({ role: "user", content: message });

    const result = await getGroq().chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: messages,
    });

    const content = result.choices[0]?.message?.content || "Lo siento, no pude procesar la respuesta.";
    const sources: Array<{ title: string; uri: string }> = [];

    res.json({ content, sources });
  } catch (error: any) {
    console.error("AI Tutor Error:", error);
    
    const query = (message || "").toLowerCase().trim();
    
    // Buscar coincidencia en la biblioteca pedagógica local (Grammar Library) de TECLINGO
    const matchedTopic = GRAMMAR_LIBRARY.find(topic => {
      return (
        topic.keywords.some(keyword => query.includes(keyword)) ||
        query.includes(topic.title.toLowerCase()) ||
        query.includes(topic.titleEn.toLowerCase()) ||
        query.includes(topic.id)
      );
    });

    if (matchedTopic) {
      let responseText = `**[Biblioteca Académica TECLINGO MCER: ${matchedTopic.title} (${matchedTopic.mcer})]**\n\n${matchedTopic.explanation}\n\n**Estructura Gramatical:**\n\`${matchedTopic.structure}\`\n\n**Ejemplos de práctica oficial:**\n`;
      
      matchedTopic.examples.forEach(ex => {
        responseText += `• **En inglés:** "${ex.en}"\n  **En español:** "${ex.es}" ${ex.note ? `*(Nota: ${ex.note}*)\n` : '\n'}`;
      });
      
      responseText += `\n\n*(Soporte de Contingencia: He recuperado esta explicación exacta de nuestra Biblioteca de Referencia Gramatical MCER local debido a una desconexión temporal de red).*`;

      return res.json({ 
        content: responseText,
        fallback: true,
        topicId: matchedTopic.id
      });
    }

    // Fallback genérico estructurado si no hay coincidencia semántica
    const listadoTemas = GRAMMAR_LIBRARY.map(t => `• **${t.title}** (Nivel ${t.mcer})`).join("\n");
    const responseText = `¡Hello! Soy tu tutor pedagógico de inglés en TECLINGO. 

Actualmente he tenido una pequeña pausa de comunicación con los servicios en la nube de IA principales. Sin embargo, puedo brindarte soporte académico completo sobre cualquier tema gramatical de nuestra **Biblioteca Local de Gramática MCER** incorporada:

${listadoTemas}

¿Qué tema te gustaría repasar o estudiar hoy? Escribe tu duda o indica el tema para proporcionarte una explicación completa con ejemplos.`;

    res.json({ 
      content: responseText,
      fallback: true,
      info: "Servicio en modo de contingencia local activa con la Biblioteca de Gramática instalada."
    });
  }
});

app.post("/api/grammar/analyze", async (req, res) => {
  const { text, expertMode } = req.body;
  console.log(`[Grammar] Analyze request (Expert Mode: ${!!expertMode})`);
  if (!text) return res.status(400).json({ error: "Text is required" });

  try {
    const prompt = expertMode
      ? `Realiza un análisis de estilo extremadamente exhaustivo y avanzado para el siguiente texto en inglés. 
      Proporciona:
      1. Un puntaje de calidad sumamente riguroso (0-100).
      2. Una estimación del nivel del Marco Común Europeo (MCER/CEFR) entre: 'A1', 'A2', 'B1', 'B2', 'C1', 'C2' basado en la complejidad de las estructuras gramaticales, tiempos verbales y vocabulario. Nota: Si la frase es muy corta o simple (e.g. menos de 10 palabras), no debería pasar de A1 o A2 por más correcta que sea. Para llegar a B1/B2 requiere cláusulas subordinadas, conjunciones o pasiva. Para C1/C2 requiere estructuras avanzadas, inversiones, vocabulario muy formal o estilo literario.
      3. Una sugerencia de estilo avanzada (vocabulario elevado, sutilezas idiomáticas, flujo cohesivo o inversiones sintácticas elegantes).
      
      Texto: "${text}"`
      : `Analiza el siguiente texto en inglés y proporciona:
      1. Un puntaje de calidad (0-100).
      2. Una estimación del nivel del Marco Común Europeo (MCER/CEFR) entre: 'A1', 'A2', 'B1', 'B2', 'C1', 'C2' basado en complejidad gramatical y de vocabulario. Si la frase es muy simple o corta, no puede superar A1 o A2. La longitud y el uso opcional de cláusulas relativas, pasiva o tiempos perfectos ayuda a subir de nivel.
      3. Una sugerencia de estilo breve y motivadora para escribir mejor y más.
      
      Texto: "${text}"`;

    const result = await getGroq().chat.completions.create({
      model: "llama3-70b-8192",
      messages: [
        {
          role: "system",
          content: "You are an expert English grammar analyzer. Always respond with valid JSON matching exactly this schema: { \"score\": number (0-100), \"cefr\": string (A1/A2/B1/B2/C1/C2), \"suggestion\": string }. Output ONLY the JSON object, no other text."
        },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
    });

    const responseText = result.choices[0]?.message?.content;
    if (responseText) {
      res.json(JSON.parse(responseText));
    } else {
      res.json({ 
        score: expertMode ? 75 : 80, 
        cefr: expertMode ? "B1" : "A2",
        suggestion: expertMode ? "Advanced evaluation suggests improving complexity and flow." : "Good effort, but could be more professional." 
      });
    }
  } catch (error) {
    console.error("Grammar Analysis Error:", error);
    
    // Heurística de respaldo de alta calidad para análisis gramatical local con CEFR
    const sample = text.trim();
    let score = expertMode ? 85 : 90;
    let cefr = "A2";
    let suggestion = expertMode 
      ? "Advanced structure is acceptable. For an expert score (95+), try integrating more sophisticated reporting verbs (e.g., 'argued', 'asserted') or cleft sentences."
      : "Excellent sentence structure and vocabulary choices! Keep practicing.";
    
    if (sample.length === 0) {
      score = 0;
      cefr = "A1";
      suggestion = "Please enter some text to write and evaluate.";
    } else if (sample.toLowerCase().includes(" i ") && !sample.includes(" I ")) {
      score = 65;
      cefr = "A1";
      suggestion = "Critical grammatical error: the personal pronoun 'I' must be capitalized. Expert evaluation demands correct punctilious conjugation.";
    } else if (sample.toLowerCase().includes("she have") || sample.toLowerCase().includes("he have") || sample.toLowerCase().includes("it have")) {
      score = 60;
      cefr = "A1";
      suggestion = "Agreement failure: 'has' instead of 'have' with third-person singular subjects (he/she/it).";
    } else if (sample.toLowerCase().includes("you is") || sample.toLowerCase().includes("they is") || sample.toLowerCase().includes("we is")) {
      score = 60;
      cefr = "A1";
      suggestion = "Subject-verb alignment failure: 'you/we/they' align with 'are'.";
    } else if (sample.length < 15) {
      score = 70;
      cefr = "A1";
      suggestion = expertMode 
        ? "The input is far too brief to assess academic stylistic resonance. Expand into fully developed subordinate clauses."
        : "Your sentence is correct but very generic. Try adding details (adjectives or adverbs) to enrich it.";
    } else if (sample.length < 40) {
      score = 80;
      cefr = "A2";
      suggestion = "Good grammar, but quite short. Try adding complexity or using perfect tenses to reach B1/B2!";
    } else if (sample.length < 80) {
      score = 85;
      cefr = "B1";
      suggestion = "Nicely developed sentence structure! Try to incorporate more advanced relative clauses or professional lexicon to target B2.";
    } else if (sample.length < 120) {
      score = 90;
      cefr = "B2";
      suggestion = "Excellent. Your writing is clear, structured and rich. Use passive voice, inversion or cleft sentences to aspire C1!";
    } else {
      score = 95;
      cefr = "C1";
      suggestion = "Superb! Highly robust syntactic coherence, elegant and cohesive vocabulary choices. You are writing at professional level C1.";
    }
    
    res.json({ score, cefr, suggestion, fallback: true });
  }
});

app.post("/api/grammar/verify", async (req, res) => {
  const { spanish, studentEnglish, targetEnglish } = req.body;
  console.log(`[Grammar] Verify request`);
  
  try {
    const prompt = `Evalúa la traducción del alumno.
    Frase en español: "${spanish}"
    Traducción del alumno: "${studentEnglish}"
    Referencia esperada: "${targetEnglish}"`;

    const result = await getGroq().chat.completions.create({
      model: "llama3-70b-8192",
      messages: [
        {
          role: "system",
          content: "You are an expert English language translator evaluator. Always respond with valid JSON matching exactly this schema: { \"score\": number (0-100), \"details\": string }. Output ONLY the JSON object, no other text."
        },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
    });

    const text = result.choices[0]?.message?.content;
    if (text) {
      res.json(JSON.parse(text));
    } else {
      res.json({ score: 70, details: "Revisa la concordancia verbal y el vocabulario." });
    }
  } catch (error) {
    console.error("Grammar Verify Error:", error);
    
    // Algoritmo local de concordancia de texto para evaluar la traducción
    const cleanStudent = (studentEnglish || "").toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").trim();
    const cleanTarget = (targetEnglish || "").toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").trim();
    
    if (cleanStudent === cleanTarget) {
      res.json({
        score: 100,
        details: "¡Traducción perfecta! Has igualado exactamente la frase de referencia esperada.",
        fallback: true
      });
      return;
    }
    
    // Contar coincidencia de palabras
    const studentWords = cleanStudent.split(/\s+/);
    const targetWords = cleanTarget.split(/\s+/);
    
    let matchedWords = 0;
    targetWords.forEach(word => {
      if (studentWords.includes(word)) {
        matchedWords++;
      }
    });
    
    const wordRatio = matchedWords / Math.max(targetWords.length, 1);
    const score = Math.max(30, Math.round(wordRatio * 100));
    
    let details = `Buen intento. Tu traducción coincide en un ${Math.round(wordRatio * 100)}% con la referencia esperada: "${targetEnglish}".`;
    if (score >= 90) {
      details += " ¡Excelente trabajo, diferencias mínimas de puntuación o sinónimos!";
    } else if (score >= 70) {
      details += " Revisa con atención el orden de las palabras y el vocabulario clave.";
    } else {
      details += " Te recomendamos comparar tu estructura con la respuesta recomendada para identificar la diferencia principal.";
    }
    
    res.json({ score, details, fallback: true });
  }
});

// Google Translate TTS Proxy (gratuito, sin API key)
// Regla estricta: máximo 25 palabras para audios dinámicos
app.post("/api/tts", async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Text is required" });

  // Filtro estricto: limpiar texto y truncar a 25 palabras máximo
  const cleanText = text.replace(/\s+/g, ' ').trim();
  const words = cleanText.split(' ');
  const truncated = words.slice(0, 25).join(' ');
  console.log(`[TTS] Texto original: ${words.length} palabras | Truncado: ${truncated.split(' ').length} palabras`);

  const lang = "en";

  // Bypass de velocidad: si mide ≤ 160 chars, petición directa sin chunking
  try {
    if (truncated.length <= 160) {
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${lang}&client=tw-ob&q=${encodeURIComponent(truncated)}`;
      const response = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }
      });
      if (!response.ok) {
        console.error("[TTS] Google TTS error:", response.status);
        return res.status(502).json({ error: "TTS upstream failed" });
      }
      const buf = Buffer.from(await response.arrayBuffer());
      res.set("Content-Type", "audio/mpeg");
      return res.send(buf);
    }

    // Respaldo: texto > 160 chars (casi imposible con 25 palabras), fragmentar seguro
    const MAX_CHARS = 160;
    const chunks: string[] = [];
    let remaining = truncated;
    while (remaining.length > 0) {
      if (remaining.length <= MAX_CHARS) {
        chunks.push(remaining);
        break;
      }
      let cut = remaining.lastIndexOf(' ', MAX_CHARS);
      if (cut === -1) cut = MAX_CHARS;
      chunks.push(remaining.slice(0, cut));
      remaining = remaining.slice(cut).trim();
    }

    const buffers: Buffer[] = [];
    for (const chunk of chunks) {
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${lang}&client=tw-ob&q=${encodeURIComponent(chunk)}`;
      const response = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }
      });
      if (!response.ok) {
        console.error("[TTS] Google TTS error en chunk:", response.status);
        return res.status(502).json({ error: "TTS upstream failed" });
      }
      const buf = Buffer.from(await response.arrayBuffer());
      buffers.push(buf);
    }

    res.set("Content-Type", "audio/mpeg");
    res.send(Buffer.concat(buffers));
  } catch (error) {
    console.error("[TTS] Proxy error:", error);
    res.status(500).json({ error: "TTS proxy failed" });
  }
});

// AI Translation endpoint (English -> Spanish)
app.post("/api/translate", async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Text is required" });

  try {
    const groq = getGroq();
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are a translator. Translate the given English text to Spanish. Return ONLY the translated text, no quotes, no metadata, no explanation.",
        },
        { role: "user", content: text },
      ],
      temperature: 0.3,
      max_tokens: 200,
    });

    const translation = completion.choices[0]?.message?.content?.trim() || "";
    res.json({ translation });
  } catch (error) {
    console.error("[Translate] Error:", error);
    res.status(502).json({ error: "Translation failed" });
  }
});

// Export Express app for Vercel serverless
export default app;

// Start server locally (not on Vercel)
if (!process.env.VERCEL) {
  async function setupServer() {
    if (process.env.NODE_ENV !== "production") {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } else {
      const distPath = path.join(process.cwd(), "dist");
      app.use(express.static(distPath));
      app.get("*all", (req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
      });
    }

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }

  setupServer();
}
