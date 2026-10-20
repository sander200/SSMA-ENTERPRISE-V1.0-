import React from "react";
import {
  Trophy,
  Award,
  Eye,
  FileCheck,
  Zap,
  Crown,
  Sparkles,
  ArrowRight,
  X,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { UserBadge } from "../types";
import { useLanguage } from "../i18n/LanguageContext";

interface Props {
  badge: UserBadge | null;
  onClose: () => void;
  onViewAllBadges: () => void;
}

export function BadgeUnlockModal({ badge, onClose, onViewAllBadges }: Props) {
  const { language } = useLanguage();

  if (!badge) return null;

  function renderBadgeIcon(iconName: UserBadge["iconName"], className = "w-10 h-10") {
    switch (iconName) {
      case "award":
        return <Award className={className} />;
      case "eye":
        return <Eye className={className} />;
      case "file-check":
        return <FileCheck className={className} />;
      case "zap":
        return <Zap className={className} />;
      case "crown":
        return <Crown className={className} />;
      default:
        return <Trophy className={className} />;
    }
  }

  function getLocalizedBadgeTitle(b: UserBadge): string {
    if (language === "es") {
      switch (b.id) {
        case "safety-novice":
          return "Principiante de Seguridad";
        case "risk-spotter":
          return "Detector de Riesgos";
        case "compliance-practitioner":
          return "Practicante de Normas";
        case "compliance-expert":
          return "Experto en Cumplimiento";
        case "master-guardian":
          return "Guardián Maestro SST";
      }
    } else if (language === "pt") {
      switch (b.id) {
        case "safety-novice":
          return "Novato em SST";
        case "risk-spotter":
          return "Observador de Riscos";
        case "compliance-practitioner":
          return "Praticante de Normas";
        case "compliance-expert":
          return "Especialista em Conformidade";
        case "master-guardian":
          return "Guardião Mestre SST";
      }
    }
    return b.defaultTitle;
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/85 backdrop-blur-md"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 25 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="relative w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 text-center overflow-hidden"
        >
          {/* Ambient Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors border border-slate-700/60 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Unlock Trophy Animation Emblem */}
          <div className="mx-auto w-24 h-24 rounded-3xl bg-amber-500/15 border-2 border-amber-400/50 flex items-center justify-center text-amber-400 shadow-xl relative mb-5">
            {renderBadgeIcon(badge.iconName, "w-12 h-12")}
            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {language === "es"
              ? "¡Nuevo Distintivo Desbloqueado!"
              : language === "en"
              ? "New Badge Unlocked!"
              : "Novo Distintivo Desbloqueado!"}
          </div>

          <h2 className="text-2xl font-black text-white mt-1">
            {getLocalizedBadgeTitle(badge)}
          </h2>

          <p className="text-xs text-amber-300/90 font-medium mt-1">
            Nível {badge.tier} • {badge.requiredScenarios}{" "}
            {language === "es"
              ? "escenarios completados"
              : language === "en"
              ? "scenarios completed"
              : "cenários concluídos"}
          </p>

          <p className="text-xs text-slate-300 mt-3 leading-relaxed">
            {badge.description}
          </p>

          <div className="mt-6 flex flex-col sm:flex-row items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-750 transition-colors border border-slate-700 cursor-pointer"
            >
              {language === "es"
                ? "Continuar"
                : language === "en"
                ? "Continue"
                : "Continuar"}
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onViewAllBadges();
              }}
              className="w-full sm:flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 transition-all shadow-lg flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>
                {language === "es"
                  ? "Ver Distintivos"
                  : language === "en"
                  ? "View Badges"
                  : "Ver Distintivos"}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
