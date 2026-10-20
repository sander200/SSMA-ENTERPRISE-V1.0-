import { useState, useEffect } from "react";
import { HardHat, ShieldCheck, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { useLanguage } from "../i18n/LanguageContext";

interface Props {
  onFinish: () => void;
  customLogo?: string | null;
}

export function SplashScreen({ onFinish, customLogo }: Props) {
  const { language } = useLanguage();
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState(
    language === "es"
      ? "Iniciando plataforma corporativa SSMA Enterprise..."
      : language === "en"
      ? "Initializing SSMA Enterprise corporate platform..."
      : "Iniciando plataforma corporativa SSMA Enterprise..."
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            onFinish();
          }, 300);
          return 100;
        }
        const next = prev + 14;
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
              ? "Verificando estado de licencia y seguridad SHA-256..."
              : language === "en"
              ? "Verifying license status & SHA-256 security..."
              : "Verificando status de licença e segurança SHA-256..."
          );
        }
        return next > 100 ? 100 : next;
      });
    }, 130);

    return () => clearInterval(timer);
  }, [language, onFinish]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.99 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-slate-50 text-slate-900 select-none"
    >
      {/* Subtle light background radial accents */}
      <div className="absolute w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none -top-20 -left-20" />
      <div className="absolute w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none -bottom-20 -right-20" />

      <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl space-y-6">
        {/* Centered Corporate Logo */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.45, type: "spring", stiffness: 280, damping: 22 }}
          className="flex flex-col items-center justify-center"
        >
          {customLogo ? (
            <div className="w-28 h-28 rounded-3xl bg-white border-2 border-teal-500/30 shadow-lg flex items-center justify-center p-2 overflow-hidden">
              <img
                src={customLogo}
                alt="Logotipo Corporativo SSMA Enterprise"
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-teal-600 via-teal-500 to-emerald-600 flex items-center justify-center text-white shadow-xl shadow-teal-600/25 border border-teal-400/40">
              <HardHat className="w-12 h-12 text-white stroke-[2.2]" />
            </div>
          )}
        </motion.div>

        {/* Corporate Identity & Subtitle */}
        <motion.div
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.35 }}
          className="space-y-2"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>SST • Gestión Ocupacional & Bienestar</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            SSMA Enterprise
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
            {language === "es"
              ? "Plataforma corporativa de Seguridad y Salud en el Trabajo con respaldo en la nube y control de licencias."
              : language === "en"
              ? "Corporate Occupational Safety and Health platform with cloud backup and license management."
              : "Plataforma corporativa de Segurança e Saúde no Trabalho com backup em nuvem e gestão de licenças."}
          </p>
        </motion.div>

        {/* Progress Bar */}
        <div className="w-full space-y-2.5 pt-1">
          <div className="w-full bg-slate-100 rounded-full h-2.5 p-0.5 border border-slate-200 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-teal-600 to-emerald-500 h-full rounded-full transition-all duration-150 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
            <span className="truncate pr-2">{statusText}</span>
            <span className="font-bold text-teal-700 shrink-0">{progress}%</span>
          </div>
        </div>

        {/* Enter Button */}
        <button
          type="button"
          onClick={onFinish}
          className="w-full py-2.5 px-5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2"
        >
          <span>
            {language === "es"
              ? "Ingresar al Menú Principal"
              : language === "en"
              ? "Enter Main Menu"
              : "Acessar Menu Principal"}
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-white" />
        </button>
      </div>

      <div className="mt-6 text-[11px] text-slate-500 font-semibold">
        SSMA Enterprise • Seguridad, Salud y Medio Ambiente
      </div>
    </motion.div>
  );
}
