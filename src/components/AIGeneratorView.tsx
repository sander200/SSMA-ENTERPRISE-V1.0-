import { useState } from "react";
import {
  Sparkles,
  Bot,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Play,
  Copy,
  Check,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import { ECONOMIC_SECTORS } from "../data/sectors";
import { TestScenario } from "../types";

interface Props {
  onLoadScenarioToPlay: (scenario: TestScenario) => void;
  initialSectorName?: string;
}

export function AIGeneratorView({ onLoadScenarioToPlay, initialSectorName }: Props) {
  const [sector, setSector] = useState(initialSectorName || ECONOMIC_SECTORS[0].name);
  const [riskLevel, setRiskLevel] = useState<"Moderado" | "Alto" | "Crítico">("Alto");
  const [environmentalConditions, setEnvironmentalConditions] = useState("");
  const [humanFactorPressure, setHumanFactorPressure] = useState("");
  const [weaknessFocus, setWeaknessFocus] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedScenario, setGeneratedScenario] = useState<TestScenario | null>(null);
  const [generationSource, setGenerationSource] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const selectedSectorObj = ECONOMIC_SECTORS.find((s) => s.name === sector);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setIsGenerating(true);
    setErrorMsg("");

    try {
      const response = await fetch("/api/scenarios/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sector,
          riskLevel,
          environmentalConditions: environmentalConditions.trim() || undefined,
          humanFactorPressure: humanFactorPressure.trim() || undefined,
          weaknessFocus: weaknessFocus.trim() || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro na requisição ao motor de IA");
      }

      const data = await response.json();
      if (data.scenario) {
        setGeneratedScenario(data.scenario);
        setGenerationSource(
          data.source === "curated-library"
            ? "Base Curada NR"
            : data.source || "Gemini 3.8 Flash"
        );
      } else {
        throw new Error("Formato inválido retornado pelo backend");
      }
    } catch (err: any) {
      console.warn("[AIGenerator] Notice during generation:", err?.message || err);
      setErrorMsg("Falha temporária ao comunicar com o motor de IA. Tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  }

  function handleCopyJSON() {
    if (!generatedScenario) return;
    navigator.clipboard.writeText(JSON.stringify(generatedScenario, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="max-w-4xl mx-auto w-full space-y-6">
      {/* Header card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Exercício de capacitação
              </span>
              <span className="text-xs text-slate-400">Não é texto oficial de NR</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Gerador Dinâmico de Cenários de SST
            </h1>
            <p className="text-sm text-slate-300 mt-1 leading-relaxed">
              O gerador pede uma situação nova. Se o motor não responder, permanece a cena curada deste setor,
              e ela se repete porque o banco local tem uma cena por setor. A resposta é a do exercício.
              Não declara conformidade e não atribui grau da NR-4.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Controls (5 cols) */}
        <form
          onSubmit={handleGenerate}
          className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl h-fit"
        >
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Sliders className="w-4 h-4 text-teal-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Parâmetros de Síntese
            </h2>
          </div>

          {/* Sector selection */}
          <div className="space-y-1.5">
            <label htmlFor="sector-select" className="text-xs font-semibold text-slate-300">
              Setor Econômico Alvo
            </label>
            <select
              id="sector-select"
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-sm focus:border-teal-500 focus:outline-hidden"
            >
              {ECONOMIC_SECTORS.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name} ({s.norms})
                </option>
              ))}
            </select>
            {selectedSectorObj && (
              <span className="text-[11px] text-slate-400 block leading-tight">
                Normas de referência do exercício: {selectedSectorObj.norms}. O grau da NR-4 depende do CNAE, não deste setor.
              </span>
            )}
          </div>

          {/* Risk Level */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 block">Nível de Risco</label>
            <div className="grid grid-cols-3 gap-2">
              {(["Moderado", "Alto", "Crítico"] as const).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setRiskLevel(level)}
                  className={`py-2 px-1 rounded-xl text-xs font-semibold border transition-all ${
                    riskLevel === level
                      ? level === "Crítico"
                        ? "bg-rose-500/20 border-rose-500 text-rose-300"
                        : level === "Alto"
                        ? "bg-amber-500/20 border-amber-500 text-amber-300"
                        : "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                      : "bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Environmental conditions input */}
          <div className="space-y-1.5">
            <label htmlFor="env-conditions" className="text-xs font-semibold text-slate-300">
              Condições Climáticas / Ambiente (Opcional)
            </label>
            <input
              id="env-conditions"
              type="text"
              placeholder="Ex: Chuva torrencial, espaço confinado, 36°C"
              value={environmentalConditions}
              onChange={(e) => setEnvironmentalConditions(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs focus:border-teal-500 focus:outline-hidden placeholder:text-slate-500"
            />
          </div>

          {/* Human factor pressure */}
          <div className="space-y-1.5">
            <label htmlFor="human-pressure" className="text-xs font-semibold text-slate-300">
              Fator Humano / Pressão de Tempo (Opcional)
            </label>
            <input
              id="human-pressure"
              type="text"
              placeholder="Ex: Cobrança da diretoria, fadiga pós-almoço"
              value={humanFactorPressure}
              onChange={(e) => setHumanFactorPressure(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs focus:border-teal-500 focus:outline-hidden placeholder:text-slate-500"
            />
          </div>

          {/* Self-Improvement Focus */}
          <div className="space-y-1.5">
            <label htmlFor="weakness-focus" className="text-xs font-semibold text-slate-300">
              Reforço em Fragilidade Detectada (Self-Improvement)
            </label>
            <input
              id="weakness-focus"
              type="text"
              placeholder="Ex: Falha em aterramento, bloqueio LOTO"
              value={weaknessFocus}
              onChange={(e) => setWeaknessFocus(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs focus:border-teal-500 focus:outline-hidden placeholder:text-slate-500"
            />
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            id="generate-scenario-submit-btn"
            disabled={isGenerating}
            className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-900/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin" />
                Sintetizando Cenário com IA...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-blue-200" />
                Gerar Cenário com Validação NR
              </>
            )}
          </button>
        </form>

        {/* Generated Scenario Preview (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {generatedScenario ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span className="text-sm font-bold text-white">Cenário Sintetizado Válido</span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    Fonte: {generationSource}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyJSON}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Copiar JSON estrito"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Copiado!" : "JSON"}
                  </button>
                </div>
              </div>

              {/* Scenario details */}
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    {generatedScenario.norm_reference}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                    {generatedScenario.sector}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Risco {generatedScenario.risk_level}
                  </span>
                </div>

                <p className="text-sm text-slate-200 leading-relaxed p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  {generatedScenario.situation_description}
                </p>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/40">
                    <span className="text-slate-400 block font-semibold mb-0.5">Clima/Ambiente:</span>
                    <span className="text-slate-300">{generatedScenario.environmental_conditions}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/40">
                    <span className="text-slate-400 block font-semibold mb-0.5">Fator Humano:</span>
                    <span className="text-slate-300">{generatedScenario.human_factor_pressure}</span>
                  </div>
                </div>

                {/* Options list */}
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                    Alternativas e Justificativas Técnicas:
                  </span>
                  {generatedScenario.options.map((opt) => (
                    <div
                      key={opt.id}
                      className={`p-3 rounded-xl border text-xs leading-normal ${
                        opt.is_correct
                          ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-200"
                          : "bg-slate-800/40 border-slate-700/50 text-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`w-5 h-5 rounded-md text-[11px] font-bold flex items-center justify-center ${
                            opt.is_correct ? "bg-emerald-500 text-white" : "bg-slate-700 text-slate-300"
                          }`}
                        >
                          {opt.id}
                        </span>
                        <span className="font-semibold text-white">{opt.text}</span>
                      </div>
                      <p className="text-slate-400 pl-7">{opt.justification}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action to play */}
              <div className="pt-3 border-t border-slate-800 flex justify-end">
                <button
                  type="button"
                  id="play-generated-scenario-btn"
                  onClick={() => onLoadScenarioToPlay(generatedScenario)}
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs transition-all shadow-md shadow-teal-900/30 flex items-center gap-2 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" />
                  Iniciar no Simulador Time-Attack
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/60 border border-slate-800 border-dashed rounded-2xl p-12 text-center text-slate-400 space-y-3 flex flex-col items-center justify-center min-h-[360px]">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-500">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-200">Aguardando Parâmetros</h3>
              <p className="text-xs text-slate-400 max-w-sm">
                Selecione o setor e os fatores de risco ao lado e clique em &quot;Gerar Cenário&quot; para sintetizar
                uma nova situação-problema validada com as Normas Regulamentadoras vigentes.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
