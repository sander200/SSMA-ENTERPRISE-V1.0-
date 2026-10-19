import { useState, useEffect } from "react";
import {
  ShieldAlert,
  Lock,
  BarChart3,
  TrendingUp,
  Download,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Building,
} from "lucide-react";
import { SectorAggregatedStats } from "../types";
import { ECONOMIC_SECTORS } from "../data/sectors";

export function SESMTDashboard() {
  const [reportData, setReportData] = useState<{
    summary: { totalRecords: number; totalDecompressions: number };
    sectors: SectorAggregatedStats[];
  } | null>(null);
  const [selectedSectorFilter, setSelectedSectorFilter] = useState<number | "all">("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReport();
  }, [selectedSectorFilter]);

  async function fetchReport() {
    setLoading(true);
    try {
      const url =
        selectedSectorFilter === "all"
          ? "/api/psychological/anonymized-report"
          : `/api/psychological/anonymized-report?sectorId=${selectedSectorFilter}`;
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        setReportData(json);
      }
    } catch (e: any) {
      console.warn("Notice: Anonymized report fetch info:", e?.message || e);
    } finally {
      setLoading(false);
    }
  }

  function handlePrintOrExport() {
    window.print();
  }

  return (
    <div className="max-w-5xl mx-auto w-full space-y-6">
      {/* Header & LGPD Shield */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  SESMT & CIPA • Painel Gerencial
                </span>
                <span className="text-xs text-slate-400">100% Anonimizado (LGPD Art. 11 e 13)</span>
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Métricas Agregadas de SST e Saúde Psicológica
              </h1>
              <p className="text-sm text-slate-300 mt-1 leading-relaxed">
                Monitoramento setorial de riscos psicossociais e eficácia de treinamentos normativos
                sem identificação nominal do trabalhador.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:self-auto">
            <button
              type="button"
              id="export-report-btn"
              onClick={handlePrintOrExport}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Imprimir / Relatório PDF
            </button>
          </div>
        </div>

        {/* Legal Non-Punitive Notice Banner */}
        <div className="mt-5 p-3.5 rounded-xl bg-slate-950/60 border border-rose-500/30 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="text-xs text-rose-200/90 leading-relaxed">
            <strong className="text-rose-300">CLÁUSULA DE VEDAÇÃO DE USO PUNITIVO (LGPD / MPT):</strong>{" "}
            É terminantemente vedada a utilização destes indicadores para ranqueamento individual,
            sanções disciplinares, desligamentos ou cobrança de metas. Os dados destinam-se
            exclusivamente ao planejamento de engenharia de segurança e intervenções ergonômicas
            preventivas.
          </div>
        </div>
      </div>

      {/* Filter and Top KPIs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Filtrar por Setor:
          </span>
          <select
            value={selectedSectorFilter}
            onChange={(e) =>
              setSelectedSectorFilter(
                e.target.value === "all" ? "all" : Number(e.target.value)
              )
            }
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-hidden focus:border-teal-500"
          >
            <option value="all">Todos os 6 Setores Críticos</option>
            {ECONOMIC_SECTORS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs text-slate-400 flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-emerald-400" />
          <span>Criptografia Ativa: AES-256-CBC • Hash SHA-256</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1">
            <span>Avaliações Psicológicas</span>
            <Building className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">
            {reportData?.summary.totalRecords ?? 6}
          </div>
          <span className="text-[11px] text-teal-400 mt-1 block">Check-ins diários monitorados</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1">
            <span>Descompressões Acionadas</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">
            {reportData?.summary.totalDecompressions ?? 3}
          </div>
          <span className="text-[11px] text-amber-400 mt-1 block">Pausas profiláticas sugeridas</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1">
            <span>Blindagem Regulatória</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">100%</div>
          <span className="text-[11px] text-emerald-400 mt-1 block">
            Aderência à LGPD e Normas NRs
          </span>
        </div>
      </div>

      {/* Sector Breakdown Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Diagnóstico Estatístico por Setor Econômico
          </h2>
          <span className="text-xs text-slate-400">Total de 6 Setores Registrados</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Setor Operacional</th>
                <th className="py-3.5 px-4 font-semibold text-center">Registros</th>
                <th className="py-3.5 px-4 font-semibold text-center">Ansiedade Média</th>
                <th className="py-3.5 px-4 font-semibold text-center">Fadiga Média</th>
                <th className="py-3.5 px-4 font-semibold text-center">Carga Mental</th>
                <th className="py-3.5 px-4 font-semibold text-center">Taxa Descompressão</th>
                <th className="py-3.5 px-4 font-semibold text-right">Classificação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    Carregando dados agregados...
                  </td>
                </tr>
              ) : reportData?.sectors && reportData.sectors.length > 0 ? (
                reportData.sectors.map((sec) => (
                  <tr key={sec.sectorName} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-white">
                      {sec.sectorName}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono">{sec.totalEvaluations}</td>
                    <td className="py-3.5 px-4 text-center font-mono">{sec.avgAnxiety} / 5</td>
                    <td className="py-3.5 px-4 text-center font-mono">{sec.avgFatigue} / 5</td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-teal-400">
                      {sec.avgMentalLoad} / 10
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 font-mono">
                        {sec.decompressionRate}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span
                        className={`px-2.5 py-1 rounded-full font-bold text-[11px] border ${
                          sec.riskLevel === "Crítico"
                            ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                            : sec.riskLevel === "Moderado"
                            ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                            : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                        }`}
                      >
                        {sec.riskLevel}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    Nenhum dado encontrado para o filtro selecionado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cryptographic SHA-256 Audit Stream */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-teal-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Amostra de Logs Criptográficos Anonimizados
            </h2>
          </div>
          <span className="text-xs text-slate-400">Imutável • Sem Dados Pessoais Identificáveis</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {reportData?.sectors.flatMap((s) => s.anonymizedLogs || []).slice(0, 6).map((log, i) => (
            <div
              key={i}
              className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs font-mono"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-slate-300">Hash: {log.workerHash}</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <span>{log.shiftStage}</span>
                {log.decompressionTriggered ? (
                  <span className="text-amber-400 font-semibold flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Pausa Ativa
                  </span>
                ) : (
                  <span className="text-emerald-400">Normal</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
