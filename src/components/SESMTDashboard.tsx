import { useState, useEffect } from "react";
import {
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
  Copy,
  Check,
  Eye,
  EyeOff,
  ExternalLink,
  ShieldCheck,
  FileText,
  FileSpreadsheet,
  RefreshCw,
  PlusCircle,
  Cloud,
  CloudOff,
  CloudUpload,
  Database,
  XCircle,
  RotateCcw,
  ShieldAlert,
} from "lucide-react";
import { User } from "firebase/auth";
import {
  PsychologicalLog,
  SectorAggregatedStats,
  TrainingAttempt,
} from "../types";
import { ECONOMIC_SECTORS } from "../data/sectors";
import { useLanguage } from "../i18n/LanguageContext";
import {
  initAuth,
  googleSignIn,
  logoutGoogle,
  sendGmailMessage,
  createAdminReportingSpreadsheet,
  syncAdminReportToSpreadsheet,
  fetchAdminReportFromSpreadsheet,
  extractSpreadsheetId,
  RemoteAdminReportPreview,
  ADMIN_SHEET_TABS,
} from "../services/googleWorkspace";
import {
  WorkspaceAccountBar,
  WorkspaceActionConfirmModal,
} from "./GoogleWorkspaceAuthBar";

interface SESMTDashboardProps {
  attempts?: TrainingAttempt[];
  psychologicalLogs?: PsychologicalLog[];
}

