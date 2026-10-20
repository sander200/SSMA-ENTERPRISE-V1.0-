import { useState } from "react";
import {
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
  Cloud,
  CloudOff,
  CloudUpload,
  RefreshCw,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ECONOMIC_SECTORS } from "../data/sectors";
import { PsychologicalLog } from "../types";
import { useLanguage } from "../i18n/LanguageContext";
import { SupportedLanguage } from "../i18n/translations";

export type TabType =
  | "menu"
  | "training"
  | "checkin"
  | "decompression"
  | "generator"
  | "sesmt"
  | "settings";

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
  customLogo?: string | null;
}

export function Navbar({
  activeTab,
  setActiveTab,
  selectedSectorId,
  setSelectedSectorId,
  isSettingsPasswordProtected,
  isSettingsUnlocked,
  onSelectSettingsTab,
  motionEnabled,
  customLogo,
}: Props) {
  const { t, language, setLanguage, languages } = useLanguage();
  const [showLangMenu, setShowLangMenu] = useState(false);

  const sheetId = localStorage.getItem("ssma_admin_reporting_sheet_id") || "";
  const lastSync = localStorage.getItem("ssma_admin_reporting_last_sync");
  const isSheetSynced = Boolean(sheetId.trim() && lastSync);
  const isSheetConfigured = Boolean(sheetId.trim());

  const tabs: { id: TabType; label: string; icon: any }[] = [
    {
      id: "menu",
      label:
        language === "es"
          ? "Menú Principal"
          : language === "en"
          ? "Main Menu"
          : "Menu Principal",
      icon: LayoutGrid,
    },
    { id: "training", label: t("tabTraining"), icon: Brain },
    { id: "checkin", label: t("tabCheckin"), icon: HeartPulse },
    { id: "decompression", label: t("tabDecompression"), icon: Wind },
    { id: "generator", label: t("tabGenerator"), icon: Bot },
    { id: "sesmt", label: t("tabSesmt"), icon: BarChart3 },
  ];

  const currentLangObj =
    languages.find((l) => l.code === language) || languages[0];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-900 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Simplified Clean Top Header Row */}
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Corporate Brand Logo & Name */}
          <button
            type="button"
            onClick={() => setActiveTab("menu")}
            className="flex items-center gap-3 text-left cursor-pointer group"
          >
            {customLogo ? (
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center p-1 shadow-xs overflow-hidden group-hover:scale-105 transition-transform">
                <img
                  src={customLogo}
                  alt="Logo SSMA"
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-600 to-emerald-600 flex items-center justify-center text-white shadow-sm font-bold text-lg group-hover:scale-105 transition-transform">
                <HardHat className="w-5 h-5 text-white" />
              </div>
            )}
            <div>
              <span className="font-extrabold text-base tracking-tight text-slate-900 group-hover:text-teal-700 transition-colors block">
                {t("appName")}
              </span>
              <span className="text-xs text-slate-500 block leading-tight">
                {t("appSubtitle")}
              </span>
            </div>
          </button>

          {/* Minimal Right Controls: Sector selector + Language + Protected Gear Icon */}
          <div className="flex items-center gap-2">
            {/* Cloud Sync Status Quick Indicator -> Opens SESMT Dashboard */}
            <button
              type="button"
              id="navbar-cloud-sync-btn"
              onClick={() => setActiveTab("sesmt")}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                isSheetSynced
                  ? "bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-800"
                  : isSheetConfigured
                  ? "bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-800"
                  : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600"
              }`}
              title={
                isSheetSynced
                  ? `Google Sheets Sincronizado (${new Date(
                      lastSync!
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}) - Clic para abrir Sync Now`
                  : isSheetConfigured
                  ? "Google Sheets pendiente de sincronizar - Clic para Sync Now"
                  : "Sincronizar con Google Sheets - Clic para configurar"
              }
            >
              {isSheetSynced ? (
                <Cloud className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : isSheetConfigured ? (
                <CloudUpload className="w-4 h-4 text-amber-600 shrink-0" />
              ) : (
                <CloudOff className="w-4 h-4 text-slate-400 shrink-0" />
              )}
              <span className="hidden sm:inline">
                {isSheetSynced
                  ? "Sheets Synced"
                  : isSheetConfigured
                  ? "Sync Pending"
                  : "Sync Now"}
              </span>
              <RefreshCw className="w-3 h-3 opacity-70 hidden md:inline" />
            </button>

            {/* Compact Sector Selector */}
            <div className="hidden lg:flex items-center gap-2 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs">
              <span className="text-slate-500 font-semibold">
                {t("sectorLabel")}:
              </span>
              <select
                value={selectedSectorId}
                onChange={(e) => setSelectedSectorId(Number(e.target.value))}
                className="bg-transparent text-slate-800 text-xs font-bold focus:outline-hidden cursor-pointer"
              >
                {ECONOMIC_SECTORS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Compact Language Selector */}
            <div className="relative">
              <button
                type="button"
                id="navbar-language-selector-btn"
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                title="Cambiar Idioma / Alterar Idioma"
              >
                <span className="text-sm">{currentLangObj.flag}</span>
                <span className="hidden sm:inline">
                  {currentLangObj.code.toUpperCase()}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <AnimatePresence>
                {showLangMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    transition={{ duration: 0.14 }}
                    className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded-2xl shadow-xl py-1.5 z-50 overflow-hidden"
                  >
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
                            ? "bg-teal-50 text-teal-800 font-bold"
                            : "text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-base">{l.flag}</span>
                          <span>{l.nativeName}</span>
                        </div>
                        {language === l.code && (
                          <span className="text-xs text-teal-600 font-bold">
                            ✓
                          </span>
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Clean Protected Settings / Developer Gear Button */}
            <button
              type="button"
              id="navbar-settings-gear-btn"
              onClick={onSelectSettingsTab}
              className={`p-2 rounded-xl border transition-all cursor-pointer relative ${
                activeTab === "settings"
                  ? "bg-teal-600 border-teal-600 text-white shadow-sm"
                  : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900"
              }`}
              title={
                language === "es"
                  ? "Configuración y Modo Desarrollador (Protegido por Clave Maestra)"
                  : language === "en"
                  ? "Settings & Developer Mode (Master Key Protected)"
                  : "Configurações e Modo Desenvolvedor (Protegido por Chave Mestra)"
              }
            >
              <Settings
                className={`w-5 h-5 ${
                  activeTab === "settings" ? "text-white" : "text-slate-700"
                }`}
              />
              {isSettingsPasswordProtected && (
                <span
                  className={`absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] border border-white ${
                    isSettingsUnlocked
                      ? "bg-emerald-500 text-white"
                      : "bg-amber-500 text-white"
                  }`}
                >
                  <Lock className="w-2 h-2 text-white" />
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Clean Navigation Tabs Bar */}
        <nav className="flex items-center gap-1.5 overflow-x-auto py-2 border-t border-slate-100 no-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                type="button"
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? "bg-teal-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                {isActive && motionEnabled && (
                  <motion.div
                    layoutId="navbar-active-tab-pill"
                    className="absolute inset-0 rounded-xl bg-teal-600 -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? "text-white" : "text-teal-600"
                  }`}
                />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
