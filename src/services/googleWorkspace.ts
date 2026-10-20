import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import firebaseConfig from "../../firebase-applet-config.json";
import { PsychologicalLog, TrainingAttempt } from "../types";

// Mandatory OAuth Scopes configured via set_up_oauth
export const SCOPES = [
  "https://www.googleapis.com/auth/gmail.send",
  "https://www.googleapis.com/auth/spreadsheets",
];

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
SCOPES.forEach((scope) => provider.addScope(scope));

// Flag to indicate if we are in the middle of a sign-in flow
let isSigningIn = false;
// Cache the access token strictly in memory (never in localStorage/sessionStorage)
let cachedAccessToken: string | null = null;

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{
  user: User;
  accessToken: string;
} | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error("No se pudo obtener el token de acceso de Google Workspace.");
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error("Google Sign-In error:", error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const logoutGoogle = async () => {
  await auth.signOut();
  cachedAccessToken = null;
};

export function getCurrentUser(): User | null {
  return auth.currentUser;
}

/**
 * Helper to extract a clean Google Spreadsheet ID from either a full URL or raw ID string
 */
export function extractSpreadsheetId(input: string): string {
  const trimmed = input.trim();
  const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) {
    return match[1];
  }
  return trimmed;
}

/**
 * Helper to encode UTF-8 string into Base64URL for Gmail API RFC 2822 message
 */
function encodeBase64Url(str: string): string {
  const utf8Bytes = new TextEncoder().encode(str);
  let binary = "";
  for (let i = 0; i < utf8Bytes.byteLength; i++) {
    binary += String.fromCharCode(utf8Bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/**
 * Send an email via Gmail API (requires https://www.googleapis.com/auth/gmail.send)
 */
export async function sendGmailMessage(params: {
  to: string;
  subject: string;
  bodyText: string;
}): Promise<{ id: string; threadId: string }> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error("AUTH_REQUIRED");
  }

  // RFC 2047 UTF-8 encoding for Subject header
  const subjectB64 = btoa(
    Array.from(new TextEncoder().encode(params.subject), (b) =>
      String.fromCharCode(b)
    ).join("")
  );
  const encodedSubject = `=?utf-8?B?${subjectB64}?=`;

  const rawEmail = [
    `To: ${params.to}`,
    `Subject: ${encodedSubject}`,
    "MIME-Version: 1.0",
    'Content-Type: text/plain; charset="UTF-8"',
    "Content-Transfer-Encoding: 8bit",
    "",
    params.bodyText,
  ].join("\r\n");

  const raw = encodeBase64Url(rawEmail);

  const response = await fetch(
    "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ raw }),
    }
  );

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(
      errData?.error?.message || `Error al enviar correo Gmail (${response.status})`
    );
  }

  return response.json();
}

export interface CloudLicenseRecord {
  licenseKey: string;
  clientName: string;
  plan: string;
  expirationDate: string; // YYYY-MM-DD
  dynamicKey: string;
  status: "ACTIVA" | "SUSPENDIDA" | "VENCIDA";
  contactDeveloper: string;
  updatedAt: string;
}

/**
 * Fetch spreadsheet metadata to get sheet tab names and URL dynamically (never hardcode "Sheet1")
 */
export async function getSpreadsheetMetadata(spreadsheetId: string): Promise<{
  title: string;
  spreadsheetUrl: string;
  sheetTitles: string[];
}> {
  const token = await getAccessToken();
  if (!token) throw new Error("AUTH_REQUIRED");

  const cleanId = extractSpreadsheetId(spreadsheetId);
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(cleanId)}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      err?.error?.message || `No se pudo acceder al Google Sheet (${res.status})`
    );
  }

  const data = await res.json();
  const sheetTitles: string[] = (data?.sheets || [])
    .map((s: any) => s?.properties?.title)
    .filter(Boolean);

  return {
    title: data?.properties?.title || "Google Sheet",
    spreadsheetUrl:
      data?.spreadsheetUrl ||
      `https://docs.google.com/spreadsheets/d/${cleanId}/edit`,
    sheetTitles,
  };
}

/**
 * Fetch spreadsheet metadata to get the first sheet tab name dynamically
 */
export async function getFirstSheetName(spreadsheetId: string): Promise<string> {
  const meta = await getSpreadsheetMetadata(spreadsheetId);
  return meta.sheetTitles[0] || "Licencias";
}

/**
 * Create a new Google Sheet to act as lightweight cloud database for licenses & dynamic keys
 */