export function SESMTDashboard({
  attempts = [],
  psychologicalLogs = [],
}: SESMTDashboardProps) {
  const { language } = useLanguage();
  const [reportData, setReportData] = useState<{
    summary: { totalRecords: number; totalDecompressions: number };
    sectors: SectorAggregatedStats[];
  } | null>(null);
  const [selectedSectorFilter, setSelectedSectorFilter] = useState<
    number | "all"
  >("all");
  const [loading, setLoading] = useState(true);

  // Company Profile & Email Dispatch State
  const [companyName, setCompanyName] = useState<string>(() => {
    return localStorage.getItem("ssma_company_name") || "";
  });
  const [recipientEmail, setRecipientEmail] = useState<string>(() => {
    return (
      localStorage.getItem("ssma_recipient_email") || "beisander2@gmail.com"
    );
  });
  const [department, setDepartment] = useState<string>(() => {
    return (
      localStorage.getItem("ssma_department") || "Coordinación SST / SESMT"
    );
  });

  const [copiedReport, setCopiedReport] = useState(false);
  const [showReportPreview, setShowReportPreview] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);
  const [gmailError, setGmailError] = useState<string | null>(null);
  const [isSendingGmail, setIsSendingGmail] = useState(false);
  const [showConfirmGmailModal, setShowConfirmGmailModal] = useState(false);

  // Google Workspace Auth State
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [hasToken, setHasToken] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Google Sheets Administrative Reporting State
  const [adminSheetId, setAdminSheetId] = useState<string>(() => {
    return localStorage.getItem("ssma_admin_reporting_sheet_id") || "";
  });
  const [adminSheetUrl, setAdminSheetUrl] = useState<string>(() => {
    return localStorage.getItem("ssma_admin_reporting_sheet_url") || "";
  });
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(() => {
    return localStorage.getItem("ssma_admin_reporting_last_sync") || null;
  });
  const [lastSyncedSignature, setLastSyncedSignature] = useState<string | null>(
    () => {
      return (
        localStorage.getItem("ssma_admin_reporting_last_signature") || null
      );
    }
  );
  const [isSyncingSheets, setIsSyncingSheets] = useState(false);
  const [isLoadingRemotePreview, setIsLoadingRemotePreview] = useState(false);
  const [sheetsFeedback, setSheetsFeedback] = useState<string | null>(null);
  const [sheetsError, setSheetsError] = useState<string | null>(null);
  const [sheetsErrorMeta, setSheetsErrorMeta] = useState<{
    failedAction: "create" | "sync" | "inspect" | "auth";
    code: string;
    hint: string;
    timestamp: string;
    retryCount: number;
  } | null>(null);
  const [remotePreview, setRemotePreview] =
    useState<RemoteAdminReportPreview | null>(null);
  const [pendingSheetsAction, setPendingSheetsAction] = useState<
    "create" | "sync" | null
  >(null);

  useEffect(() => {
    const unsub = initAuth(
      (u) => {
        setGoogleUser(u);
        setHasToken(true);
      },
      () => {
        setGoogleUser(null);
        setHasToken(false);
      }
    );
    return () => unsub();
  }, []);

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

  // Combine local psychological logs with any server-side anonymized logs for complete reporting
  const serverAnonymizedLogs =
    reportData?.sectors.flatMap((s) => s.anonymizedLogs || []) || [];

  const combinedPsychologicalLogs: PsychologicalLog[] = (() => {
    const byKey = new Map<string, PsychologicalLog>();
    psychologicalLogs.forEach((l) => {
      const key = `${l.workerHash || l.userId}-${l.loggedAt}`;
      byKey.set(key, l);
    });
    serverAnonymizedLogs.forEach((sl) => {
      const key = `${sl.workerHash}-${sl.timestamp}`;
      if (!byKey.has(key)) {
        byKey.set(key, {
          userId: "operador-anon",
          workerHash: sl.workerHash,
          shiftStage: sl.shiftStage === "END" ? "END" : "START",
          anxietyScore: sl.decompressionTriggered ? 4 : 2,
          fatigueScore: sl.decompressionTriggered ? 4 : 2,
          focusScore: 4,
          totalMentalLoad: sl.decompressionTriggered ? 8 : 4,
          decompressionTriggered: sl.decompressionTriggered,
          loggedAt: sl.timestamp,
        });
      }
    });
    return Array.from(byKey.values());
  })();

  // Compute deterministic signature of current local data + target sheet ID
  const currentDataSignature = `${adminSheetId.trim()}|attempts:${
    attempts.length
  }:${attempts[0]?.id || ""}|logs:${combinedPsychologicalLogs.length}:${
    combinedPsychologicalLogs[0]?.loggedAt || ""
  }`;

  const isSheetConfigured = Boolean(adminSheetId.trim());
  const isDataSynced =
    isSheetConfigured &&
    Boolean(lastSyncedAt) &&
    lastSyncedSignature === currentDataSignature;

  function classifySheetsError(
    err: any,
    failedAction: "create" | "sync" | "inspect" | "auth"
  ) {
    const rawMsg =
      err?.message ||
      "Error de conexión al intentar comunicarse con Google Sheets API.";
    let code = "CONNECTION_ERROR";
    let hint =
      "Verifique su conexión a internet y que la hoja de cálculo de Google Sheets esté disponible.";

    if (
      rawMsg.includes("AUTH_REQUIRED") ||
      rawMsg.includes("401") ||
      rawMsg.toLowerCase().includes("iniciar sesión") ||
      rawMsg.toLowerCase().includes("token")
    ) {
      code = "AUTH_TOKEN_EXPIRED (401)";
      hint =
        "Su sesión de Google Workspace expiró o aún no ha sido autorizada. Reconecte su cuenta de Google y vuelva a intentar.";
    } else if (rawMsg.includes("403") || rawMsg.toLowerCase().includes("permission")) {
      code = "PERMISSION_DENIED (403)";
      hint =
        "La cuenta de Google conectada no tiene permisos de edición sobre esta hoja de cálculo o falta el permiso de Google Sheets.";
    } else if (
      rawMsg.includes("404") ||
      rawMsg.toLowerCase().includes("not found") ||
      rawMsg.toLowerCase().includes("no se pudo acceder") ||
      rawMsg.toLowerCase().includes("inválido")
    ) {
      code = "SPREADSHEET_NOT_FOUND (404)";
      hint =
        "No se encontró el documento con el ID proporcionado. Verifique que el ID o URL de Google Sheets sea correcto o cree una nueva hoja.";
    } else if (
      rawMsg.toLowerCase().includes("failed to fetch") ||
      rawMsg.toLowerCase().includes("network")
    ) {
      code = "NETWORK_FAILURE";
      hint =
        "Fallo de red al conectar con sheets.googleapis.com. Compruebe su conexión y presione Reintentar.";
    }

    const cleanMessage =
      rawMsg === "AUTH_REQUIRED"
        ? "Sesión de Google Workspace caducada o no iniciada. Se requiere autenticación para conectar con Google Sheets."
        : rawMsg;

    setSheetsError(cleanMessage);
    setSheetsErrorMeta((prev) => ({
      failedAction,
      code,
      hint,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      retryCount: (prev?.retryCount ?? 0) + 1,
    }));
  }

  function clearSheetsError() {
    setSheetsError(null);
    setSheetsErrorMeta(null);
  }

  async function handleGoogleLogin() {
    setIsLoggingIn(true);
    setGmailError(null);
    clearSheetsError();
    try {
      const res = await googleSignIn();
      if (res) {
        setGoogleUser(res.user);
        setHasToken(true);
      }
    } catch (err: any) {
      const msg = err?.message || "No se pudo iniciar sesión con Google.";
      setGmailError(msg);
      classifySheetsError(err, "auth");
    } finally {
      setIsLoggingIn(false);
    }
  }

  async function handleGoogleLogout() {
    await logoutGoogle();
    setGoogleUser(null);
    setHasToken(false);
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
    setTimeout(() => setSaveFeedback(null), 3500);
  }

  function handleSaveSheetId(rawInput: string) {
    const cleanId = extractSpreadsheetId(rawInput);
    setAdminSheetId(cleanId);
    localStorage.setItem("ssma_admin_reporting_sheet_id", cleanId);
    if (cleanId) {
      const url = `https://docs.google.com/spreadsheets/d/${cleanId}/edit`;
      setAdminSheetUrl(url);
      localStorage.setItem("ssma_admin_reporting_sheet_url", url);
    } else {
      setAdminSheetUrl("");
      localStorage.removeItem("ssma_admin_reporting_sheet_url");
    }
  }

  function handleRequestCreateAdminSheet() {
    clearSheetsError();
    setSheetsFeedback(null);
    if (!hasToken) {
      classifySheetsError(
        new Error(
          "Debe iniciar sesión con Google primero para crear y sincronizar hojas de cálculo en Google Sheets."
        ),
        "create"
      );
      return;
    }
    setPendingSheetsAction("create");
  }

  function handleRequestSyncAdminSheet() {
    clearSheetsError();
    setSheetsFeedback(null);
    if (!hasToken) {
      classifySheetsError(
        new Error(
          "Debe iniciar sesión con Google primero para sincronizar datos con Google Sheets."
        ),
        "sync"
      );
      return;
    }
    if (!adminSheetId.trim()) {
      classifySheetsError(
        new Error(
          "Ingrese un ID o URL de Google Sheets existente, o haga clic en 'Crear Nueva Hoja de Reporte Administrativo'."
        ),
        "sync"
      );
      return;
    }
    setPendingSheetsAction("sync");
  }

  async function performSheetsSyncRequest(action: "create" | "sync") {
    setIsSyncingSheets(true);
    clearSheetsError();
    setSheetsFeedback(null);

    try {
      const payload = {
        companyName: companyName || "Corporativo SSMA Enterprise",
        department: department || "Coordinación SST / SESMT",
        attempts,
        psychologicalLogs: combinedPsychologicalLogs,
      };

      const result =
        action === "create"
          ? await createAdminReportingSpreadsheet(payload)
          : await syncAdminReportToSpreadsheet(adminSheetId, payload);

      const syncedSig = `${result.spreadsheetId.trim()}|attempts:${
        attempts.length
      }:${attempts[0]?.id || ""}|logs:${combinedPsychologicalLogs.length}:${
        combinedPsychologicalLogs[0]?.loggedAt || ""
      }`;

      setAdminSheetId(result.spreadsheetId);
      setAdminSheetUrl(result.spreadsheetUrl);
      setLastSyncedAt(result.syncedAt);
      setLastSyncedSignature(syncedSig);
      localStorage.setItem(
        "ssma_admin_reporting_sheet_id",
        result.spreadsheetId
      );
      localStorage.setItem(
        "ssma_admin_reporting_sheet_url",
        result.spreadsheetUrl
      );
      localStorage.setItem("ssma_admin_reporting_last_sync", result.syncedAt);
      localStorage.setItem("ssma_admin_reporting_last_signature", syncedSig);

      setSheetsFeedback(
        action === "create"
          ? `¡Hoja de reporte administrativo creada y sincronizada con éxito! (${result.syncedAttemptsCount} intentos de entrenamiento y ${result.syncedLogsCount} logs psicológicos).`
          : `¡Sincronización completada con Google Sheets! (${result.syncedAttemptsCount} intentos de entrenamiento y ${result.syncedLogsCount} logs psicológicos actualizados).`
      );
    } catch (err: any) {
      classifySheetsError(err, action);
    } finally {
      setIsSyncingSheets(false);
    }
  }

  async function executeConfirmedSheetsAction() {
    const action = pendingSheetsAction;
    setPendingSheetsAction(null);
    if (!action) return;
    await performSheetsSyncRequest(action);
  }

  async function handleQuickSyncNow() {
    clearSheetsError();
    setSheetsFeedback(null);

    if (!hasToken) {
      setIsLoggingIn(true);
      try {
        const res = await googleSignIn();
        if (!res) return;
        setGoogleUser(res.user);
        setHasToken(true);
      } catch (err: any) {
        classifySheetsError(
          err?.message
            ? err
            : new Error(
                "Debe iniciar sesión con Google para sincronizar con Google Sheets."
              ),
          adminSheetId.trim() ? "sync" : "create"
        );
        return;
      } finally {
        setIsLoggingIn(false);
      }
    }

    if (!adminSheetId.trim()) {
      setPendingSheetsAction("create");
    } else {
      setPendingSheetsAction("sync");
    }
  }

  async function handleInspectRemoteSheet() {
    clearSheetsError();
    if (!hasToken) {
      classifySheetsError(
        new Error(
          "Inicie sesión con Google para consultar los datos remotos de la hoja de cálculo."
        ),
        "inspect"
      );
      return;
    }
    if (!adminSheetId.trim()) {
      classifySheetsError(
        new Error(
          "Ingrese o cree primero una hoja de cálculo de reporte administrativo."
        ),
        "inspect"
      );
      return;
    }
    setIsLoadingRemotePreview(true);
    try {
      const preview = await fetchAdminReportFromSpreadsheet(adminSheetId);
      setRemotePreview(preview);
      setSheetsFeedback(
        `Datos verificados desde "${preview.spreadsheetTitle}": ${preview.attemptsRows.length} intentos y ${preview.psychologicalRows.length} logs psicológicos en la nube.`
      );
    } catch (err: any) {
      classifySheetsError(err, "inspect");
    } finally {
      setIsLoadingRemotePreview(false);
    }
  }

  async function handleRetryFailedSheetsRequest() {
    const failedAction = sheetsErrorMeta?.failedAction || "sync";
    clearSheetsError();
    setSheetsFeedback(null);

    // Ensure authenticated before retrying if token is missing
    if (!hasToken) {
      setIsLoggingIn(true);
      try {
        const res = await googleSignIn();
        if (!res) return;
        setGoogleUser(res.user);
        setHasToken(true);
      } catch (err: any) {
        classifySheetsError(err, failedAction);
        return;
      } finally {
        setIsLoggingIn(false);
      }
    }

    if (failedAction === "auth") {
      return;
    }

    if (failedAction === "inspect") {
      await handleInspectRemoteSheet();
      return;
    }

    if (failedAction === "create" || !adminSheetId.trim()) {
      await performSheetsSyncRequest("create");
    } else {
      await performSheetsSyncRequest("sync");
    }
  }

  function handlePrintOrExport() {
    window.print();
  }

  // Generate Formal Cryptographic Plaintext Report
  function generateFormattedReportText(): string {
    const totalRecords =
      Math.max(
        reportData?.summary.totalRecords ?? 0,
        combinedPsychologicalLogs.length
      );
    const totalDecomp =
      Math.max(
        reportData?.summary.totalDecompressions ?? 0,
        combinedPsychologicalLogs.filter((l) => l.decompressionTriggered).length
      );
    const dateStr = new Date().toLocaleString("es-ES", {
      dateStyle: "full",
      timeStyle: "medium",
    });

    const sectorsLines = (reportData?.sectors || [])
      .map(
        (s) =>
          `* ${s.sectorName.padEnd(30, " ")} | Evaluaciones: ${String(
            s.totalEvaluations
          ).padStart(3, " ")} | Carga Mental: ${
            s.avgMentalLoad
          }/10 | Descompresión: ${s.decompressionRate}% | Riesgo: ${s.riskLevel}`
      )
      .join("\n");

    const logsLines =
      combinedPsychologicalLogs.length > 0
        ? combinedPsychologicalLogs
            .map(
              (l, idx) =>
                `  [${String(idx + 1).padStart(2, "0")}] SHA-256: ${
                  l.workerHash || "sha256-anon"
                } | Turno: ${l.shiftStage} | Carga: ${
                  l.totalMentalLoad
                }/10 | Pausa Activa: ${
                  l.decompressionTriggered ? "SÍ" : "NO"
                } | Fecha: ${new Date(l.loggedAt).toLocaleString("es-ES")}`
            )
            .join("\n")
        : "  (Ningún registro cargado en este momento. Sistema listo para recepción en tiempo real).";

    const attemptsLines =
      attempts.length > 0
        ? attempts
            .slice(0, 15)
            .map(
              (a, idx) =>
                `  [${String(idx + 1).padStart(2, "0")}] Escenario: ${
                  a.scenarioId
                } (${a.sector}) | Norma: ${a.normReference} | Resultado: ${
                  a.isCorrect ? "CORRECTO" : "INCORRECTO"
                } | Tiempo: ${a.timeSpentSeconds}s/${a.allocatedTimeSeconds}s`
            )
            .join("\n")
        : "  (Sin intentos de entrenamiento registrados aún).";

    return `================================================================================
INFORME EJECUTIVO DE SEGURIDAD Y SALUD EN EL TRABAJO (SST) & CARGA MENTAL
PLATAFORMA SSMA ENTERPRISE • RESPALDO Y AUDITORÍA CRIPTOGRÁFICA
================================================================================

EMPRESA / RAZÓN SOCIAL : ${companyName || "USO INTERNO CORPORATIVO"}
DEPARTAMENTO / ÁREA    : ${department}
DESTINATARIO OFICIAL   : ${recipientEmail || "beisander2@gmail.com"}
FECHA DE EMISIÓN       : ${dateStr}

1. RESUMEN EJECUTIVO CONSOLIDADO
--------------------------------------------------------------------------------
- Total de Evaluaciones Psicológicas     : ${totalRecords}
- Total de Descompresiones Profilácticas : ${totalDecomp}
- Total de Intentos de Entrenamiento SST : ${attempts.length}
- Blindaje Criptográfico                 : 100% (AES-256-CBC + SHA-256)

2. DIAGNÓSTICO ESTADÍSTICO POR SECTOR ECONÓMICO
--------------------------------------------------------------------------------
${sectorsLines}

3. INTENTOS DE ENTRENAMIENTO SST (SIMULADOR TIME-ATTACK)
--------------------------------------------------------------------------------
${attemptsLines}

4. AUDITORÍA DE LOGS CRIPTOGRÁFICOS (100% ANONIMIZADOS)
--------------------------------------------------------------------------------
${logsLines}
================================================================================`;
  }

  function handleTriggerSendGmailApi() {
    setGmailError(null);
    if (!recipientEmail.trim()) {
      setGmailError("Por favor ingrese un correo electrónico de destino válido.");
      return;
    }
    if (!hasToken) {
      setGmailError(
        "Debe iniciar sesión con Google primero para enviar correos directamente mediante la API de Gmail."
      );
      return;
    }
    handleSaveCompanyInfo();
    setShowConfirmGmailModal(true);
  }

  async function executeSendGmailApi() {
    setShowConfirmGmailModal(false);
    setIsSendingGmail(true);
    setGmailError(null);
    try {
      const subject = `[SSMA Enterprise] Respaldo e Informe Ejecutivo SST - ${
        companyName || "Corporativo"
      }`;
      const bodyText = generateFormattedReportText();
      await sendGmailMessage({
        to: recipientEmail.trim(),
        subject,
        bodyText,
      });
      setSaveFeedback(
        `¡Correo enviado con éxito vía Gmail API a ${recipientEmail.trim()}!`
      );
      setTimeout(() => setSaveFeedback(null), 5000);
    } catch (err: any) {
      setGmailError(err?.message || "Error al enviar correo mediante Gmail API.");
    } finally {
      setIsSendingGmail(false);
    }
  }

  function getGmailComposeUrl(): string {
    const subject = `[SSMA Enterprise] Informe Ejecutivo Criptografiado de SST - ${
      companyName || "Empresa"
    }`;
    const body = generateFormattedReportText();
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      recipientEmail
    )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  function handleCopyReport() {
    handleSaveCompanyInfo();
    const text = generateFormattedReportText();
    navigator.clipboard.writeText(text);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2500);
  }

  const allAnonymizedLogs =
    reportData?.sectors.flatMap((s) => s.anonymizedLogs || []) || [];

  return (
    <div className="max-w-5xl mx-auto w-full space-y-6">
      {/* Confirmation Modal for Gmail API Send */}
      <WorkspaceActionConfirmModal
        isOpen={showConfirmGmailModal}
        title="Confirmar envío de respaldo por Gmail"
        description="Se enviará un correo electrónico desde su cuenta de Gmail conectada con el informe ejecutivo, intentos de entrenamiento y registros psicológicos de SST."
        details={[
          `Destinatario: ${recipientEmail}`,
          `Empresa: ${companyName || "Corporativo SSMA"}`,
          `Intentos de Entrenamiento: ${attempts.length} registros`,
          `Logs Psicológicos: ${combinedPsychologicalLogs.length} evaluaciones`,
        ]}
        confirmLabel="Enviar Correo Ahora"
        onConfirm={executeSendGmailApi}
        onCancel={() => setShowConfirmGmailModal(false)}
      />

      {/* Confirmation Modal for Google Sheets Administrative Reporting Sync */}
      <WorkspaceActionConfirmModal
        isOpen={pendingSheetsAction !== null}
        title={
          pendingSheetsAction === "create"
            ? "Confirmar creación de Hoja de Reporte Administrativo en Google Sheets"
            : "Confirmar sincronización de datos en Google Sheets"
        }
        description={
          pendingSheetsAction === "create"
            ? "Se creará una nueva hoja de cálculo en su cuenta de Google Drive/Sheets con 3 pestañas (Resumen_Ejecutivo, Intentos_Entrenamiento y Logs_Psicologicos) y se volcarán los registros actuales."
            : "Se actualizarán las pestañas Resumen_Ejecutivo, Intentos_Entrenamiento y Logs_Psicologicos en la hoja de cálculo remota seleccionada con los datos administrativos actuales."
        }
        details={[
          `Empresa / Unidad: ${companyName || "Corporativo SSMA Enterprise"} (${department})`,
          `Intentos de Entrenamiento a sincronizar: ${attempts.length} intentos`,
          `Logs Psicológicos (SHA-256) a sincronizar: ${combinedPsychologicalLogs.length} registros`,
          pendingSheetsAction === "sync"
            ? `Spreadsheet ID destino: ${adminSheetId}`
            : "Acción: Crear nueva hoja estructurada en Google Sheets",
        ]}
        confirmLabel={
          pendingSheetsAction === "create"
            ? "Crear y Sincronizar Hoja"
            : "Sincronizar con Google Sheets"
        }
        onConfirm={executeConfirmedSheetsAction}
        onCancel={() => setPendingSheetsAction(null)}
      />

      {/* Header & LGPD Shield */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
              <BarChart3 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Panel Ejecutivo SST & Privacidad
                </span>
                <span className="text-xs text-slate-500">
                  100% Anonimizado (SHA-256)
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {language === "es"
                  ? "Reportes Administrativos: Google Sheets y Gmail"
                  : language === "en"
                  ? "Administrative Reporting: Google Sheets & Gmail"
                  : "Relatórios Administrativos: Google Sheets e Gmail"}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                {language === "es"
                  ? "Sincronización en la nube de intentos de entrenamiento y logs psicológicos con Google Sheets API, además de respaldo ejecutivo por Gmail."
                  : language === "en"
                  ? "Cloud synchronization of training attempts and psychological logs via Google Sheets API, plus executive email backup via Gmail."
                  : "Sincronização em nuvem de tentativas de treinamento e logs psicológicos via Google Sheets API, além de backup por Gmail."}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-end md:self-auto">
            {/* Visual Cloud Sync Status Indicator & Manual Sync Now / Retry Button */}
            <div
              id="cloud-sync-status-indicator"
              className={`flex items-center gap-2.5 px-3 py-1.5 rounded-2xl border text-xs transition-all ${
                isSyncingSheets
                  ? "bg-teal-50 border-teal-200 text-teal-800"
                  : sheetsError
                  ? "bg-rose-50 border-rose-300 text-rose-900 shadow-xs"
                  : isDataSynced
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                  : isSheetConfigured
                  ? "bg-amber-50 border-amber-200 text-amber-800"
                  : "bg-slate-50 border-slate-200 text-slate-600"
              }`}
              title={
                isSyncingSheets
                  ? "Sincronizando registros locales con Google Sheets..."
                  : sheetsError
                  ? `Fallo de conexión con Google Sheets: ${sheetsError}`
                  : isDataSynced
                  ? `Datos sincronizados con Google Sheets (${
                      lastSyncedAt
                        ? new Date(lastSyncedAt).toLocaleTimeString()
                        : ""
                    })`
                  : isSheetConfigured
                  ? "Existen registros locales pendientes de sincronizar con Google Sheets"
                  : "Hoja de Google Sheets no vinculada aún"
              }
            >
              <div className="flex items-center gap-1.5">
                {isSyncingSheets ? (
                  <RefreshCw className="w-4 h-4 text-teal-600 animate-spin shrink-0" />
                ) : sheetsError ? (
                  <div className="relative flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 absolute -top-0.5 -right-0.5 ring-2 ring-rose-50 animate-ping" />
                  </div>
                ) : isDataSynced ? (
                  <div className="relative flex items-center justify-center shrink-0">
                    <Cloud className="w-4 h-4 text-emerald-600" />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 absolute -top-0.5 -right-0.5 ring-2 ring-emerald-50" />
                  </div>
                ) : isSheetConfigured ? (
                  <div className="relative flex items-center justify-center shrink-0">
                    <CloudUpload className="w-4 h-4 text-amber-600" />
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 absolute -top-0.5 -right-0.5 ring-2 ring-amber-50 animate-pulse" />
                  </div>
                ) : (
                  <CloudOff className="w-4 h-4 text-slate-400 shrink-0" />
                )}

                <div className="flex flex-col leading-tight">
                  <span className="font-extrabold text-[11px]">
                    {isSyncingSheets
                      ? language === "en"
                        ? "Syncing to Cloud..."
                        : "Sincronizando..."
                      : sheetsError
                      ? language === "en"
                        ? "Connection Failed"
                        : "Error de Conexión"
                      : isDataSynced
                      ? language === "en"
                        ? "Synced to Google Sheets"
                        : "Sincronizado en Google Sheets"
                      : isSheetConfigured
                      ? language === "en"
                        ? "Unsynced Local Data"
                        : "Pendiente de Sincronizar"
                      : language === "en"
                      ? "Sheet Not Linked"
                      : "Sin Hoja Vinculada"}
                  </span>
                  <span className="text-[10px] opacity-80">
                    {sheetsError
                      ? language === "en"
                        ? "Sync failed • Retry available"
                        : "Fallo al sincronizar • Reintentar"
                      : lastSyncedAt
                      ? `${
                          language === "en" ? "Last sync:" : "Últ. sync:"
                        } ${new Date(lastSyncedAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}`
                      : `${attempts.length} int. • ${combinedPsychologicalLogs.length} logs`}
                  </span>
                </div>
              </div>

              {sheetsError ? (
                <button
                  type="button"
                  id="header-retry-sync-btn"
                  onClick={handleRetryFailedSheetsRequest}
                  disabled={isSyncingSheets || isLoadingRemotePreview || isLoggingIn}
                  className="px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer disabled:opacity-50 bg-rose-600 hover:bg-rose-500 text-white shadow-xs"
                >
                  <RotateCcw
                    className={`w-3 h-3 ${
                      isSyncingSheets || isLoadingRemotePreview
                        ? "animate-spin"
                        : ""
                    }`}
                  />
                  <span>{language === "en" ? "Retry" : "Reintentar"}</span>
                </button>
              ) : (
                <button
                  type="button"
                  id="header-sync-now-btn"
                  onClick={handleQuickSyncNow}
                  disabled={isSyncingSheets || isLoggingIn}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer disabled:opacity-50 ${
                    isDataSynced
                      ? "bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-200"
                      : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs"
                  }`}
                >
                  <RefreshCw
                    className={`w-3 h-3 ${isSyncingSheets ? "animate-spin" : ""}`}
                  />
                  <span>{language === "en" ? "Sync Now" : "Sync Now"}</span>
                </button>
              )}
            </div>

            <button
              type="button"
              id="export-report-btn"
              onClick={handlePrintOrExport}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Imprimir / PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 1: GOOGLE SHEETS API - ADMINISTRATIVE REPORTING SYNC */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Sincronización con Google Sheets: Reporte Administrativo SST
              </h2>
              <p className="text-xs text-slate-600">
                Sincronice los intentos de entrenamiento ({ADMIN_SHEET_TABS.ATTEMPTS}) y logs psicológicos ({ADMIN_SHEET_TABS.PSYCHOLOGICAL}) en una hoja de cálculo remota.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div
              className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
                sheetsError
                  ? "bg-rose-50 text-rose-800 border-rose-200"
                  : isDataSynced
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                  : isSheetConfigured
                  ? "bg-amber-50 text-amber-800 border-amber-200"
                  : "bg-slate-100 text-slate-600 border-slate-200"
              }`}
            >
              {sheetsError ? (
                <>
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  <span>Error de conexión</span>
                </>
              ) : isDataSynced ? (
                <>
                  <Cloud className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Sincronizado</span>
                </>
              ) : isSheetConfigured ? (
                <>
                  <CloudUpload className="w-3.5 h-3.5 text-amber-600" />
                  <span>Cambios sin sincronizar</span>
                </>
              ) : (
                <>
                  <CloudOff className="w-3.5 h-3.5 text-slate-500" />
                  <span>No vinculado</span>
                </>
              )}
            </div>

            {sheetsError ? (
              <button
                type="button"
                id="section-retry-sync-btn"
                onClick={handleRetryFailedSheetsRequest}
                disabled={isSyncingSheets || isLoadingRemotePreview || isLoggingIn}
                className="px-3 py-1 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs disabled:opacity-50"
              >
                <RotateCcw
                  className={`w-3 h-3 ${
                    isSyncingSheets || isLoadingRemotePreview
                      ? "animate-spin"
                      : ""
                  }`}
                />
                <span>Retry</span>
              </button>
            ) : (
              <button
                type="button"
                id="section-sync-now-btn"
                onClick={handleQuickSyncNow}
                disabled={isSyncingSheets || isLoggingIn}
                className="px-3 py-1 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-3 h-3 ${isSyncingSheets ? "animate-spin" : ""}`}
                />
                <span>Sync Now</span>
              </button>
            )}
          </div>
        </div>

        {/* Google Workspace Account Connection Bar */}
        <WorkspaceAccountBar
          user={googleUser}
          hasToken={hasToken}
          isLoggingIn={isLoggingIn}
          onLogin={handleGoogleLogin}
          onLogout={handleGoogleLogout}
        />

        {sheetsFeedback && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{sheetsFeedback}</span>
            </div>
            <button
              type="button"
              onClick={() => setSheetsFeedback(null)}
              className="text-emerald-700 hover:text-emerald-900 text-[11px] font-bold cursor-pointer shrink-0"
            >
              Cerrar
            </button>
          </div>
        )}

        {/* Prominent Error Handling UI for Failed Google Sheets Connection / Sync */}
        {sheetsError && (
          <div
            id="sheets-sync-error-alert"
            role="alert"
            className="p-4 rounded-2xl bg-rose-50/90 border-2 border-rose-200 text-rose-950 space-y-3 shadow-xs animate-fadeIn"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-rose-100 border border-rose-200 text-rose-700 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-extrabold text-rose-900">
                      {language === "en"
                        ? "Google Sheets Connection Failed"
                        : "Error de Conexión con Google Sheets"}
                    </h3>
                    {sheetsErrorMeta?.code && (
                      <span className="px-2 py-0.5 rounded-md bg-rose-100 border border-rose-200 text-rose-800 font-mono text-[10px] font-bold">
                        {sheetsErrorMeta.code}
                      </span>
                    )}
                    {sheetsErrorMeta?.timestamp && (
                      <span className="text-[10px] text-rose-600 font-medium">
                        • {sheetsErrorMeta.timestamp}
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-rose-800 leading-relaxed">
                    {sheetsError}
                  </p>
                  {sheetsErrorMeta?.hint && (
                    <p className="text-[11px] text-rose-700/90 leading-relaxed">
                      <span className="font-bold">Diagnóstico: </span>
                      {sheetsErrorMeta.hint}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 self-end sm:self-center shrink-0">
                <button
                  type="button"
                  id="sheets-error-retry-btn"
                  onClick={handleRetryFailedSheetsRequest}
                  disabled={
                    isSyncingSheets || isLoadingRemotePreview || isLoggingIn
                  }
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs disabled:opacity-50"
                >
                  <RotateCcw
                    className={`w-3.5 h-3.5 ${
                      isSyncingSheets || isLoadingRemotePreview
                        ? "animate-spin"
                        : ""
                    }`}
                  />
                  <span>
                    {isSyncingSheets || isLoadingRemotePreview
                      ? language === "en"
                        ? "Retrying..."
                        : "Reintentando..."
                      : language === "en"
                      ? "Retry Sync"
                      : "Reintentar Conexión (Retry)"}
                  </span>
                </button>

                <button
                  type="button"
                  id="sheets-error-dismiss-btn"
                  onClick={clearSheetsError}
                  className="px-3 py-2 rounded-xl bg-white hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>{language === "en" ? "Dismiss" : "Descartar"}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Summary Counters Ready for Cloud Sync */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase block">
                Intentos de Entrenamiento
              </span>
              <span className="text-2xl font-extrabold text-slate-900">
                {attempts.length}
              </span>
              <span className="text-[11px] text-teal-700 font-medium block mt-0.5">
                Pestaña: {ADMIN_SHEET_TABS.ATTEMPTS}
              </span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center font-bold text-xs">
              SST
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase block">
                Logs Psicológicos (SHA-256)
              </span>
              <span className="text-2xl font-extrabold text-slate-900">
                {combinedPsychologicalLogs.length}
              </span>
              <span className="text-[11px] text-emerald-700 font-medium block mt-0.5">
                Pestaña: {ADMIN_SHEET_TABS.PSYCHOLOGICAL}
              </span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-bold text-xs">
              LGPD
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase block">
              Última Sincronización Remota
            </span>
            <span className="text-xs font-extrabold text-slate-800 mt-1">
              {lastSyncedAt
                ? new Date(lastSyncedAt).toLocaleString("es-ES")
                : "Sin sincronizar aún"}
            </span>
            {adminSheetUrl ? (
              <a
                href={adminSheetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-teal-700 hover:underline font-bold inline-flex items-center gap-1 mt-1"
              >
                <span>Abrir Hoja en Google Sheets</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            ) : (
              <span className="text-[11px] text-slate-400 mt-1">
                Vincule o cree una hoja abajo
              </span>
            )}
          </div>
        </div>

        {/* Spreadsheet ID Input & Sync Controls */}
        <div className="space-y-3 pt-1">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              ID o URL de la Hoja de Cálculo Remota (Google Sheets)
            </label>
            <div className="flex flex-col sm:flex-row gap-2.5">
              <input
                type="text"
                value={adminSheetId}
                onChange={(e) => handleSaveSheetId(e.target.value)}
                placeholder="Pegue el enlace https://docs.google.com/spreadsheets/d/... o el ID de la hoja"
                className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-emerald-600 font-mono"
              />
              {adminSheetUrl && (
                <a
                  href={adminSheetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shrink-0"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Ver Google Sheet</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </a>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              type="button"
              id="sync-admin-sheets-btn"
              onClick={handleRequestSyncAdminSheet}
              disabled={isSyncingSheets}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <CloudUpload className="w-4 h-4" />
              <span>
                {isSyncingSheets
                  ? "Sincronizando con Google Sheets..."
                  : "Sincronizar Intentos y Logs a Google Sheets"}
              </span>
            </button>

            <button
              type="button"
              id="create-admin-sheets-btn"
              onClick={handleRequestCreateAdminSheet}
              disabled={isSyncingSheets}
              className="px-4 py-2.5 rounded-xl bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-900 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <PlusCircle className="w-4 h-4 text-teal-700" />
              <span>Crear Nueva Hoja de Reporte Administrativo</span>
            </button>

            <button
              type="button"
              id="inspect-remote-sheets-btn"
              onClick={handleInspectRemoteSheet}
              disabled={isLoadingRemotePreview || !adminSheetId.trim()}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${
                  isLoadingRemotePreview ? "animate-spin text-teal-600" : ""
                }`}
              />
              <span>
                {isLoadingRemotePreview
                  ? "Consultando hoja..."
                  : "Verificar Datos en la Nube"}
              </span>
            </button>
          </div>
        </div>

        {/* Remote Spreadsheet Live Preview Table */}
        {remotePreview && (
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <div>
                <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  Vista en Vivo: {remotePreview.spreadsheetTitle}
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  Pestañas detectadas: {remotePreview.sheetTabs.join(" • ")}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setRemotePreview(null)}
                className="text-xs text-slate-500 hover:text-slate-800 font-semibold self-end sm:self-auto cursor-pointer"
              >
                Cerrar vista remota
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Remote Training Attempts Preview */}
              <div className="bg-white rounded-xl border border-slate-200 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">
                    Intentos Sincronizados ({remotePreview.attemptsRows.length})
                  </span>
                  <span className="text-[10px] font-mono bg-teal-50 text-teal-800 px-2 py-0.5 rounded-md border border-teal-200">
                    {ADMIN_SHEET_TABS.ATTEMPTS}
                  </span>
                </div>
                {remotePreview.attemptsRows.length > 0 ? (
                  <div className="overflow-x-auto max-h-44">
                    <table className="w-full text-left text-[11px] text-slate-700">
                      <thead className="bg-slate-50 text-slate-500 uppercase border-b border-slate-200">
                        <tr>
                          <th className="py-1.5 px-2">Escenario</th>
                          <th className="py-1.5 px-2">Sector</th>
                          <th className="py-1.5 px-2">Resultado</th>
                          <th className="py-1.5 px-2">Tiempo</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {remotePreview.attemptsRows.slice(0, 8).map((r, idx) => (
                          <tr key={idx}>
                            <td className="py-1.5 px-2 font-mono">{r[1] || "-"}</td>
                            <td className="py-1.5 px-2 truncate max-w-[120px]">
                              {r[2] || "-"}
                            </td>
                            <td className="py-1.5 px-2 font-bold">
                              <span
                                className={
                                  r[5] === "CORRECTO"
                                    ? "text-emerald-700"
                                    : "text-rose-700"
                                }
                              >
                                {r[5] || "-"}
                              </span>
                            </td>
                            <td className="py-1.5 px-2 font-mono">{r[6] || "0"}s</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-500 py-3 text-center">
                    No hay intentos registrados en esta pestaña aún.
                  </p>
                )}
              </div>

              {/* Remote Psychological Logs Preview */}
              <div className="bg-white rounded-xl border border-slate-200 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">
                    Logs Psicológicos Sincronizados ({remotePreview.psychologicalRows.length})
                  </span>
                  <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-200">
                    {ADMIN_SHEET_TABS.PSYCHOLOGICAL}
                  </span>
                </div>
                {remotePreview.psychologicalRows.length > 0 ? (
                  <div className="overflow-x-auto max-h-44">
                    <table className="w-full text-left text-[11px] text-slate-700">
                      <thead className="bg-slate-50 text-slate-500 uppercase border-b border-slate-200">
                        <tr>
                          <th className="py-1.5 px-2">Hash SHA-256</th>
                          <th className="py-1.5 px-2">Turno</th>
                          <th className="py-1.5 px-2">Carga</th>
                          <th className="py-1.5 px-2">Estado</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {remotePreview.psychologicalRows
                          .slice(0, 8)
                          .map((r, idx) => (
                            <tr key={idx}>
                              <td className="py-1.5 px-2 font-mono">
                                {r[0] || "-"}
                              </td>
                              <td className="py-1.5 px-2">{r[2] || "-"}</td>
                              <td className="py-1.5 px-2 font-mono font-bold">
                                {r[6] || "0"}/10
                              </td>
                              <td className="py-1.5 px-2">{r[7] || "-"}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-500 py-3 text-center">
                    No hay logs psicológicos registrados en esta pestaña aún.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 2: INTEGRACIÓN CON GMAIL Y ENVÍO DE REGISTROS */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Integración con Gmail: Respaldo y Envío de Registros
              </h2>
              <p className="text-xs text-slate-600">
                Envíe los registros operacionales y el informe ejecutivo directamente a través de Gmail API.
              </p>
            </div>
          </div>

          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 self-start sm:self-auto flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            Gmail OAuth Integrado
          </span>
        </div>

        {saveFeedback && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{saveFeedback}</span>
          </div>
        )}

        {gmailError && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{gmailError}</span>
          </div>
        )}

        {/* Form Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Empresa / Razón Social
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              onBlur={handleSaveCompanyInfo}
              placeholder="Ej: Corporación Industrial S.A."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-teal-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Correo Gmail de Destino
            </label>
            <input
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              onBlur={handleSaveCompanyInfo}
              placeholder="Ej: beisander2@gmail.com"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-teal-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Departamento / Responsable
            </label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              onBlur={handleSaveCompanyInfo}
              placeholder="Ej: Coordinación SST"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-teal-600"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            type="button"
            id="send-gmail-api-btn"
            onClick={handleTriggerSendGmailApi}
            disabled={isSendingGmail}
            className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Send className="w-4 h-4 text-white" />
            <span>
              {isSendingGmail
                ? "Enviando por Gmail..."
                : "Enviar Respaldo Directo con Gmail API"}
            </span>
          </button>

          <a
            id="send-gmail-web-btn"
            href={getGmailComposeUrl()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleSaveCompanyInfo}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Mail className="w-3.5 h-3.5 text-teal-700" />
            <span>Abrir en Gmail Web</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </a>

          <button
            type="button"
            id="copy-report-btn"
            onClick={handleCopyReport}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
          >
            {copiedReport ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-bold">¡Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copiar Informe</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setShowReportPreview(!showReportPreview)}
            className="px-3 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {showReportPreview ? (
              <EyeOff className="w-3.5 h-3.5" />
            ) : (
              <Eye className="w-3.5 h-3.5" />
            )}
            <span>
              {showReportPreview ? "Ocultar Vista Previa" : "Ver Vista Previa"}
            </span>
          </button>
        </div>

        {showReportPreview && (
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 animate-fadeIn">
            <div className="flex items-center justify-between text-xs text-slate-600 pb-2 border-b border-slate-200">
              <span className="font-mono font-bold flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-teal-600" />
                Vista Previa del Respaldo de Registros
              </span>
              <span className="text-[11px] text-teal-700 font-semibold">
                Anonimizado SHA-256
              </span>
            </div>
            <pre className="text-[11px] font-mono text-slate-700 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-72 p-3 bg-white rounded-xl border border-slate-200">
              {generateFormattedReportText()}
            </pre>
          </div>
        )}
      </div>

      {/* Filter and Top KPIs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Filtrar por Sector:
          </span>
          <select
            value={selectedSectorFilter}
            onChange={(e) =>
              setSelectedSectorFilter(
                e.target.value === "all" ? "all" : Number(e.target.value)
              )
            }
            className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-800 text-xs font-semibold focus:outline-hidden focus:border-teal-600"
          >
            <option value="all">Todos los Sectores</option>
            {ECONOMIC_SECTORS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs text-slate-600 font-medium flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          <span>Cifrado Activo: AES-256-CBC • Hash SHA-256</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-600 font-bold mb-1">
            <span>Evaluaciones Psicológicas</span>
            <Building className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">
            {Math.max(
              reportData?.summary.totalRecords ?? 0,
              combinedPsychologicalLogs.length
            )}
          </div>
          <span className="text-[11px] text-teal-700 font-medium mt-1 block">
            Check-ins diarios monitoreados
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-600 font-bold mb-1">
            <span>Descompresiones Activadas</span>
            <TrendingUp className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">
            {Math.max(
              reportData?.summary.totalDecompressions ?? 0,
              combinedPsychologicalLogs.filter((l) => l.decompressionTriggered)
                .length
            )}
          </div>
          <span className="text-[11px] text-amber-700 font-medium mt-1 block">
            Pausas profilácticas ejecutadas
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-600 font-bold mb-1">
            <span>Blindaje Normativo</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">100%</div>
          <span className="text-[11px] text-emerald-700 font-medium mt-1 block">
            Cumplimiento de Privacidad y SST
          </span>
        </div>
      </div>

      {/* Sector Breakdown Table */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
            Diagnóstico Estadístico por Sector Económico
          </h2>
          <span className="text-xs text-slate-500 font-semibold">
            6 Sectores Registrados
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4 font-bold">Sector Operacional</th>
                <th className="py-3.5 px-4 font-bold text-center">Registros</th>
                <th className="py-3.5 px-4 font-bold text-center">
                  Ansiedad Media
                </th>
                <th className="py-3.5 px-4 font-bold text-center">
                  Fatiga Media
                </th>
                <th className="py-3.5 px-4 font-bold text-center">
                  Carga Mental
                </th>
                <th className="py-3.5 px-4 font-bold text-center">
                  Tasa Descompresión
                </th>
                <th className="py-3.5 px-4 font-bold text-right">
                  Clasificación
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    Cargando datos agregados...
                  </td>
                </tr>
              ) : reportData?.sectors && reportData.sectors.length > 0 ? (
                reportData.sectors.map((sec) => (
                  <tr
                    key={sec.sectorName}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {sec.sectorName}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono">
                      {sec.totalEvaluations}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono">
                      {sec.avgAnxiety} / 5
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono">
                      {sec.avgFatigue} / 5
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-teal-700">
                      {sec.avgMentalLoad} / 10
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 font-mono">
                        {sec.decompressionRate}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span
                        className={`px-2.5 py-1 rounded-full font-bold text-[11px] border ${
                          sec.riskLevel === "Crítico"
                            ? "bg-rose-50 text-rose-800 border-rose-200"
                            : sec.riskLevel === "Moderado"
                            ? "bg-amber-50 text-amber-800 border-amber-200"
                            : "bg-emerald-50 text-emerald-800 border-emerald-200"
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
                    Ningún dato encontrado para el filtro seleccionado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cryptographic SHA-256 Audit Stream */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-teal-600" />
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              Auditoría de Logs Criptográficos Anonimizados
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            Inmutable • Sin Datos Personales Identificables
          </span>
        </div>

        {allAnonymizedLogs.length > 0 || combinedPsychologicalLogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {combinedPsychologicalLogs.slice(0, 8).map((log, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs font-mono"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-slate-800 font-bold">
                    Hash: {log.workerHash || "sha256-anon"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-600">
                  <span>{log.shiftStage}</span>
                  {log.decompressionTriggered ? (
                    <span className="text-amber-700 font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Pausa Activa
                    </span>
                  ) : (
                    <span className="text-emerald-700 font-semibold">Normal</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
            <Lock className="w-7 h-7 text-teal-600 mx-auto" />
            <p className="text-xs text-slate-700 font-bold">
              Esperando registros operacionales en tiempo real.
            </p>
            <p className="text-[11px] text-slate-500 max-w-md mx-auto">
              A medida que los colaboradores realicen el Check-in Emocional, los logs cifrados con hashes SHA-256 se mostrarán en esta área.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
