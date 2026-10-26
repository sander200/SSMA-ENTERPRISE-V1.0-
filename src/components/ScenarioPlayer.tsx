import { useState, useEffect } from "react";
import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Shield,
  CloudRain,
  UserCheck,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Wind,
  HelpCircle,
} from "lucide-react";
import { TestScenario, PsychologicalLog, TrainingAttempt } from "../types";
import { useLanguage } from "../i18n/LanguageContext";

interface Props {
  scenario: TestScenario;
  userLog: PsychologicalLog | null;
  onNextScenario: () => void;
  onOpenDecompression: () => void;
  onAttemptCompleted: (attempt: TrainingAttempt) => void;
  isGeneratingAI?: boolean;
}

export function ScenarioPlayer({
  scenario,
  userLog,
  onNextScenario,
  onOpenDecompression,
  onAttemptCompleted,
  isGeneratingAI = false,
}: Props) {
  const { language } = useLanguage();
  // Calculate dynamic time based on user psychological state as per technical dossier:
  // baseTime = 30s
  // totalMentalLoad >= 7 -> 45s
  // totalMentalLoad <= 4 -> 24s
  const mentalLoad = userLog?.totalMentalLoad ?? 5;
  const initialAllocatedTime =
    mentalLoad >= 7 ? 45 : mentalLoad <= 4 ? 24 : 30;

  const [timeLeft, setTimeLeft] = useState<number>(initialAllocatedTime);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [showDecompressionAlert, setShowDecompressionAlert] = useState<boolean>(mentalLoad >= 7);

  // Reset state when scenario changes
  useEffect(() => {
    const allocated = mentalLoad >= 7 ? 45 : mentalLoad <= 4 ? 24 : 30;
    setTimeLeft(allocated);
    setSelectedOptionId(null);
    setIsAnswered(false);
    setShowDecompressionAlert(mentalLoad >= 7);
  }, [scenario.scenario_id, mentalLoad]);

  // Countdown timer
  useEffect(() => {
    if (isAnswered || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time expired
          setIsAnswered(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isAnswered, timeLeft]);

  function handleSelectOption(optionId: string) {
    if (isAnswered) return;

    setSelectedOptionId(optionId);
    setIsAnswered(true);

    const chosenOption = scenario.options.find((opt) => opt.id === optionId);
    const isCorrect = chosenOption?.is_correct ?? false;
    const timeSpent = initialAllocatedTime - timeLeft;

    const attempt: TrainingAttempt = {
      id: "attempt-" + Date.now(),
      scenarioId: scenario.scenario_id,
      sector: scenario.sector,
      normReference: scenario.norm_reference,
      selectedOptionId: optionId,
      isCorrect,
      timeSpentSeconds: timeSpent,
      allocatedTimeSeconds: initialAllocatedTime,
      mentalLoadAtTime: mentalLoad,
      timestamp: new Date().toISOString(),
    };

    onAttemptCompleted(attempt);
  }

  const selectedOption = scenario.options.find((o) => o.id === selectedOptionId);
  const correctOption = scenario.options.find((o) => o.is_correct);

  // Time progress bar percentage
  const progressPercent = Math.max(0, Math.min(100, (timeLeft / initialAllocatedTime) * 100));

  const isLowTime = timeLeft <= 7 && !isAnswered;

  return (
    <div className="max-w-4xl mx-auto w-full space-y-5">
      {/* High Mental Load Preventive Notice */}
      {showDecompressionAlert && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-3">
            <Wind className="w-5 h-5 text-amber-400 shrink-0" />
            <div className="text-xs">
              <strong>Time-Attack Adaptativo Ativo:</strong> Carga mental avaliada em {mentalLoad}/10.
              Tempo de resposta ampliado para 45s (+50%) para reduzir a pressão cognitiva.
            </div>
          </div>
          <button
            type="button"
            id="trigger-decompression-alert-btn"
            onClick={onOpenDecompression}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition-colors shrink-0 cursor-pointer"
          >
            Fazer Pausa de Respiração
          </button>
        </div>
      )}

      {/* Main Scenario Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 md:p-8 space-y-6 relative overflow-hidden">
        {/* Top bar with Badges & Timer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              {scenario.norm_reference}
            </span>

            <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
              {scenario.sector}
            </span>

            <span
              className={`px-3 py-1 rounded-full text-xs font-bold border ${
                scenario.risk_level === "Crítico"
                  ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                  : scenario.risk_level === "Alto"
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                  : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
              }`}
            >
              {language === "es" ? "Riesgo" : language === "en" ? "Risk" : "Risco"} {scenario.risk_level}
            </span>

            <span className="text-xs text-slate-500 font-mono">ID: {scenario.scenario_id}</span>
          </div>

          {/* Time-Attack Counter */}
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                isAnswered
                  ? "bg-slate-800 border-slate-700 text-slate-400"
                  : isLowTime
                  ? "bg-rose-500/20 border-rose-500 text-rose-300 animate-pulse"
                  : "bg-teal-500/10 border-teal-500/30 text-teal-300"
              }`}
            >
              <Clock className={`w-4 h-4 ${isLowTime ? "text-rose-400" : "text-teal-400"}`} />
              <span className="font-mono text-lg font-extrabold">{timeLeft}s</span>
              <span className="text-xs font-medium text-slate-400">
                {isAnswered
                  ? language === "es" ? "Finalizado" : language === "en" ? "Finished" : "Finalizado"
                  : language === "es" ? "Restante" : language === "en" ? "Remaining" : "Restante"}
              </span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        {!isAnswered && (
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${
                isLowTime ? "bg-rose-500" : "bg-teal-400"
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}

        {/* Operational Context Badges (Environment & Pressure) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-start gap-3">
            <CloudRain className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="text-slate-400 font-semibold block mb-0.5">
                {language === "es" ? "Condiciones Ambientales:" : language === "en" ? "Environmental Conditions:" : "Condições Ambientais:"}
              </span>
              <span className="text-slate-200">{scenario.environmental_conditions}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-start gap-3">
            <UserCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="text-slate-400 font-semibold block mb-0.5">
                {language === "es" ? "Factor Humano / Presión:" : language === "en" ? "Human Factor / Pressure:" : "Fator Humano / Pressão:"}
              </span>
              <span className="text-slate-200">{scenario.human_factor_pressure}</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-400">
            Exercício de capacitação. Não é inspeção, laudo nem texto oficial da norma. A resposta esperada não libera a atividade.
          </p>

          {/* Situation Description */}
        <div className="space-y-2">
          <span className="text-xs uppercase tracking-wider font-bold text-slate-400">
            {language === "es" ? "Situación Crítica Observada:" : language === "en" ? "Observed Critical Situation:" : "Situação Crítica Observada:"}
          </span>
          <p className="text-base text-slate-100 leading-relaxed font-normal p-4 rounded-xl bg-slate-800/40 border border-slate-700/50">
            {scenario.situation_description}
          </p>
        </div>

        {/* Options List */}
        <div className="space-y-3 pt-2">
          <span className="text-xs uppercase tracking-wider font-bold text-slate-400 block">
            {language === "es"
              ? "Seleccione la acción esperada en este ejercicio:"
              : language === "en"
              ? "Select the action expected in this exercise:"
              : "Selecione a ação esperada neste exercício:"}
          </span>

          {scenario.options.map((option) => {
            const isSelected = selectedOptionId === option.id;
            const showCorrect = isAnswered && option.is_correct;
            const showWrong = isAnswered && isSelected && !option.is_correct;

            return (
              <button
                key={option.id}
                id={`scenario-option-${option.id}`}
                type="button"
                disabled={isAnswered}
                onClick={() => handleSelectOption(option.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3 ${
                  showCorrect
                    ? "bg-emerald-950/60 border-emerald-500 text-emerald-100 shadow-md shadow-emerald-950/50"
                    : showWrong
                    ? "bg-rose-950/60 border-rose-500 text-rose-100 shadow-md shadow-rose-950/50"
                    : isSelected
                    ? "bg-teal-900/40 border-teal-500 text-white"
                    : isAnswered
                    ? "bg-slate-800/40 border-slate-800 text-slate-400 cursor-not-allowed"
                    : "bg-slate-800/70 hover:bg-slate-800 border-slate-700 text-slate-200 hover:border-teal-500/60 cursor-pointer"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 border ${
                    showCorrect
                      ? "bg-emerald-500 border-emerald-400 text-white"
                      : showWrong
                      ? "bg-rose-500 border-rose-400 text-white"
                      : "bg-slate-700 border-slate-600 text-slate-200"
                  }`}
                >
                  {showCorrect ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : showWrong ? (
                    <XCircle className="w-4 h-4" />
                  ) : (
                    option.id
                  )}
                </div>

                <div className="flex-1 text-sm leading-relaxed">{option.text}</div>
              </button>
            );
          })}
        </div>

        {/* Time expired without answer */}
        {isAnswered && !selectedOptionId && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-200 flex items-center gap-3 text-sm">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>Tempo esgotado! Em situações reais de SST, decisões rápidas e assertivas salvam vidas.</span>
          </div>
        )}

        {/* Detailed Legal & Normative Justification (shown upon answer) */}
        {isAnswered && (
          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3 animate-fadeIn">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-teal-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
                {language === "es"
                  ? "Lectura del ejercicio"
                  : language === "en"
                  ? "Exercise reading"
                  : "Leitura do exercício"} ({scenario.norm_reference})
              </span>
            </div>

            {selectedOption && (
              <div
                className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                  selectedOption.is_correct
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-200"
                    : "bg-rose-500/10 border-rose-500/30 text-rose-200"
                }`}
              >
                <strong>
                  {language === "es"
                    ? `Su Elección (Opción ${selectedOption.id}):`
                    : language === "en"
                    ? `Your Choice (Option ${selectedOption.id}):`
                    : `Sua Escolha (Opção ${selectedOption.id}):`}
                </strong>{" "}
                {selectedOption.justification}
              </div>
            )}

            {/* If wrong or timed out, display the correct option explanation */}
            {(!selectedOption || !selectedOption.is_correct) && correctOption && (
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-700 text-xs leading-relaxed text-slate-300">
                <strong className="text-emerald-400 block mb-1">
                  {language === "es"
                    ? `Respuesta esperada en este ejercicio (Opción ${correctOption.id}):`
                    : language === "en"
                    ? `Expected answer in this exercise (Option ${correctOption.id}):`
                    : `Resposta esperada neste exercício (Opção ${correctOption.id}):`}
                </strong>
                {correctOption.justification}
              </div>
            )}
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <div className="text-xs text-slate-400">
            {isAnswered ? (
              <span>
                {language === "es"
                  ? "Escenario evaluado. Avance al siguiente para consolidar competencias."
                  : language === "en"
                  ? "Scenario evaluated. Proceed to next to consolidate skills."
                  : "Cenário avaliado. Avance para o próximo para consolidar competências."}
              </span>
            ) : (
              <span>
                {language === "es"
                  ? "Responda antes de que termine el cronómetro."
                  : language === "en"
                  ? "Respond before the timer runs out."
                  : "Responda antes do término do cronômetro."}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {mentalLoad >= 7 && (
              <button
                type="button"
                id="scenario-decompression-btn"
                onClick={onOpenDecompression}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Wind className="w-3.5 h-3.5 text-teal-400" />
                {language === "es" ? "Descompresión" : language === "en" ? "Decompression" : "Descompressão"}
              </button>
            )}

            <button
              type="button"
              id="next-scenario-button"
              disabled={!isAnswered || isGeneratingAI}
              onClick={onNextScenario}
              className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                isAnswered && !isGeneratingAI
                  ? "bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-900/40 cursor-pointer"
                  : "bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed"
              }`}
            >
              {isGeneratingAI ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin text-teal-400" />
                  {language === "es"
                    ? "Generando Escenario por IA..."
                    : language === "en"
                    ? "Generating AI Scenario..."
                    : "Gerando Cenário por IA..."}
                </>
              ) : (
                <>
                  {language === "es"
                    ? "Siguiente Escenario"
                    : language === "en"
                    ? "Next Scenario"
                    : "Próximo Cenário"}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