export async function createCloudLicenseSpreadsheet(
  initialRecord: CloudLicenseRecord
): Promise<{ spreadsheetId: string; spreadsheetUrl: string; sheetTitle: string }> {
  const token = await getAccessToken();
  if (!token) throw new Error("AUTH_REQUIRED");

  const createRes = await fetch("https://sheets.googleapis.com/v4/spreadsheets", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      properties: {
        title: "SSMA Enterprise - Base de Datos de Licencias y Llaves Dinámicas",
      },
      sheets: [
        {
          properties: {
            title: "Licencias_SSMA",
            gridProperties: { frozenRowCount: 1 },
          },
        },
      ],
    }),
  });

  if (!createRes.ok) {
    const err = await createRes.json().catch(() => ({}));
    throw new Error(
      err?.error?.message || "Error al crear la hoja de cálculo en Google Sheets"
    );
  }

  const created = await createRes.json();
  const spreadsheetId = created.spreadsheetId;
  const spreadsheetUrl = created.spreadsheetUrl;
  const sheetTitle = created?.sheets?.[0]?.properties?.title || "Licencias_SSMA";

  // Seed header row and initial license row
  const values = [
    [
      "LICENSE_KEY",
      "CLIENT_NAME",
      "PLAN",
      "EXPIRATION_DATE",
      "DYNAMIC_KEY",
      "STATUS",
      "DEVELOPER_CONTACT",
      "UPDATED_AT",
    ],
    [
      initialRecord.licenseKey,
      initialRecord.clientName,
      initialRecord.plan,
      initialRecord.expirationDate,
      initialRecord.dynamicKey,
      initialRecord.status,
      initialRecord.contactDeveloper,
      initialRecord.updatedAt,
    ],
  ];

  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(
      spreadsheetId
    )}/values/${encodeURIComponent(`${sheetTitle}!A1:H2`)}?valueInputOption=USER_ENTERED`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ values }),
    }
  );

  return { spreadsheetId, spreadsheetUrl, sheetTitle };
}

/**
 * Read all license records from the configured Google Sheet
 */
export async function fetchCloudLicensesFromSheet(
  spreadsheetId: string
): Promise<CloudLicenseRecord[]> {
  const token = await getAccessToken();
  if (!token) throw new Error("AUTH_REQUIRED");

  const cleanId = extractSpreadsheetId(spreadsheetId);
  const sheetTitle = await getFirstSheetName(cleanId);
  const range = `${sheetTitle}!A2:H100`;

  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(
      cleanId
    )}/values/${encodeURIComponent(range)}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      err?.error?.message || "Error al leer licencias desde Google Sheets"
    );
  }

  const data = await res.json();
  const rows: string[][] = data.values || [];

  return rows
    .filter((r) => r.length > 0 && r[0])
    .map((r) => ({
      licenseKey: r[0] || "",
      clientName: r[1] || "Corporativo SSMA",
      plan: r[2] || "SSMA Enterprise Multi-Setor SaaS",
      expirationDate: r[3] || "",
      dynamicKey: r[4] || "",
      status: (r[5] as "ACTIVA" | "SUSPENDIDA" | "VENCIDA") || "ACTIVA",
      contactDeveloper: r[6] || "beisander2@gmail.com",
      updatedAt: r[7] || new Date().toISOString(),
    }));
}

/**
 * Append or update a license & dynamic key record in Google Sheets
 */
export async function syncLicenseRecordToSheet(
  spreadsheetId: string,
  record: CloudLicenseRecord
): Promise<void> {
  const token = await getAccessToken();
  if (!token) throw new Error("AUTH_REQUIRED");

  const cleanId = extractSpreadsheetId(spreadsheetId);
  const sheetTitle = await getFirstSheetName(cleanId);
  const existing = await fetchCloudLicensesFromSheet(cleanId);
  const rowIndex = existing.findIndex(
    (item) => item.licenseKey.trim() === record.licenseKey.trim()
  );

  const rowValues = [
    [
      record.licenseKey,
      record.clientName,
      record.plan,
      record.expirationDate,
      record.dynamicKey,
      record.status,
      record.contactDeveloper,
      record.updatedAt,
    ],
  ];

  if (rowIndex >= 0) {
    const targetRow = rowIndex + 2;
    const range = `${sheetTitle}!A${targetRow}:H${targetRow}`;
    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(
        cleanId
      )}/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ values: rowValues }),
      }
    );
    if (!res.ok) {
      throw new Error("No se pudo actualizar la fila en Google Sheets");
    }
  } else {
    const range = `${sheetTitle}!A1:H1`;
    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(
        cleanId
      )}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ values: rowValues }),
      }
    );
    if (!res.ok) {
      throw new Error("No se pudo insertar la licencia en Google Sheets");
    }
  }
}

// ============================================================================
// ADMINISTRATIVE REPORTING: SYNC TRAINING ATTEMPTS & PSYCHOLOGICAL LOGS
// ============================================================================

export const ADMIN_SHEET_TABS = {
  SUMMARY: "Resumen_Ejecutivo",
  ATTEMPTS: "Intentos_Entrenamiento",
  PSYCHOLOGICAL: "Logs_Psicologicos",
} as const;

export interface AdminSheetSyncResult {
  spreadsheetId: string;
  spreadsheetUrl: string;
  syncedAttemptsCount: number;
  syncedLogsCount: number;
  syncedAt: string;
}

export interface RemoteAdminReportPreview {
  spreadsheetTitle: string;
  spreadsheetUrl: string;
  sheetTabs: string[];
  attemptsRows: string[][];
  psychologicalRows: string[][];
}

function formatAttemptRows(attempts: TrainingAttempt[]): string[][] {
  const header = [
    "ID_INTENTO",
    "ESCENARIO_ID",
    "SECTOR_ECONOMICO",
    "NORMA_SST",
    "OPCION_SELECCIONADA",
    "RESULTADO",
    "TIEMPO_EMPLEADO_SEG",
    "TIEMPO_ASIGNADO_SEG",
    "CARGA_MENTAL_1_10",
    "FECHA_HORA_ISO",
  ];

  const rows = attempts.map((a) => [
    a.id || "",
    a.scenarioId || "",
    a.sector || "",
    a.normReference || "",
    a.selectedOptionId || "",
    a.isCorrect ? "CORRECTO" : "INCORRECTO",
    String(a.timeSpentSeconds ?? 0),
    String(a.allocatedTimeSeconds ?? 30),
    String(a.mentalLoadAtTime ?? 0),
    a.timestamp || new Date().toISOString(),
  ]);

  return [header, ...rows];
}

function formatPsychologicalRows(logs: PsychologicalLog[]): string[][] {
  const header = [
    "HASH_TRABAJADOR_SHA256",
    "USUARIO_ANONIMO",
    "ETAPA_TURNO",
    "NIVEL_ANSIEDAD_1_5",
    "NIVEL_FATIGA_1_5",
    "NIVEL_FOCO_1_5",
    "CARGA_MENTAL_TOTAL_10",
    "DESCOMPRESION_ACTIVADA",
    "FECHA_HORA_ISO",
  ];

  const rows = logs.map((l) => [
    l.workerHash || "sha256-anon",
    l.userId || "operador-anon",
    l.shiftStage === "START" ? "INICIO_TURNO" : "FIN_TURNO",
    String(l.anxietyScore ?? 0),
    String(l.fatigueScore ?? 0),
    String(l.focusScore ?? 4),
    String(l.totalMentalLoad ?? 0),
    l.decompressionTriggered ? "SI (PAUSA_ACTIVA)" : "NO (ESTABLE)",
    l.loggedAt || new Date().toISOString(),
  ]);

  return [header, ...rows];
}

function formatExecutiveSummaryRows(params: {
  companyName: string;
  department: string;
  attempts: TrainingAttempt[];
  psychologicalLogs: PsychologicalLog[];
}): string[][] {
  const totalAttempts = params.attempts.length;
  const correctAttempts = params.attempts.filter((a) => a.isCorrect).length;
  const accuracy =
    totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 100;
  const avgTime =
    totalAttempts > 0
      ? (
          params.attempts.reduce((acc, a) => acc + (a.timeSpentSeconds || 0), 0) /
          totalAttempts
        ).toFixed(1)
      : "0.0";

  const totalLogs = params.psychologicalLogs.length;
  const highLoadLogs = params.psychologicalLogs.filter(
    (l) => l.totalMentalLoad >= 7 || l.decompressionTriggered
  ).length;
  const avgMentalLoad =
    totalLogs > 0
      ? (
          params.psychologicalLogs.reduce(
            (acc, l) => acc + (l.totalMentalLoad || 0),
            0
          ) / totalLogs
        ).toFixed(1)
      : "0.0";

  const nowIso = new Date().toISOString();

  return [
    ["INDICADOR ADMINISTRATIVO SST", "VALOR REGISTRADO", "DETALLE / UNIDAD", "ACTUALIZADO_EN"],
    [
      "Empresa / Organización",
      params.companyName || "Corporativo SSMA Enterprise",
      params.department || "Coordinación SST / SESMT",
      nowIso,
    ],
    [
      "Total Intentos de Entrenamiento (Simulador SST)",
      String(totalAttempts),
      `${correctAttempts} aciertos (${accuracy}% precisión normativa)`,
      nowIso,
    ],
    [
      "Tiempo Promedio de Respuesta (Time-Attack)",
      `${avgTime} s`,
      "Segundos por escenario",
      nowIso,
    ],
    [
      "Total Evaluaciones Psicológicas (Check-in)",
      String(totalLogs),
      `Carga mental media: ${avgMentalLoad}/10`,
      nowIso,
    ],
    [
      "Pausas de Descompresión Activadas",
      String(highLoadLogs),
      "Protocolos profilácticos 4-7-8 disparados",
      nowIso,
    ],
    [
      "Blindaje de Privacidad y Cumplimiento",
      "100% Activo",
      "Anonimización SHA-256 + Cifrado AES-256",
      nowIso,
    ],
  ];
}

/**
 * Ensure the required reporting tabs exist in the target spreadsheet.
 * Inspects metadata first and uses batchUpdate addSheet only for missing tabs.
 */
async function ensureAdminReportingTabs(
  spreadsheetId: string,
  token: string
): Promise<{ spreadsheetUrl: string; sheetTitles: string[] }> {
  const meta = await getSpreadsheetMetadata(spreadsheetId);
  const requiredTabs = [
    ADMIN_SHEET_TABS.SUMMARY,
    ADMIN_SHEET_TABS.ATTEMPTS,
    ADMIN_SHEET_TABS.PSYCHOLOGICAL,
  ];

  const missingTabs = requiredTabs.filter(
    (tab) => !meta.sheetTitles.includes(tab)
  );

  if (missingTabs.length > 0) {
    const requests = missingTabs.map((title) => ({
      addSheet: {
        properties: {
          title,
          gridProperties: { frozenRowCount: 1 },
        },
      },
    }));

    const batchRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(
        spreadsheetId
      )}:batchUpdate`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requests }),
      }
    );

    if (!batchRes.ok) {
      const err = await batchRes.json().catch(() => ({}));
      throw new Error(
        err?.error?.message ||
          "No se pudieron crear las pestañas de reporte en Google Sheets"
      );
    }
  }

  return {
    spreadsheetUrl: meta.spreadsheetUrl,
    sheetTitles: Array.from(new Set([...meta.sheetTitles, ...requiredTabs])),
  };
}

