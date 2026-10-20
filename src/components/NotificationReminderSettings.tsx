import React, { useState } from 'react';
import {
  Bell,
  BellRing,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Send,
  ShieldCheck,
  Smartphone,
  Info,
  Check,
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { NotificationReminderConfig } from '../hooks/useNotificationReminder';

interface Props {
  isSupported: boolean;
  permission: NotificationPermission;
  config: NotificationReminderConfig;
  onUpdateConfig: (partial: Partial<NotificationReminderConfig>) => void;
  onRequestPermission: () => Promise<boolean>;
  onSendTestNotification: () => void;
}

export function NotificationReminderSettings({
  isSupported,
  permission,
  config,
  onUpdateConfig,
  onRequestPermission,
  onSendTestNotification,
}: Props) {
  const { language } = useLanguage();
  const [testSent, setTestSent] = useState(false);
  const [requesting, setRequesting] = useState(false);

  async function handleRequest() {
    setRequesting(true);
    await onRequestPermission();
    setRequesting(false);
  }

  function handleTest() {
    onSendTestNotification();
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3500);
  }

  const PRESET_TIMES = [
    { label: '07:00', desc: 'Turno Manhã' },
    { label: '08:00', desc: 'Padrão' },
    { label: '13:00', desc: 'Turno Tarde' },
    { label: '17:00', desc: 'Fim de Turno' },
  ];

  return (
    <section className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700/70 space-y-6 shadow-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <BellRing className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              {language === 'es'
                ? 'Recordatorios Diarios (Web Notification API)'
                : language === 'en'
                ? 'Daily Check-in Reminders (Web Notification API)'
                : 'Lembretes Diários (Web Notification API)'}
              <span
                className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${
                  permission === 'granted'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : permission === 'denied'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                }`}
              >
                {permission === 'granted'
                  ? 'Permissão Concedida'
                  : permission === 'denied'
                  ? 'Bloqueado no Navegador'
                  : 'Permissão Pendente'}
              </span>
            </h2>
            <p className="text-xs text-slate-300">
              {language === 'es'
                ? 'Notificaciones del navegador en horario programado para asegurar el registro diario de salud mental.'
                : language === 'en'
                ? 'Scheduled browser notifications to ensure daily logging of emotional and fatigue state.'
                : 'Notificações no navegador em horário pré-definido para garantir o registro diário de prontidão mental.'}
            </p>
          </div>
        </div>

        {/* Toggle On/Off Switch */}
        <div className="flex items-center gap-3 bg-slate-900/80 px-3.5 py-2 rounded-2xl border border-slate-700 self-start sm:self-auto">
          <span className="text-xs font-semibold text-slate-200">
            {config.enabled ? 'Lembrete Ativo' : 'Desativado'}
          </span>
          <button
            type="button"
            onClick={() => onUpdateConfig({ enabled: !config.enabled })}
            className={`w-12 h-6 rounded-full p-1 transition-colors relative cursor-pointer ${
              config.enabled ? 'bg-amber-600' : 'bg-slate-700'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                config.enabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Permission Warning / Request Banner */}
      {!isSupported ? (
        <div className="p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
          <span>Este navegador não suporta a Web Notification API nativa. O sistema usará alertas em tela.</span>
        </div>
      ) : permission !== 'granted' ? (
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-2.5 text-slate-300">
            <Bell className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block">Permissão de Notificação Necessária</strong>
              <span>
                Para que o navegador envie o lembrete diário no horário programado, autorize as notificações.
              </span>
            </div>
          </div>
          <button
            type="button"
            disabled={requesting}
            onClick={handleRequest}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition-colors shrink-0 cursor-pointer shadow-md shadow-amber-950/40"
          >
            {requesting ? 'Solicitando...' : 'Habilitar Notificações'}
          </button>
        </div>
      ) : null}

      {/* Test Success Feedback */}
      {testSent && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>
            {language === 'es'
              ? '¡Notificación de prueba enviada! Verifique su centro de notificaciones.'
              : language === 'en'
              ? 'Test notification dispatched! Check your system notification center.'
              : 'Notificação de teste enviada com sucesso! Verifique a barra de notificações do seu sistema.'}
          </span>
        </div>
      )}

      {/* Configuration Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
        {/* Time Picker Card */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-700/80 space-y-3.5">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-700">
            <Clock className="w-4 h-4 text-teal-400" />
            <h3 className="text-sm font-bold text-white">Horário Pré-definido do Lembrete</h3>
          </div>

          <p className="text-xs text-slate-300">
            Escolha a hora exata em que o alarme diário de prontidão psicológica será disparado:
          </p>

          <div className="flex items-center gap-3">
            <input
              type="time"
              value={config.time}
              onChange={(e) => onUpdateConfig({ time: e.target.value })}
              className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-lg font-mono font-bold text-teal-300 focus:outline-hidden focus:border-teal-500 cursor-pointer"
            />
            <span className="text-xs text-slate-400">
              Disparo diário automático (24h)
            </span>
          </div>

          {/* Quick Presets */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-semibold text-slate-400 block">Horários Sugeridos:</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PRESET_TIMES.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => onUpdateConfig({ time: preset.label })}
                  className={`p-2 rounded-xl text-center border transition-all cursor-pointer ${
                    config.time === preset.label
                      ? 'bg-teal-500/20 border-teal-500/40 text-teal-300 font-bold'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span className="text-xs font-mono block">{preset.label}</span>
                  <span className="text-[10px] text-slate-400 block truncate">{preset.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Shift Type & Live Actions Card */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-700/80 flex flex-col justify-between space-y-4">
          <div className="space-y-3.5">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-700">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">Momento Operacional do Check-in</h3>
            </div>

            <p className="text-xs text-slate-300">
              Associe o lembrete ao estágio operacional do turno:
            </p>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'START', label: 'Início Turno', desc: 'Prontidão' },
                { id: 'END', label: 'Fim Turno', desc: 'Descompressão' },
                { id: 'BOTH', label: 'Ambos', desc: 'Duplo' },
              ].map((stage) => {
                const isSelected = config.shiftType === stage.id;
                return (
                  <button
                    key={stage.id}
                    type="button"
                    onClick={() => onUpdateConfig({ shiftType: stage.id as 'START' | 'END' | 'BOTH' })}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold ring-1 ring-amber-500/30'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="text-xs block font-semibold">{stage.label}</span>
                    <span className="text-[10px] text-slate-400 block">{stage.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Test Notification Trigger */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleTest}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 hover:text-white text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:border-amber-500/40"
            >
              <Send className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {language === 'es'
                  ? 'Probar Notificación de Recordatorio Ahora'
                  : language === 'en'
                  ? 'Test Reminder Notification Now'
                  : 'Testar Notificação de Lembrete Agora'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Technical Footer Info */}
      <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2.5">
        <Info className="w-4 h-4 text-teal-400 shrink-0" />
        <span>
          A notificação utiliza a <strong>Web Notification API</strong> compatível com navegadores modernos e PWAs (Android, Chrome, Edge e Firefox), respeitando os modos <em>Não Perturbe</em> do sistema operacional.
        </span>
      </div>
    </section>
  );
}
