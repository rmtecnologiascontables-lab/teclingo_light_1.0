/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

interface GrammarTopic {
  id: string;
  title: string;
  titleEn: string;
  mcer: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  category: 'Grammar' | 'Vocabulary' | 'Structure' | 'Syntax';
  summary: string;
  explanation: string;
  structure: string;
  examples: Array<{ en: string; es: string; note?: string }>;
  keywords: string[];
}

const GRAMMAR_LIBRARY: GrammarTopic[] = [
  {
    id: 'third-person',
    title: 'La Tercera Persona (Singular vs Plural)',
    titleEn: 'Third Person Singular & Plural',
    mcer: 'A1',
    category: 'Grammar',
    summary: 'Aprende cómo conjugar verbos en Presente Simple usando pronombres en tercera persona singular (he, she, it) y plural (they).',
    explanation: `En inglés, la conjugación del Presente Simple varía dependiendo de si nos referimos a la tercera persona **singular** o **plural**:

### 1. Tercera Persona Singular (He, She, It)
Cuando el sujeto es *He* (Él), *She* (Ella) o *It* (Eso - objeto/animal), el verbo principal **SIEMPRE cambia** en oraciones afirmativas de presente simple agregando una desinencia:
*   **Regla general:** Añadimos **-s** al final del verbo.
    *   *Ejemplo:* Work -> Work**s**, Play -> Play**s**.
*   **Terminaciones en -ch, -sh, -ss, -x, -z, -o:** Añadimos **-es**.
    *   *Ejemplo:* Watch -> Watch**es**, Go -> Go**es**, Wash -> Wash**es**.
*   **Consonante + Y:** Cambiamos la 'y' por **-ies**.
    *   *Ejemplo:* Study -> Stud**ies**, Fly -> Fl**ies** (Atención: *Play* tiene vocal antes de la Y, por lo tanto solo añade -s: *Plays*).

### 2. Tercera Persona Plural (They)
Cuando el sujeto es *They* (Ellos o Ellas), **NO se modifica el verbo**. Se utiliza el verbo en su **forma base (infinitivo sin "to")**. Esta es una confusión muy común porque en español pensamos en "ellos" como tercera persona y queremos cambiar la terminación, pero en inglés *They* se conjuga exactamente igual que *I*, *You* y *We*.
*   *Ejemplo:* They study (Ellos estudian), They watch (Ellos miran), They go (Ellos van).

### Oraciones Negativas e Interrogativas (Auxiliares)
*   **Singular (He, She, It):** Usa el auxiliar **Does** (oración interrogativa) o **Does not / Doesn't** (oración negativa). El verbo principal vuelve a su **forma base** porque el auxiliar ya lleva la marca de tercera persona.
    *   *Negativa:* He **doesn't work** here. (NO: He doesn't works).
    *   *Pregunta:* **Does** she **like** coffee? (NO: Does she likes).
*   **Plural (They):** Usa el auxiliar **Do** o **Do not / Don't**.
    *   *Negativa:* They **don't work** here.
    *   *Pregunta:* **Do** they **like** coffee?`,
    structure: 'Singular: He/She/It + Verbo(-s/-es) + Comp. | Plural: They + Verbo(Base) + Comp.',
    examples: [
      { en: 'He lives in London.', es: 'Él vive en Londres.', note: 'Tercera persona singular: añade "-s"' },
      { en: 'They live in London.', es: 'Ellos viven en Londres.', note: 'Tercera persona plural: verbo en su forma base' },
      { en: 'She does not speak French.', es: 'Ella no habla francés.', note: 'Auxiliar "does" con verbo base "speak"' },
      { en: 'They do not speak French.', es: 'Ellos no hablan francés.', note: 'Auxiliar "do" con verbo base "speak"' },
      { en: 'Does she study everyday?', es: '¿Ella estudia todos los días?', note: 'Estructura interrogativa para singular' }
    ],
    keywords: ['tercera persona', 'singular', 'plural', 'they', 'he', 'she', 'it', 'pronoun', 'pronombres', 'verbo conjugacion', 'terminacion s', 'doesn\'t', 'does']
  },
  {
    id: 'past-perfect',
    title: 'Pasado Perfecto (Past Perfect Simple)',
    titleEn: 'Past Perfect Tense',
    mcer: 'B1',
    category: 'Grammar',
    summary: 'Domina los eventos que ocurrieron antes de otro punto de referencia en el pasado. Clave para narraciones complejas.',
    explanation: `El Pasado Perfecto se utiliza para indicar que una acción ocurrió en el pasado **antes** que otra acción también en el pasado (que normalmente se describe en Pasado Simple). Actúa como el "pasado del pasado".

### Estructura y Construcción
Se forma utilizando el verbo auxiliar **had** (para todos los sujetos, sin distinción de persona) más el **participio pasado** del verbo principal:
*   **Verbos Regulares:** El participio pasado termina en **-ed** (igual que el pasado simple).
*   **Verbos Irregulares:** Debes usar la tercera columna de los verbos (ej: *go* -> *went* -> **gone**).

### Usos Comunes
1.  **Secuencia de Eventos:** Para clarificar cuál de dos eventos pasados ocurrió primero.
    *   *Ejemplo:* When I arrived at the station, the train **had** already **left**. (Primero se fue el tren, luego llegué yo).
2.  **Conectores Temporales:** Frecuentemente se acompaña de palabras como *already*, *just*, *never*, *before*, *after*, *by the time*.
    *   *By the time we got there, they had finished.* (Para cuando llegamos, ellos habían terminado).
3.  **Condicionales Imaginarios (Tercer Condicional):** Se usa para situaciones hipotéticas del pasado.
    *   *If I had studied, I would have passed.* (Si hubiera estudiado, habría aprobado).`,
    structure: 'Sujeto + had + Verbo(Participio Pasado) + Complemento',
    examples: [
      { en: 'I could not log in because I had forgotten my password.', es: 'No pude iniciar sesión porque había olvidado mi contraseña.', note: 'Olvidar la contraseña ocurrió antes del intento de inicio de sesión' },
      { en: 'The field was wet because it had rained all night.', es: 'El campo estaba mojado porque había llovido toda la noche.', note: 'Llover ocurrió antes de que el campo estuviera mojado' },
      { en: 'Alex went to bed after he had finished his homework.', es: 'Alex se fue a la cama después de haber terminado su tarea.', note: 'Terminar la tarea ocurrió antes de irse a dormir' },
      { en: 'By the time she arrived, they had already decided.', es: 'Para cuando ella llegó, ellos ya habían decidido.', note: 'Decidir ocurrió antes de la llegada' }
    ],
    keywords: ['past perfect', 'pasado perfecto', 'had', 'participio', 'pasado del pasado', 'already', 'before', 'by the time', 'hubiera', 'habia', 'haber']
  },
  {
    id: 'present-vs-continuous',
    title: 'Presente Simple vs Presente Continuo',
    titleEn: 'Present Simple vs Present Continuous',
    mcer: 'A2',
    category: 'Grammar',
    summary: 'Aprende a diferenciar el uso de hábitos habituales (Simple) frente a acciones temporales en progreso (Continuo).',
    explanation: `La diferencia entre el Presente Simple y el Presente Continuo es crucial para expresarte con precisión temporal en inglés.

### 1. Presente Simple (Habits & Facts)
Se utiliza para situaciones que son permanentes, hábitos, rutinas diarias o hechos científicos.
*   **Palabras Clave:** *Always, usually, sometimes, never, every day, on Mondays.*
*   *Uso:* Se enfoca en la regularidad de una acción.
*   *Fórmula afirmativa:* Sujeto + Verbo (añade -s en singular para he/she/it).

### 2. Presente Continuo (Temporary action / Right Now)
Se utiliza para acciones que están sucediendo **exactamente ahora**, alrededor del momento presente, o para situaciones temporales actuales.
*   **Palabras Clave:** *Now, at the moment, currently, right now, look, listen.*
*   *Uso:* Se enfoca en que la acción está en desarrollo activo en este instante.
*   *Fórmula afirmativa:* Sujeto + Verbo auxiliar *to be* (am, is, are) + Verbo principal con terminación **-ing**.

### Verbos de Estado (Stative Verbs) - ¡Excepción Importante!
Ciertos verbos que describen estados, opiniones, sentimientos o posesión **no se suelen usar en tiempos continuos**, incluso si ocurren en este momento.
*   *Verbos comunes:* *like, love, hate, know, understand, believe, need, want, belong.*
*   *Incorrecto:* I am wanting a coffee right now.
*   *Correcto:* I **want** a coffee right now.`,
    structure: 'Simple: Sujeto + Verbo | Continuo: Sujeto + am/is/are + Verbo(-ing)',
    examples: [
      { en: 'I am a teacher and I teach English every day.', es: 'Soy profesor y enseño inglés todos los días.', note: 'Presente simple para una rutina/profesión permanente' },
      { en: 'Shh! I am teaching a class right now.', es: '¡Shh! Estoy enseñando una clase justo ahora.', note: 'Presente continuo para una acción en progreso en este momento' },
      { en: 'They usually wear sneakers, but today they are wearing formal shoes.', es: 'Ellos usualmente usan tenis, pero hoy llevan zapatos formales.', note: 'Contrasta rutina general (Simple) con excepción hoy (Continuo)' },
      { en: 'I do not understand this grammar rule.', es: 'No entiendo esta regla gramatical.', note: 'Usa presente simple porque "understand" es un verbo de estado' }
    ],
    keywords: ['present simple', 'present continuous', 'presente simple', 'presente continuo', 'ing', 'now', 'always', 'rutina', 'habito', 'hecho', 'stative verbs']
  },
  {
    id: 'conditionals-1-2',
    title: 'Condicionales: Tipo 1 (Real) y Tipo 2 (Imaginario)',
    titleEn: 'First & Second Conditionals',
    mcer: 'B1',
    category: 'Structure',
    summary: 'Aprende a formular hipótesis sobre el futuro real y probable (First) frente a escenarios imaginarios u utópicos (Second).',
    explanation: `Los enunciados condicionales se utilizan para especular sobre lo que podría ocurrir, lo que podría haber ocurrido y lo que desearíamos que ocurriese.

### 1. Primer Condicional (First Conditional) - Realidad
Habla de situaciones que son **muy posibles, probables o reales** en el futuro si se cumple una circunstancia determinada.
*   **Estructura:** Condición en presente + Consecuencia en futuro simple (*will*).
*   *Fórmula:* **If + Present Simple, ... Will + Verb(Base)**
*   *Ejemplo:* If you study, you will pass your exam. (Si estudias, pasarás tu examen).

### 2. Segundo Condicional (Second Conditional) - Hipótesis / Sueños
Habla de situaciones que son **altamente improbables, ficticias, imaginarias o imposibles** en el presente o futuro.
*   **Estructura:** Condición en pasado simple + Consecuencia con el auxiliar *would*.
*   *Fórmula:* **If + Past Simple, ... Would + Verb(Base)**
*   *Ejemplo:* If I won the lottery, I would travel around the world. (Si ganara la lotería, viajaría por el mundo).
*   *Nota Gramatical:* Con el verbo "to be" en la condición del Segundo Condicional, tradicionalmente se prefiere usar **were** para todas las personas en lenguaje formal (ej: *If I **were** you...* - Si yo fuera tú; *If she **were** here...* - Si ella estuviera aquí).`,
    structure: 'First: If + Present, will + Verb | Second: If + Past, would + Verb',
    examples: [
      { en: 'If it rains tomorrow, we will stay at home.', es: 'Si llueve mañana, nos quedaremos en casa.', note: 'Primer Condicional: Posibilidad meteorológica real' },
      { en: 'If I had infinite money, I would buy a certified library.', es: 'Si tuviera dinero infinito, compraría una biblioteca certificada.', note: 'Segundo Condicional: Escenario irreal en el presente' },
      { en: 'If I were you, I would practice with Teclingo daily.', es: 'Si yo fuera tú, practicaría con Teclingo diariamente.', note: 'Uso formal de "were" para dar un consejo hipotético' },
      { en: 'If they find her keys, they will call her.', es: 'Si encuentran sus llaves, la llamarán.', note: 'Primer Condicional: Probabilidad real de encontrar las llaves' }
    ],
    keywords: ['conditionals', 'condicionales', 'if', 'will', 'would', 'first conditional', 'second conditional', 'hipotetico', 'posibilidad', 'were you', 'won']
  },
  {
    id: 'passive-voice',
    title: 'La Voz Pasiva (Passive Voice)',
    titleEn: 'Passive Voice',
    mcer: 'B2',
    category: 'Syntax',
    summary: 'Transfiere el enfoque comunicativo desde el agente activo hacia el recibidor del evento. Esencial para escritura académica.',
    explanation: `En inglés, utilizamos la **Voz Pasiva** cuando queremos enfocar la atención del receptor en el **objeto o la acción de la oración**, en lugar de en el "sujeto activo" que la realiza. También se prefiere cuando no sabemos quién realizó la acción o no es relevante mencionarlo.

### Cómo Convertir de Activa a Pasiva
1.  El **objeto** de la oración activa se convierte en el **sujeto** de la pasiva.
2.  Agregamos el verbo auxiliar **to be** conjugado en el **mismo tiempo verbal** que tenía la oración activa.
3.  Agregamos el verbo principal en su forma de **participio pasado**.
4.  (Opcional) Si es relevante mencionar quién realizó la acción, lo introducimos con la preposición **by** (el agente).

### Ejemplos en Diferentes Tiempos
*   **Presente Simple:**
    *   *Activa:* Shakespeare writes books.
    *   *Pasiva:* Books **are written** by Shakespeare.
*   **Pasado Simple:**
    *   *Activa:* Alex designed this app.
    *   *Pasiva:* This app **was designed** by Alex.
*   **Futuro Simple:**
    *   *Activa:* The company will launch the product.
    *   *Pasiva:* The product **will be launched** by the company.`,
    structure: 'Objeto/Paciente + Verbo TO BE (Conjugado) + Participio Pasado [+ by Agente]',
    examples: [
      { en: 'The English rules were established by academic committees.', es: 'Las reglas de inglés fueron establecidas por comités académicos.', note: 'Enfoque en las reglas, no en los comités' },
      { en: 'The grammar library is updated every single week.', es: 'La biblioteca de gramática es actualizada cada semana.', note: 'No se menciona al agente porque se sobreentiende o no importa' },
      { en: 'The test had been corrected before the system crashed.', es: 'La prueba había sido corregida antes de que el sistema fallara.', note: 'Pasiva en Pasado Perfecto ("had been + participio")' }
    ],
    keywords: ['passive voice', 'voz pasiva', 'was', 'were', 'been', 'by', 'objeto receptivo', 'participio pasado', 'acciones academicas']
  },
  {
    id: 'reported-speech',
    title: 'Estilo Indirecto (Reported Speech - Indirect Speech)',
    titleEn: 'Reported Speech',
    mcer: 'B2',
    category: 'Syntax',
    summary: 'Aprende a contar lo que otra persona ha dicho aplicando las leyes de retroceso temporal de los verbos (Backshifting).',
    explanation: `El **Reported Speech** se utiliza para contarle a otra persona lo que un tercero dijo en un momento previo, sin necesidad de citar sus palabras textuales (que sería el *Direct Speech*).

### La Regla del "Paso Atrás" (Verb Backshift)
Dado que estamos informando algo que se dijo en el pasado, la regla general en inglés es que los tiempos verbales **vuelven un paso hacia el pasado** (backshift):

| Direct Speech (Mensaje Original) | Reported Speech (Mensaje Reportado) |
| :--- | :--- |
| **Present Simple** (*"I go"*) | **Past Simple** (*She said she went*) |
| **Present Continuous** (*"I am going"*) | **Past Continuous** (*She said she was going*) |
| **Past Simple** / **Present Perfect** (*"I went" / "I have gone"*) | **Past Perfect** (*She said she had gone*) |
| **Future Simple (Will)** (*"I will go"*) | **Conditional (Would)** (*She said she would go*) |
| **Can** | **Could** |
| **Must / Have to** | **Had to** |

### Cambio de Expresiones Temporales y Pronombres
Recuerda adaptar también los pronombres (I -> he/she, we -> they) y las expresiones de tiempo/espacio para que todo tenga coherencia lógica:
*   *here* -> *there*
*   *now* -> *then / at that moment*
*   *tomorrow* -> *the next day / the following day*
*   *yesterday* -> *the day before / the previous day*`,
    structure: 'Sujeto + said/told [+ persona] + (that) + Sujeto_2 + Verbo (Backshifted) + Comp.',
    examples: [
      { en: 'Direct: "I teach English." -> Reported: He said that he taught English.', es: 'Directo: "Enseño inglés." -> Indirecto: Él dijo que enseñaba inglés.', note: '"teach" (presente) cambia a "taught" (pasado)' },
      { en: 'Direct: "We have finished." -> Reported: She told me they had finished.', es: 'Directo: "Hemos terminado." -> Indirecto: Ella me dijo que habían terminado.', note: '"have finished" (presente perfecto) cambia a "had finished" (pasado perfecto)' },
      { en: 'Direct: "I will call you tomorrow." -> Reported: She said she would call me the following day.', es: 'Directo: "Te llamaré mañana." -> Indirecto: Ella dijo que me llamaría al día siguiente.', note: '"will" cambia a "would"; "tomorrow" cambia a "the following day"' }
    ],
    keywords: ['reported speech', 'indirect speech', 'estilo indirecto', 'say', 'tell', 'said', 'told', 'that', 'backshift', 'tiempos verbales', 'retroceso', 'gramatica']
  },
  {
    id: 'modal-deduction',
    title: 'Verbos Modales de Deducción (Must, Might, Can\'t)',
    titleEn: 'Modal Verbs of Deduction & Probability',
    mcer: 'B1',
    category: 'Structure',
    summary: 'Aprende a expresar tu grado de certeza y probabilidad sobre eventos presentes y pasados usando verbos auxiliares modales.',
    explanation: `Los verbos modales de deducción sirven para indicar qué tan seguros estamos respecto a una afirmación o conclusión basada en la evidencia disponible.

### 1. Certeza Absoluta / Cero Dudas (Afirmativo)
*   **Must:** Utilizado cuando estás 90-100% seguro de que algo es cierto porque hay pruebas innegables. Significa "debe de".
    *   *Ejemplo:* The lights are on. They **must** be at home. (Las luces están encendidas. Deben de estar en casa).

### 2. Posibilidad / Duda Moderada
*   **Might / May / Could:** Utilizados cuando consideras que algo es posible pero no estás completamente seguro (un 30-50% de probabilidad). Significa "puede que" o "podría".
    *   *Ejemplo:* She is not in class. She **might** be sick. (No está en clase. Puede que esté enferma).

### 3. Certeza Absoluta de que algo NO es posible (Negativo)
*   **Can't:** Utilizado cuando estás 90-100% seguro de que algo **es imposible** o falso según tu lógica y evidencia. Significa "no puede ser que".
    *   *Ejemplo:* He just ate a massive lunch. He **can\'t** be hungry already! (Acaba de devorar un gran almuerzo. ¡No puede tener hambre ya!).
    *   *¡Cuidado!* No uses *mustn't* para deducción de imposibilidad. *Mustn't* significa prohibición (ej: *You mustn\'t park here*), mientras que *Can't* es el opuesto deductivo de *Must*.`,
    structure: 'Sujeto + must/might/could/can\'t + Verbo(Base) + Complemento',
    examples: [
      { en: 'You have been studying all evening, you must be exhausted.', es: 'Has estado estudiando toda la tarde, debes estar agotado.', note: 'Deducción lógica con alta certeza basada en evidencia' },
      { en: 'Don\'t eat that plant, it might be poisonous.', es: 'No te comas esa planta, podría ser venenosa.', note: 'Expresa una posibilidad o advertencia en el presente' },
      { en: 'It is 2:00 AM. That can\'t be the postman knocking at the door.', es: 'Son las 2:00 AM. Ese no puede ser el cartero llamando a la puerta.', note: 'Certeza deductiva negativa: es totalmente improbable por la hora' }
    ],
    keywords: ['modal verbs', 'must', 'might', 'could', 'can\'t', 'may', 'deduccion', 'probabilidad', 'certeza', 'posibilidad', 'modales']
  },
  {
    id: 'relative-clauses',
    title: 'Cláusulas Relativas (Relative Clauses: Who, Which, That, Whose)',
    titleEn: 'Defining & Non-Defining Relative Clauses',
    mcer: 'B1',
    category: 'Syntax',
    summary: 'Aprende a unir oraciones complejas y ampliar información de personas, lugares, pertenencias y objetos de forma fluida.',
    explanation: `Las cláusulas relativas sirven para unir dos frases u ofrecer información adicional detallada sobre una persona, objeto, lugar o concepto sin tener que iniciar una nueva oración de forma robótica.

### Pronombres Relativos Clave
*   **Who o That:** Para referirse a **personas**.
    *   *Ejemplo:* The teacher **who** explained Past Perfect was Alex.
*   **Which o That:** Para referirse a **cosas, objetos o animales**.
    *   *Ejemplo:* The framework **which** powers this chatbot is Gemini.
*   **Where:** Para referirse a **lugares**.
    *   *Ejemplo:* This is the school **where** I passed the B2 exam.
*   **Whose:** Para referirse a **posesión o pertenencia** (significa "cuyo/cuya").
    *   *Ejemplo:* The student **whose** paper got an A is celebrating.

### Cláusulas Relativas Especificativas (Defining) vs Explicativas (Non-Defining)
1.  **Defining (Especificativas):** Son esenciales. Sin esta información, la oración no tiene sentido completo. No llevan comas.
    *   *The computer **that** I bought is fast.* (¿Cuál computadora? La que compré).
2.  **Non-Defining (Explicativas / Suplementarias):** Proporcionan información adicional "extra" y prescindible que puede ser eliminada sin perder el sentido de la frase. Van **siempre entre comas** y el pronombre **never** puede cambiarse por *that*.
    *   *Alex, **who** is a pedagogical tutor, wrote a list of English structures.* (Alex escribió una lista de estructuras... el hecho de que sea tutor es información adicional).`,
    structure: 'Sujeto + Pronombre Relativo (who/which/where/whose) + Frase Relativa + Complemento',
    examples: [
      { en: 'She is the tutor who helped me understand the differences.', es: 'Ella es la tutora que me ayudó a comprender las diferencias.', note: 'Cláusula especificativa (defining) para personas' },
      { en: 'This online library, which contains CEFR explanations, is fully active.', es: 'Esta biblioteca en línea, la cual contiene explicaciones MCER, está completamente activa.', note: 'Cláusula explicativa (non-defining) entre comas para cosas' },
      { en: 'The boy whose toy was broken began to cry.', es: 'El niño cuyo juguete estaba roto comenzó a llorar.', note: 'Uso de "whose" para reflejar posesión' },
      { en: 'The office where they teach English is on the third floor.', es: 'La oficina donde enseñan inglés está en el tercer piso.', note: 'Uso de "where" para lugares' }
    ],
    keywords: ['relative clauses', 'clausulas relativas', 'who', 'which', 'that', 'where', 'whose', 'whom', 'defining relative', 'non defining', 'unir oraciones']
  }
];

const app = express();

app.use(express.json());

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

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", env: process.env.NODE_ENV });
});

app.post("/api/tutor", async (req, res) => {
  const { message, history, systemPrompt, currentSpeed, conversationMode, hobby, channel } = req.body;
  console.log(`[ALERTA NATIVA] Modo: ${conversationMode} | Velocidad: ${currentSpeed}`);

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
app.post("/api/tts", async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Text is required" });

  const cleanText = text.replace(/\s+/g, ' ').trim();
  const words = cleanText.split(' ');
  const truncated = words.slice(0, 25).join(' ');
  console.log(`[TTS] Texto original: ${words.length} palabras | Truncado: ${truncated.split(' ').length} palabras`);

  const lang = "en";

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

export default app;
