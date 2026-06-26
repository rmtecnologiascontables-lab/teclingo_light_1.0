import { useState } from 'react';
import {
  Waves,
  Box,
  Headphones,
  MessageSquare,
  Edit3,
  Shield,
  Sliders,
  Sparkles,
  Zap,
  ChevronRight,
  TrendingUp,
  Lock,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TheBridge } from './tools/TheBridge';
import { ListeningLab } from './tools/ListeningLab';
import { AITutor } from './tools/AITutor';
import { TestMaker } from './tools/TestMaker';
import { GrammarFixer } from './tools/GrammarFixer';
import { AvatarMatrix } from './tools/AvatarMatrix';
import { SafeZoneModule } from './SafeZoneModule';
import { ExtracurricularModal } from './ExtracurricularModal';

function SafeZoneWrapper({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[200] overflow-y-auto custom-scrollbar">
      <div className="absolute inset-0 bg-[#061a1a]/95 backdrop-blur-2xl" />
      <button
        onClick={onClose}
        className="fixed top-8 right-8 z-[210] w-12 h-12 rounded-full bg-black/40 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-black/60 transition-all"
      >
        <X size={20} />
      </button>
      <div className="relative z-[205]">
        <SafeZoneModule />
      </div>
    </div>
  );
}

export function AlumnoMainboard() {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [showExtraModal, setShowExtraModal] = useState(false);
  const userProgress = 72;

  const ToolCard = ({
    icon: Icon,
    title,
    description,
    accent = 'green',
    toolId,
    badge
  }: {
    icon: any;
    title: string;
    description: string;
    accent?: 'green' | 'cyan' | 'purple' | 'orange';
    toolId: string;
    badge?: string;
  }) => {
    const accentColors = {
      green: 'from-[#DEFF9A]/5 border-[#DEFF9A]/20 hover:border-[#DEFF9A]/40 text-[#DEFF9A]',
      cyan: 'from-cyan-500/5 border-cyan-500/20 hover:border-cyan-500/40 text-cyan-400',
      purple: 'from-purple-500/5 border-purple-500/20 hover:border-purple-500/40 text-purple-400',
      orange: 'from-orange-500/5 border-orange-500/20 hover:border-orange-500/40 text-orange-400'
    };

    return (
      <motion.div
        whileHover={{ y: -4 }}
        className={`relative group rounded-[2.5rem] p-8 bg-gradient-to-br ${accentColors[accent]} border overflow-hidden transition-all duration-300 flex flex-col items-center text-center`}
      >
        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-50`} />
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        <div className="relative z-10 flex flex-col items-center gap-5 w-full">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border bg-black/30`} style={{ borderColor: 'currentColor', color: 'inherit' }}>
            <Icon size={32} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 justify-center flex-wrap">
              <h3 className="text-lg font-black text-white uppercase tracking-tight">{title}</h3>
              {badge && (
                <span className="px-2.5 py-0.5 rounded-full bg-current/10 text-current text-[8px] font-black uppercase tracking-widest">{badge}</span>
              )}
            </div>
            <p className="text-white/40 text-[10px] font-medium leading-relaxed max-w-xs">{description}</p>
          </div>

          <button
            onClick={() => setActiveTool(toolId)}
            className="px-8 py-3 rounded-full border border-current/30 text-current text-[9px] font-black uppercase tracking-widest hover:bg-current hover:text-[#061a1a] transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            VAMOS AHORA <ChevronRight size={12} />
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="h-screen bg-gradient-to-br from-[#020b18] via-[#051c3a] to-[#010812] text-white overflow-y-auto custom-scrollbar">
      <div className="p-6 md:p-8 lg:p-12 max-w-[1400px] mx-auto w-full space-y-12 pb-32">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="px-3 py-1.5 rounded-full bg-[#DEFF9A]/10 border border-[#DEFF9A]/20 text-[#DEFF9A] text-[8px] font-black uppercase tracking-[0.3em]">
                DEMO VERSION
              </span>
              <span className="w-2 h-2 rounded-full bg-[#DEFF9A] animate-pulse" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter italic leading-none">
              TECLINGO <span className="text-[#DEFF9A]">PRO</span>
            </h1>
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-2">
              Plataforma de Inmersión en Inglés con Inteligencia Artificial
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse" />
              <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Sistema Activo</span>
            </div>
          </div>
        </header>

        {/* Section 1: System Prompt Maestro */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-emerald-500/30 to-transparent" />
            <h2 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em]">Protocolo de IA</h2>
            <div className="h-px flex-1 bg-gradient-to-l from-emerald-500/30 to-transparent" />
          </div>

          <div className="p-8 rounded-[2.5rem] bg-gradient-to-r from-emerald-500/10 to-[#DEFF9A]/5 border border-[#DEFF9A]/20 flex flex-col md:flex-row items-center justify-between text-center md:text-left group hover:from-emerald-500/15 hover:to-[#DEFF9A]/10 transition-all relative overflow-hidden gap-6">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#DEFF9A] via-emerald-500 to-[#DEFF9A]" />
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-16 h-16 rounded-3xl bg-[#DEFF9A]/10 border border-[#DEFF9A]/30 flex items-center justify-center text-[#DEFF9A] shrink-0 group-hover:scale-105 transition-transform">
                <Sliders size={32} />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#DEFF9A]/20 border border-[#DEFF9A]/30 text-[#DEFF9A] text-[8px] font-mono font-black uppercase tracking-widest mb-1.5">
                  SYSTEM PROMPT MAESTRO
                </div>
                <h4 className="text-white text-lg font-black uppercase tracking-tight">Protocolo de Avatar de IA</h4>
                <p className="text-white/40 text-[10px] font-medium leading-relaxed max-w-md">
                  Modos adaptativos Onboarding, Clase Teórica, Corrección Estricta y Asistencia Directiva sincronizados al PDP.
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTool('avatar')}
              className="px-8 py-4 rounded-full bg-[#DEFF9A] hover:bg-[#DEFF9A]/95 text-[#061a1a] text-[10px] tracking-widest font-black uppercase transition-all shadow-[0_0_20px_rgba(222,255,154,0.25)] hover:scale-105 active:scale-95 cursor-pointer shrink-0"
            >
              PROBAR AVATAR
            </button>
          </div>
        </div>

        {/* Section 2: AI Tools Grid */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-[#DEFF9A]/30 to-transparent" />
            <h2 className="text-[10px] font-black text-[#DEFF9A] uppercase tracking-[0.4em]">Ecosistema AI Alumno</h2>
            <div className="h-px flex-1 bg-gradient-to-l from-[#DEFF9A]/30 to-transparent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ToolCard
              icon={Waves}
              title="The Bridge"
              description="Laboratorio de pronunciación nativa con IA. Mejora tu acento y precisión vocal."
              accent="green"
              toolId="bridge"
              badge="PRONUNCIACIÓN"
            />
            <ToolCard
              icon={Edit3}
              title="Test Maker"
              description="Evaluación adaptativa con IA. Exámenes personalizados según tu nivel y progreso."
              accent="purple"
              toolId="test"
              badge="ADAPTATIVO"
            />
            <ToolCard
              icon={MessageSquare}
              title="AI Tutor"
              description="Asistente conversacional 24/7. Resuelve dudas y practica inglés en cualquier momento."
              accent="cyan"
              toolId="tutor"
              badge="CHAT"
            />
            <ToolCard
              icon={Headphones}
              title="Listening Lab"
              description="Dictados interactivos con control de velocidad. Entrena tu oído paso a paso."
              accent="purple"
              toolId="listening"
              badge="AUDITIVO"
            />
            <ToolCard
              icon={TrendingUp}
              title="Grammar Fixer"
              description="Corrector gramatical inteligente. Recibe sugerencias y explicaciones en tiempo real."
              accent="orange"
              toolId="grammar"
              badge="CORRECTOR"
            />
            {/* DALLAS VIP ACCESS — Bloqueado */}
            <motion.div
              className="relative group rounded-[2.5rem] p-8 bg-black/40 border border-[#38BDF8]/40 opacity-70 hover:opacity-100 hover:border-[#38BDF8] overflow-hidden transition-all duration-300 flex flex-col items-center text-center cursor-pointer shadow-[inset_0_0_20px_rgba(56,189,248,0.1)]"
              whileHover={{ y: -4 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#38BDF8]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative mb-4">
                <Box className="text-[#38BDF8] group-hover:scale-110 transition-transform" size={40} />
                <motion.div
                  animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
                  className="absolute -top-2 -right-2 w-7 h-7 bg-[#FBBF24] rounded-lg flex items-center justify-center text-[#061a1a] shadow-[0_0_15px_#FBBF24]"
                >
                  <Lock size={14} fill="currentColor" />
                </motion.div>
              </div>
              <h4 className="text-white text-lg font-black uppercase tracking-tight relative z-10">DALLAS VIP ACCESS</h4>
              <p className="text-white/30 text-[9px] font-black uppercase tracking-widest mt-2 mb-8 relative z-10">SOLO PARA ÉLITE 90%</p>
              <button className="px-8 py-3 rounded-full border border-[#38BDF8]/30 text-[#38BDF8] text-[9px] font-black uppercase tracking-widest relative z-10">
                BLOQUEADO
              </button>
              <motion.div
                animate={{ y: [0, 100, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-b from-transparent via-[#38BDF8]/5 to-transparent h-20 w-full pointer-events-none"
              />
            </motion.div>
          </div>
        </div>

        {/* Section 3: SafeZone AI */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-cyan-500/30 to-transparent" />
            <h2 className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.4em]">SafeZone AI Active Lab</h2>
            <div className="h-px flex-1 bg-gradient-to-l from-cyan-500/30 to-transparent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ToolCard
              icon={Shield}
              title="Búnker de Confianza Lingüística"
              description="Entorno de práctica conversacional seguro y libre de juicios. Supera el miedo a hablar inglés."
              accent="cyan"
              toolId="safe-zone"
              badge="CONFIDENCIAL"
            />
            <div className="col-span-1 md:col-span-2 p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/10 flex flex-col items-center text-center group hover:bg-white/[0.05] transition-all relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3">
                <Zap size={14} className="text-[#DEFF9A] opacity-30 group-hover:opacity-100 transition-opacity" />
              </div>
              <Sparkles className="text-[#FBBF24] mb-3 animate-pulse" size={32} />
              <span className="text-white text-lg font-black uppercase tracking-tight mb-4">Extracurricular</span>
              <button
                onClick={() => setShowExtraModal(true)}
                className="px-8 py-3 rounded-full border border-[#DEFF9A]/30 text-[#DEFF9A] text-[9px] font-black uppercase tracking-widest hover:bg-[#DEFF9A] hover:text-[#061a1a] transition-all"
              >
                PRÓXIMAMENTE
              </button>
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 p-3 rounded-xl bg-[#0a0c10] border border-white/10 text-[8px] font-bold text-[#DEFF9A] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30 shadow-2xl backdrop-blur-md">
                Acceso VIP: Reto Pioneer
              </div>
            </div>
          </div>
        </div>

        {/* Footer branding */}
        <div className="flex flex-col items-center gap-6 pt-8 border-t border-white/5">
          <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-[0.3em] text-white/20">
            <Sparkles size={14} className="text-[#DEFF9A]" />
            <span>Powered by TECLINGO AI Engine v2.4</span>
            <Zap size={14} className="text-[#DEFF9A]" />
          </div>
        </div>
      </div>

      {/* Tool Modals */}
      <AnimatePresence mode="wait">
        {activeTool === 'bridge' && (
          <TheBridge onClose={() => setActiveTool(null)} />
        )}
        {activeTool === 'listening' && (
          <ListeningLab onClose={() => setActiveTool(null)} />
        )}
        {activeTool === 'tutor' && (
          <AITutor onClose={() => setActiveTool(null)} />
        )}
        {activeTool === 'test' && (
          <TestMaker onClose={() => setActiveTool(null)} />
        )}
        {activeTool === 'grammar' && (
          <GrammarFixer onClose={() => setActiveTool(null)} />
        )}
        {activeTool === 'avatar' && (
          <AvatarMatrix onClose={() => setActiveTool(null)} />
        )}
        {activeTool === 'safe-zone' && (
          <SafeZoneWrapper onClose={() => setActiveTool(null)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showExtraModal && (
          <ExtracurricularModal onClose={() => setShowExtraModal(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
