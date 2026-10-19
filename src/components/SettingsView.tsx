import { useState } from "react";
import {
  Globe,
  Lock,
  KeyRound,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Eye,
  EyeOff,
  Trash2,
  Download,
  Info,
  Sliders,
  Check,
  Languages,
  Smartphone,
  ShieldAlert,
  FileCode,
  QrCode,
  ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "../i18n/LanguageContext";
import { SupportedLanguage } from "../i18n/translations";

interface Props {
  currentPassword: string;
  onUpdatePassword: (newPass: string) => void;
  onResetPassword: () => void;
  isPasswordRequired: boolean;
  onTogglePasswordRequired: (required: boolean) => void;
  onLockSessionNow: () => void;
  motionEnabled: boolean;
  onToggleMotion: (enabled: boolean) => void;
  onClearHistory: () => void;
  totalAttempts: number;
}

export function SettingsView({
  currentPassword,
  onUpdatePassword,
  onResetPassword,
  isPasswordRequired,
  onTogglePasswordRequired,
  onLockSessionNow,
  motionEnabled,
  onToggleMotion,
  onClearHistory,
  totalAttempts,
}: Props) {
  const { language, setLanguage, t, languages } = useLanguage();

  // Password Change Form State
  const [oldPasswordInput, setOldPasswordInput] = useState("");
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [confirmPasswordInput, setConfirmPasswordInput] = useState("");
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // Status Banners
  const [passError, setPassError] = useState<string | null>(null);
  const [passSuccess, setPassSuccess] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState<string | null>(null);
  const [historyClearedNotice, setHistoryClearedNotice] = useState<string | null>(null);
  const [isConfirmingReset, setIsConfirmingReset] = useState(false);
  const [isConfirmingClearHistory, setIsConfirmingClearHistory] = useState(false);

  // Protected APK Download Master Key State (keysander5361)
  const [apkMasterKeyInput, setApkMasterKeyInput] = useState("");
  const [showApkKey, setShowApkKey] = useState(false);
  const [isApkUnlocked, setIsApkUnlocked] = useState(false);
  const [apkKeyError, setApkKeyError] = useState<string | null>(null);
  const [apkKeySuccess, setApkKeySuccess] = useState<string | null>(null);

  function handleSavePassword(e: React.FormEvent) {
    e.preventDefault();
    setPassError(null);
    setPassSuccess(null);
    setResetSuccess(null);

    if (oldPasswordInput !== currentPassword) {
      setPassError(t("errorCurrentPasswordWrong"));
      return;
    }

    if (newPasswordInput.length < 4) {
      setPassError(t("errorPasswordTooShort"));
      return;
    }

    if (newPasswordInput !== confirmPasswordInput) {
      setPassError(t("errorPasswordMismatch"));
      return;
    }

    onUpdatePassword(newPasswordInput);
    setPassSuccess(t("passwordChangedSuccess"));
    setOldPasswordInput("");
    setNewPasswordInput("");
    setConfirmPasswordInput("");
  }

  function handleResetToDefault() {
    onResetPassword();
    setIsConfirmingReset(false);
    setPassError(null);
    setPassSuccess(null);
    setResetSuccess(t("resetSuccessMessage"));
  }

  function handleClearAllHistory() {
    onClearHistory();
    setIsConfirmingClearHistory(false);
    setHistoryClearedNotice(t("clearHistorySuccess"));
  }

  function handleExportData() {
    const attempts = localStorage.getItem("ssma_training_attempts") || "[]";
    const psychoLog = localStorage.getItem("ssma_psychological_log") || "{}";
    const exportObj = {
      app: "SSMA Enterprise - SST & Saúde Mental",
      exportedAt: new Date().toISOString(),
      language,
      attempts: JSON.parse(attempts),
      psychologicalLog: JSON.parse(psychoLog),
    };

    const blob = new Blob([JSON.stringify(exportObj, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ssma-enterprise-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function handleUnlockApk(e: React.FormEvent) {
    e.preventDefault();
    setApkKeyError(null);
    setApkKeySuccess(null);

    if (apkMasterKeyInput.trim() === "keysander5361") {
      setIsApkUnlocked(true);
      setApkKeySuccess(
        language === "es"
          ? "¡Clave maestra validada con éxito! Descarga de APK habilitada."
          : language === "en"
          ? "Master key verified successfully! APK download enabled."
          : "Chave mestra validada com sucesso! Download de APK liberado."
      );
    } else {
      setApkKeyError(
        language === "es"
          ? "Clave maestra incorrecta. Ingrese 'keysander5361' para desbloquear."
          : language === "en"
          ? "Invalid master key. Enter 'keysander5361' to unlock."
          : "Chave mestra incorreta. Digite 'keysander5361' para desbloquear."
      );
    }
  }

  function handleLockApkAgain() {
    setIsApkUnlocked(false);
    setApkMasterKeyInput("");
    setApkKeySuccess(null);
    setApkKeyError(null);
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-800/90 p-6 rounded-3xl border border-slate-700/70 shadow-lg backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 via-emerald-600 to-cyan-700 flex items-center justify-center text-white shadow-lg shadow-teal-950/60 shrink-0">
            <Sliders className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                {t("settingsTitle")}
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                SSMA Control
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
              {t("settingsSubtitle")}
            </p>
          </div>
        </div>

        {/* Lock Now Button */}
        {isPasswordRequired && (
          <button
            type="button"
            onClick={onLockSessionNow}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-300 hover:text-amber-200 text-xs font-semibold transition-all cursor-pointer shadow-xs self-start sm:self-auto"
            title="Bloqueia imediatamente esta aba para exigir a senha no próximo clique"
          >
            <Lock className="w-4 h-4 text-amber-400" />
            <span>{t("lockNowBtn")}</span>
          </button>
        )}
      </div>

      {/* SECTION 1: MULTILINGUAL CONFIGURATION (PORTUGUES, ESPANOL, INGLES) */}
      <section className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700/70 space-y-5 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                {t("languageSectionTitle")}
                <span className="text-xs font-normal text-slate-300">
                  (Português • Español • English)
                </span>
              </h2>
              <p className="text-xs text-slate-300">
                {t("languageSectionDesc")}
              </p>
            </div>
          </div>

          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
            <Languages className="w-3.5 h-3.5" />
            {t("currentLanguageBadge")}: {languages.find((l) => l.code === language)?.label}
          </span>
        </div>

        {/* 3 Interactive Language Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
          {languages.map((item) => {
            const isSelected = language === item.code;
            return (
              <button
                key={item.code}
                type="button"
                onClick={() => setLanguage(item.code as SupportedLanguage)}
                className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? "bg-slate-850 border-teal-500 ring-2 ring-teal-500/40 shadow-lg shadow-teal-950/40"
                    : "bg-slate-900/60 border-slate-750 hover:border-slate-600 hover:bg-slate-800/80"
                }`}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center text-white shadow-xs">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2.5 mb-2">
                    <span className="text-3xl filter drop-shadow-sm">{item.flag}</span>
                    <div>
                      <span className="text-sm font-bold text-white block">
                        {item.nativeName}
                      </span>
                      <span className="text-[11px] text-teal-400 font-semibold uppercase tracking-wider">
                        {item.code.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mt-2">
                    {item.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs">
                  <span
                    className={
                      isSelected ? "text-teal-300 font-semibold" : "text-slate-400"
                    }
                  >
                    {isSelected ? t("active") : "Clique para selecionar"}
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    {item.code === "pt" ? "BR / MTE" : item.code === "es" ? "ES / LATAM" : "Global"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* SECTION 2: PASSWORD CONFIGURATION & RESET */}
      <section className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700/70 space-y-6 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {t("securitySectionTitle")}
              </h2>
              <p className="text-xs text-slate-300">
                {t("securitySectionDesc")}
              </p>
            </div>
          </div>

          {/* Toggle Password Requirement */}
          <div className="flex items-center gap-3 bg-slate-900/80 px-3.5 py-2 rounded-2xl border border-slate-700">
            <div className="text-right">
              <span className="text-xs font-semibold text-slate-200 block">
                {isPasswordRequired ? t("passwordStatusActive") : t("passwordStatusDisabled")}
              </span>
              <span className="text-[10px] text-slate-400">
                {isPasswordRequired ? "Aba protegida" : "Acesso liberado"}
              </span>
            </div>
            <button
              type="button"
              onClick={() => onTogglePasswordRequired(!isPasswordRequired)}
              className={`w-12 h-6 rounded-full p-1 transition-colors relative cursor-pointer ${
                isPasswordRequired ? "bg-teal-600" : "bg-slate-700"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  isPasswordRequired ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Feedback Banners */}
        {passError && (
          <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{passError}</span>
          </div>
        )}
        {passSuccess && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{passSuccess}</span>
          </div>
        )}
        {resetSuccess && (
          <div className="p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2.5">
            <RotateCcw className="w-4 h-4 shrink-0 text-amber-400" />
            <span>{resetSuccess}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card A: Configurar Nova Senha */}
          <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-700/80 space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-700">
              <KeyRound className="w-4 h-4 text-teal-400" />
              <h3 className="text-sm font-bold text-white">
                {t("changePasswordTitle")}
              </h3>
            </div>

            <form onSubmit={handleSavePassword} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {t("currentPasswordLabel")}
                </label>
                <div className="relative">
                  <input
                    type={showOldPass ? "text" : "password"}
                    value={oldPasswordInput}
                    onChange={(e) => setOldPasswordInput(e.target.value)}
                    placeholder={t("currentPasswordPlaceholder")}
                    className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-teal-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPass(!showOldPass)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    {showOldPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {t("newPasswordLabel")}
                </label>
                <div className="relative">
                  <input
                    type={showNewPass ? "text" : "password"}
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    placeholder={t("newPasswordPlaceholder")}
                    className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-teal-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    {showNewPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {t("confirmPasswordLabel")}
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPass ? "text" : "password"}
                    value={confirmPasswordInput}
                    onChange={(e) => setConfirmPasswordInput(e.target.value)}
                    placeholder={t("confirmPasswordPlaceholder")}
                    className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-teal-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    {showConfirmPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all shadow-md shadow-teal-950/40 cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                <KeyRound className="w-3.5 h-3.5" />
                {t("saveNewPasswordBtn")}
              </button>
            </form>
          </div>

          {/* Card B: Reestabelecer Senha Padrão */}
          <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-700/80 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-700">
                <RotateCcw className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">
                  {t("resetPasswordTitle")}
                </h3>
              </div>

              <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                {t("resetPasswordDesc")}
              </p>

              <div className="mt-4 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs space-y-1.5">
                <div className="flex items-center gap-2 font-semibold">
                  <Info className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>{t("defaultPasswordNotice")}</span>
                </div>
                <p className="text-[11px] text-amber-200/80">
                  Caso esqueça sua senha modificada, você pode usar este botão de restauração rápida para retornar a <strong>admin123</strong> sem perder seus dados de treinamento.
                </p>
              </div>
            </div>

            <div>
              {!isConfirmingReset ? (
                <button
                  type="button"
                  onClick={() => setIsConfirmingReset(true)}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-amber-500/30 text-amber-300 hover:text-amber-200 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                  {t("resetPasswordBtn")}
                </button>
              ) : (
                <div className="p-3 bg-amber-500/15 border border-amber-500/40 rounded-xl space-y-2.5 text-center">
                  <p className="text-xs text-amber-200 font-semibold">
                    {t("resetPasswordConfirmPrompt")}
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsConfirmingReset(false)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs hover:bg-slate-700 cursor-pointer"
                    >
                      {t("cancel")}
                    </button>
                    <button
                      type="button"
                      onClick={handleResetToDefault}
                      className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold cursor-pointer flex items-center gap-1.5 shadow-sm"
                    >
                      <RotateCcw className="w-3 h-3" />
                      {t("confirm")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: PROTECTED APK DOWNLOAD (CLAVE MAESTRA: keysander5361) */}
      <section className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700/70 space-y-5 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                {language === "es"
                  ? "Descarga de APK / Instalador Android"
                  : language === "en"
                  ? "APK Download / Android Installer"
                  : "Download de APK / Instalador Android"}
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {isApkUnlocked ? "Desbloqueado" : "Protegido por Clave Maestra"}
                </span>
              </h2>
              <p className="text-xs text-slate-300">
                {language === "es"
                  ? "Área restringida para descarga del instalador corporativo Android. Requiere autorización previa."
                  : language === "en"
                  ? "Restricted area for corporate Android installer download. Requires prior authorization."
                  : "Área restrita para download do instalador corporativo Android. Requer autorização prévia."}
              </p>
            </div>
          </div>

          {isApkUnlocked && (
            <button
              type="button"
              onClick={handleLockApkAgain}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-white text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Bloquear APK</span>
            </button>
          )}
        </div>

        {/* Feedback Messages */}
        {apkKeyError && (
          <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{apkKeyError}</span>
          </div>
        )}
        {apkKeySuccess && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{apkKeySuccess}</span>
          </div>
        )}

        {/* IF LOCKED: MASTER KEY INPUT */}
        {!isApkUnlocked ? (
          <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-750 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  {language === "es"
                    ? "Ingrese la Clave Maestra para Habilitar Descarga"
                    : language === "en"
                    ? "Enter Master Key to Enable Download"
                    : "Digite a Chave Mestra para Liberar o Download"}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {language === "es"
                    ? "La distribución de paquetes APK está restringida para control interno de versiones."
                    : language === "en"
                    ? "APK package distribution is restricted for internal version control."
                    : "A distribuição de pacotes APK é restrita para controle interno de versões."}
                </p>
              </div>
            </div>

            <form onSubmit={handleUnlockApk} className="flex flex-col sm:flex-row gap-3 pt-1">
              <div className="relative flex-1">
                <input
                  type={showApkKey ? "text" : "password"}
                  value={apkMasterKeyInput}
                  onChange={(e) => setApkMasterKeyInput(e.target.value)}
                  placeholder={
                    language === "es"
                      ? "Ingrese clave maestra (ej: keysander5361)..."
                      : language === "en"
                      ? "Enter master key (e.g. keysander5361)..."
                      : "Digite a chave mestra (ex: keysander5361)..."
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-teal-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowApkKey(!showApkKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showApkKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>

              <button
                type="submit"
                className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-teal-950/40 cursor-pointer flex items-center justify-center gap-2"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>
                  {language === "es" ? "Desbloquear APK" : language === "en" ? "Unlock APK" : "Desbloquear APK"}
                </span>
              </button>
            </form>
          </div>
        ) : (
          /* IF UNLOCKED: DIRECT DOWNLOADS AND QR CODE */
          <div className="space-y-4 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Card 1: Direct APK File */}
              <div className="bg-slate-900/90 p-5 rounded-2xl border border-teal-500/40 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">ssma-enterprise.apk</h4>
                      <span className="text-[11px] text-teal-400 font-mono">
                        Versão 2.5.0 • Android 8.0+
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300">
                    42.8 MB
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {language === "es"
                    ? "Instalador ejecutable directo para teléfonos y tablets Android en terreno operacional."
                    : language === "en"
                    ? "Direct standalone APK installer for Android smartphones and tablets in the field."
                    : "Instalador executável direto para celulares e tablets Android em campo operacional."}
                </p>

                <a
                  href="/ssma-enterprise.apk"
                  download="ssma-enterprise.apk"
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xs font-bold transition-all shadow-lg shadow-teal-950/50 flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>
                    {language === "es"
                      ? "Descargar ssma-enterprise.apk"
                      : language === "en"
                      ? "Download ssma-enterprise.apk"
                      : "Baixar ssma-enterprise.apk"}
                  </span>
                </a>
              </div>

              {/* Card 2: Full Android Package ZIP */}
              <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-700 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-300">
                      <FileCode className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">ssma-android-package.zip</h4>
                      <span className="text-[11px] text-blue-400 font-mono">
                        Código-fonte & Assets PWA
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300">
                    Pacote ZIP
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {language === "es"
                    ? "Incluye manifiesto PWA, iconos adaptativos, scripts de compilación e instrucciones MD."
                    : language === "en"
                    ? "Includes PWA manifest, adaptive icons, build scripts, and offline service worker."
                    : "Inclui manifesto PWA, ícones adaptativos, scripts de build e offline service worker."}
                </p>

                <a
                  href="/ssma-android-package.zip"
                  download="ssma-android-package.zip"
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4 text-blue-400" />
                  <span>
                    {language === "es"
                      ? "Descargar Pacote ZIP Completo"
                      : language === "en"
                      ? "Download Full Android ZIP"
                      : "Baixar Pacote ZIP Completo"}
                  </span>
                </a>
              </div>
            </div>

            {/* Installation Instructions */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 space-y-2">
              <div className="font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                <span>Instruções de Instalação no Android:</span>
              </div>
              <ol className="list-decimal list-inside space-y-1 text-slate-400 pl-1 text-[11px]">
                <li>Transfira o arquivo <code>ssma-enterprise.apk</code> para o aparelho Android.</li>
                <li>Habilite nas configurações do aparelho a opção <em>"Instalar aplicativos de fontes desconhecidas"</em>.</li>
                <li>Toque no arquivo APK baixado para instalar a versão nativa corporativa.</li>
              </ol>
            </div>
          </div>
        )}
      </section>

      {/* SECTION 4: ANIMATIONS AND VISUAL EFFECTS */}
      <section className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700/70 space-y-5 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {t("animationsSectionTitle")}
              </h2>
              <p className="text-xs text-slate-300">
                {t("animationsSectionDesc")}
              </p>
            </div>
          </div>

          {/* Toggle Animation */}
          <div className="flex items-center gap-3 bg-slate-900/80 px-3.5 py-2 rounded-2xl border border-slate-700">
            <span className="text-xs font-semibold text-slate-200">
              {motionEnabled ? t("active") : t("disabled")}
            </span>
            <button
              type="button"
              onClick={() => onToggleMotion(!motionEnabled)}
              className={`w-12 h-6 rounded-full p-1 transition-colors relative cursor-pointer ${
                motionEnabled ? "bg-purple-600" : "bg-slate-700"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  motionEnabled ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        <div className="bg-slate-900/70 p-4 rounded-2xl border border-slate-750 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-slate-300">
            <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
            <span>{t("transitionSpringNotice")}</span>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-slate-800 text-purple-300 border border-purple-500/30">
            Framer Motion v12 • Spring Physics
          </span>
        </div>
      </section>

      {/* SECTION 5: LOCAL DATA & EXPORT */}
      <section className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700/70 space-y-4 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">
              {t("dataSectionTitle")}
            </h2>
            <p className="text-xs text-slate-300">
              {t("dataSectionDesc")}
            </p>
          </div>
        </div>

        {historyClearedNotice && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{historyClearedNotice}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-700 text-xs">
          <div>
            <span className="text-slate-200 font-semibold block">
              Tentativas Gravadas no Navegador: {totalAttempts}
            </span>
            <span className="text-slate-400 text-[11px]">
              Os dados ficam armazenados exclusivamente no seu dispositivo (em conformidade com a LGPD).
            </span>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleExportData}
              className="flex-1 sm:flex-initial py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-slate-700"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              <span>{t("exportDataBtn")}</span>
            </button>

            {!isConfirmingClearHistory ? (
              <button
                type="button"
                onClick={() => setIsConfirmingClearHistory(true)}
                className="flex-1 sm:flex-initial py-2 px-3 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                <span>{t("clearHistoryBtn")}</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5 bg-rose-500/20 p-1.5 rounded-xl border border-rose-500/40">
                <span className="text-[11px] text-rose-200 px-1 font-medium">Confirmar?</span>
                <button
                  type="button"
                  onClick={handleClearAllHistory}
                  className="px-2 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] cursor-pointer"
                >
                  {t("confirm")}
                </button>
                <button
                  type="button"
                  onClick={() => setIsConfirmingClearHistory(false)}
                  className="px-2 py-1 rounded bg-slate-800 text-slate-300 text-[11px] cursor-pointer"
                >
                  {t("cancel")}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