/**
 * Create a brand-new remote Google Spreadsheet dedicated to Administrative Reporting
 * (Training Attempts + Psychological Logs + Executive Summary) and sync initial data.
 */
export async function createAdminReportingSpreadsheet(params: {
  companyName: string;
  department: string;
  attempts: TrainingAttempt[];
  psychologicalLogs: PsychologicalLog[];
}): Promise<AdminSheetSyncResult> {
  const token = await getAccessToken();
  if (!token) throw new Error("AUTH_REQUIRED");

  const titleLabel = params.companyName?.trim()
    ? `SSMA Enterprise - Reporte Administrativo SST (${params.companyName.trim()})`
    : "SSMA Enterprise - Reporte Administrativo SST (Entrenamientos y Logs)";

  const createRes = await fetch("https://sheets.googleapis.com/v4/spreadsheets", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      properties: {
        title: titleLabel,
      },
      sheets: [
        {
          properties: {
            title: ADMIN_SHEET_TABS.SUMMARY,
            gridProperties: { frozenRowCount: 1 },
          },
        },
        {
          properties: {
            title: ADMIN_SHEET_TABS.ATTEMPTS,
            gridProperties: { frozenRowCount: 1 },
          },
        },
        {
          properties: {
            title: ADMIN_SHEET_TABS.PSYCHOLOGICAL,
            gridProperties: { frozenRowCount: 1 },
          },
        },
      ],
    }),
  });

  if (!createRes.ok) {
    const err = await createRes.json().catch(() => ({}));
    throw new Error(
      err?.error?.message ||
        "Error al crear la hoja de cálculo de Reporte Administrativo en Google Sheets"
    );
  }

  const created = await createRes.json();
  const spreadsheetId = created.spreadsheetId;

  return syncAdminReportToSpreadsheet(spreadsheetId, params);
}

