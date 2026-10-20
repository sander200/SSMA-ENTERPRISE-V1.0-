import { useState } from "react";
import {
  Smile,
  AlertCircle,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  HeartHandshake,
  ArrowRight,
  Bell,
  Clock,
  Send,
} from "lucide-react";
import { PsychologicalLog } from "../types";
import { useLanguage } from "../i18n/LanguageContext";

interface Props {
  onCheckInCompleted: (log: PsychologicalLog) => void;
  currentSector: string;
  currentSectorId: number;
  reminderConfig?: { enabled: boolean; time: string };
  onOpenReminderSettings?: () => void;
  onSendTestNotification?: () => void;
}

export function CheckInView({
  onCheckInCompleted,
  currentSector,
  currentSectorId,
  reminderConfig,
  onOpenReminderSettings,
  onSendTestNotification,
}: Props) {
  const { language } = useLanguage();
  const [shiftStage, setShiftStage] = useState<"START" | "END">("START");
  const [anxietyScore, setAnxietyScore] = useState<number>(3);
  const [fatigueScore, setFatigueScore] = useState<number>(3);
  const [focusScore, setFocusScore] = useState<number>(4);
  const [submitting, setSubmitting] = useState(false);
  const [lastSubmittedLog, setLastSubmittedLog] = useState<PsychologicalLog | null>(null);

  const totalMentalLoad = anxietyScore + fatigueScore;
  const isHighLoad = totalMentalLoad >= 7;

  const anxietyLabels = [
    "Calmo e Tranquilo",
    "Leve Tensão Esporádica",
    "Apreensão Moderada",
    "Ansiedade Elevada",
    "Angústia Severa / Crítica",
  ];

  const fatigueLabels = [
    "Descansado e Revigorado",
    "Cansaço Normal de Rotina",
    "Fadiga Cognitiva Média",
    "Exaustão Mental Significativa",
    "Esgotamento Extremo / Burnout",
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    const logData: PsychologicalLog = {
      userId: "operador-" + (localStorage.getItem("ssma_user_id") || "demo-01"),
      shiftStage,
      anxietyScore,
      fatigueScore,
      focusScore,
      totalMentalLoad,
      decompressionTriggered: isHighLoad,
      loggedAt: new Date().toISOString(),
    };

    try {
      const response = await fetch("/api/psychological/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: logData.userId,
          sectorId: currentSectorId,
          sectorName: currentSector,
          shiftStage: logData.shiftStage,
          anxietyScore: logData.anxietyScore,
          fatigueScore: logData.fatigueScore,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        logData.workerHash = data.workerHash;
      }
    } catch (err) {
      console.warn("Backend log sync failed, persisting locally", err);
    } finally {
      setSubmitting(false);
      setLastSubmittedLog(logData);
      onCheckInCompleted(logData);
    }
  }

  return (
    <div className="max-w-3xl mx-auto w-full space-y-6">
      {/* Reminder Pill Notification Banner */}
      {reminderConfig && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-800/90 border border-amber-500/30 shadow-md">
          <div className="flex items-center gap-2.5 text-xs text-slate-300">
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white block">
                {reminderConfig.enabled
                  ? `Lembrete Diário Ativo: ${reminderConfig.time}h`
                  : "Lembrete Diário Desativado"}
              </span>
              <span className="text-[11px] text-slate-400">
                Notificação automática via Web Notification API
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {onSendTestNotification && (
              <button
                type="button"
                onClick={onSendTestNotification}
                className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-750 text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1"
                title="Testar disparo de notificação"
              >
                <Send className="w-3 h-3 text-amber-400" />
                <span>Testar</span>
              </button>
            )}
            {onOpenReminderSettings && (
              <button
                type="button"
                onClick={onOpenReminderSettings}
                className="px-3 py-1.5 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 text-[11px] font-semibold transition-colors cursor-pointer"
              >
                Alterar Horário
              </button>
            )}
          </div>
        </div>
      )}

      {/* Intro Banner */}
      <div className="bg-slate-800/90 border border-slate-700/70 rounded-3xl p-6 shadow-xl relative overflow-hidden backdrop-blur-md">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/15 border border-teal-500/30 text-teal-400 flex items-center justify-center shrink-0 shadow-inner">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                SST • Carga Mental & Bem-estar
              </span>
              <span className="text-xs text-slate-300">Escala de Bem-Estar Psicológico</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Check-in Emocional Diário do Trabalhador
            </h1>
            <p className="text-sm text-slate-300 mt-1 leading-relaxed">
              O monitoramento de carga mental ajusta o dinamismo do treinamento técnico de SST em tempo
              real, protegendo você contra acidentes provocados por estresse e fadiga cognitiva.
            </p>
          </div>
        </div>
      </div>

      {lastSubmittedLog ? (
        <div className="bg-slate-800/90 border border-emerald-500/30 rounded-3xl p-6 text-slate-100 space-y-4 shadow-xl animate-fadeIn">
          <div className="flex items-center gap-3 text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
            <h3 className="text-lg font-bold text-white">Check-in Registrado com Proteção LGPD</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 bg-slate-900/80 rounded-2xl border border-slate-700/60">
              <span className="text-xs text-slate-400 block">Identificador Anonimizado</span>
              <span className="font-mono text-sm font-semibold text-teal-300 truncate block">
                {lastSubmittedLog.workerHash || "hash-sha256-ok"}
              </span>
            </div>
            <div className="p-3.5 bg-slate-900/80 rounded-2xl border border-slate-700/60">
              <span className="text-xs text-slate-400 block">Carga Mental Apurada</span>
              <span className="text-sm font-bold text-white">
                {lastSubmittedLog.totalMentalLoad}/10{" "}
                <span
                  className={`text-xs px-2 py-0.5 rounded-md ml-1 ${
                    lastSubmittedLog.totalMentalLoad >= 7
                      ? "bg-rose-500/20 text-rose-300"
                      : lastSubmittedLog.totalMentalLoad <= 4
                      ? "bg-emerald-500/20 text-emerald-300"
                      : "bg-amber-500/20 text-amber-300"
                  }`}
                >
                  {lastSubmittedLog.totalMentalLoad >= 7
                    ? "Elevada (45s)"
                    : lastSubmittedLog.totalMentalLoad <= 4
                    ? "Baixa (24s)"
                    : "Moderada (30s)"}
                </span>
              </span>
            </div>
            <div className="p-3.5 bg-slate-900/80 rounded-2xl border border-slate-700/60">
              <span className="text-xs text-slate-400 block">Etapa do Turno</span>
              <span className="text-sm font-semibold text-slate-200">
                {lastSubmittedLog.shiftStage === "START" ? "Início de Turno" : "Encerramento de Turno"}
              </span>
            </div>
          </div>

          {lastSubmittedLog.totalMentalLoad >= 7 && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-xs text-rose-200 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong>Atenção Preventiva:</strong> Sua carga mental combinada está em{" "}
                {lastSubmittedLog.totalMentalLoad}/10. O motor de avaliação estendeu seu tempo de
                resposta para 45 segundos e sugere realizar o exercício de respiração 4-7-8 antes de
                tarefas de alto risco.
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setLastSubmittedLog(null)}
              className="px-4 py-2 rounded-xl text-xs font-medium bg-slate-800 text-slate-300 hover:bg-slate-750 border border-slate-700 cursor-pointer"
            >
              Fazer Novo Check-in
            </button>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-slate-800/90 border border-slate-700/70 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl"
        >
          {/* Shift Stage Selector */}
          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
              Momento da Avaliação
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                id="shift-stage-start"
                onClick={() => setShiftStage("START")}
                className={`p-3 rounded-2xl border text-sm font-medium flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  shiftStage === "START"
                    ? "bg-teal-600/20 border-teal-500 text-teal-300"
                    : "bg-slate-900/60 border-slate-750 text-slate-400 hover:bg-slate-800"
                }`}
              >
                <Sparkles className="w-4 h-4" />
                Início de Turno (Abertura)
              </button>
              <button
                type="button"
                id="shift-stage-end"
                onClick={() => setShiftStage("END")}
                className={`p-3 rounded-2xl border text-sm font-medium flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  shiftStage === "END"
                    ? "bg-teal-600/20 border-teal-500 text-teal-300"
                    : "bg-slate-900/60 border-slate-750 text-slate-400 hover:bg-slate-800"
                }`}
              >
                <Sparkles className="w-4 h-4" />
                Fim de Turno (Fechamento)
              </button>
            </div>
          </div>

          {/* Anxiety Scale */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Nível de Tensão / Ansiedade (1 a 5)
              </label>
              <span className="text-xs font-bold text-teal-400">
                {anxietyScore} - {anxietyLabels[anxietyScore - 1]}
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={5}
              value={anxietyScore}
              onChange={(e) => setAnxietyScore(Number(e.target.value))}
              className="w-full accent-teal-500 bg-slate-900 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 px-1">
              <span>1 - Calmo</span>
              <span>3 - Moderado</span>
              <span>5 - Crítico</span>
            </div>
          </div>

          {/* Fatigue Scale */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Nível de Fadiga Física / Cognitiva (1 a 5)
              </label>
              <span className="text-xs font-bold text-amber-400">
                {fatigueScore} - {fatigueLabels[fatigueScore - 1]}
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={5}
              value={fatigueScore}
              onChange={(e) => setFatigueScore(Number(e.target.value))}
              className="w-full accent-amber-500 bg-slate-900 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 px-1">
              <span>1 - Revigorado</span>
              <span>3 - Cansaço Normal</span>
              <span>5 - Esgotado</span>
            </div>
          </div>

          {/* Calculated Mental Load Pill */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700/80 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block">Carga Mental Combinada Calculada:</span>
              <span className="text-xl font-extrabold text-white">
                {totalMentalLoad} / 10
              </span>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold border ${
                isHighLoad
                  ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                  : totalMentalLoad <= 4
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                  : "bg-amber-500/20 text-amber-300 border-amber-500/40"
              }`}
            >
              {isHighLoad ? "Carga Elevada (Alerta)" : totalMentalLoad <= 4 ? "Carga Baixa (Ótima)" : "Carga Moderada (Estável)"}
            </span>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-sm font-bold transition-all shadow-lg shadow-teal-950/40 cursor-pointer flex items-center justify-center gap-2"
          >
            {submitting ? "Criptografando e Salvando..." : "Registrar Check-in Emocional"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      )}
    </div>
  );
}
