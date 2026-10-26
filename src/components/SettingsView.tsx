import React, { useState, useEffect, useRef } from "react";
import {
  Globe,
  Lock,
  KeyRound,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Eye,
  EyeOff,
  Trash2,
  Download,
  Upload,
  Info,
  Sliders,
  Check,
  Languages,
  Smartphone,
  FileCode,
  Award,
  RefreshCw,
  Code2,
  Image as ImageIcon,
  Database,
  Mail,
  Send,
  Calendar,
  ExternalLink,
  BellRing,
  HardHat,
  ArchiveRestore,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";
import { User } from "firebase/auth";
import { useLanguage } from "../i18n/LanguageContext";
import { SupportedLanguage } from "../i18n/translations";
import { NotificationReminderSettings } from "./NotificationReminderSettings";
import { NotificationReminderConfig } from "../hooks/useNotificationReminder";
import {
  ThemePreference,
  ResolvedTheme,
} from "../hooks/useThemeMode";
import { PsychologicalLog, TrainingAttempt } from "../types";
import {
  initAuth,
  googleSignIn,
  logoutGoogle,
  sendGmailMessage,
  createCloudLicenseSpreadsheet,
  fetchCloudLicensesFromSheet,
  syncLicenseRecordToSheet,
  generateDynamicExchangeKey,
  getTodayLocalISO,
  CloudLicenseRecord,
} from "../services/googleWorkspace";
import {
  WorkspaceAccountBar,
  WorkspaceActionConfirmModal,
} from "./GoogleWorkspaceAuthBar";

interface Props {
  currentPassword: string;
  onUpdatePassword: (newPass: string) => void;
  onResetPassword: () => void;
  isPasswordRequired: boolean;
  onTogglePasswordRequired: (required: boolean) => void;
  onLockSessionNow: () => void;
  motionEnabled: boolean;
  onToggleMotion: (enabled: boolean) => void;
  onClearHistory: () => void;
  totalAttempts: number;
  attempts: TrainingAttempt[];
  userLog: PsychologicalLog | null;
  onRestoreLocalData: (data: {
    attempts?: TrainingAttempt[];
    userLog?: PsychologicalLog | null;
  }) => void;
  customLogo: string | null;
  onUpdateCustomLogo: (logoDataUrl: string | null) => void;
  licenseExpirationDate: string;
  onUpdateLicenseExpirationDate: (dateStr: string) => void;
  licenseKey: string;
  onUpdateLicenseKey: (key: string) => void;
  dynamicKey: string;
  onUpdateDynamicKey: (key: string) => void;
  onTriggerExpirationPopupNow: () => void;
  initialSubTab?: "general" | "developer";
  themePreference?: ThemePreference;
  resolvedTheme?: ResolvedTheme;
  systemTheme?: ResolvedTheme;
  onChangeThemePreference?: (pref: ThemePreference) => void;
  notificationReminder?: {
    isSupported: boolean;
    permission: NotificationPermission;
    config: NotificationReminderConfig;
    onUpdateConfig: (partial: Partial<NotificationReminderConfig>) => void;
    onRequestPermission: () => Promise<boolean>;
    onSendTestNotification: () => void;
  };
}

export function SettingsView({
  currentPassword,
  onUpdatePassword,
  onResetPassword,
  isPasswordRequired,
  onTogglePasswordRequired,
  onLockSessionNow,
  motionEnabled,
  onToggleMotion,
  onClearHistory,
  totalAttempts,
  attempts,
  userLog,
  onRestoreLocalData,
  customLogo,
  onUpdateCustomLogo,
  licenseExpirationDate,
  onUpdateLicenseExpirationDate,
  licenseKey,
  onUpdateLicenseKey,
  dynamicKey,
  onUpdateDynamicKey,
  onTriggerExpirationPopupNow,
  initialSubTab = "general",
  themePreference = "light",
  resolvedTheme = "light",
  systemTheme = "light",
  onChangeThemePreference,
  notificationReminder,
}: Props) {
  const { language, setLanguage, t, languages } = useLanguage();
  const [activeSubTab, setActiveSubTab] = useState<"general" | "developer">(
    initialSubTab
  );

  useEffect(() => {
    setActiveSubTab(initialSubTab);
  }, [initialSubTab]);

  // Password Change Form State
  const [oldPasswordInput, setOldPasswordInput] = useState("");
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [confirmPasswordInput, setConfirmPasswordInput] = useState("");
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // Status Banners
  const [passError, setPassError] = useState<string | null>(null);
  const [passSuccess, setPassSuccess] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState<string | null>(null);
  const [dataNotice, setDataNotice] = useState<string | null>(null);
  const [dataError, setDataError] = useState<string | null>(null);
  const [isConfirmingReset, setIsConfirmingReset] = useState(false);
  const [isConfirmingClearHistory, setIsConfirmingClearHistory] = useState(false);

  const [apkMasterKeyInput, setApkMasterKeyInput] = useState("");
  const [showApkKey, setShowApkKey] = useState(false);
  const [isApkUnlocked, setIsApkUnlocked] = useState(false);
  const [apkKeyError, setApkKeyError] = useState<string | null>(null);
  const [apkKeySuccess, setApkKeySuccess] = useState<string | null>(null);

  // Enterprise SaaS License & Developer Mode State
  const [clientName, setClientName] = useState<string>(() => {
    return localStorage.getItem("ssma_company_name") || "Corporativo SSMA Enterprise";
  });
  const [licensePlan, setLicensePlan] = useState<string>(() => {
    return (
      localStorage.getItem("ssma_enterprise_plan") ||
      "SSMA Enterprise Multi-Setor SaaS (2026)"
    );
  });
  const [licenseStatus, setLicenseStatus] = useState<
    "ACTIVA" | "SUSPENDIDA" | "VENCIDA"
  >(() => {
    return (
      (localStorage.getItem("ssma_license_status") as
        | "ACTIVA"
        | "SUSPENDIDA"
        | "VENCIDA") || "ACTIVA"
    );
  });
  const [developerContact, setDeveloperContact] = useState<string>(() => {
    return localStorage.getItem("ssma_developer_contact") || "beisander2@gmail.com";
  });
  const [devFeedback, setDevFeedback] = useState<string | null>(null);
  const [devError, setDevError] = useState<string | null>(null);

  // Google Workspace Auth & Cloud Sheets State
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [hasToken, setHasToken] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [spreadsheetId, setSpreadsheetId] = useState<string>(() => {
    return localStorage.getItem("ssma_cloud_spreadsheet_id") || "";
  });
  const [spreadsheetUrl, setSpreadsheetUrl] = useState<string>(() => {
    return localStorage.getItem("ssma_cloud_spreadsheet_url") || "";
  });
  const [cloudRecords, setCloudRecords] = useState<CloudLicenseRecord[]>([]);
  const [isSyncingSheets, setIsSyncingSheets] = useState(false);

  // Gmail Backup State
  const [backupEmailTo, setBackupEmailTo] = useState<string>(() => {
    return localStorage.getItem("ssma_recipient_email") || "beisander2@gmail.com";
  });
  const [isSendingGmailBackup, setIsSendingGmailBackup] = useState(false);

  // Mandatory Confirmation Modals for Workspace Mutations
  const [showConfirmGmailBackup, setShowConfirmGmailBackup] = useState(false);
  const [showConfirmSheetSync, setShowConfirmSheetSync] = useState(false);
  const [showConfirmSheetCreate, setShowConfirmSheetCreate] = useState(false);

  const fileRestoreInputRef = useRef<HTMLInputElement | null>(null);
  const logoUploadInputRef = useRef<HTMLInputElement | null>(null);

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

  async function handleGoogleLogin() {
    setIsLoggingIn(true);
    setDataError(null);
    setDevError(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setGoogleUser(res.user);
        setHasToken(true);
      }
    } catch (err: any) {
      const msg = err?.message || "No se pudo conectar con Google Workspace.";
      setDataError(msg);
      setDevError(msg);
    } finally {
      setIsLoggingIn(false);
    }
  }

  async function handleGoogleLogout() {
    await logoutGoogle();
    setGoogleUser(null);
    setHasToken(false);
  }

  // Save local snapshot checkpoint for 1-click restoration
  function handleCreateLocalRestorePoint() {
    setDataError(null);
    const snapshot = {
      savedAt: new Date().toISOString(),
      attempts,
      userLog,
      licenseKey,
      licenseExpirationDate,
      dynamicKey,
      clientName,
      licensePlan,
    };
    localStorage.setItem("ssma_local_restore_point", JSON.stringify(snapshot));
    setDataNotice(
      "Punto de restauración local guardado correctamente en el navegador."
    );
    setTimeout(() => setDataNotice(null), 4000);
  }

  // Restore from local snapshot checkpoint
  function handleRestoreFromLocalCheckpoint() {
    setDataError(null);
    const raw = localStorage.getItem("ssma_local_restore_point");
    if (!raw) {
      setDataError(
        "No se encontró un punto de restauración local previo. Puede guardar uno ahora o importar un archivo JSON."
      );
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      onRestoreLocalData({
        attempts: Array.isArray(parsed.attempts) ? parsed.attempts : [],
        userLog: parsed.userLog || null,
      });
      if (parsed.licenseKey) onUpdateLicenseKey(parsed.licenseKey);
      if (parsed.licenseExpirationDate)
        onUpdateLicenseExpirationDate(parsed.licenseExpirationDate);
      if (parsed.dynamicKey) onUpdateDynamicKey(parsed.dynamicKey);
      setDataNotice(
        `¡Datos locales restaurados con éxito desde el punto de control (${new Date(
          parsed.savedAt
        ).toLocaleString()})!`
      );
      setTimeout(() => setDataNotice(null), 4500);
    } catch (e: any) {
      setDataError("Error al leer el punto de restauración local.");
    }
  }

  // Restore from uploaded JSON file
  function handleImportJsonFile(e: React.ChangeEvent<HTMLInputElement>) {
    setDataError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(String(event.target?.result || "{}"));
        const restoredAttempts = Array.isArray(json.attempts)
          ? json.attempts
          : [];
        const restoredLog =
          json.psychologicalLog && Object.keys(json.psychologicalLog).length > 0
            ? json.psychologicalLog
            : null;

        onRestoreLocalData({
          attempts: restoredAttempts,
          userLog: restoredLog,
        });

        if (json.licenseKey) onUpdateLicenseKey(json.licenseKey);
        if (json.licenseExpirationDate)
          onUpdateLicenseExpirationDate(json.licenseExpirationDate);
        if (json.dynamicKey) onUpdateDynamicKey(json.dynamicKey);

        setDataNotice(
          `¡Reposición completada! Se restauraron ${restoredAttempts.length} escenarios y registros locales desde "${file.name}".`
        );
        setTimeout(() => setDataNotice(null), 5000);
      } catch (err) {
        setDataError(
          "El archivo seleccionado no tiene un formato JSON de respaldo válido."
        );
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  function handleExportData() {
    const exportObj = {
      app: "SSMA Enterprise - SST & Saúde Mental",
      exportedAt: new Date().toISOString(),
      language,
      attempts,
      psychologicalLog: userLog,
      licenseKey,
      licenseExpirationDate,
      dynamicKey,
      clientName,
      licensePlan,
    };

    // Also save as local restore point automatically
    localStorage.setItem("ssma_local_restore_point", JSON.stringify(exportObj));

    const blob = new Blob([JSON.stringify(exportObj, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ssma-enterprise-backup-${getTodayLocalISO()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Send full local backup via Gmail API
  function handleRequestGmailBackup() {
    setDataError(null);
    if (!backupEmailTo.trim()) {
      setDataError("Ingrese un correo electrónico de destino para el respaldo.");
      return;
    }
    if (!hasToken) {
      setDataError(
        "Inicie sesión con Google arriba para enviar el respaldo directamente mediante Gmail."
      );
      return;
    }
    localStorage.setItem("ssma_recipient_email", backupEmailTo.trim());
    setShowConfirmGmailBackup(true);
  }

  async function executeSendGmailBackup() {
    setShowConfirmGmailBackup(false);
    setIsSendingGmailBackup(true);
    setDataError(null);
    try {
      const backupPayload = {
        app: "SSMA Enterprise",
        exportedAt: new Date().toISOString(),
        clientName,
        licenseKey,
        dynamicKey,
        licenseExpirationDate,
        totalAttempts: attempts.length,
        attempts,
        psychologicalLog: userLog,
      };

      const bodyText = [
        "====================================================================",
        "RESPALDO DE DATOS LOCALES Y REGISTROS - SSMA ENTERPRISE",
        "====================================================================",
        `Empresa / Cliente      : ${clientName}`,
        `Fecha de Respaldo      : ${new Date().toLocaleString()}`,
        `Licencia Activa        : ${licenseKey}`,
        `Llave Dinámica         : ${dynamicKey}`,
        `Fecha de Vencimiento   : ${licenseExpirationDate}`,
        `Escenarios Completados : ${attempts.length}`,
        `Último Check-in Mental : ${
          userLog ? `${userLog.totalMentalLoad}/10 (${userLog.shiftStage})` : "Sin registro"
        }`,
        "",
        "--- COPIA DE SEGURIDAD JSON (PARA REPOSICIÓN DE DATOS LOCALES) ---",
        JSON.stringify(backupPayload, null, 2),
      ].join("\n");

      await sendGmailMessage({
        to: backupEmailTo.trim(),
        subject: `[SSMA Enterprise] Respaldo de Registros y Datos Locales (${getTodayLocalISO()})`,
        bodyText,
      });

      setDataNotice(
        `¡Respaldo enviado exitosamente por Gmail a ${backupEmailTo.trim()}!`
      );
      setTimeout(() => setDataNotice(null), 5000);
    } catch (err: any) {
      setDataError(err?.message || "No se pudo enviar el respaldo por Gmail.");
    } finally {
      setIsSendingGmailBackup(false);
    }
  }

  // Logo Upload in Developer Tab
  function handleLogoFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = String(ev.target?.result || "");
      if (dataUrl) {
        onUpdateCustomLogo(dataUrl);
        setDevFeedback(
          "¡Logotipo corporativo actualizado correctamente en toda la aplicación!"
        );
        setTimeout(() => setDevFeedback(null), 4000);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  function handleRestoreDefaultLogo() {
    onUpdateCustomLogo(null);
    setDevFeedback("Se restauró el logotipo corporativo original de SSMA Enterprise.");
    setTimeout(() => setDevFeedback(null), 4000);
  }

  // Developer License & Dynamic Key Management
  function handleGenerateNewDynamicKey() {
    const newDyn = generateDynamicExchangeKey();
    onUpdateDynamicKey(newDyn);
    setDevFeedback(`Nueva llave dinámica generada: ${newDyn}`);
    setTimeout(() => setDevFeedback(null), 4000);
  }

  function handleSaveDeveloperLicenseSettings(e: React.FormEvent) {
    e.preventDefault();
    localStorage.setItem("ssma_company_name", clientName);
    localStorage.setItem("ssma_enterprise_plan", licensePlan);
    localStorage.setItem("ssma_license_status", licenseStatus);
    localStorage.setItem("ssma_developer_contact", developerContact);
    localStorage.setItem("ssma_cloud_spreadsheet_id", spreadsheetId.trim());
    setDevFeedback(
      "Configuración de licencia, fecha de expiración y llave dinámica guardada localmente."
    );
    setTimeout(() => setDevFeedback(null), 4000);
  }

  // Set expiration to today & trigger exact-day popup
  function handleSetExpirationToTodayAndTest() {
    const today = getTodayLocalISO();
    onUpdateLicenseExpirationDate(today);
    onTriggerExpirationPopupNow();
  }

  // Google Sheets Cloud Database Actions
  function handleRequestCreateCloudSheet() {
    setDevError(null);
    if (!hasToken) {
      setDevError(
        "Inicie sesión con Google primero para crear la base de datos de licencias en Google Sheets."
      );
      return;
    }
    setShowConfirmSheetCreate(true);
  }

  async function executeCreateCloudSheet() {
    setShowConfirmSheetCreate(false);
    setIsSyncingSheets(true);
    setDevError(null);
    try {
      const initialRecord: CloudLicenseRecord = {
        licenseKey,
        clientName,
        plan: licensePlan,
        expirationDate: licenseExpirationDate,
        dynamicKey,
        status: licenseStatus,
        contactDeveloper: developerContact,
        updatedAt: new Date().toISOString(),
      };
      const created = await createCloudLicenseSpreadsheet(initialRecord);
      setSpreadsheetId(created.spreadsheetId);
      setSpreadsheetUrl(created.spreadsheetUrl);
      localStorage.setItem("ssma_cloud_spreadsheet_id", created.spreadsheetId);
      localStorage.setItem("ssma_cloud_spreadsheet_url", created.spreadsheetUrl);
      setCloudRecords([initialRecord]);
      setDevFeedback(
        "¡Base de datos creada en Google Sheets (Google Drive) y sincronizada con éxito!"
      );
    } catch (err: any) {
      setDevError(err?.message || "Error al crear Google Sheet.");
    } finally {
      setIsSyncingSheets(false);
    }
  }

  function handleRequestSyncToSheet() {
    setDevError(null);
    if (!hasToken) {
      setDevError(
        "Inicie sesión con Google primero para sincronizar con Google Sheets."
      );
      return;
    }
    if (!spreadsheetId.trim()) {
      setDevError(
        "Ingrese un Spreadsheet ID o cree una nueva hoja con el botón 'Crear Hoja en Google Sheets'."
      );
      return;
    }
    setShowConfirmSheetSync(true);
  }

  async function executeSyncToSheet() {
    setShowConfirmSheetSync(false);
    setIsSyncingSheets(true);
    setDevError(null);
    try {
      const record: CloudLicenseRecord = {
        licenseKey,
        clientName,
        plan: licensePlan,
        expirationDate: licenseExpirationDate,
        dynamicKey,
        status: licenseStatus,
        contactDeveloper: developerContact,
        updatedAt: new Date().toISOString(),
      };
      await syncLicenseRecordToSheet(spreadsheetId.trim(), record);
      const updatedList = await fetchCloudLicensesFromSheet(spreadsheetId.trim());
      setCloudRecords(updatedList);
      localStorage.setItem("ssma_cloud_spreadsheet_id", spreadsheetId.trim());
      setDevFeedback(
        "¡Licencia, fecha de vencimiento y llave dinámica actualizadas en Google Sheets!"
      );
    } catch (err: any) {
      setDevError(err?.message || "Error al sincronizar con Google Sheets.");
    } finally {
      setIsSyncingSheets(false);
    }
  }

  async function handleFetchFromSheet() {
    setDevError(null);
    if (!hasToken) {
      setDevError(
        "Inicie sesión con Google primero para leer las llaves dinámicas desde Google Sheets."
      );
      return;
    }
    if (!spreadsheetId.trim()) {
      setDevError("Ingrese el ID de la hoja de Google Sheets a consultar.");
      return;
    }
    setIsSyncingSheets(true);
    try {
      const list = await fetchCloudLicensesFromSheet(spreadsheetId.trim());
      setCloudRecords(list);
      localStorage.setItem("ssma_cloud_spreadsheet_id", spreadsheetId.trim());
      // If matching license exists, sync its expirationDate & dynamicKey locally
      const matching =
        list.find((r) => r.licenseKey.trim() === licenseKey.trim()) || list[0];
      if (matching) {
        onUpdateLicenseKey(matching.licenseKey);
        onUpdateLicenseExpirationDate(matching.expirationDate);
        onUpdateDynamicKey(matching.dynamicKey);
        setClientName(matching.clientName);
        setLicensePlan(matching.plan);
        setLicenseStatus(matching.status);
      }
      setDevFeedback(
        `Se cargaron ${list.length} registro(s) de licencia desde Google Sheets.`
      );
    } catch (err: any) {
      setDevError(err?.message || "Error al consultar Google Sheets.");
    } finally {
      setIsSyncingSheets(false);
    }
  }

  function handleSavePassword(e: React.FormEvent) {
    e.preventDefault();
    setPassError(null);
    setPassSuccess(null);
    setResetSuccess(null);

    if (oldPasswordInput !== currentPassword) {
      setPassError(t("errorCurrentPasswordWrong"));
      return;
    }

    if (newPasswordInput.length < 4) {
      setPassError(t("errorPasswordTooShort"));
      return;
    }

    if (newPasswordInput !== confirmPasswordInput) {
      setPassError(t("errorPasswordMismatch"));
      return;
    }

    onUpdatePassword(newPasswordInput);
    setPassSuccess(t("passwordChangedSuccess"));
    setOldPasswordInput("");
    setNewPasswordInput("");
    setConfirmPasswordInput("");
  }

  function handleResetToDefault() {
    onResetPassword();
    setIsConfirmingReset(false);
    setPassError(null);
    setPassSuccess(null);
    setResetSuccess(t("resetSuccessMessage"));
  }

  function handleClearAllHistory() {
    onClearHistory();
    setIsConfirmingClearHistory(false);
    setDataNotice(t("clearHistorySuccess"));
  }

  function handleUnlockApk(e: React.FormEvent) {
    e.preventDefault();
    setApkKeyError(null);
    setApkKeySuccess(null);

    if (currentPassword && apkMasterKeyInput.trim() === currentPassword) {
      setIsApkUnlocked(true);
      setApkKeySuccess("Download do instalador liberado neste aparelho.");
    } else {
      setApkKeyError(t("modalWrongPassword"));
    }
  }

  function handleLockApkAgain() {
    setIsApkUnlocked(false);
    setApkMasterKeyInput("");
    setApkKeySuccess(null);
    setApkKeyError(null);
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 text-slate-900">
      {/* Mandatory Confirmation Modals for Google Workspace Operations */}
      <WorkspaceActionConfirmModal
        isOpen={showConfirmGmailBackup}
        title="Confirmar envío de respaldo por Gmail"
        description="¿Desea enviar la copia de seguridad de los registros locales y estado de licencia a través de su cuenta de Gmail?"
        details={[
          `Destinatario: ${backupEmailTo}`,
          `Escenarios entrenados: ${attempts.length}`,
          `Licencia: ${licenseKey} (Vence: ${licenseExpirationDate})`,
        ]}
        confirmLabel="Enviar por Gmail"
        onConfirm={executeSendGmailBackup}
        onCancel={() => setShowConfirmGmailBackup(false)}
      />

      <WorkspaceActionConfirmModal
        isOpen={showConfirmSheetCreate}
        title="Crear base de datos en Google Sheets"
        description="Se creará una nueva hoja de cálculo en su Google Drive para gestionar fechas de expiración e intercambio de llaves dinámicas."
        details={[
          "Título: SSMA Enterprise - Base de Datos de Licencias y Llaves Dinámicas",
          `Licencia inicial: ${licenseKey}`,
          `Llave Dinámica: ${dynamicKey}`,
          `Fecha de Expiración: ${licenseExpirationDate}`,
        ]}
        confirmLabel="Crear Hoja de Cálculo"
        onConfirm={executeCreateCloudSheet}
        onCancel={() => setShowConfirmSheetCreate(false)}
      />

      <WorkspaceActionConfirmModal
        isOpen={showConfirmSheetSync}
        title="Actualizar datos en Google Sheets"
        description="Se sobrescribirán o insertarán los datos de la licencia activa, fecha de expiración y llave dinámica en la hoja de Google Sheets vinculada."
        details={[
          `Spreadsheet ID: ${spreadsheetId}`,
          `Licencia: ${licenseKey}`,
          `Llave Dinámica: ${dynamicKey}`,
          `Fecha de Expiración: ${licenseExpirationDate}`,
        ]}
        confirmLabel="Confirmar Sincronización"
        onConfirm={executeSyncToSheet}
        onCancel={() => setShowConfirmSheetSync(false)}
      />

      {/* View Header & Sub-Tabs Switcher */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-600 to-emerald-600 flex items-center justify-center text-white shadow-md shrink-0">
              <Sliders className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  Configuración y Modo Desarrollador
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                  Acceso Protegido
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                Gestión de seguridad, reposición de datos locales, respaldo Gmail, logotipo y licencias en Google Sheets.
              </p>
            </div>
          </div>

          {isPasswordRequired && (
            <button
              type="button"
              onClick={onLockSessionNow}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold transition-all cursor-pointer self-start sm:self-auto"
            >
              <Lock className="w-4 h-4 text-amber-600" />
              <span>{t("lockNowBtn")}</span>
            </button>
          )}
        </div>

        {/* Sub-Tabs Navigation: General vs Pestaña de Desarrollador */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            id="settings-subtab-general"
            onClick={() => setActiveSubTab("general")}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === "general"
                ? "bg-teal-600 text-white shadow-xs"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            <Sliders
              className={`w-4 h-4 ${
                activeSubTab === "general" ? "text-white" : "text-teal-600"
              }`}
            />
            <span>1. Configuración, Descarga APK y Recuperación de Datos</span>
          </button>

          <button
            type="button"
            id="settings-subtab-developer"
            onClick={() => setActiveSubTab("developer")}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === "developer"
                ? "bg-teal-600 text-white shadow-xs"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            <Code2
              className={`w-4 h-4 ${
                activeSubTab === "developer" ? "text-white" : "text-teal-600"
              }`}
            />
            <span>2. Pestaña de Desarrollador (Licencias, Logo & Google Sheets)</span>
          </button>
        </div>
      </div>

      {/* =====================================================================
          SUB-TAB 2: PESTAÑA EXCLUSIVA DE MODO DESARROLLADOR
      ===================================================================== */}
      {activeSubTab === "developer" && (
        <div className="space-y-6 animate-fadeIn">
          {devFeedback && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2.5 shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{devFeedback}</span>
            </div>
          )}

          {devError && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-bold flex items-center gap-2.5 shadow-xs">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{devError}</span>
            </div>
          )}

          {/* DEV CARD 1: CARGAR Y ACTUALIZAR EL LOGOTIPO DE LA APLICACIÓN */}
          <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-slate-900">
                    Identidad Corporativa: Cargar y Actualizar Logotipo
                  </h2>
                  <p className="text-xs text-slate-600">
                    Actualice el logotipo que se muestra centrado en la Pantalla de Inicio y en el Encabezado.
                  </p>
                </div>
              </div>

              <span className="text-xs font-bold px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200 self-start sm:self-auto">
                Modo Desarrollador
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6 bg-slate-50 p-5 rounded-2xl border border-slate-200">
              {/* Current Logo Preview */}
              <div className="flex flex-col items-center gap-2 shrink-0">
                <div className="w-24 h-24 rounded-3xl bg-white border-2 border-slate-200 shadow-sm flex items-center justify-center p-2 overflow-hidden">
                  {customLogo ? (
                    <img
                      src={customLogo}
                      alt="Logotipo Actual"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-600 to-emerald-600 flex items-center justify-center text-white">
                      <HardHat className="w-9 h-9 text-white" />
                    </div>
                  )}
                </div>
                <span className="text-[11px] font-semibold text-slate-500">
                  {customLogo ? "Logotipo Personalizado" : "Logotipo Predeterminado"}
                </span>
              </div>

              {/* Upload Controls */}
              <div className="flex-1 space-y-3 text-center sm:text-left">
                <h3 className="text-sm font-bold text-slate-900">
                  Seleccione una imagen corporativa (PNG, JPG, SVG o WebP)
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  El logotipo cargado se almacena localmente y se aplica de inmediato en la Pantalla de Inicio (Splash Screen) y en la barra de navegación.
                </p>

                <input
                  ref={logoUploadInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoFileChange}
                  className="hidden"
                />

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => logoUploadInputRef.current?.click()}
                    className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-xs"
                  >
                    <Upload className="w-4 h-4 text-white" />
                    <span>Cargar Nuevo Logotipo</span>
                  </button>

                  {customLogo && (
                    <button
                      type="button"
                      onClick={handleRestoreDefaultLogo}
                      className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                      <span>Restaurar Logotipo Original</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* DEV CARD 2: GESTIÓN DE LICENCIAS, LLAVES DINÁMICAS Y NOTIFICACIÓN DE VENCIMIENTO */}
          <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-slate-900">
                    Gestión de Licencias de Activación y Llaves Dinámicas
                  </h2>
                  <p className="text-xs text-slate-600">
                    Controle la fecha exacta de expiración, el intercambio de llaves dinámicas y la alerta de vencimiento.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSetExpirationToTodayAndTest}
                className="px-3.5 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 border border-amber-300 text-amber-900 text-xs font-extrabold transition-colors cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
                title="Establece la fecha de vencimiento al día de hoy y muestra el Pop-up obligatorio"
              >
                <BellRing className="w-3.5 h-3.5 text-amber-700" />
                <span>Simular Vencimiento Hoy (Ver Pop-up)</span>
              </button>
            </div>

            <form onSubmit={handleSaveDeveloperLicenseSettings} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Clave de Licencia de Activación
                  </label>
                  <input
                    type="text"
                    value={licenseKey}
                    onChange={(e) => onUpdateLicenseKey(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:outline-hidden focus:border-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Fecha de Expiración (YYYY-MM-DD)
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={licenseExpirationDate}
                      onChange={(e) =>
                        onUpdateLicenseExpirationDate(e.target.value)
                      }
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:outline-hidden focus:border-teal-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Llave Dinámica de Intercambio
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={dynamicKey}
                      onChange={(e) => onUpdateDynamicKey(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-teal-800 focus:outline-hidden focus:border-teal-600"
                    />
                    <button
                      type="button"
                      onClick={handleGenerateNewDynamicKey}
                      className="p-2 rounded-xl bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-700 cursor-pointer shrink-0"
                      title="Generar nueva llave dinámica"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Empresa / Cliente Asignado
                  </label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Estado de Licencia
                  </label>
                  <select
                    value={licenseStatus}
                    onChange={(e) =>
                      setLicenseStatus(
                        e.target.value as "ACTIVA" | "SUSPENDIDA" | "VENCIDA"
                      )
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-hidden focus:border-teal-600"
                  >
                    <option value="ACTIVA">ACTIVA</option>
                    <option value="SUSPENDIDA">SUSPENDIDA</option>
                    <option value="VENCIDA">VENCIDA</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Contacto del Desarrollador (Pop-up)
                  </label>
                  <input
                    type="text"
                    value={developerContact}
                    onChange={(e) => setDeveloperContact(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-teal-600"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                <div className="text-xs text-slate-600 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-teal-600" />
                  <span>
                    El pop-up de alerta se activará automáticamente el día exacto:{" "}
                    <strong className="font-mono text-slate-900">
                      {licenseExpirationDate}
                    </strong>
                  </span>
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-xs"
                >
                  <Check className="w-4 h-4 text-white" />
                  <span>Guardar Parámetros de Licencia</span>
                </button>
              </div>
            </form>
          </section>

          {/* DEV CARD 3: BASE DE DATOS EN LA NUBE CON GOOGLE SHEETS (GOOGLE DRIVE) */}
          <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-slate-900">
                    Base de Datos Ligera en Google Sheets (Control de Expiración y Llaves Dinámicas)
                  </h2>
                  <p className="text-xs text-slate-600">
                    Conecte o cree una hoja de cálculo en Google Sheets para sincronizar licencias y llaves dinámicas en la nube.
                  </p>
                </div>
              </div>

              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 self-start sm:self-auto">
                Google Sheets API v4
              </span>
            </div>

            {/* Google Account Connection */}
            <WorkspaceAccountBar
              user={googleUser}
              hasToken={hasToken}
              isLoggingIn={isLoggingIn}
              onLogin={handleGoogleLogin}
              onLogout={handleGoogleLogout}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-end">
              <div className="lg:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ID de Hoja de Cálculo de Google Sheets (Spreadsheet ID)
                </label>
                <input
                  type="text"
                  value={spreadsheetId}
                  onChange={(e) => setSpreadsheetId(e.target.value)}
                  placeholder="Pegue el ID de su Google Sheet o haga clic en 'Crear Nueva Base de Datos'..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-teal-600"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRequestCreateCloudSheet}
                  disabled={isSyncingSheets}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
                >
                  <Database className="w-4 h-4 text-white" />
                  <span>Crear Nueva Hoja en Sheets</span>
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleRequestSyncToSheet}
                disabled={isSyncingSheets}
                className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-xs disabled:opacity-50"
              >
                <Upload className="w-3.5 h-3.5 text-white" />
                <span>
                  {isSyncingSheets
                    ? "Sincronizando..."
                    : "Enviar / Actualizar Licencia y Llave Dinámica en Sheets"}
                </span>
              </button>

              <button
                type="button"
                onClick={handleFetchFromSheet}
                disabled={isSyncingSheets}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 text-xs font-bold transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
              >
                <RefreshCw className="w-3.5 h-3.5 text-teal-700" />
                <span>Consultar / Intercambiar Llaves desde Sheets</span>
              </button>

              {(spreadsheetUrl || spreadsheetId) && (
                <a
                  href={
                    spreadsheetUrl ||
                    `https://docs.google.com/spreadsheets/d/${spreadsheetId}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-teal-700 text-xs font-bold flex items-center gap-1.5"
                >
                  <span>Abrir Hoja en Google Drive</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            {/* Cloud Records Table */}
            {cloudRecords.length > 0 && (
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Registros en Google Sheets ({cloudRecords.length})</span>
                  <span className="text-[11px] text-teal-700">
                    Haga clic en "Aplicar" para cargar una llave dinámica
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-100 text-[11px] uppercase text-slate-600">
                      <tr>
                        <th className="py-2.5 px-3">Licencia</th>
                        <th className="py-2.5 px-3">Cliente</th>
                        <th className="py-2.5 px-3">Vencimiento</th>
                        <th className="py-2.5 px-3">Llave Dinámica</th>
                        <th className="py-2.5 px-3">Estado</th>
                        <th className="py-2.5 px-3 text-right">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {cloudRecords.map((rec, i) => (
                        <tr key={i} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                            {rec.licenseKey}
                          </td>
                          <td className="py-2.5 px-3">{rec.clientName}</td>
                          <td className="py-2.5 px-3 font-mono font-semibold text-amber-800">
                            {rec.expirationDate}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-teal-700 font-bold">
                            {rec.dynamicKey}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                              {rec.status}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                onUpdateLicenseKey(rec.licenseKey);
                                onUpdateLicenseExpirationDate(rec.expirationDate);
                                onUpdateDynamicKey(rec.dynamicKey);
                                setClientName(rec.clientName);
                                setLicenseStatus(rec.status);
                                setDevFeedback(
                                  `Llave dinámica ${rec.dynamicKey} y fecha ${rec.expirationDate} aplicadas.`
                                );
                              }}
                              className="px-2.5 py-1 rounded-lg bg-teal-600 text-white text-[11px] font-bold hover:bg-teal-500 cursor-pointer"
                            >
                              Aplicar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>
        </div>
      )}

      {/* =====================================================================
          SUB-TAB 1: CONFIGURACIÓN GENERAL, SEGURIDAD, APK Y RECUPERACIÓN DE DATOS
      ===================================================================== */}
      {activeSubTab === "general" && (
        <div className="space-y-6 animate-fadeIn">
          {/* SECTION 0: SELECTOR DE TEMA (MODO CLARO / MODO OSCURO / PREDETERMINADO DEL SISTEMA) */}
          <section
            id="theme-preference-section"
            className="bg-white p-6 rounded-3xl border border-slate-200 space-y-5 shadow-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
                  {resolvedTheme === "dark" ? (
                    <Moon className="w-5 h-5" />
                  ) : (
                    <Sun className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-slate-900">
                    Apariencia y Tema Visual (Modo Claro / Modo Oscuro)
                  </h2>
                  <p className="text-xs text-slate-600">
                    Alterne entre fondos claros corporativos (#f8fafc / #ffffff) y oscuros (#0f172a / #1e293b) o sincronice con el sistema operativo.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200 flex items-center gap-1.5">
                  {resolvedTheme === "dark" ? (
                    <>
                      <Moon className="w-3.5 h-3.5" />
                      <span>Activo: Modo Oscuro (#0f172a)</span>
                    </>
                  ) : (
                    <>
                      <Sun className="w-3.5 h-3.5" />
                      <span>Activo: Modo Claro (#f8fafc)</span>
                    </>
                  )}
                </span>
              </div>
            </div>

            {/* Selector Desplegable + Interruptor Rápido */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="space-y-1">
                <label
                  htmlFor="theme-mode-select"
                  className="block text-xs font-extrabold text-slate-800"
                >
                  Selector Desplegable de Tema
                </label>
                <p className="text-[11px] text-slate-500">
                  La preferencia seleccionada se guarda automáticamente en el almacenamiento local (LocalStorage).
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <select
                  id="theme-mode-select"
                  value={themePreference}
                  onChange={(e) =>
                    onChangeThemePreference?.(
                      e.target.value as ThemePreference
                    )
                  }
                  className="px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs font-bold focus:outline-hidden focus:border-teal-600 cursor-pointer min-w-[270px]"
                >
                  <option value="system">
                    1. Predeterminado del Sistema (Automático)
                  </option>
                  <option value="light">2. Modo Claro (Forzado)</option>
                  <option value="dark">3. Modo Oscuro (Forzado)</option>
                </select>

                {/* Quick Switch Toggle between Light & Dark */}
                <button
                  type="button"
                  id="theme-quick-switch-btn"
                  onClick={() =>
                    onChangeThemePreference?.(
                      resolvedTheme === "dark" ? "light" : "dark"
                    )
                  }
                  className="px-3.5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs"
                  title="Alternar rápidamente entre Modo Claro y Modo Oscuro"
                >
                  {resolvedTheme === "dark" ? (
                    <>
                      <Sun className="w-3.5 h-3.5 text-white" />
                      <span>Cambiar a Claro</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-3.5 h-3.5 text-white" />
                      <span>Cambiar a Oscuro</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* 3 Option Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {/* Option 1: Predeterminado del Sistema (Automático) */}
              <button
                type="button"
                id="theme-option-system"
                onClick={() => onChangeThemePreference?.("system")}
                className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                  themePreference === "system"
                    ? "bg-teal-50/60 border-teal-500 ring-2 ring-teal-500/20"
                    : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {themePreference === "system" && (
                  <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-teal-600 flex items-center justify-center text-white">
                    <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                  </div>
                )}
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-teal-700 shrink-0">
                    <Monitor className="w-4 h-4" />
                  </div>
                  <div className="pr-6">
                    <span className="text-xs font-extrabold text-slate-900 block">
                      Predeterminado del Sistema (Automático)
                    </span>
                    <span className="text-[10px] font-bold text-teal-700 uppercase">
                      OS: {systemTheme === "dark" ? "Oscuro" : "Claro"}
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Sincroniza automáticamente con la preferencia configurada en el sistema operativo del dispositivo.
                </p>
              </button>

              {/* Option 2: Modo Claro (Forzado) */}
              <button
                type="button"
                id="theme-option-light"
                onClick={() => onChangeThemePreference?.("light")}
                className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                  themePreference === "light"
                    ? "bg-teal-50/60 border-teal-500 ring-2 ring-teal-500/20"
                    : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {themePreference === "light" && (
                  <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-teal-600 flex items-center justify-center text-white">
                    <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                  </div>
                )}
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
                    <Sun className="w-4 h-4" />
                  </div>
                  <div className="pr-6">
                    <span className="text-xs font-extrabold text-slate-900 block">
                      Modo Claro (Forzado)
                    </span>
                    <span className="text-[10px] font-mono font-bold text-teal-700">
                      #f8fafc / #ffffff • Inicial
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Establece fondos claros de máxima legibilidad en toda la interfaz corporativa SSMA.
                </p>
              </button>

              {/* Option 3: Modo Oscuro (Forzado) */}
              <button
                type="button"
                id="theme-option-dark"
                onClick={() => onChangeThemePreference?.("dark")}
                className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                  themePreference === "dark"
                    ? "bg-teal-50/60 border-teal-500 ring-2 ring-teal-500/20"
                    : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {themePreference === "dark" && (
                  <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-teal-600 flex items-center justify-center text-white">
                    <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                  </div>
                )}
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 shrink-0">
                    <Moon className="w-4 h-4" />
                  </div>
                  <div className="pr-6">
                    <span className="text-xs font-extrabold text-slate-900 block">
                      Modo Oscuro (Forzado)
                    </span>
                    <span className="text-[10px] font-mono font-bold text-teal-700">
                      #0f172a / #1e293b • Nocturno
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Superficies oscuras corporativas con alto contraste en normativas SST y métricas de carga mental.
                </p>
              </button>
            </div>
          </section>

          {/* SECTION A: ALMACENAMIENTO, REPOSICIÓN DE DATOS LOCALES Y RESPALDO GMAIL */}
          <section className="bg-white p-6 rounded-3xl border border-slate-200 space-y-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
                  <ArchiveRestore className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-slate-900">
                    Almacenamiento, Reposición de Datos Locales e Integración con Gmail
                  </h2>
                  <p className="text-xs text-slate-600">
                    Restaure los datos almacenados localmente o envíe un respaldo completo de registros por correo electrónico (Gmail).
                  </p>
                </div>
              </div>

              <span className="text-xs font-bold px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200 self-start sm:self-auto">
                Escenarios Guardados: {totalAttempts}
              </span>
            </div>

            {dataNotice && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{dataNotice}</span>
              </div>
            )}

            {dataError && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{dataError}</span>
              </div>
            )}

            {/* 1. Local Data Restoration Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-teal-600" />
                  <span>Reposición de Datos Almacenados Localmente</span>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Recupere sus registros de entrenamiento, check-in emocional y parámetros desde el punto de control del navegador o desde un archivo JSON de respaldo.
                </p>

                <input
                  ref={fileRestoreInputRef}
                  type="file"
                  accept=".json,application/json"
                  onChange={handleImportJsonFile}
                  className="hidden"
                />

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleRestoreFromLocalCheckpoint}
                    className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    <ArchiveRestore className="w-3.5 h-3.5 text-white" />
                    <span>Restaurar Punto Local</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCreateLocalRestorePoint}
                    className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5 text-teal-600" />
                    <span>Guardar Punto Local</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fileRestoreInputRef.current?.click()}
                    className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5 text-blue-600" />
                    <span>Importar JSON Local</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleExportData}
                    className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Descargar JSON</span>
                  </button>
                </div>
              </div>

              {/* 2. Gmail Backup Dispatch */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-teal-600" />
                  <span>Respaldo y Envío de Datos por Gmail</span>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Envíe una copia completa de los registros y métricas almacenadas directamente a su correo electrónico mediante Gmail.
                </p>

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    value={backupEmailTo}
                    onChange={(e) => setBackupEmailTo(e.target.value)}
                    placeholder="Correo Gmail destino..."
                    className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-teal-600"
                  />
                  <button
                    type="button"
                    onClick={handleRequestGmailBackup}
                    disabled={isSendingGmailBackup}
                    className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5 text-white" />
                    <span>
                      {isSendingGmailBackup ? "Enviando..." : "Enviar por Gmail"}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Google Workspace Sign-In Bar for Gmail */}
            <WorkspaceAccountBar
              user={googleUser}
              hasToken={hasToken}
              isLoggingIn={isLoggingIn}
              onLogin={handleGoogleLogin}
              onLogout={handleGoogleLogout}
            />

            {/* Clear History Option */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <span className="text-slate-500">
                ¿Desea reiniciar el contador de intentos a cero para una nueva auditoría?
              </span>
              {!isConfirmingClearHistory ? (
                <button
                  type="button"
                  onClick={() => setIsConfirmingClearHistory(true)}
                  className="py-1.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                  <span>{t("clearHistoryBtn")}</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleClearAllHistory}
                    className="px-3 py-1 rounded-lg bg-rose-600 text-white font-bold text-xs cursor-pointer"
                  >
                    {t("confirm")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsConfirmingClearHistory(false)}
                    className="px-3 py-1 rounded-lg bg-slate-200 text-slate-700 text-xs cursor-pointer"
                  >
                    {t("cancel")}
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* SECTION B: PROTECTED APK DOWNLOAD */}
          <section className="bg-white p-6 rounded-3xl border border-slate-200 space-y-5 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <span>Generar APK / Instalar Android</span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-300">
                      {isApkUnlocked
                        ? "Desbloqueado"
                        : "Protegido por Clave Maestra"}
                    </span>
                  </h2>
                  <p className="text-xs text-slate-600">
                    El acceso al paquete de instalación Android está protegido mediante clave maestra de seguridad.
                  </p>
                </div>
              </div>

              {isApkUnlocked && (
                <button
                  type="button"
                  onClick={handleLockApkAgain}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Bloquear APK</span>
                </button>
              )}
            </div>

            {apkKeyError && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{apkKeyError}</span>
              </div>
            )}
            {apkKeySuccess && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{apkKeySuccess}</span>
              </div>
            )}

            {!isApkUnlocked ? (
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 shrink-0 mt-0.5">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Ingrese la Clave Maestra para Generar APK / Instalar Android
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Requiere validación de seguridad del administrador para habilitar los enlaces de descarga.
                    </p>
                  </div>
                </div>

                <form
                  onSubmit={handleUnlockApk}
                  className="flex flex-col sm:flex-row gap-3 pt-1"
                >
                  <div className="relative flex-1">
                    <input
                      type={showApkKey ? "text" : "password"}
                      value={apkMasterKeyInput}
                      onChange={(e) => setApkMasterKeyInput(e.target.value)}
                      placeholder="Ingrese clave maestra de seguridad..."
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-teal-600 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowApkKey(!showApkKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    >
                      {showApkKey ? (
                        <EyeOff className="w-3.5 h-3.5" />
                      ) : (
                        <Eye className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="py-2.5 px-5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-white" />
                    <span>Desbloquear Generar APK</span>
                  </button>
                </form>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
                <div className="bg-slate-50 p-5 rounded-2xl border border-teal-300 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-teal-100 border border-teal-300 flex items-center justify-center text-teal-800">
                        <Smartphone className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold text-slate-900">
                          ssma-enterprise.apk
                        </h4>
                        <span className="text-[11px] text-teal-700 font-mono font-bold">
                          Versión 2.5.0 • Android 8.0+
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                      APK Nativo
                    </span>
                  </div>

                  <a
                    href="/ssma-enterprise.apk"
                    download="ssma-enterprise.apk"
                    className="w-full py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4 text-white" />
                    <span>Descargar ssma-enterprise.apk</span>
                  </a>
                </div>

                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
                        <FileCode className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold text-slate-900">
                          ssma-android-package.zip
                        </h4>
                        <span className="text-[11px] text-blue-700 font-mono font-bold">
                          Paquete Completo PWA & Android
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-800">
                      ZIP
                    </span>
                  </div>

                  <a
                    href="/ssma-android-package.zip"
                    download="ssma-android-package.zip"
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4 text-white" />
                    <span>Descargar Paquete Android ZIP</span>
                  </a>
                </div>
              </div>
            )}
          </section>

          {/* SECTION C: CLAVE MAESTRA DE SEGURIDAD */}
          <section className="bg-white p-6 rounded-3xl border border-slate-200 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-slate-900">
                    {t("securitySectionTitle")}
                  </h2>
                  <p className="text-xs text-slate-600">
                    {t("securitySectionDesc")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-slate-50 px-3.5 py-2 rounded-2xl border border-slate-200">
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-800 block">
                    {isPasswordRequired
                      ? t("passwordStatusActive")
                      : t("passwordStatusDisabled")}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (!isPasswordRequired && !currentPassword) {
                      setPassError(t("defaultPasswordNotice"));
                      return;
                    }
                    onTogglePasswordRequired(!isPasswordRequired);
                  }}
                  className={`w-12 h-6 rounded-full p-1 transition-colors relative cursor-pointer ${
                    isPasswordRequired ? "bg-teal-600" : "bg-slate-300"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      isPasswordRequired ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>

            {passError && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{passError}</span>
              </div>
            )}
            {passSuccess && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{passSuccess}</span>
              </div>
            )}
            {resetSuccess && (
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold flex items-center gap-2.5">
                <RotateCcw className="w-4 h-4 shrink-0 text-amber-600" />
                <span>{resetSuccess}</span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
                  <KeyRound className="w-4 h-4 text-teal-600" />
                  <h3 className="text-sm font-bold text-slate-900">
                    {t("changePasswordTitle")}
                  </h3>
                </div>

                <form onSubmit={handleSavePassword} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t("currentPasswordLabel")}
                    </label>
                    <div className="relative">
                      <input
                        type={showOldPass ? "text" : "password"}
                        value={oldPasswordInput}
                        onChange={(e) => setOldPasswordInput(e.target.value)}
                        placeholder={t("currentPasswordPlaceholder")}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-teal-600 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowOldPass(!showOldPass)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                      >
                        {showOldPass ? (
                          <EyeOff className="w-3.5 h-3.5" />
                        ) : (
                          <Eye className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t("newPasswordLabel")}
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPass ? "text" : "password"}
                        value={newPasswordInput}
                        onChange={(e) => setNewPasswordInput(e.target.value)}
                        placeholder={t("newPasswordPlaceholder")}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-teal-600 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPass(!showNewPass)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                      >
                        {showNewPass ? (
                          <EyeOff className="w-3.5 h-3.5" />
                        ) : (
                          <Eye className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t("confirmPasswordLabel")}
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPass ? "text" : "password"}
                        value={confirmPasswordInput}
                        onChange={(e) =>
                          setConfirmPasswordInput(e.target.value)
                        }
                        placeholder={t("confirmPasswordPlaceholder")}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-teal-600 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPass(!showConfirmPass)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                      >
                        {showConfirmPass ? (
                          <EyeOff className="w-3.5 h-3.5" />
                        ) : (
                          <Eye className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-white" />
                    {t("saveNewPasswordBtn")}
                  </button>
                </form>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
                    <RotateCcw className="w-4 h-4 text-amber-600" />
                    <h3 className="text-sm font-bold text-slate-900">
                      {t("resetPasswordTitle")}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                    {t("resetPasswordDesc")}
                  </p>

                  <div className="mt-4 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
                    <div className="flex items-center gap-2 font-bold">
                      <Info className="w-4 h-4 shrink-0 text-amber-600" />
                      <span>{t("defaultPasswordNotice")}</span>
                    </div>
                  </div>
                </div>

                <div>
                  {!isConfirmingReset ? (
                    <button
                      type="button"
                      onClick={() => setIsConfirmingReset(true)}
                      className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 border border-amber-300 text-amber-900 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                      {t("resetPasswordBtn")}
                    </button>
                  ) : (
                    <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl space-y-2.5 text-center">
                      <p className="text-xs text-amber-900 font-bold">
                        {t("resetPasswordConfirmPrompt")}
                      </p>
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => setIsConfirmingReset(false)}
                          className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 text-xs cursor-pointer"
                        >
                          {t("cancel")}
                        </button>
                        <button
                          type="button"
                          onClick={handleResetToDefault}
                          className="px-3 py-1.5 rounded-lg bg-amber-600 text-white text-xs font-bold cursor-pointer"
                        >
                          {t("confirm")}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* SECTION D: IDIOMA Y NOTIFICACIONES */}
          <section className="bg-white p-6 rounded-3xl border border-slate-200 space-y-5 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-700">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-slate-900">
                    {t("languageSectionTitle")}
                  </h2>
                  <p className="text-xs text-slate-600">
                    {t("languageSectionDesc")}
                  </p>
                </div>
              </div>

              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-50 border border-cyan-200 text-cyan-800">
                <Languages className="w-3.5 h-3.5" />
                {languages.find((l) => l.code === language)?.label}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
              {languages.map((item) => {
                const isSelected = language === item.code;
                return (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => setLanguage(item.code as SupportedLanguage)}
                    className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? "bg-teal-50/60 border-teal-500 ring-2 ring-teal-500/20"
                        : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-teal-600 flex items-center justify-center text-white">
                        <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                      </div>
                    )}
                    <div className="flex items-center gap-2.5 mb-2">
                      <span className="text-2xl">{item.flag}</span>
                      <div>
                        <span className="text-sm font-bold text-slate-900 block">
                          {item.nativeName}
                        </span>
                        <span className="text-[11px] text-teal-700 font-bold uppercase">
                          {item.code.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>

          {notificationReminder && (
            <NotificationReminderSettings
              isSupported={notificationReminder.isSupported}
              permission={notificationReminder.permission}
              config={notificationReminder.config}
              onUpdateConfig={notificationReminder.onUpdateConfig}
              onRequestPermission={notificationReminder.onRequestPermission}
              onSendTestNotification={
                notificationReminder.onSendTestNotification
              }
            />
          )}

          {/* SECTION E: ANIMACIONES */}
          <section className="bg-white p-6 rounded-3xl border border-slate-200 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-slate-900">
                    {t("animationsSectionTitle")}
                  </h2>
                  <p className="text-xs text-slate-600">
                    {t("animationsSectionDesc")}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onToggleMotion(!motionEnabled)}
                className={`w-12 h-6 rounded-full p-1 transition-colors relative cursor-pointer ${
                  motionEnabled ? "bg-teal-600" : "bg-slate-300"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    motionEnabled ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
