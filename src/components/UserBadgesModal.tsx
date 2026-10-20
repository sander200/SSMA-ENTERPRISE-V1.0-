import React from "react";
import {
  Award,
  Eye,
  FileCheck,
  Zap,
  Crown,
  Lock,
  CheckCircle2,
  Trophy,
  X,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "../i18n/LanguageContext";
import { USER_BADGES, getBadgesStatus, getHighestUnlockedBadge, getNextBadgeToUnlock } from "../data/badges";
import { UserBadge } from "../types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  completedScenarios: number;
  onGoToTraining: () => void;
}

export function UserBadgesModal({
  isOpen,
  onClose,
  completedScenarios,
  onGoToTraining,
}: Props) {
  const { language } = useLanguage();
  const badgesStatus = getBadgesStatus(completedScenarios);
  const highestBadge = getHighestUnlockedBadge(completedScenarios);
  const nextBadge = getNextBadgeToUnlock(completedScenarios);
  const totalUnlocked = badgesStatus.filter((b) => b.isUnlocked).length;

  function renderBadgeIcon(iconName: UserBadge["iconName"], className = "w-6 h-6") {
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

  function getLocalizedTitle(badge: UserBadge): string {
    if (language === "es") {
      switch (badge.id) {
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
      switch (badge.id) {
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
    return badge.defaultTitle;
  }

  function getLocalizedTagline(badge: UserBadge): string {
    if (language === "es") {
      switch (badge.id) {
        case "safety-novice":
          return "Primer paso en la conformidad operativa";
        case "risk-spotter":
          return "Vigilancia técnica e identificación de peligros";
        case "compliance-practitioner":
          return "Aplicación consistente de NRs en campo";
        case "compliance-expert":
          return "Dominio avanzado de seguridad y salud en el trabajo";
        case "master-guardian":
          return "Liderazgo y excelencia en prevención de incidentes";
      }
    } else if (language === "en") {
      switch (badge.id) {
        case "safety-novice":
          return "First step towards operational safety compliance";
        case "risk-spotter":
          return "Technical vigilance & active hazard identification";
        case "compliance-practitioner":
          return "Consistent field execution of OSH standards";
        case "compliance-expert":
          return "Advanced mastery of OSH regulatory frameworks";
        case "master-guardian":
          return "Safety leadership & zero-accident excellence";
      }
    }
    return badge.tagline;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]"
          >
            {/* Header with gradient flare */}
            <div className="relative p-6 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border-b border-slate-800">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shadow-inner">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 mb-0.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>
                        {language === "es"
                          ? "Sistema de Reconocimiento SST"
                          : language === "en"
                          ? "OSH Recognition System"
                          : "Sistema de Reconhecimento SST"}
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                      {language === "es"
                        ? "Distintivos y Rangos de Seguridad"
                        : language === "en"
                        ? "User Badges & Safety Ranks"
                        : "Distintivos e Níveis de Segurança"}
                    </h2>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors border border-slate-700/60 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Summary Status Strip */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-xs">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-teal-400" />
                  <span className="text-slate-300">
                    {language === "es"
                      ? "Cenarios Concluídos:"
                      : language === "en"
                      ? "Completed Scenarios:"
                      : "Cenários Concluídos:"}
                  </span>
                  <span className="font-bold text-white font-mono text-sm">
                    {completedScenarios}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-400">
                    {language === "es"
                      ? "Desbloqueados:"
                      : language === "en"
                      ? "Unlocked:"
                      : "Desbloqueados:"}
                  </span>
                  <span className="font-bold text-amber-400 font-mono">
                    {totalUnlocked} / {USER_BADGES.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Badges List (Scrollable) */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {badgesStatus.map((status) => {
                const badge = status.badge;
                const isUnlocked = status.isUnlocked;

                return (
                  <div
                    key={badge.id}
                    className={`relative p-4 rounded-2xl border transition-all ${
                      isUnlocked
                        ? "bg-slate-850/90 border-slate-700/80 shadow-md"
                        : "bg-slate-950/40 border-slate-800/50 opacity-70"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Badge Icon Emblem */}
                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border relative ${
                          isUnlocked
                            ? badge.colorClass
                            : "bg-slate-800/60 border-slate-700/60 text-slate-500"
                        }`}
                      >
                        {renderBadgeIcon(badge.iconName, "w-7 h-7")}
                        {isUnlocked && (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </div>
                        )}
                        {!isUnlocked && (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center border border-slate-700">
                            <Lock className="w-3 h-3" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <h3
                              className={`font-bold text-base ${
                                isUnlocked ? "text-white" : "text-slate-400"
                              }`}
                            >
                              {getLocalizedTitle(badge)}
                            </h3>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                isUnlocked
                                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                  : "bg-slate-800 text-slate-400 border border-slate-700"
                              }`}
                            >
                              Nível {badge.tier}
                            </span>
                          </div>

                          <span className="text-xs font-mono font-medium text-slate-400 shrink-0">
                            {isUnlocked ? (
                              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                {language === "es"
                                  ? "Desbloqueado"
                                  : language === "en"
                                  ? "Unlocked"
                                  : "Desbloqueado"}
                              </span>
                            ) : (
                              <span>
                                {completedScenarios} / {badge.requiredScenarios}
                              </span>
                            )}
                          </span>
                        </div>

                        <p className="text-xs text-slate-300 font-medium mt-0.5">
                          {getLocalizedTagline(badge)}
                        </p>

                        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                          {badge.description}
                        </p>

                        {/* Progress Bar for Locked Badges */}
                        {!isUnlocked && (
                          <div className="mt-3 space-y-1">
                            <div className="flex justify-between text-[11px] text-slate-400">
                              <span>
                                {language === "es"
                                  ? `Faltan ${status.remainingCount} escenario(s)`
                                  : language === "en"
                                  ? `${status.remainingCount} scenario(s) remaining`
                                  : `Faltam ${status.remainingCount} cenário(s)`}
                              </span>
                              <span className="font-mono text-slate-300">
                                {status.progressPercent}%
                              </span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-teal-500 to-amber-500 transition-all duration-500"
                                style={{ width: `${status.progressPercent}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer with action to train */}
            <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between gap-3">
              <div className="text-xs text-slate-400">
                {nextBadge ? (
                  <span>
                    {language === "es"
                      ? "Próximo rango: "
                      : language === "en"
                      ? "Next rank: "
                      : "Próximo distintivo: "}
                    <strong className="text-amber-300">
                      {getLocalizedTitle(nextBadge)}
                    </strong>
                  </span>
                ) : (
                  <span className="text-emerald-400 font-bold">
                    {language === "es"
                      ? "¡Has alcanzado todos los distintivos máximos!"
                      : language === "en"
                      ? "All master badges unlocked!"
                      : "Todos os distintivos máximos conquistados!"}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-750 transition-colors cursor-pointer border border-slate-700"
                >
                  {language === "es" ? "Cerrar" : language === "en" ? "Close" : "Fechar"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onGoToTraining();
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-teal-400 hover:bg-teal-300 transition-colors shadow-lg cursor-pointer"
                >
                  <span>
                    {language === "es"
                      ? "Entrenar Ahora"
                      : language === "en"
                      ? "Train Now"
                      : "Treinar Agora"}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
