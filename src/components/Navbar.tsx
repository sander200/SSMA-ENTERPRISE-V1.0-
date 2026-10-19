import { useState } from "react";
import {
  ShieldCheck,
  HardHat,
  HeartPulse,
  Brain,
  Bot,
  BarChart3,
  Wind,
  Settings,
  Lock,
  ChevronDown,
  LayoutGrid,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ECONOMIC_SECTORS } from "../data/sectors";
import { PsychologicalLog } from "../types";
import { useLanguage } from "../i18n/LanguageContext";
import { SupportedLanguage } from "../i18n/translations";

export type TabType = "menu" | "training" | "checkin" | "decompression" | "generator" | "sesmt" | "settings";

interface Props {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  selectedSectorId: number;
  setSelectedSectorId: (id: number) => void;
  userLog: PsychologicalLog | null;
  onOpenLGPDModal: () => void;
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
  isSettingsPasswordProtected,
  isSettingsUnlocked,
  onSelectSettingsTab,
  motionEnabled,
}: Props) {
  const { t, language, setLanguage, languages } = useLanguage();
  const mentalLoad = userLog?.totalMentalLoad ?? 0;
  const [showLangMenu, setShowLangMenu] = useState(false);

  // Tabs for the horizontal navigation bar (settings is moved to top right gear icon)
  const tabs: { id: TabType; label: string; icon: any }[] = [
    {
      id: "menu",
      label: language === "es" ? "Menú Principal" : language === "en" ? "Main Menu" : "Menu Principal",
      icon: LayoutGrid,
    },
    { id: "training", label: t("tabTraining"), icon: Brain },
    { id: "checkin", label: t("tabCheckin"), icon: HeartPulse },
    { id: "decompression", label: t("tabDecompression"), icon: Wind },
    { id: "generator", label: t("tabGenerator"), icon: Bot },
    { id: "sesmt", label: t("tabSesmt"), icon: BarChart3 },
  ];

  const currentLangObj = languages.find((l) => l.code === language) || languages[0];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-700/60 text-slate-100 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header Row */}
        <div className="flex items-center justify-between h-16 gap-3 sm:gap-4">
          {/* Logo & Platform Info - "SANDERVERSE • 2026" text removed */}
          <button
            type="button"
            onClick={() => setActiveTab("menu")}
            className="flex items-center gap-3 text-left cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-700 flex items-center justify-center text-white shadow-lg shadow-teal-900/30 font-bold text-lg group-hover:scale-105 transition-transform">
              <HardHat className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-white group-hover:text-teal-300 transition-colors">
                  {t("appName")}
                </span>
              </div>
              <span className="text-xs text-slate-300 block leading-tight">
                {t("appSubtitle")}
              </span>
            </div>
          </button>

          {/* Center Sector Selector (quick access) */}
          <div className="hidden lg:flex items-center gap-2 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700 text-xs">
            <span className="text-slate-300 font-semibold px-2">{t("sectorLabel")}:</span>
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

          {/* Right Status Badges & Elegant Gear Icon */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Quick Language Dropdown Menu */}
            <div className="relative">
              <button
                type="button"
                id="navbar-language-selector-btn"
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium transition-colors cursor-pointer"
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
                    className="absolute right-0 mt-2 w-48 bg-slate-850 border border-slate-700 rounded-2xl shadow-2xl py-1.5 z-50 overflow-hidden"
                  >
                    <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-700/80">
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
                  : mentalLoad <= 4 && mentalLoad > 0
                  ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25"
                  : mentalLoad > 4
                  ? "bg-amber-500/15 border-amber-500/40 text-amber-300 hover:bg-amber-500/25"
                  : "bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700"
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
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs transition-colors cursor-pointer"
              title="Ver garantias da Lei Geral de Proteção de Dados (LGPD)"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t("lgpdBadge")}</span>
            </button>

            {/* Elegant Gear Icon (Clean Configuration Access) */}
            <button
              type="button"
              id="navbar-settings-gear-btn"
              onClick={onSelectSettingsTab}
              className={`p-2 rounded-xl border transition-all cursor-pointer relative ${
                activeTab === "settings"
                  ? "bg-teal-600 border-teal-500 text-white shadow-md shadow-teal-900/40"
                  : "bg-slate-800/90 hover:bg-slate-700 border-slate-700 text-slate-300 hover:text-white"
              }`}
              title={
                language === "es"
                  ? "Configuración del Sistema"
                  : language === "en"
                  ? "System Settings"
                  : "Configurações do Sistema"
              }
            >
              <Settings className="w-5 h-5" />
              {isSettingsPasswordProtected && (
                <span
                  className={`absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] border border-slate-900 ${
                    isSettingsUnlocked ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"
                  }`}
                  title={isSettingsUnlocked ? "Sessão Desbloqueada" : "Protegido por Senha"}
                >
                  <Lock className="w-2 h-2" />
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar with Dynamic Motion Pill */}
        <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2.5 border-t border-slate-800/80 no-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                type="button"
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  isActive ? "text-white" : "text-slate-300 hover:text-white hover:bg-slate-800/60"
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
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
