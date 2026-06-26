import { AlumnoMainboard } from './components/AlumnoMainboard';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from './context/AppContext';
import { AlertTriangle, Zap } from 'lucide-react';

export default function App() {
  const { maintenanceMode } = useAppContext();

  return (
    <div className="h-screen bg-[#061a1a] text-white font-sans selection:bg-[#DEFF9A] selection:text-black overflow-hidden relative">
      <AnimatePresence>
        {maintenanceMode && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] bg-[#061a1a]/90 backdrop-blur-2xl flex flex-col items-center justify-center p-8 text-center"
          >
             <div className="w-24 h-24 rounded-[2rem] bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mb-8 animate-pulse shadow-[0_0_50px_rgba(239,68,68,0.2)]">
                <AlertTriangle size={48} />
             </div>
             <h1 className="text-4xl font-black uppercase tracking-tighter italic mb-4">
                SISTEMA EN <span className="text-red-500">MANTENIMIENTO</span>
             </h1>
             <p className="max-w-md text-white/40 text-sm font-medium leading-relaxed">
                El sistema está temporalmente en mantenimiento para mejorar tu experiencia.
             </p>
             <div className="mt-12 flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-[#DEFF9A]/40">
                <Zap size={14} fill="currentColor" />
                <span>Protocolo Tecnolingo AI Hub v2.4</span>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AlumnoMainboard />
    </div>
  );
}
