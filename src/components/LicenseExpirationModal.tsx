import React from "react";
import {
  AlertTriangle,
  Mail,
  Phone,
  KeyRound,
  Calendar,
  ShieldAlert,
  X,
  ArrowRight,
  UserCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenDeveloperLicenseTab?: () => void;
  expirationDate: string;
  licenseKey: string;
  dynamicKey: string;
  developerEmail?: string;
  developerPhone?: string;
  developerName?: string;
}

export function LicenseExpirationModal({
  isOpen,
  onClose,
  onOpenDeveloperLicenseTab,
  expirationDate,
  licenseKey,
  dynamicKey,
  developerEmail = "beisander2@gmail.com",
  developerPhone = "+55 / +58 Soporte Técnico SSMA Enterprise",
  developerName = "Beisander Lameda • Desarrollador Principal SSMA Enterprise",
}: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 12 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="bg-white border-2 border-amber-400 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-5 relative overflow-hidden text-slate-900"
          >
            {/* Top accent bar */}
            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-amber-500 via-rose-500 to-amber-500" />

            {/* Header */}
            <div className="flex items-start justify-between gap-4 pt-1">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 shrink-0 shadow-xs">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-300">
                    <Calendar className="w-3 h-3" />
                    Aviso de Vencimiento Hoy ({expirationDate})
                  </span>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">
                    Notificación de Vencimiento de Licencia
                  </h2>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Cerrar alerta"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Exact Required Instruction Box */}
            <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-center space-y-1.5 shadow-inner">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-800">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <span>Instrucción Oficial del Sistema</span>
              </div>
              <p className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                "Contactar al desarrollador para verificación de licencia."
              </p>
              <p className="text-xs text-slate-600">
                La fecha de vigencia de su licencia corporativa coincide exactamente con el día de hoy ({expirationDate}).
              </p>
            </div>

            {/* Developer Contact Information */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-2 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-teal-600" />
                <span>Datos de Contacto del Desarrollador</span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-500 font-medium">Desarrollador:</span>
                  <span className="font-bold text-slate-900 text-right">{developerName}</span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-500 font-medium flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-teal-600" />
                    Correo Electrónico:
                  </span>
                  <a
                    href={`mailto:${developerEmail}?subject=${encodeURIComponent(
                      "Verificación de Licencia SSMA Enterprise - " + licenseKey
                    )}`}
                    className="font-mono font-bold text-teal-700 hover:underline"
                  >
                    {developerEmail}
                  </a>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-500 font-medium flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-teal-600" />
                    Contacto / Soporte:
                  </span>
                  <span className="font-semibold text-slate-800">{developerPhone}</span>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-2">
                  <span className="text-slate-500 font-medium flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                    Licencia / Llave Dinámica:
                  </span>
                  <span className="font-mono text-[11px] font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {licenseKey} • {dynamicKey}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-1">
              {onOpenDeveloperLicenseTab && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenDeveloperLicenseTab();
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-slate-300"
                >
                  <KeyRound className="w-3.5 h-3.5 text-teal-600" />
                  <span>Verificar Llave Dinámica</span>
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
              >
                <span>Entendido</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
