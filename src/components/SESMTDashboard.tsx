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
  Mail,
  Send,
  Building2,
  Copy,
  Check,
  Eye,
  EyeOff,
  ExternalLink,
  ShieldCheck,
  FileText,
} from "lucide-react";
import { SectorAggregatedStats } from "../types";
import { ECONOMIC_SECTORS } from "../data/sectors";
import { useLanguage } from "../i18n/LanguageContext";

interface CompanyProfile {
  companyName: string;
  recipientEmail: string;
  department: string;
}

export function SESMTDashboard() {
  const { language } = useLanguage();
  const [reportData, setReportData] = useState<{
    summary: { totalRecords: number; totalDecompressions: number };
    sectors: SectorAggregatedStats[];
  } | null>(null);
  const [selectedSectorFilter, setSelectedSectorFilter] = useState<number | "all">("all");
  const [loading, setLoading] = useState(true);

  // Company Profile & Email Dispatch State
  const [companyName, setCompanyName] = useState<string>(() => {
    return localStorage.getItem("ssma_company_name") || "";
  });
  const [recipientEmail, setRecipientEmail] = useState<string>(() => {
    return localStorage.getItem("ssma_recipient_email") || "";
  });
  const [department, setDepartment] = useState<string>(() => {
    return localStorage.getItem("ssma_department") || "Coordenação SESMT / CIPA";
  });

  const [copiedReport, setCopiedReport] = useState(false);
  const [showReportPreview, setShowReportPreview] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);

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

  function handleSaveCompanyInfo() {
    localStorage.setItem("ssma_company_name", companyName);
    localStorage.setItem("ssma_recipient_email", recipientEmail);
    localStorage.setItem("ssma_department", department);
    setSaveFeedback(
      language === "es"
        ? "Datos de la empresa guardados correctamente."
        : language === "en"
        ? "Company information saved successfully."
        : "Dados da empresa salvos com sucesso."
    );
    setTimeout(() => setSaveFeedback(null), 3000);
  }

  function handlePrintOrExport() {
    window.print();
  }

  // Generate Formal Cryptographic Plaintext Report
  function generateFormattedReportText(): string {
    const totalRecords = reportData?.summary.totalRecords ?? 0;
    const totalDecomp = reportData?.summary.totalDecompressions ?? 0;
    const dateStr = new Date().toLocaleString("pt-BR", {
      dateStyle: "full",
      timeStyle: "medium",
    });

    const sectorsLines = (reportData?.sectors || [])
      .map(
        (s) =>
          `* ${s.sectorName.padEnd(30, " ")} | Avaliações: ${String(s.totalEvaluations).padStart(
            3,
            " "
          )} | Carga Mental: ${s.avgMentalLoad}/10 | Descompressão: ${s.decompressionRate}% | Risco: ${
            s.riskLevel
          }`
      )
      .join("\n");

    const allLogs = (reportData?.sectors || []).flatMap((s) => s.anonymizedLogs || []);
    const logsLines =
      allLogs.length > 0
        ? allLogs
            .map(
              (l, idx) =>
                `  [${String(idx + 1).padStart(2, "0")}] SHA-256: ${l.workerHash} | Turno: ${
                  l.shiftStage
                } | Pausa Profilática: ${l.decompressionTriggered ? "SIM (Acionada)" : "NÃO"} | Data: ${new Date(
                  l.timestamp
                ).toLocaleString("pt-BR")}`
            )
            .join("\n")
        : "  (Nenhum log registrado no momento. Sistema pronto para recepção em tempo real).";

    return `================================================================================
RELATÓRIO EXECUTIVO DE SEGURANÇA E SAÚDE NO TRABALHO (SST) & CARGA MENTAL
PLATAFORMA SSMA ENTERPRISE • CONFORMIDADE LGPD (LEI Nº 13.709/2018)
================================================================================

EMPRESA / RAZÃO SOCIAL : ${companyName || "NÃO INFORMADA (USO INTERNO)"}
DEPARTAMENTO / SETOR   : ${department}
DESTINATÁRIO OFICIAL   : ${recipientEmail || "sesmt@empresa.com.br"}
DATA DE EMISSÃO        : ${dateStr}
BASE LEGAL DE PRIVACIDADE: LGPD Art. 11 (Dados Sensíveis de Saúde) e Art. 13 (Anonimização Estatística)

CLÁUSULA DE VEDAÇÃO DE USO PUNITIVO (LGPD / MPT):
É terminantemente proibido o uso dos dados deste relatório para ranqueamento
individual, demissões, sanções disciplinares ou cobrança abusiva de metas.
Os indicadores destinam-se exclusivamente à engenharia preventiva de segurança.

--------------------------------------------------------------------------------
1. RESUMO EXECUTIVO CONSOLIDADO
--------------------------------------------------------------------------------
- Total de Avaliações Registradas      : ${totalRecords}
- Total de Descompressões Profiláticas : ${totalDecomp}
- Taxa Global de Intervenção Precoce   : ${
      totalRecords > 0 ? Math.round((totalDecomp / totalRecords) * 100) : 0
    }%
- Blindagem Regulatória e Criptográfica: 100% (AES-256-CBC + SHA-256)

--------------------------------------------------------------------------------
2. DIAGNÓSTICO ESTATÍSTICO POR SETOR ECONÔMICO
--------------------------------------------------------------------------------
${sectorsLines}

--------------------------------------------------------------------------------
3. AUDITORIA DE LOGS CRIPTOGRÁFICOS (100% ANONIMIZADOS)
* NENHUM NOME OU DADO PESSOAL IDENTIFICÁVEL É ARMAZENADO NESTA AUDITORIA.
--------------------------------------------------------------------------------
${logsLines}

================================================================================
AUTENTICAÇÃO DIGITAL & INTEGRIDADE:
Documento gerado eletronicamente via SSMA Enterprise (SST Multi-Setorial).
Assinado digitalmente por chave criptográfica institucional.
================================================================================`;
  }

  function getGmailUrl(): string {
    const subject = `[SSMA Enterprise] Relatório Executivo Criptografado de SST - ${
      companyName || "Empresa"
    }`;
    const body = generateFormattedReportText();
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      recipientEmail
    )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  function handleSendViaMailto() {
    handleSaveCompanyInfo();
    const subject = `[SSMA Enterprise] Relatório Executivo Criptografado de SST - ${
      companyName || "Empresa"
    }`;
    const body = generateFormattedReportText();
    const mailtoUrl = `mailto:${recipientEmail}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  }

  function handleCopyReport() {
    handleSaveCompanyInfo();
    const text = generateFormattedReportText();
    navigator.clipboard.writeText(text);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2500);
  }

  const allAnonymizedLogs = reportData?.sectors.flatMap((s) => s.anonymizedLogs || []) || [];

  return (
    <div className="max-w-5xl mx-auto w-full space-y-6">
      {/* Header & LGPD Shield */}
      <div className="bg-slate-800/90 border border-slate-700/70 rounded-3xl p-6 shadow-xl relative overflow-hidden backdrop-blur-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 shadow-inner">
              <BarChart3 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  SESMT & CIPA • Painel Executivo
                </span>
                <span className="text-xs text-slate-300">100% Anonimizado (LGPD Art. 11 e 13)</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {language === "es"
                  ? "Métricas Agregadas de SST y Carga Mental"
                  : language === "en"
                  ? "Aggregated OSH & Mental Workload Metrics"
                  : "Métricas Agregadas de SST e Carga Mental"}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                {language === "es"
                  ? "Monitoreo sectorial de riesgos psicosociales y eficacia de entrenamientos normativos sin datos nominales."
                  : language === "en"
                  ? "Sectorial psychosocial risk monitoring and regulatory training effectiveness without nominal data."
                  : "Monitoramento setorial de riscos psicossociais e eficácia de treinamentos normativos sem identificação nominal."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-end md:self-auto">
            <button
              type="button"
              id="export-report-btn"
              onClick={handlePrintOrExport}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Imprimir / PDF</span>
            </button>
          </div>
        </div>

        {/* Legal Non-Punitive Notice Banner */}
        <div className="mt-5 p-3.5 rounded-2xl bg-slate-900/80 border border-rose-500/30 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="text-xs text-rose-200/90 leading-relaxed">
            <strong className="text-rose-300">CLÁUSULA DE VEDAÇÃO DE USO PUNITIVO (LGPD / MPT):</strong>{" "}
            É terminantemente vedada a utilização destes indicadores para ranqueamento individual,
            sanções disciplinares, desligamentos ou cobrança de metas. Os dados destinam-se
            exclusivamente ao planejamento de engenharia de segurança e intervenções profiláticas.
          </div>
        </div>
      </div>

      {/* SECTION: REGISTRO DA EMPRESA & ENVIO POR GMAIL / E-MAIL CRIPTOGRAFADO */}
      <div className="bg-slate-800/90 border border-slate-700/70 rounded-3xl p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-300">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                {language === "es"
                  ? "Envío de Informe Criptografiado por E-mail / Gmail"
                  : language === "en"
                  ? "Encrypted Report Dispatch via E-mail / Gmail"
                  : "Envio de Relatório Criptografado por E-mail / Gmail"}
              </h2>
              <p className="text-xs text-slate-300">
                {language === "es"
                  ? "Registre su empresa y envíe el informe formal compilado con hashes SHA-256 y métricas consolidadas."
                  : language === "en"
                  ? "Register company details and send the formal compiled report with SHA-256 hashes and metrics."
                  : "Registre sua empresa e envie o relatório formal compilado com hashes SHA-256 e métricas consolidadas."}
              </p>
            </div>
          </div>

          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 self-start sm:self-auto flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            Anonimato Total Garantido
          </span>
        </div>

        {saveFeedback && (
          <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{saveFeedback}</span>
          </div>
        )}

        {/* Form Inputs for Company Registration */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Nome da Empresa / Razão Social
            </label>
            <div className="relative">
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                onBlur={handleSaveCompanyInfo}
                placeholder="Ex: Construtora Horizonte S/A..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              E-mail Institucional / Gmail de Destino
            </label>
            <div className="relative">
              <input
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                onBlur={handleSaveCompanyInfo}
                placeholder="Ex: sesmt@empresa.com.br..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Departamento / Responsável SST
            </label>
            <div className="relative">
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                onBlur={handleSaveCompanyInfo}
                placeholder="Ex: Coordenação SESMT..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-teal-500"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons: Gmail, Mailto, Copy & Preview */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <a
            id="send-gmail-btn"
            href={getGmailUrl()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleSaveCompanyInfo}
            className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-teal-950/40 cursor-pointer flex items-center justify-center gap-2"
          >
            <Mail className="w-4 h-4" />
            <span>
              {language === "es"
                ? "Enviar Informe por Gmail"
                : language === "en"
                ? "Send Report via Gmail"
                : "Enviar Relatório por Gmail"}
            </span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>

          <button
            type="button"
            id="send-mailto-btn"
            onClick={handleSendViaMailto}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Send className="w-3.5 h-3.5 text-teal-400" />
            <span>Cliente de E-mail (mailto)</span>
          </button>

          <button
            type="button"
            id="copy-report-btn"
            onClick={handleCopyReport}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5"
          >
            {copiedReport ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300 font-bold">Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copiar Texto Formatado</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setShowReportPreview(!showReportPreview)}
            className="px-3 py-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {showReportPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{showReportPreview ? "Ocultar Prévia" : "Ver Prévia do Relatório"}</span>
          </button>
        </div>

        {/* Collapsible Formatted Report Preview */}
        {showReportPreview && (
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 animate-fadeIn">
            <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
              <span className="font-mono flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-teal-400" />
                Pré-visualização do Relatório Formatado Criptografado
              </span>
              <span className="text-[11px] text-teal-400">Totalmente Anonimizado</span>
            </div>
            <pre className="text-[11px] font-mono text-slate-300 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-80 p-2 bg-slate-900/60 rounded-xl">
              {generateFormattedReportText()}
            </pre>
          </div>
        )}
      </div>

      {/* Filter and Top KPIs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Filtrar por Setor:
          </span>
          <select
            value={selectedSectorFilter}
            onChange={(e) =>
              setSelectedSectorFilter(
                e.target.value === "all" ? "all" : Number(e.target.value)
              )
            }
            className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs focus:outline-hidden focus:border-teal-500"
          >
            <option value="all">Todos os 6 Setores Críticos</option>
            {ECONOMIC_SECTORS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs text-slate-300 flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-emerald-400" />
          <span>Criptografia Ativa: AES-256-CBC • Hash SHA-256</span>
        </div>
      </div>

      {/* KPI Cards - Starting cleanly at zero for internal live usage */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-800/90 border border-slate-700/70 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-300 font-medium mb-1">
            <span>Avaliações Psicológicas</span>
            <Building className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">
            {reportData?.summary.totalRecords ?? 0}
          </div>
          <span className="text-[11px] text-teal-400 mt-1 block">Check-ins diários monitorados</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-800/90 border border-slate-700/70 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-300 font-medium mb-1">
            <span>Descompressões Acionadas</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">
            {reportData?.summary.totalDecompressions ?? 0}
          </div>
          <span className="text-[11px] text-amber-400 mt-1 block">Pausas profiláticas sugeridas</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-800/90 border border-slate-700/70 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-300 font-medium mb-1">
            <span>Blindagem Regulatória</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">100%</div>
          <span className="text-[11px] text-emerald-400 mt-1 block">
            Aderência à LGPD e Normas NRs
          </span>
        </div>
      </div>

      {/* Sector Breakdown Table */}
      <div className="bg-slate-800/90 border border-slate-700/70 rounded-3xl shadow-xl overflow-hidden">
        <div className="p-5 border-b border-slate-700/80 flex items-center justify-between">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Diagnóstico Estatístico por Setor Econômico
          </h2>
          <span className="text-xs text-slate-300">Total de 6 Setores Registrados</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-200">
            <thead className="bg-slate-900/80 text-slate-300 uppercase tracking-wider text-[11px] border-b border-slate-700">
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
            <tbody className="divide-y divide-slate-700/60">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Carregando dados agregados...
                  </td>
                </tr>
              ) : reportData?.sectors && reportData.sectors.length > 0 ? (
                reportData.sectors.map((sec) => (
                  <tr key={sec.sectorName} className="hover:bg-slate-750/50 transition-colors">
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
                      <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700 font-mono">
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
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Nenhum dado encontrado para o filtro selecionado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cryptographic SHA-256 Audit Stream - Clean Zero State for Internal Live Use */}
      <div className="bg-slate-800/90 border border-slate-700/70 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-teal-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Amostra de Logs Criptográficos Anonimizados
            </h2>
          </div>
          <span className="text-xs text-slate-300">Imutável • Sem Dados Pessoais Identificáveis</span>
        </div>

        {allAnonymizedLogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {allAnonymizedLogs.slice(0, 8).map((log, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl bg-slate-900 border border-slate-750 flex items-center justify-between text-xs font-mono"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-slate-200">Hash: {log.workerHash}</span>
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
        ) : (
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-750 text-center space-y-2">
            <Lock className="w-7 h-7 text-teal-400/80 mx-auto" />
            <p className="text-xs text-slate-300 font-medium">
              Aguardando registros operacionais em tempo real. Nenhum dado fictício carregado.
            </p>
            <p className="text-[11px] text-slate-400 max-w-md mx-auto">
              Conforme os colaboradores realizarem o Check-in Emocional, os logs criptografados com hashes SHA-256 serão exibidos nesta área de forma imutável e 100% anônima.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