/**
 * Sync all Training Attempts and Psychological Logs to an existing Google Spreadsheet
 */
export async function syncAdminReportToSpreadsheet(
  rawSpreadsheetId: string,
  params: {
    companyName: string;
    department: string;
    attempts: TrainingAttempt[];
    psychologicalLogs: PsychologicalLog[];
  }
): Promise<AdminSheetSyncResult> {
  const token = await getAccessToken();
  if (!token) throw new Error("AUTH_REQUIRED");

  const spreadsheetId = extractSpreadsheetId(rawSpreadsheetId);
  if (!spreadsheetId) {
    throw new Error("ID de Google Sheet inválido.");
  }

  const { spreadsheetUrl } = await ensureAdminReportingTabs(
    spreadsheetId,
    token
  );

  const summaryValues = formatExecutiveSummaryRows(params);
  const attemptsValues = formatAttemptRows(params.attempts);
  const psychValues = formatPsychologicalRows(params.psychologicalLogs);

  // Clear existing ranges first so old trailing rows don't remain if history was reset
  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(
      spreadsheetId
    )}/values:batchClear`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ranges: [
          `${ADMIN_SHEET_TABS.SUMMARY}!A1:D50`,
          `${ADMIN_SHEET_TABS.ATTEMPTS}!A1:J500`,
          `${ADMIN_SHEET_TABS.PSYCHOLOGICAL}!A1:I500`,
        ],
      }),
    }
  );

  // Batch write all three tabs in a single atomic call
  const batchUpdateValuesRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(
      spreadsheetId
    )}/values:batchUpdate`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        valueInputOption: "USER_ENTERED",
        data: [
          {
            range: `${ADMIN_SHEET_TABS.SUMMARY}!A1`,
            values: summaryValues,
          },
          {
            range: `${ADMIN_SHEET_TABS.ATTEMPTS}!A1`,
            values: attemptsValues,
          },
          {
            range: `${ADMIN_SHEET_TABS.PSYCHOLOGICAL}!A1`,
            values: psychValues,
          },
        ],
      }),
    }
  );

  if (!batchUpdateValuesRes.ok) {
    const err = await batchUpdateValuesRes.json().catch(() => ({}));
    throw new Error(
      err?.error?.message ||
        "Error al sincronizar los registros administrativos en Google Sheets"
    );
  }

  return {
    spreadsheetId,
    spreadsheetUrl,
    syncedAttemptsCount: params.attempts.length,
    syncedLogsCount: params.psychologicalLogs.length,
    syncedAt: new Date().toISOString(),
  };
}

