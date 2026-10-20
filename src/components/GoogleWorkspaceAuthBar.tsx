import React from "react";
import { User } from "firebase/auth";
import { LogOut, CheckCircle2, ShieldAlert, X, Check } from "lucide-react";

interface SignInButtonProps {
  onClick: () => void;
  disabled?: boolean;
  label?: string;
}

export function GoogleSignInButton({
  onClick,
  disabled = false,
  label = "Iniciar sesión con Google",
}: SignInButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="gsi-material-button inline-flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-semibold text-xs shadow-xs transition-all cursor-pointer disabled:opacity-50"
    >
      <div className="gsi-material-button-state" />
      <div className="gsi-material-button-content-wrapper flex items-center gap-2.5">
        <div className="gsi-material-button-icon w-4 h-4 shrink-0">
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            style={{ display: "block" }}
          >
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
            />
            <path
              fill="#4285F4"
              d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
            />
            <path
              fill="#FBBC05"
              d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
            />
            <path
              fill="#34A853"
              d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
            />
            <path fill="none" d="M0 0h48v48H0z" />
          </svg>
        </div>
        <span className="gsi-material-button-contents">{label}</span>
        <span style={{ display: "none" }}>Sign in with Google</span>
      </div>
    </button>
  );
}

interface WorkspaceAccountPillProps {
  user: User | null;
  hasToken: boolean;
  isLoggingIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

export function WorkspaceAccountBar({
  user,
  hasToken,
  isLoggingIn,
  onLogin,
  onLogout,
}: WorkspaceAccountPillProps) {
  if (!user || !hasToken) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-100 border border-slate-200">
        <div className="text-xs text-slate-700">
          <span className="font-bold text-slate-900 block">
            Conexión Google Workspace (Gmail & Google Sheets)
          </span>
          <span>
            Inicie sesión con Google para habilitar el envío directo por Gmail y la sincronización en la nube con Google Sheets.
          </span>
        </div>
        <GoogleSignInButton
          onClick={onLogin}
          disabled={isLoggingIn}
          label={isLoggingIn ? "Conectando..." : "Sign in with Google"}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
      <div className="flex items-center gap-2.5">
        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
        <div className="text-xs">
          <span className="font-bold text-emerald-950 block">
            Google Workspace Conectado: {user.displayName || user.email}
          </span>
          <span className="text-emerald-700 text-[11px]">
            {user.email} • Gmail & Google Sheets activos en memoria
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={onLogout}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
      >
        <LogOut className="w-3.5 h-3.5 text-slate-500" />
        <span>Cerrar sesión Google</span>
      </button>
    </div>
  );
}

interface WorkspaceActionConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  details?: string[];
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Mandatory User Confirmation Dialog before executing mutating/sending Workspace API operations
 */
export function WorkspaceActionConfirmModal({
  isOpen,
  title,
  description,
  details = [],
  confirmLabel = "Confirmar y Ejecutar",
  onConfirm,
  onCancel,
}: WorkspaceActionConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">{title}</h3>
              <span className="text-[11px] font-semibold text-amber-700">
                Confirmación de operación en Google Workspace
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">{description}</p>

        {details.length > 0 && (
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs text-slate-700 font-mono">
            {details.map((line, i) => (
              <div key={i} className="truncate">
                • {line}
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>{confirmLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
