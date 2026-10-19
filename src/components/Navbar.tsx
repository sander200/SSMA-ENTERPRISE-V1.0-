import { useState } from "react";
import {
  ShieldCheck,
  HardHat,
  HeartPulse,
  Brain,
  Bot,
  BarChart3,
  Wind,
  Smartphone,
  Sliders,
  Lock,
  Globe,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ECONOMIC_SECTORS } from "../data/sectors";
import { PsychologicalLog } from "../types";
import { useLanguage } from "../i18n/LanguageContext";
import { SupportedLanguage } from "../i18n/translations";

export type TabType = "training" | "checkin" | "decompression" | "generator" | "sesmt" | "settings";

interface Props {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  selectedSectorId: number;
  setSelectedSectorId: (id: number) => void;
  userLog: PsychologicalLog | null;
  onOpenLGPDModal: () => void;
  onOpenAPKModal: () => void;
  isSettingsPasswordProtected: boolean;
  isSettingsUnlocked: boolean;
  onSelectSettingsTab: () => void;
  motionEnabled: boolean;
}

export function Navbar({
  activeTab,
  setActiveTab,
  selectedSectorId,
  setSelectedSectorId,
  userLog,
  onOpenLGPDModal,
  onOpenAPKModal,
  isSettingsPasswordProtected,
  isSettingsUnlocked,
  onSelectSettingsTab,
  motionEnabled,
}: Props) {
  const { t, language, setLanguage, languages } = useLanguage();
  const mentalLoad = userLog?.totalMentalLoad ?? 5;
  const [showLangMenu, setShowLangMenu] = useState(false);

  const tabs: { id: TabType; label: string; icon: any; isProtected?: boolean }[] = [
    { id: "training", label: t("tabTraining"), icon: Brain },
    { id: "checkin", label: t("tabCheckin"), icon: HeartPulse },
    { id: "decompression", label: t("tabDecompression"), icon: Wind },
    { id: "generator", label: t("tabGenerator"), icon: Bot },
    { id: "sesmt", label: t("tabSesmt"), icon: BarChart3 },
    { id: "settings", label: t("tabSettings"), icon: Sliders, isProtected: isSettingsPasswordProtected },
  ];

  const currentLangObj = languages.find((l) => l.code === language) || languages[0];

  function handleTabClick(tabId: TabType) {
    if (tabId === "settings") {
      onSelectSettingsTab();
    } else {
      setActiveTab(tabId);
    }
  }

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header Row */}
        <div className="flex items-center justify-between h-16 gap-3 sm:gap-4">
          {/* Logo & Platform Info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-700 flex items-center justify-center text-white shadow-lg shadow-teal-900/30 font-bold text-lg">
              <HardHat className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-white">
                  {t("appName")}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  {t("appBadge")}
                </span>
              </div>
              <span className="text-xs text-slate-400 block leading-tight">
                {t("appSubtitle")}
              </span>
            </div>
          </div>

          {/* Center Sector Selector (quick access) */}
          <div className="hidden lg:flex items-center gap-2 bg-slate-950/60 p-1.5 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400 font-semibold px-2">{t("sectorLabel")}:</span>
            <select
              value={selectedSectorId}
              onChange={(e) => setSelectedSectorId(Number(e.target.value))}
              className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 text-xs font-medium focus:outline-hidden focus:border-teal-500"
            >
              {ECONOMIC_SECTORS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.norms})
                </option>
              ))}
            </select>
          </div>

          {/* Right Status Badges & Language Selector */}
          <div className="flex items-center gap-2">
            {/* Quick Language Dropdown Menu */}
            <div className="relative">
              <button
                type="button"
                id="navbar-language-selector-btn"
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700/90 border border-slate-700 text-slate-200 text-xs font-medium transition-colors cursor-pointer"
                title="Alterar Idioma / Cambiar Idioma / Change Language"
              >
                <span className="text-base">{currentLangObj.flag}</span>
                <span className="hidden sm:inline font-semibold">{currentLangObj.code.toUpperCase()}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <AnimatePresence>
                {showLangMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-xl py-1.5 z-50 overflow-hidden"
                  >
                    <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                      Idioma / Language
                    </div>
                    {languages.map((l) => (
                      <button
                        key={l.code}
                        type="button"
                        onClick={() => {
                          setLanguage(l.code as SupportedLanguage);
                          setShowLangMenu(false);
                        }}
                        className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between transition-colors cursor-pointer ${
                          language === l.code
                            ? "bg-teal-500/20 text-teal-300 font-bold"
                            : "text-slate-300 hover:bg-slate-800"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-base">{l.flag}</span>
                          <span>{l.nativeName}</span>
                        </div>
                        {language === l.code && (
                          <span className="text-[10px] text-teal-400 font-mono">✓</span>
                        )}
                      </button>
                    ))}
                    <div className="border-t border-slate-800 mt-1 pt-1 px-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowLangMenu(false);
                          onSelectSettingsTab();
                        }}
                        className="w-full text-center py-1 text-[11px] text-teal-400 hover:text-teal-300 flex items-center justify-center gap-1"
                      >
                        <Sliders className="w-3 h-3" />
                        <span>{t("tabSettings")}</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mental Load Pill */}
            <button
              type="button"
              id="navbar-mental-load-pill"
              onClick={() => setActiveTab("checkin")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                mentalLoad >= 7
                  ? "bg-rose-500/15 border-rose-500/40 text-rose-300 hover:bg-rose-500/25"
                  : mentalLoad <= 4
                  ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25"
                  : "bg-amber-500/15 border-amber-500/40 text-amber-300 hover:bg-amber-500/25"
              }`}
              title="Clique para atualizar seu Check-in Emocional"
            >
              <HeartPulse className="w-3.5 h-3.5" />
              <span>{t("mentalLoadLabel")}: {mentalLoad}/10</span>
            </button>

            {/* LGPD Badge */}
            <button
              type="button"
              id="navbar-lgpd-badge"
              onClick={onOpenLGPDModal}
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs transition-colors cursor-pointer"
              title="Ver garantias da Lei Geral de Proteção de Dados (LGPD)"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t("lgpdBadge")}</span>
            </button>

            {/* Gerar / Baixar APK Button */}
            <button
              type="button"
              id="navbar-apk-install-btn"
              onClick={onOpenAPKModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/40 text-teal-300 text-xs font-semibold transition-all cursor-pointer shadow-xs"
              title="Gerar Pacote APK para Android ou Instalar no Celular"
            >
              <Smartphone className="w-3.5 h-3.5 text-teal-400" />
              <span className="hidden sm:inline">{t("apkDownload")}</span>
              <span className="sm:hidden">{t("apkShort")}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar with Dynamic Motion Pill */}
        <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2.5 border-t border-slate-800/60 no-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                type="button"
                id={`tab-${tab.id}`}
                onClick={() => handleTabClick(tab.id)}
                className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  isActive ? "text-white" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                }`}
              >
                {/* Dynamic Floating Pill Indicator */}
                {isActive && (
                  motionEnabled ? (
                    <motion.div
                      layoutId="activeNavTabPill"
                      className="absolute inset-0 bg-teal-600 rounded-xl shadow-md shadow-teal-900/40"
                      transition={{ type: "spring", stiffness: 480, damping: 34 }}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-teal-600 rounded-xl shadow-md shadow-teal-900/40" />
                  )
                )}

                <span className="relative z-10 flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>

                  {/* Settings Lock indicator */}
                  {tab.id === "settings" && isSettingsPasswordProtected && (
                    <span
                      className={`ml-1 flex items-center ${
                        isSettingsUnlocked ? "text-emerald-300" : "text-amber-300"
                      }`}
                      title={isSettingsUnlocked ? "Sessão Desbloqueada" : "Protegido por Senha"}
                    >
                      <Lock className="w-3 h-3" />
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