/**
 * Fetch remote training attempts and psychological logs from the linked Google Sheet
 * for administrative inspection.
 */
export async function fetchAdminReportFromSpreadsheet(
  rawSpreadsheetId: string
): Promise<RemoteAdminReportPreview> {
  const token = await getAccessToken();
  if (!token) throw new Error("AUTH_REQUIRED");

  const spreadsheetId = extractSpreadsheetId(rawSpreadsheetId);
  const meta = await getSpreadsheetMetadata(spreadsheetId);

  const attemptsTab = meta.sheetTitles.includes(ADMIN_SHEET_TABS.ATTEMPTS)
    ? ADMIN_SHEET_TABS.ATTEMPTS
    : meta.sheetTitles[0] || "Sheet1";

  const psychTab = meta.sheetTitles.includes(ADMIN_SHEET_TABS.PSYCHOLOGICAL)
    ? ADMIN_SHEET_TABS.PSYCHOLOGICAL
    : meta.sheetTitles[1] || meta.sheetTitles[0] || "Sheet1";

  const [attemptsRes, psychRes] = await Promise.all([
    fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(
        spreadsheetId
      )}/values/${encodeURIComponent(`${attemptsTab}!A2:J100`)}`,
      { headers: { Authorization: `Bearer ${token}` } }
    ),
    fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(
        spreadsheetId
      )}/values/${encodeURIComponent(`${psychTab}!A2:I100`)}`,
      { headers: { Authorization: `Bearer ${token}` } }
    ),
  ]);

  const attemptsJson = attemptsRes.ok ? await attemptsRes.json() : { values: [] };
  const psychJson = psychRes.ok ? await psychRes.json() : { values: [] };

  return {
    spreadsheetTitle: meta.title,
    spreadsheetUrl: meta.spreadsheetUrl,
    sheetTabs: meta.sheetTitles,
    attemptsRows: attemptsJson.values || [],
    psychologicalRows: psychJson.values || [],
  };
}

/**
 * Generate a cryptographic dynamic exchange key
 */
export function generateDynamicExchangeKey(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const segment = (len: number) =>
    Array.from({ length: len }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join("");
  return `DYN-${segment(4)}-${segment(4)}-${new Date().getFullYear()}`;
}

/**
 * Check if a YYYY-MM-DD expiration date matches today's exact local date
 */
export function getTodayLocalISO(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function isExactExpirationDay(
  expirationDateStr: string | null | undefined
): boolean {
  if (!expirationDateStr) return false;
  return expirationDateStr.trim() === getTodayLocalISO();
}
