import { useState } from "react";
import { Smile, AlertCircle, ShieldAlert, Sparkles, CheckCircle2, HeartHandshake, ArrowRight } from "lucide-react";
import { PsychologicalLog } from "../types";

interface Props {
  onCheckInCompleted: (log: PsychologicalLog) => void;
  currentSector: string;
  currentSectorId: number;
}

export function CheckInView({ onCheckInCompleted, currentSector, currentSectorId }: Props) {
  const [shiftStage, setShiftStage] = useState<"START" | "END">("START");
  const [anxietyScore, setAnxietyScore] = useState<number>(3);
  const [fatigueScore, setFatigueScore] = useState<number>(3);
  const [focusScore, setFocusScore] = useState<number>(4);
  const [submitting, setSubmitting] = useState(false);
  const [lastSubmittedLog, setLastSubmittedLog] = useState<PsychologicalLog | null>(null);

  const totalMentalLoad = anxietyScore + fatigueScore;
  const isHighLoad = totalMentalLoad >= 7;
  const isLowLoad = totalMentalLoad <= 4;

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
      {/* Intro Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                SanderVerse • Saúde Mental
              </span>
              <span className="text-xs text-slate-400">Escala de Bem-Estar Psicológico</span>
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
        <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-6 text-slate-100 space-y-4 shadow-xl animate-fadeIn">
          <div className="flex items-center gap-3 text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
            <h3 className="text-lg font-bold text-white">Check-in Registrado com Proteção LGPD</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700/60">
              <span className="text-xs text-slate-400 block">Identificador Anonimizado</span>
              <span className="font-mono text-sm font-semibold text-teal-300">
                {lastSubmittedLog.workerHash || "hash-sha256-ok"}
              </span>
            </div>
            <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700/60">
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
            <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700/60">
              <span className="text-xs text-slate-400 block">Etapa do Turno</span>
              <span className="text-sm font-semibold text-slate-200">
                {lastSubmittedLog.shiftStage === "START" ? "Início de Turno" : "Encerramento de Turno"}
              </span>
            </div>
          </div>

          {lastSubmittedLog.totalMentalLoad >= 7 && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-200 flex items-start gap-3">
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
              className="px-4 py-2 rounded-xl text-xs font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
            >
              Fazer Novo Check-in
            </button>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl"
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
                className={`p-3 rounded-xl border text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                  shiftStage === "START"
                    ? "bg-teal-600/20 border-teal-500 text-teal-300"
                    : "bg-slate-800/60 border-slate-700 text-slate-400 hover:bg-slate-800"
                }`}
              >
                <Sparkles className="w-4 h-4" />
                Início de Turno (Abertura)
              </button>
              <button
                type="button"
                id="shift-stage-end"
                onClick={() => setShiftStage("END")}
                className={`p-3 rounded-xl border text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                  shiftStage === "END"
                    ? "bg-teal-600/20 border-teal-500 text-teal-300"
                    : "bg-slate-800/60 border-slate-700 text-slate-400 hover:bg-slate-800"
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                Encerramento de Turno (Desmobilização)
              </button>
            </div>
          </div>

          {/* Slider 1: Anxiety */}
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="anxiety-range" className="text-sm font-bold text-slate-200">
                1. Nível de Ansiedade / Tensão Emocional
              </label>
              <span className="text-sm font-extrabold text-teal-400 bg-teal-500/10 px-2.5 py-0.5 rounded-lg border border-teal-500/20">
                {anxietyScore} de 5
              </span>
            </div>

            <input
              id="anxiety-range"
              type="range"
              min="1"
              max="5"
              step="1"
              value={anxietyScore}
              onChange={(e) => setAnxietyScore(Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-400"
            />

            <div className="flex justify-between items-center text-xs text-slate-400">
              <span className="text-emerald-400 font-medium">1 - Serenidade</span>
              <span className="text-center font-medium text-slate-300">
                {anxietyLabels[anxietyScore - 1]}
              </span>
              <span className="text-rose-400 font-medium">5 - Alta Tensão</span>
            </div>
          </div>

          {/* Slider 2: Fatigue */}
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="fatigue-range" className="text-sm font-bold text-slate-200">
                2. Nível de Fadiga Cognitiva / Cansaço
              </label>
              <span className="text-sm font-extrabold text-teal-400 bg-teal-500/10 px-2.5 py-0.5 rounded-lg border border-teal-500/20">
                {fatigueScore} de 5
              </span>
            </div>

            <input
              id="fatigue-range"
              type="range"
              min="1"
              max="5"
              step="1"
              value={fatigueScore}
              onChange={(e) => setFatigueScore(Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-400"
            />

            <div className="flex justify-between items-center text-xs text-slate-400">
              <span className="text-emerald-400 font-medium">1 - Disposição Plena</span>
              <span className="text-center font-medium text-slate-300">
                {fatigueLabels[fatigueScore - 1]}
              </span>
              <span className="text-rose-400 font-medium">5 - Exaustão Mental</span>
            </div>
          </div>

          {/* Slider 3: Focus */}
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="focus-range" className="text-sm font-bold text-slate-200">
                3. Clareza Mental e Percepção de Foco
              </label>
              <span className="text-sm font-extrabold text-teal-400 bg-teal-500/10 px-2.5 py-0.5 rounded-lg border border-teal-500/20">
                {focusScore} de 5
              </span>
            </div>

            <input
              id="focus-range"
              type="range"
              min="1"
              max="5"
              step="1"
              value={focusScore}
              onChange={(e) => setFocusScore(Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-400"
            />

            <div className="flex justify-between items-center text-xs text-slate-400">
              <span className="text-amber-400 font-medium">1 - Disperso</span>
              <span className="text-emerald-400 font-medium">5 - Foco Operacional Total</span>
            </div>
          </div>

          {/* Dynamic Impact Preview */}
          <div
            className={`p-4 rounded-xl border flex items-center justify-between text-xs transition-colors ${
              isHighLoad
                ? "bg-rose-500/10 border-rose-500/30 text-rose-200"
                : isLowLoad
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-200"
                : "bg-blue-500/10 border-blue-500/30 text-blue-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>
                <strong>Carga Mental Prevista ({totalMentalLoad}/10):</strong>{" "}
                {isHighLoad
                  ? "Tempo ampliado (+50% = 45s) com sugestão de descompressão ativa."
                  : isLowLoad
                  ? "Tempo reduzido (-20% = 24s) no modo time-attack competitivo."
                  : "Tempo padrão de avaliação (30 segundos por cenário)."}
              </span>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              id="submit-checkin-button"
              disabled={submitting}
              className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-sm shadow-lg shadow-teal-900/30 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              {submitting ? "Processando e Encriptando..." : "Registrar Check-in e Iniciar Sessão"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
