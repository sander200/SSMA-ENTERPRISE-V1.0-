import { Bell, ArrowRight, X, HeartPulse } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../i18n/LanguageContext';

interface Props {
  alert: {
    id: string;
    title: string;
    body: string;
    time: string;
  } | null;
  onDismiss: () => void;
  onNavigateToCheckIn: () => void;
}

export function NotificationReminderToast({ alert, onDismiss, onNavigateToCheckIn }: Props) {
  const { language } = useLanguage();

  if (!alert) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="fixed top-20 right-4 sm:right-8 z-50 max-w-md w-full bg-slate-850/95 border-2 border-amber-500/70 rounded-3xl p-4 shadow-2xl shadow-amber-950/40 backdrop-blur-md"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
              <Bell className="w-5 h-5 animate-bounce" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Lembrete Diário • {alert.time}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white leading-tight">
                {alert.title}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {alert.body}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onDismiss}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-750 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-3.5 pt-3 border-t border-slate-750 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onDismiss}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 cursor-pointer"
          >
            Mais tarde
          </button>
          <button
            type="button"
            onClick={() => {
              onDismiss();
              onNavigateToCheckIn();
            }}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-teal-600 hover:from-amber-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-950/50 cursor-pointer"
          >
            <HeartPulse className="w-3.5 h-3.5" />
            <span>Fazer Check-in Agora</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
