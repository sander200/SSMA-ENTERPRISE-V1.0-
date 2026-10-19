import { useState, useEffect } from "react";
import { Wind, Eye, Activity, RefreshCw, CheckCircle, ArrowRight, Sparkles, Volume2, VolumeX } from "lucide-react";

interface Props {
  onFinish?: () => void;
  initialExercise?: "breathing" | "grounding" | "ergonomics";
  isModal?: boolean;
}

export function DecompressionModule({
  onFinish,
  initialExercise = "breathing",
  isModal = false,
}: Props) {
  const [activeTab, setActiveTab] = useState<"breathing" | "grounding" | "ergonomics">(initialExercise);
  const [soundEnabled, setSoundEnabled] = useState(false);

  // 4-7-8 Breathing State
  // Phases: 'inhale' (4s), 'hold' (7s), 'exhale' (8s), 'ready'
  const [breathPhase, setBreathPhase] = useState<"ready" | "inhale" | "hold" | "exhale">("ready");
  const [breathTimer, setBreathTimer] = useState(4);
  const [breathCyclesCompleted, setBreathCyclesCompleted] = useState(0);

  // Grounding 5-4-3-2-1 State
  const [groundingStep, setGroundingStep] = useState(0);
  const groundingSteps = [
    {
      num: 5,
      sense: "Visão",
      title: "5 Coisas que você pode ver",
      desc: "Observe o ambiente ao seu redor com atenção plena. Localize 5 objetos concretos (ex: a borda de uma viga, o crachá, a cor do piso, um detalhe no painel de comando).",
      examples: ["Capacete de segurança", "Painel de controle", "Luminária", "Sinalização de saída", "Suporte de ferramentas"],
    },
    {
      num: 4,
      sense: "Tato",
      title: "4 Coisas que você pode tocar",
      desc: "Perceba a textura física de 4 superfícies próximas a você.",
      examples: ["Tecido do uniforme de trabalho", "Superfície metálica fresca", "Apoio de braço da cadeira", "A sola da bota no chão"],
    },
    {
      num: 3,
      sense: "Audição",
      title: "3 Sons perceptíveis no momento",
      desc: "Feche suavemente os olhos ou relaxe o olhar. Concentre-se em identificar 3 frequências sonoras distintas.",
      examples: ["Ruído contínuo do compressor ou ar", "Passos de colegas de turno", "O som da sua própria respiração nasal"],
    },
    {
      num: 2,
      sense: "Olfato",
      title: "2 Aromas ou odores no ambiente",
      desc: "Inspire suavemente pelo nariz e identifique dois aromas presentes.",
      examples: ["Cheiro de café fresco na copa", "Ar fresco ou essência do ambiente"],
    },
    {
      num: 1,
      sense: "Presença e Foco",
      title: "1 Emoção positiva ou sensação interna",
      desc: "Sinta seu corpo aterrado e seguro. Lembre-se: seu trabalho é valioso, e sua integridade vem em primeiro lugar.",
      examples: ["Sensação de relaxamento nos ombros", "Batimentos cardíacos estabilizados"],
    },
  ];

  // Ergonomic Stretch State (NR-17)
  const [ergoStep, setErgoStep] = useState(0);
  const [ergoTimer, setErgoTimer] = useState(15);
  const [ergoActive, setErgoActive] = useState(false);

  const ergoSteps = [
    {
      title: "Alongamento Cervical Lateral",
      desc: "Incline suavemente a cabeça em direção ao ombro direito sem elevar o ombro. Mantenha por 15 segundos e depois repita para o lado esquerdo.",
      nrReference: "NR-17 • Prevenção de tensão no trapézio",
    },
    {
      title: "Extensão e Flexão de Punhos",
      desc: "Estenda um dos braços à frente, com a palma voltada para frente, e puxe suavemente os dedos para trás com a outra mão. Mantenha os cotovelos alinhados.",
      nrReference: "NR-17 • Prevenção de Tenossinovite e Síndrome do Túnel do Carpo",
    },
    {
      title: "Descompressão Torácica e Ombros",
      desc: "Entrelace os dedos atrás das costas e projete o peito suavemente para frente, afastando os ombros das orelhas. Respire fundo 3 vezes.",
      nrReference: "NR-17 • Reequilíbrio da cadeia postural anterior",
    },
  ];

  // Breathing loop effect
  useEffect(() => {
    let interval: any = null;
    if (breathPhase === "inhale") {
      interval = setInterval(() => {
        setBreathTimer((prev) => {
          if (prev <= 1) {
            setBreathPhase("hold");
            return 7;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (breathPhase === "hold") {
      interval = setInterval(() => {
        setBreathTimer((prev) => {
          if (prev <= 1) {
            setBreathPhase("exhale");
            return 8;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (breathPhase === "exhale") {
      interval = setInterval(() => {
        setBreathTimer((prev) => {
          if (prev <= 1) {
            setBreathCyclesCompleted((c) => c + 1);
            setBreathPhase("inhale");
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [breathPhase]);

  // Ergonomics timer
  useEffect(() => {
    let interval: any = null;
    if (ergoActive) {
      interval = setInterval(() => {
        setErgoTimer((t) => {
          if (t <= 1) {
            if (ergoStep < ergoSteps.length - 1) {
              setErgoStep((s) => s + 1);
              return 15;
            } else {
              setErgoActive(false);
              return 0;
            }
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [ergoActive, ergoStep, ergoSteps.length]);

  return (
    <div
      id="decompression-module-container"
      className={`rounded-2xl border border-teal-800/40 bg-slate-900/95 text-slate-100 p-6 md:p-8 flex flex-col gap-6 shadow-xl ${
        isModal ? "max-w-2xl w-full mx-auto" : "w-full"
      }`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
            <Wind className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                SanderVerse • Saúde Mental
              </span>
              <span className="text-xs text-slate-400">Mitigação de Sobrecarga e Estresse</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight mt-1">
              Módulo de Descompressão Psicológica
            </h2>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg border transition-colors ${
            soundEnabled
              ? "bg-teal-500/20 border-teal-500/40 text-teal-300"
              : "bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200"
          }`}
        >
          {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          {soundEnabled ? "Áudio Guia Ligado" : "Silencioso"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("breathing")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
            activeTab === "breathing"
              ? "bg-teal-600 text-white shadow-md shadow-teal-900/40"
              : "bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          }`}
        >
          <Wind className="w-4 h-4" />
          Respiração 4-7-8
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("grounding")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
            activeTab === "grounding"
              ? "bg-teal-600 text-white shadow-md shadow-teal-900/40"
              : "bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          }`}
        >
          <Eye className="w-4 h-4" />
          Grounding 5-4-3-2-1
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("ergonomics")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
            activeTab === "ergonomics"
              ? "bg-teal-600 text-white shadow-md shadow-teal-900/40"
              : "bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          }`}
        >
          <Activity className="w-4 h-4" />
          Pausa Ativa NR-17
        </button>
      </div>

      {/* Tab 1: Breathing 4-7-8 */}
      {activeTab === "breathing" && (
        <div className="flex flex-col items-center justify-center py-6 px-4 gap-6 text-center">
          <p className="text-sm text-slate-300 max-w-md">
            A respiração diafragmática 4-7-8 estimula o nervo vago e o sistema parassimpático,
            reduzindo o batimento cardíaco e a ansiedade operacional em menos de 2 minutos.
          </p>

          {/* Interactive animated breathing circle */}
          <div className="relative w-56 h-56 flex items-center justify-center">
            {/* Outer animated ripple */}
            <div
              className={`absolute inset-0 rounded-full transition-all duration-1000 ${
                breathPhase === "inhale"
                  ? "bg-teal-500/20 scale-110 blur-md"
                  : breathPhase === "hold"
                  ? "bg-indigo-500/25 scale-105 blur-md"
                  : breathPhase === "exhale"
                  ? "bg-emerald-500/20 scale-90 blur-xs"
                  : "bg-teal-500/10 scale-100"
              }`}
            />

            {/* Core breathing sphere */}
            <div
              className={`w-44 h-44 rounded-full border-2 flex flex-col items-center justify-center transition-all duration-1000 ${
                breathPhase === "inhale"
                  ? "border-teal-400 bg-teal-950/80 scale-105 shadow-xl shadow-teal-500/20 text-teal-300"
                  : breathPhase === "hold"
                  ? "border-indigo-400 bg-indigo-950/80 scale-100 shadow-xl shadow-indigo-500/20 text-indigo-300"
                  : breathPhase === "exhale"
                  ? "border-emerald-400 bg-emerald-950/80 scale-95 shadow-xl shadow-emerald-500/20 text-emerald-300"
                  : "border-slate-700 bg-slate-800/80 text-slate-400"
              }`}
            >
              <span className="text-3xl font-extrabold tracking-tight">
                {breathPhase === "ready" ? "Iniciar" : `${breathTimer}s`}
              </span>
              <span className="text-xs uppercase tracking-wider font-semibold mt-1">
                {breathPhase === "ready"
                  ? "4-7-8"
                  : breathPhase === "inhale"
                  ? "Inspire pelo nariz"
                  : breathPhase === "hold"
                  ? "Segure o ar"
                  : "Expire pela boca"}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            {breathPhase === "ready" ? (
              <button
                type="button"
                id="start-breathing-button"
                onClick={() => {
                  setBreathPhase("inhale");
                  setBreathTimer(4);
                }}
                className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-sm transition-all shadow-lg shadow-teal-900/30 flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                Iniciar Exercício 4-7-8
              </button>
            ) : (
              <button
                type="button"
                id="reset-breathing-button"
                onClick={() => {
                  setBreathPhase("ready");
                  setBreathTimer(4);
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reiniciar
              </button>
            )}

            {breathCyclesCompleted > 0 && (
              <div className="text-xs text-teal-400 bg-teal-500/10 border border-teal-500/30 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" />
                {breathCyclesCompleted} {breathCyclesCompleted === 1 ? "ciclo concluído" : "ciclos concluídos"}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Grounding 5-4-3-2-1 */}
      {activeTab === "grounding" && (
        <div className="space-y-6 py-2">
          {/* Progress bar */}
          <div className="flex items-center justify-between gap-2">
            {groundingSteps.map((step, idx) => (
              <div
                key={step.num}
                onClick={() => setGroundingStep(idx)}
                className={`flex-1 h-2 rounded-full cursor-pointer transition-all ${
                  idx === groundingStep
                    ? "bg-teal-400 ring-2 ring-teal-400/40"
                    : idx < groundingStep
                    ? "bg-teal-600"
                    : "bg-slate-800"
                }`}
                title={`Etapa ${step.num}: ${step.sense}`}
              />
            ))}
          </div>

          {/* Current Step Card */}
          <div className="p-6 rounded-2xl bg-slate-800/70 border border-slate-700/80 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 text-teal-300 font-extrabold text-lg flex items-center justify-center">
                {groundingSteps[groundingStep].num}
              </span>
              <div>
                <span className="text-xs uppercase tracking-wider text-teal-400 font-bold">
                  Sentido: {groundingSteps[groundingStep].sense}
                </span>
                <h3 className="text-lg font-bold text-white">
                  {groundingSteps[groundingStep].title}
                </h3>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              {groundingSteps[groundingStep].desc}
            </p>

            <div className="pt-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Exemplos no Ambiente de Trabalho:
              </span>
              <div className="flex flex-wrap gap-2 mt-2">
                {groundingSteps[groundingStep].examples.map((item, i) => (
                  <span
                    key={i}
                    className="text-xs px-3 py-1 rounded-lg bg-slate-900/80 border border-slate-700 text-slate-300"
                  >
                    • {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-2">
            <button
              type="button"
              disabled={groundingStep === 0}
              onClick={() => setGroundingStep((s) => Math.max(0, s - 1))}
              className="px-4 py-2 rounded-xl text-xs font-medium border border-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800"
            >
              Etapa Anterior
            </button>

            {groundingStep < groundingSteps.length - 1 ? (
              <button
                type="button"
                onClick={() => setGroundingStep((s) => s + 1)}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white shadow-md shadow-teal-900/30 flex items-center gap-2 cursor-pointer"
              >
                Próximo Sentido
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <div className="flex items-center gap-2 text-xs text-teal-300 font-semibold bg-teal-500/10 border border-teal-500/30 px-4 py-2 rounded-xl">
                <CheckCircle className="w-4 h-4 text-teal-400" />
                Grounding Concluído com Sucesso!
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Ergonomics NR-17 */}
      {activeTab === "ergonomics" && (
        <div className="space-y-6 py-2">
          <div className="p-5 rounded-2xl bg-slate-800/70 border border-slate-700 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                {ergoSteps[ergoStep].nrReference}
              </span>
              <div className="text-right">
                <span className="text-2xl font-bold text-teal-400">{ergoTimer}s</span>
                <span className="text-xs text-slate-400 block">Duração guiada</span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white mb-2">{ergoSteps[ergoStep].title}</h3>
              <p className="text-sm text-slate-300 leading-relaxed">{ergoSteps[ergoStep].desc}</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex gap-2">
              {ergoSteps.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setErgoStep(i);
                    setErgoTimer(15);
                  }}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors ${
                    i === ergoStep
                      ? "bg-teal-600 text-white"
                      : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              type="button"
              id="toggle-ergo-timer-button"
              onClick={() => setErgoActive(!ergoActive)}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white shadow-md shadow-teal-900/30 flex items-center gap-2 cursor-pointer"
            >
              {ergoActive ? "Pausar Alongamento" : "Iniciar Cronômetro Ativo"}
            </button>
          </div>
        </div>
      )}

      {/* Footer action if opened from scenario trigger */}
      {onFinish && (
        <div className="flex justify-end pt-4 border-t border-slate-800">
          <button
            type="button"
            id="finish-decompression-button"
            onClick={onFinish}
            className="px-5 py-2.5 rounded-xl font-medium text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            Concluir Descompressão e Retornar ao Treinamento
          </button>
        </div>
      )}
    </div>
  );
}
