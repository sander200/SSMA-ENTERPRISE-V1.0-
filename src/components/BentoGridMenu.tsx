import { useState } from "react";
import {
  Brain,
  HeartPulse,
  Wind,
  Bot,
  BarChart3,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Trophy,
  Layers,
  Building2,
  Mail,
  Award,
  Eye,
  FileCheck,
  Zap,
  Crown,
  CheckCircle2,
  Cloud,
  CloudOff,
  CloudUpload,
  RefreshCw,
  FileSpreadsheet,
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

export type ModuleTab =
  | "training"
  | "checkin"
  | "decompression"
  | "generator"
  | "sesmt";

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

  const badgesStatus = getBadgesStatus(totalAttempts);
  const highestBadge = getHighestUnlockedBadge(totalAttempts);
  const nextBadge = getNextBadgeToUnlock(totalAttempts);
  const unlockedBadgesCount = badgesStatus.filter((b) => b.isUnlocked).length;

  // Read Google Sheets sync state for immediate visual status on the Bento Menu
  const sheetId = localStorage.getItem("ssma_admin_reporting_sheet_id") || "";
  const lastSync = localStorage.getItem("ssma_admin_reporting_last_sync");
  const isSheetSynced = Boolean(sheetId.trim() && lastSync);
  const isSheetConfigured = Boolean(sheetId.trim());

  function renderMiniBadgeIcon(
    iconName: UserBadge["iconName"],
    className = "w-3.5 h-3.5"
  ) {
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
      {/* Bento Grid Header - Clean Corporate Light Theme */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold mb-1.5">
            <Layers className="w-3.5 h-3.5 text-teal-600" />
            <span>
              {language === "es"
                ? "Centro de Control Operativo"
                : language === "en"
                ? "Operations Control Center"
                : "Centro de Controle Operacional"}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {language === "es"
              ? "Menú Principal • Módulos SST"
              : language === "en"
              ? "Main Menu • OSH Modules"
              : "Menu Principal • Módulos SST"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {language === "es"
              ? "Seleccione un módulo interactivo para iniciar simulaciones, registros profilácticos o sincronización en la nube con Google Sheets."
              : language === "en"
              ? "Select an interactive module to start simulations, psychological logs, or Google Sheets cloud synchronization."
              : "Selecione um módulo interativo para iniciar simulações, registros profiláticos ou sincronização com Google Sheets."}
          </p>
        </div>

        {/* Live Status Summary Chips */}
        <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
          {/* Cloud Sync Status Chip -> Opens SESMT Dashboard */}
          <button
            type="button"
            onClick={() => onSelectModule("sesmt")}
            className={`flex items-center gap-2.5 p-2.5 sm:p-3 rounded-2xl border text-xs transition-all cursor-pointer shadow-2xs ${
              isSheetSynced
                ? "bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-900"
                : isSheetConfigured
                ? "bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-900"
                : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 ${
                isSheetSynced
                  ? "bg-emerald-100 border-emerald-300 text-emerald-700"
                  : isSheetConfigured
                  ? "bg-amber-100 border-amber-300 text-amber-700"
                  : "bg-white border-slate-200 text-slate-500"
              }`}
            >
              {isSheetSynced ? (
                <Cloud className="w-4 h-4" />
              ) : isSheetConfigured ? (
                <CloudUpload className="w-4 h-4" />
              ) : (
                <CloudOff className="w-4 h-4" />
              )}
            </div>
            <div className="text-left">
              <span className="text-slate-500 block text-[10px] font-semibold uppercase leading-tight">
                Google Sheets Cloud
              </span>
              <span className="font-extrabold block text-xs flex items-center gap-1">
                {isSheetSynced
                  ? language === "en"
                    ? "Synced"
                    : "Sincronizado"
                  : isSheetConfigured
                  ? language === "en"
                    ? "Pending Sync"
                    : "Pendiente Sync"
                  : "Sync Now"}
                <RefreshCw className="w-3 h-3 opacity-75 inline ml-1" />
              </span>
            </div>
          </button>

          {/* Badges Status Chip */}
          <button
            type="button"
            onClick={() => setIsBadgesModalOpen(true)}
            className="flex items-center gap-2.5 bg-slate-50 hover:bg-amber-50/70 p-2.5 sm:p-3 rounded-2xl border border-slate-200 hover:border-amber-300 text-xs transition-colors cursor-pointer group shadow-2xs"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Trophy className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="text-slate-500 block text-[11px] leading-tight font-semibold">
                {language === "es"
                  ? "Distintivos"
                  : language === "en"
                  ? "Badges"
                  : "Distintivos"}
              </span>
              <span className="font-extrabold text-slate-900 block text-xs">
                {unlockedBadgesCount} / {USER_BADGES.length}{" "}
                <span className="text-[10px] text-slate-500 font-normal">
                  {language === "es"
                    ? "Rango"
                    : language === "en"
                    ? "Rank"
                    : "Nível"}
                </span>
              </span>
            </div>
          </button>

          {/* Active Sector Chip */}
          <div className="flex items-center gap-2.5 bg-slate-50 p-2.5 sm:p-3 rounded-2xl border border-slate-200 text-xs shadow-2xs">
            <div className="text-right">
              <span className="text-slate-500 block text-[11px] leading-tight font-semibold">
                {language === "es"
                  ? "Sector Activo"
                  : language === "en"
                  ? "Active Sector"
                  : "Setor Ativo"}
              </span>
              <span className="font-extrabold text-slate-900 max-w-[120px] truncate block text-xs">
                {currentSectorName}
              </span>
            </div>
            <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center shrink-0">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Bento Grid Layout - 6 Interactive Square Bento Panels (Light Theme) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* CARD 1: SIMULADOR SST */}
        <motion.button
          type="button"
          onClick={() => onSelectModule("training")}
          whileHover={{ y: -4, scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="group relative p-6 rounded-3xl bg-white border border-slate-200 hover:border-teal-500 shadow-sm hover:shadow-md text-left flex flex-col justify-between aspect-square transition-all cursor-pointer overflow-hidden"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-colors">
                <Brain className="w-7 h-7" />
              </div>
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
                Time-Attack
              </span>
            </div>

            <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-teal-700 transition-colors">
              {t("tabTraining")}
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              {language === "es"
                ? "Entrenamiento reactivo y toma de decisiones técnicas bajo presión normativa estricta (NRs)."
                : language === "en"
                ? "Time-attack safety decision simulator under strict regulatory standards (OSH)."
                : "Treinamento reativo e tomada de decisão técnica sob pressão normativa estrita (NRs)."}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="text-xs font-mono text-slate-500">
              <span className="text-slate-900 font-bold">{accuracy}%</span>{" "}
              precisión •{" "}
              <span className="text-teal-700 font-bold">{totalAttempts}</span>{" "}
              escenarios
            </div>
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-teal-700 group-hover:translate-x-1 group-hover:bg-teal-600 group-hover:text-white transition-all">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </motion.button>

        {/* CARD 2: CHECK-IN EMOCIONAL */}
        <motion.button
          type="button"
          onClick={() => onSelectModule("checkin")}
          whileHover={{ y: -4, scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="group relative p-6 rounded-3xl bg-white border border-slate-200 hover:border-rose-500 shadow-sm hover:shadow-md text-left flex flex-col justify-between aspect-square transition-all cursor-pointer overflow-hidden"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-colors">
                <HeartPulse className="w-7 h-7" />
              </div>
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-800 border border-rose-200">
                LGPD Art. 11/13
              </span>
            </div>

            <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-rose-700 transition-colors">
              {t("tabCheckin")}
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              {language === "es"
                ? "Registro anónimo de carga mental, estrés, fatiga y aptitud psicofísica antes y después del turno."
                : language === "en"
                ? "Anonymous tracking of mental load, fatigue, anxiety, and fitness-for-duty pre/post shift."
                : "Registro anônimo de carga mental, estresse, fadiga e aptidão psicofísica antes e após o turno."}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="text-xs text-slate-500">
              {userLog ? (
                <span>
                  Carga actual:{" "}
                  <strong className="text-rose-700">
                    {userLog.totalMentalLoad}/10
                  </strong>
                </span>
              ) : (
                <span className="text-amber-700 font-semibold">
                  0 registros • Pendiente
                </span>
              )}
            </div>
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-rose-600 group-hover:translate-x-1 group-hover:bg-rose-600 group-hover:text-white transition-all">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </motion.button>

        {/* CARD 3: MÓDULO DESCOMPRESIÓN */}
        <motion.button
          type="button"
          onClick={() => onSelectModule("decompression")}
          whileHover={{ y: -4, scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="group relative p-6 rounded-3xl bg-white border border-slate-200 hover:border-cyan-500 shadow-sm hover:shadow-md text-left flex flex-col justify-between aspect-square transition-all cursor-pointer overflow-hidden"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-cyan-50 border border-cyan-200 text-cyan-700 flex items-center justify-center group-hover:bg-cyan-600 group-hover:text-white transition-colors">
                <Wind className="w-7 h-7" />
              </div>
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-cyan-50 text-cyan-800 border border-cyan-200">
                Profilaxis
              </span>
            </div>

            <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-cyan-700 transition-colors">
              {t("tabDecompression")}
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              {language === "es"
                ? "Pausa activa con respiración diafragmática 4-7-8, grounding sensorial y micro-pausas ergonómicas."
                : language === "en"
                ? "Active recovery with 4-7-8 diaphragmatic breathing, 5-4-3-2-1 grounding, and ergonomic breaks."
                : "Pausa ativa com respiração diafragmática 4-7-8, grounding sensorial e micro-pausas ergonômicas."}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-700">
              3 Protocolos Clínicos
            </span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-cyan-700 group-hover:translate-x-1 group-hover:bg-cyan-600 group-hover:text-white transition-all">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </motion.button>

        {/* CARD 4: GENERADOR DE ESCENARIOS IA */}
        <motion.button
          type="button"
          onClick={() => onSelectModule("generator")}
          whileHover={{ y: -4, scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="group relative p-6 rounded-3xl bg-white border border-slate-200 hover:border-purple-500 shadow-sm hover:shadow-md text-left flex flex-col justify-between aspect-square transition-all cursor-pointer overflow-hidden"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <Bot className="w-7 h-7" />
              </div>
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-purple-50 text-purple-800 border border-purple-200">
                IA Generativa
              </span>
            </div>

            <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-purple-700 transition-colors">
              {t("tabGenerator")}
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              {language === "es"
                ? "Simulación de incidentes y fiscalizaciones imprevistas creadas por IA con validación legal estricta."
                : language === "en"
                ? "Dynamic incident generator with zero-hallucination compliance checking."
                : "Simulação de incidentes e fiscalizações imprevistas criadas por IA com validação legal estrita."}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-purple-700">
              6 Sectores Económicos
            </span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-purple-700 group-hover:translate-x-1 group-hover:bg-purple-600 group-hover:text-white transition-all">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </motion.button>

        {/* CARD 5: PANEL SST & PRIVACIDAD (GOOGLE SHEETS SYNC + GMAIL) */}
        <motion.button
          type="button"
          onClick={() => onSelectModule("sesmt")}
          whileHover={{ y: -4, scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="group relative p-6 rounded-3xl bg-white border border-slate-200 hover:border-emerald-500 shadow-sm hover:shadow-md text-left flex flex-col justify-between aspect-square transition-all cursor-pointer overflow-hidden"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <BarChart3 className="w-7 h-7" />
              </div>
              <div className="flex items-center gap-1.5">
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1 ${
                    isSheetSynced
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                      : isSheetConfigured
                      ? "bg-amber-50 text-amber-800 border-amber-200"
                      : "bg-slate-100 text-slate-700 border-slate-200"
                  }`}
                >
                  {isSheetSynced ? (
                    <Cloud className="w-3 h-3 text-emerald-600" />
                  ) : isSheetConfigured ? (
                    <CloudUpload className="w-3 h-3 text-amber-600" />
                  ) : (
                    <FileSpreadsheet className="w-3 h-3 text-emerald-600" />
                  )}
                  <span>Sheets Sync</span>
                </span>
                <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <Mail className="w-3 h-3" /> Gmail
                </span>
              </div>
            </div>

            <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors">
              {t("tabSesmt")}
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              {language === "es"
                ? "Sincronización de intentos y logs psicológicos con Google Sheets API (Sync Now), métricas por sector y respaldo Gmail."
                : language === "en"
                ? "Sync training attempts and psychological logs with Google Sheets API (Sync Now), sector metrics, and Gmail backup."
                : "Sincronização de tentativas e logs psicológicos com Google Sheets API (Sync Now), métricas e Gmail."}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold truncate max-w-[190px]">
              <RefreshCw className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">
                {isSheetSynced
                  ? "Sincronizado • Sync Now"
                  : "Google Sheets • Sync Now"}
              </span>
            </div>
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-emerald-700 group-hover:translate-x-1 group-hover:bg-emerald-600 group-hover:text-white transition-all">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </motion.button>

        {/* CARD 6: DISTINTIVOS DEL USUARIO / USER BADGES */}
        <motion.button
          type="button"
          onClick={() => setIsBadgesModalOpen(true)}
          whileHover={{ y: -4, scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="group relative p-6 rounded-3xl bg-white border border-slate-200 hover:border-amber-500 shadow-sm hover:shadow-md text-left flex flex-col justify-between aspect-square transition-all cursor-pointer overflow-hidden"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors">
                <Trophy className="w-7 h-7" />
              </div>
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-amber-500" />
                {highestBadge
                  ? getLocalizedBadgeTitle(highestBadge)
                  : "Nivel Inicial"}
              </span>
            </div>

            <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-amber-700 transition-colors">
              {t("badgesCardTitle")}
            </h3>

            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              {t("badgesCardSubtitle")}
            </p>

            {/* Badges Mini Medallions Shelf */}
            <div className="mt-3 flex items-center gap-2">
              {badgesStatus.map((b) => (
                <div
                  key={b.badge.id}
                  title={`${b.badge.defaultTitle} (${b.badge.requiredScenarios} escenarios)`}
                  className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs border transition-transform ${
                    b.isUnlocked
                      ? "bg-amber-50 border-amber-300 text-amber-700 shadow-2xs group-hover:scale-105"
                      : "bg-slate-50 border-slate-200 text-slate-400"
                  }`}
                >
                  {renderMiniBadgeIcon(b.badge.iconName, "w-3.5 h-3.5")}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-2">
            {nextBadge ? (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="truncate max-w-[140px]">
                    Próximo:{" "}
                    <strong className="text-slate-800">
                      {getLocalizedBadgeTitle(nextBadge)}
                    </strong>
                  </span>
                  <span className="font-mono font-bold text-amber-700">
                    {totalAttempts}/{nextBadge.requiredScenarios}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-teal-500 transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.round(
                          (totalAttempts / nextBadge.requiredScenarios) * 100
                        )
                      )}%`,
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
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
              <span className="text-[11px] text-amber-700 font-bold">
                {unlockedBadgesCount} / {USER_BADGES.length}{" "}
                {language === "es"
                  ? "Desbloqueados"
                  : language === "en"
                  ? "Unlocked"
                  : "Desbloqueados"}
              </span>
              <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-amber-700 group-hover:translate-x-1 group-hover:bg-amber-500 group-hover:text-white transition-all">
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
