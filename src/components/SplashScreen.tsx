import { useState, useEffect } from "react";
import { HardHat, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "../i18n/LanguageContext";

interface Props {
  onFinish: () => void;
}

export function SplashScreen({ onFinish }: Props) {
  const { t, language } = useLanguage();
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Iniciando motor normativo e criptográfico...");

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            onFinish();
          }, 350);
          return 100;
        }
        const next = prev + 12;
        if (next > 30 && next < 70) {
          setStatusText(
            language === "es"
              ? "Cargando matriz de riesgos y normativas SST..."
              : language === "en"
              ? "Loading OSH risk matrices & standards..."
              : "Carregando matriz de riscos e normas MTE..."
          );
        } else if (next >= 70) {
          setStatusText(
            language === "es"
              ? "Verificando cifrado de privacidad SHA-256..."
              : language === "en"
              ? "Verifying SHA-256 privacy cryptography..."
              : "Verificando criptografia de privacidade SHA-256..."
          );
        }
        return next > 100 ? 100 : next;
      });
    }, 140);

    return () => clearInterval(timer);
  }, [language, onFinish]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 text-slate-100 select-none"
    >
      {/* Background glow orbs */}
      <div className="absolute w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none -top-20 -left-20 animate-pulse" />
      <div className="absolute w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none -bottom-20 -right-20 animate-pulse" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-md w-full space-y-7">
        {/* Animated App Icon with Glowing Ring */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 300, damping: 20 }}
          className="relative"
        >
          <div className="absolute -inset-2 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-3xl blur-md opacity-40 animate-pulse" />
          <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-teal-500 via-teal-600 to-emerald-700 flex items-center justify-center text-white shadow-2xl shadow-teal-900/50 border border-teal-400/30">
            <HardHat className="w-12 h-12 text-white stroke-[2.2]" />
          </div>
        </motion.div>

        {/* Title & Description */}
        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="space-y-2"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs font-semibold mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>SST • Gestão Ocupacional & Carga Mental</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
            SSMA Enterprise
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed max-w-sm mx-auto">
            {language === "es"
              ? "Plataforma integrada de Seguridad y Salud en el Trabajo con monitoreo de bienestar psicológico."
              : language === "en"
              ? "Integrated Occupational Safety and Health platform with mental workload monitoring."
              : "Plataforma integrada de Segurança e Saúde no Trabalho com monitoramento de bem-estar psicológico."}
          </p>
        </motion.div>

        {/* Progress Bar & Status */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className="w-full space-y-3 pt-2"
        >
          <div className="w-full bg-slate-800/80 rounded-full h-2 p-0.5 border border-slate-700 overflow-hidden shadow-inner">
            <motion.div
              className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full rounded-full transition-all duration-150 ease-out shadow-sm shadow-teal-500/50"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span className="truncate pr-2">{statusText}</span>
            <span className="font-bold text-teal-300 shrink-0">{progress}%</span>
          </div>
        </motion.div>

        {/* Skip / Enter Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          type="button"
          onClick={onFinish}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-slate-200 transition-all cursor-pointer shadow-md hover:border-teal-500/40"
        >
          <span>{language === "es" ? "Acceder al Menú Principal" : language === "en" ? "Enter Main Menu" : "Acessar Menu Principal"}</span>
          <ArrowRight className="w-3.5 h-3.5 text-teal-400" />
        </motion.button>
      </div>

      <div className="absolute bottom-6 text-[11px] text-slate-400 font-medium">
        SSMA Enterprise • Conformidade NRs MTE & LGPD Art. 11/13
      </div>
    </motion.div>
  );
}
