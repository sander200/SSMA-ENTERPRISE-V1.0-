import React, { useState } from "react";
import {
  Brain,
  HeartPulse,
  Wind,
  Bot,
  BarChart3,
  ShieldCheck,
  ArrowRight,
  Flame,
  Lock,
  Sparkles,
  Trophy,
  Activity,
  Layers,
  Building2,
  Mail,
  Award,
  Eye,
  FileCheck,
  Zap,
  Crown,
  CheckCircle2,
} from "lucide-react";
import { motion } from "motion/react";
import { useLanguage } from "../i18n/LanguageContext";
import { PsychologicalLog, UserBadge } from "../types";
import {
  USER_BADGES,
  getBadgesStatus,
  getHighestUnlockedBadge,
  getNextBadgeToUnlock,
} from "../data/badges";
import { UserBadgesModal } from "./UserBadgesModal";

export type ModuleTab = "training" | "checkin" | "decompression" | "generator" | "sesmt";

interface Props {
  onSelectModule: (module: ModuleTab) => void;
  userLog: PsychologicalLog | null;
  totalAttempts: number;
  accuracy: number;
  currentSectorName: string;
}

export function BentoGridMenu({
  onSelectModule,
  userLog,
  totalAttempts,
  accuracy,
  currentSectorName,
}: Props) {
  const { t, language } = useLanguage();
  const [isBadgesModalOpen, setIsBadgesModalOpen] = useState(false);

  const mentalLoad = userLog?.totalMentalLoad ?? 0;
  const badgesStatus = getBadgesStatus(totalAttempts);
  const highestBadge = getHighestUnlockedBadge(totalAttempts);
  const nextBadge = getNextBadgeToUnlock(totalAttempts);
  const unlockedBadgesCount = badgesStatus.filter((b) => b.isUnlocked).length;

  function renderMiniBadgeIcon(iconName: UserBadge["iconName"], className = "w-3.5 h-3.5") {
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

  function getLocalizedBadgeTitle(badge: UserBadge): string {
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

  return (
    <div className="space-y-6 max-w-6xl mx-auto w-full">
      {/* Bento Grid Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-800/80 p-6 rounded-3xl border border-slate-700/60 shadow-lg backdrop-blur-md">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs font-semibold mb-1.5">
            <Layers className="w-3.5 h-3.5" />
            <span>
              {language === "es"
                ? "Centro de Control Operativo"
                : language === "en"
                ? "Operations Control Center"
                : "Centro de Controle Operacional"}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {language === "es"
              ? "Menú Principal • Módulos SST"
              : language === "en"
              ? "Main Menu • OSH Modules"
              : "Menu Principal • Módulos SST"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            {language === "es"
              ? "Seleccione un módulo interactivo para iniciar simulaciones, registros profilácticos o auditoría de gestión."
              : language === "en"
              ? "Select an interactive module to start simulations, psychological logs, or management audit."
              : "Selecione um módulo interativo para iniciar simulações, registros profiláticos ou auditoria de gestão."}
          </p>
        </div>

        {/* Live Status Summary Chips */}
        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
          {/* Badges Status Chip */}
          <button
            type="button"
            onClick={() => setIsBadgesModalOpen(true)}
            className="flex items-center gap-2.5 bg-slate-900/75 hover:bg-slate-900 p-2.5 sm:p-3 rounded-2xl border border-slate-700/60 hover:border-amber-500/50 text-xs transition-colors cursor-pointer group shadow-sm"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Trophy className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="text-slate-400 block text-[11px] leading-tight">
                {language === "es"
                  ? "Distintivos"
                  : language === "en"
                  ? "Badges"
                  : "Distintivos"}
              </span>
              <span className="font-bold text-amber-300 block text-xs">
                {unlockedBadgesCount} / {USER_BADGES.length}{" "}
                <span className="text-[10px] text-slate-400 font-normal">
                  {language === "es" ? "Rango" : language === "en" ? "Rank" : "Nível"}
                </span>
              </span>
            </div>
          </button>

          {/* Active Sector Chip */}
          <div className="flex items-center gap-2.5 bg-slate-900/75 p-2.5 sm:p-3 rounded-2xl border border-slate-700/60 text-xs shadow-sm">
            <div className="text-right">
              <span className="text-slate-400 block text-[11px] leading-tight">
                {language === "es" ? "Sector Activo" : language === "en" ? "Active Sector" : "Setor Ativo"}
              </span>
              <span className="font-bold text-white max-w-[120px] truncate block text-xs">
                {currentSectorName}
              </span>
            </div>
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 border border-teal-500/40 text-teal-300 flex items-center justify-center shrink-0">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Bento Grid Layout - 6 Interactive Square Bento Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* CARD 1: SIMULADOR SST (Square Bento Card) */}
        <motion.button
          type="button"
          onClick={() => onSelectModule("training")}
          whileHover={{ y: -5, scale: 1.015 }}
          whileTap={{ scale: 0.985 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="group relative p-6 rounded-3xl bg-slate-800/90 border border-slate-700/70 hover:border-teal-500/80 shadow-lg hover:shadow-teal-950/40 text-left flex flex-col justify-between aspect-square transition-colors cursor-pointer overflow-hidden"
        >
          {/* Hover glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl group-hover:bg-teal-500/20 transition-all pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-teal-500/15 border border-teal-500/30 text-teal-400 flex items-center justify-center shadow-inner group-hover:bg-teal-500/25 group-hover:text-teal-300 transition-colors">
                <Brain className="w-7 h-7" />
              </div>
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/40">
                Time-Attack
              </span>
            </div>

            <h3 className="text-xl font-bold text-white group-hover:text-teal-300 transition-colors">
              {t("tabTraining")}
            </h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              {language === "es"
                ? "Entrenamiento reactivo y toma de decisiones técnicas bajo presión normativa estricta (NRs)."
                : language === "en"
                ? "Time-attack safety decision simulator under strict regulatory standards (OSH)."
                : "Treinamento reativo e tomada de decisão técnica sob pressão normativa estrita (NRs)."}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-700/60 flex items-center justify-between">
            <div className="text-xs font-mono text-slate-400">
              <span className="text-white font-bold">{accuracy}%</span> precisão •{" "}
              <span className="text-teal-300 font-bold">{totalAttempts}</span> cenários
            </div>
            <div className="w-8 h-8 rounded-xl bg-slate-900/80 flex items-center justify-center text-teal-400 group-hover:translate-x-1 group-hover:bg-teal-600 group-hover:text-white transition-all shadow-sm">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </motion.button>

        {/* CARD 2: CHECK-IN EMOCIONAL (Square Bento Card) */}
        <motion.button
          type="button"
          onClick={() => onSelectModule("checkin")}
          whileHover={{ y: -5, scale: 1.015 }}
          whileTap={{ scale: 0.985 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="group relative p-6 rounded-3xl bg-slate-800/90 border border-slate-700/70 hover:border-rose-500/80 shadow-lg hover:shadow-rose-950/40 text-left flex flex-col justify-between aspect-square transition-colors cursor-pointer overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl group-hover:bg-rose-500/20 transition-all pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center shadow-inner group-hover:bg-rose-500/25 group-hover:text-rose-300 transition-colors">
                <HeartPulse className="w-7 h-7" />
              </div>
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                LGPD Art. 11/13
              </span>
            </div>

            <h3 className="text-xl font-bold text-white group-hover:text-rose-300 transition-colors">
              {t("tabCheckin")}
            </h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              {language === "es"
                ? "Registro anónimo de carga mental, estrés, fatiga y aptitud psicofísica antes y después del turno."
                : language === "en"
                ? "Anonymous tracking of mental load, fatigue, anxiety, and fitness-for-duty pre/post shift."
                : "Registro anônimo de carga mental, estresse, fadiga e aptidão psicofísica antes e após o turno."}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-700/60 flex items-center justify-between">
            <div className="text-xs text-slate-400">
              {userLog ? (
                <span>
                  Carga atual: <strong className="text-rose-300">{userLog.totalMentalLoad}/10</strong>
                </span>
              ) : (
                <span className="text-amber-300 font-medium">0 registros • Pendente</span>
              )}
            </div>
            <div className="w-8 h-8 rounded-xl bg-slate-900/80 flex items-center justify-center text-rose-400 group-hover:translate-x-1 group-hover:bg-rose-600 group-hover:text-white transition-all shadow-sm">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </motion.button>

        {/* CARD 3: MÓDULO DESCOMPRESSÃO (Square Bento Card) */}
        <motion.button
          type="button"
          onClick={() => onSelectModule("decompression")}
          whileHover={{ y: -5, scale: 1.015 }}
          whileTap={{ scale: 0.985 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="group relative p-6 rounded-3xl bg-slate-800/90 border border-slate-700/70 hover:border-cyan-500/80 shadow-lg hover:shadow-cyan-950/40 text-left flex flex-col justify-between aspect-square transition-colors cursor-pointer overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shadow-inner group-hover:bg-cyan-500/25 group-hover:text-cyan-300 transition-colors">
                <Wind className="w-7 h-7" />
              </div>
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                Profilaxia
              </span>
            </div>

            <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
              {t("tabDecompression")}
            </h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              {language === "es"
                ? "Pausa activa con respiración diafragmática 4-7-8, grounding sensorial y micro-pausas ergonómicas."
                : language === "en"
                ? "Active recovery with 4-7-8 diaphragmatic breathing, 5-4-3-2-1 grounding, and ergonomic breaks."
                : "Pausa ativa com respiração diafragmática 4-7-8, grounding sensorial e micro-pausas ergonômicas."}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-700/60 flex items-center justify-between">
            <span className="text-xs font-medium text-cyan-300">
              3 Protocolos Clínicos
            </span>
            <div className="w-8 h-8 rounded-xl bg-slate-900/80 flex items-center justify-center text-cyan-400 group-hover:translate-x-1 group-hover:bg-cyan-600 group-hover:text-white transition-all shadow-sm">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </motion.button>

        {/* CARD 4: GERADOR DE CENÁRIOS IA (Square Bento Card) */}
        <motion.button
          type="button"
          onClick={() => onSelectModule("generator")}
          whileHover={{ y: -5, scale: 1.015 }}
          whileTap={{ scale: 0.985 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="group relative p-6 rounded-3xl bg-slate-800/90 border border-slate-700/70 hover:border-purple-500/80 shadow-lg hover:shadow-purple-950/40 text-left flex flex-col justify-between aspect-square transition-colors cursor-pointer overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center shadow-inner group-hover:bg-purple-500/25 group-hover:text-purple-300 transition-colors">
                <Bot className="w-7 h-7" />
              </div>
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                IA Generativa
              </span>
            </div>

            <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
              {t("tabGenerator")}
            </h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              {language === "es"
                ? "Simulación de incidentes y fiscalizaciones imprevistas creadas por IA con validación legal estricta."
                : language === "en"
                ? "Dynamic incident generator with zero-hallucination compliance checking."
                : "Simulação de incidentes e fiscalizações imprevistas criadas por IA com validação legal estrita."}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-700/60 flex items-center justify-between">
            <span className="text-xs font-medium text-purple-300">
              6 Setores Econômicos
            </span>
            <div className="w-8 h-8 rounded-xl bg-slate-900/80 flex items-center justify-center text-purple-400 group-hover:translate-x-1 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-sm">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </motion.button>

        {/* CARD 5: PAINEL SST & PRIVACIDADE (Square Bento Card) */}
        <motion.button
          type="button"
          onClick={() => onSelectModule("sesmt")}
          whileHover={{ y: -5, scale: 1.015 }}
          whileTap={{ scale: 0.985 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="group relative p-6 rounded-3xl bg-slate-800/90 border border-slate-700/70 hover:border-emerald-500/80 shadow-lg hover:shadow-emerald-950/40 text-left flex flex-col justify-between aspect-square transition-colors cursor-pointer overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-inner group-hover:bg-emerald-500/25 group-hover:text-emerald-300 transition-colors">
                <BarChart3 className="w-7 h-7" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <Mail className="w-3 h-3" /> Gmail
                </span>
              </div>
            </div>

            <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
              {t("tabSesmt")}
            </h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              {language === "es"
                ? "Métricas agregadas por sector, blindaje contra uso punitivo, hashes SHA-256 y envío formal por Gmail."
                : language === "en"
                ? "Aggregated sector metrics, non-punitive privacy shielding, SHA-256 logs, and direct Gmail dispatch."
                : "Métricas agregadas por setor, blindagem contra uso punitivo, hashes SHA-256 e envio formal por Gmail."}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-700/60 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-emerald-300 font-semibold truncate max-w-[170px]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">LGPD Art. 11/13</span>
            </div>
            <div className="w-8 h-8 rounded-xl bg-slate-900/80 flex items-center justify-center text-emerald-400 group-hover:translate-x-1 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </motion.button>

        {/* CARD 6: DISTINTIVOS DO USUÁRIO / USER BADGES (Square Bento Card) */}
        <motion.button
          type="button"
          onClick={() => setIsBadgesModalOpen(true)}
          whileHover={{ y: -5, scale: 1.015 }}
          whileTap={{ scale: 0.985 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="group relative p-6 rounded-3xl bg-slate-800/90 border border-slate-700/70 hover:border-amber-500/80 shadow-lg hover:shadow-amber-950/40 text-left flex flex-col justify-between aspect-square transition-colors cursor-pointer overflow-hidden"
        >
          {/* Amber glow */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/25 transition-all pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shadow-inner group-hover:bg-amber-500/25 group-hover:text-amber-300 transition-colors">
                <Trophy className="w-7 h-7" />
              </div>
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-amber-400" />
                {highestBadge ? getLocalizedBadgeTitle(highestBadge) : "Nível Inicial"}
              </span>
            </div>

            <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
              {t("badgesCardTitle")}
            </h3>

            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              {t("badgesCardSubtitle")}
            </p>

            {/* Badges Mini Medallions Shelf */}
            <div className="mt-3 flex items-center gap-2">
              {badgesStatus.map((b) => (
                <div
                  key={b.badge.id}
                  title={`${b.badge.defaultTitle} (${b.badge.requiredScenarios} cenários)`}
                  className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs border transition-transform ${
                    b.isUnlocked
                      ? `${b.badge.colorClass} shadow-sm group-hover:scale-105`
                      : "bg-slate-900/60 border-slate-800 text-slate-600"
                  }`}
                >
                  {renderMiniBadgeIcon(b.badge.iconName, "w-3.5 h-3.5")}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-700/60 space-y-2">
            {/* Next badge progression */}
            {nextBadge ? (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="truncate max-w-[140px]">
                    {language === "es"
                      ? "Próximo: "
                      : language === "en"
                      ? "Next: "
                      : "Próximo: "}
                    <strong className="text-slate-200">{getLocalizedBadgeTitle(nextBadge)}</strong>
                  </span>
                  <span className="font-mono text-amber-400">
                    {totalAttempts}/{nextBadge.requiredScenarios}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-teal-400 transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.round((totalAttempts / nextBadge.requiredScenarios) * 100)
                      )}%`,
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>
                  {language === "es"
                    ? "¡Todos los rangos desbloqueados!"
                    : language === "en"
                    ? "All ranks unlocked!"
                    : "Todos os distintivos conquistados!"}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-amber-300/90 font-medium">
                {unlockedBadgesCount} / {USER_BADGES.length}{" "}
                {language === "es"
                  ? "Desbloqueados"
                  : language === "en"
                  ? "Unlocked"
                  : "Desbloqueados"}
              </span>
              <div className="w-8 h-8 rounded-xl bg-slate-900/80 flex items-center justify-center text-amber-400 group-hover:translate-x-1 group-hover:bg-amber-600 group-hover:text-white transition-all shadow-sm">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </motion.button>
      </div>

      {/* User Badges Modal */}
      <UserBadgesModal
        isOpen={isBadgesModalOpen}
        onClose={() => setIsBadgesModalOpen(false)}
        completedScenarios={totalAttempts}
        onGoToTraining={() => onSelectModule("training")}
      />
    </div>
  );
}
