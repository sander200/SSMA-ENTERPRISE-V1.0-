import { useState } from "react";
import { Lock, Eye, EyeOff, KeyRound, AlertCircle, CheckCircle2, RotateCcw, X, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "../i18n/LanguageContext";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  currentPassword: string;
  onResetToDefault: () => void;
}

export function PasswordPromptModal({
  isOpen,
  onClose,
  onSuccess,
  currentPassword,
  onResetToDefault,
}: Props) {
  const { t } = useLanguage();
  const [enteredPassword, setEnteredPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resetFeedback, setResetFeedback] = useState<string | null>(null);
  const [isResetConfirming, setIsResetConfirming] = useState(false);

  if (!isOpen) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);

    if (enteredPassword === currentPassword) {
      setEnteredPassword("");
      setErrorMessage(null);
      setResetFeedback(null);
      onSuccess();
    } else {
      setErrorMessage(t("modalWrongPassword"));
    }
  }

  function handleReset() {
    onResetToDefault();
    setResetFeedback(t("resetSuccessMessage"));
    setErrorMessage(null);
    setIsResetConfirming(false);
    setEnteredPassword("admin123");
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-md p-6 shadow-2xl relative overflow-hidden"
        >
          {/* Top colored accent line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-teal-500 to-emerald-500" />

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3.5 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                {t("modalPromptTitle")}
              </h3>
              <p className="text-xs text-slate-400">
                {t("modalPromptDesc")}
              </p>
            </div>
          </div>

          {/* Error Message Banner */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </motion.div>
          )}

          {/* Reset Feedback Banner */}
          {resetFeedback && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{resetFeedback}</span>
            </motion.div>
          )}

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {t("currentPasswordLabel")}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  autoFocus
                  value={enteredPassword}
                  onChange={(e) => {
                    setEnteredPassword(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder={t("modalInputPlaceholder")}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-teal-500 focus:ring-1 focus:ring-teal-500 pr-10 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Default Tip Info */}
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-2 text-[11px] text-slate-400">
              <KeyRound className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{t("modalDefaultTip")}</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                {t("modalCancelBtn")}
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xs font-bold transition-all shadow-lg shadow-teal-950/50 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                {t("modalUnlockBtn")}
              </button>
            </div>
          </form>

          {/* Reset / Forgot Section */}
          <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-col items-center">
            {!isResetConfirming ? (
              <button
                type="button"
                onClick={() => setIsResetConfirming(true)}
                className="text-xs text-amber-400 hover:text-amber-300 hover:underline flex items-center gap-1.5 cursor-pointer font-medium"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                {t("modalForgotLink")}
              </button>
            ) : (
              <div className="w-full bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-center space-y-2">
                <div className="flex items-center justify-center gap-1.5 text-amber-300 text-xs font-semibold">
                  <ShieldAlert className="w-4 h-4" />
                  <span>{t("resetPasswordConfirmPrompt")}</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsResetConfirming(false)}
                    className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-pointer"
                  >
                    {t("cancel")}
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-3 py-1 text-[11px] rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold cursor-pointer flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    {t("modalResetDirectBtn")}
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
