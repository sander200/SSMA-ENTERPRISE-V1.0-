import { useState, useEffect } from "react";
import { Navbar, TabType } from "./components/Navbar";
import { BentoGridMenu } from "./components/BentoGridMenu";
import { SplashScreen } from "./components/SplashScreen";
import { SectorGrid } from "./components/SectorGrid";
import { ScenarioPlayer } from "./components/ScenarioPlayer";
import { CheckInView } from "./components/CheckInView";
import { DecompressionModule } from "./components/DecompressionModule";
import { AIGeneratorView } from "./components/AIGeneratorView";
import { SESMTDashboard } from "./components/SESMTDashboard";
import { LGPDConsentModal } from "./components/LGPDConsentModal";
import { PasswordPromptModal } from "./components/PasswordPromptModal";
import { SettingsView } from "./components/SettingsView";
import { LicenseExpirationModal } from "./components/LicenseExpirationModal";
import { ECONOMIC_SECTORS, INITIAL_SCENARIOS } from "./data/sectors";
import { USER_BADGES } from "./data/badges";
import {
  TestScenario,
  PsychologicalLog,
  TrainingAttempt,
  UserBadge,
} from "./types";
import {
  Trophy,
  CheckCircle,
  Flame,
  Shield,
  ArrowUpRight,
  ArrowLeft,
} from "lucide-react";
import { LanguageProvider, useLanguage } from "./i18n/LanguageContext";
import { motion, AnimatePresence } from "motion/react";
import { useNotificationReminder } from "./hooks/useNotificationReminder";
import { useThemeMode } from "./hooks/useThemeMode";
import { NotificationReminderToast } from "./components/NotificationReminderToast";
import { BadgeUnlockModal } from "./components/BadgeUnlockModal";
import { isExactExpirationDay } from "./services/googleWorkspace";

function AppContent() {
  const { t, language } = useLanguage();
  const {
    themePreference,
    resolvedTheme,
    systemTheme,
    setThemePreference,
  } = useThemeMode();

  // Splash Screen State
  const [showSplash, setShowSplash] = useState<boolean>(true);

  // Tab State - Starts on Bento Grid Menu
  const [activeTab, setActiveTab] = useState<TabType>("menu");
  const [settingsInitialSubTab, setSettingsInitialSubTab] = useState<
    "general" | "developer"
  >("general");
  const [selectedSectorId, setSelectedSectorId] = useState<number>(1);
  const [currentScenario, setCurrentScenario] = useState<TestScenario>(
    INITIAL_SCENARIOS[0]
  );
  const [isGeneratingAI, setIsGeneratingAI] = useState<boolean>(false);
  const [showLGPDModal, setShowLGPDModal] = useState<boolean>(false);

  // Corporate Custom Logo State (Managed in Developer Tab)
  const [customLogo, setCustomLogo] = useState<string | null>(() => {
    return localStorage.getItem("ssma_custom_logo") || null;
  });

  // License & Dynamic Key State (Synced with Google Sheets in Developer Tab)
  const [licenseKey, setLicenseKey] = useState<string>(() => {
    return (
      localStorage.getItem("ssma_enterprise_license_key") ||
      "SSMA-CORP-94713-ENT-2026-VAL"
    );
  });
  const [dynamicKey, setDynamicKey] = useState<string>(() => {
    return (
      localStorage.getItem("ssma_dynamic_exchange_key") || "DYN-7K9P-4M2X-2026"
    );
  });
  const [licenseExpirationDate, setLicenseExpirationDate] = useState<string>(
    () => {
      return localStorage.getItem("ssma_license_expiration_date") || "2026-12-31";
    }
  );
  const [showExpirationModal, setShowExpirationModal] =
    useState<boolean>(false);

  // Check if today is the exact expiration day of the license
  useEffect(() => {
    if (isExactExpirationDay(licenseExpirationDate)) {
      setShowExpirationModal(true);
    } else {
      setShowExpirationModal(false);
    }
  }, [licenseExpirationDate]);

  // Settings & Password State (Strict Master Key: keysander5361)
  const [settingsPassword, setSettingsPassword] = useState<string>(() => {
    const saved = localStorage.getItem("ssma_settings_password");
    if (!saved || saved === "admin123") {
      localStorage.setItem("ssma_settings_password", "keysander5361");
      return "keysander5361";
    }
    return saved;
  });
  const [isPasswordRequired, setIsPasswordRequired] = useState<boolean>(() => {
    return localStorage.getItem("ssma_settings_password_required") !== "false";
  });
  const [isSettingsUnlocked, setIsSettingsUnlocked] = useState<boolean>(false);
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);

  // Dynamic Tab Transitions / Motion State
  const [motionEnabled, setMotionEnabled] = useState<boolean>(() => {
    return localStorage.getItem("ssma_motion_enabled") !== "false";
  });

  // Badge Unlock Celebration State
  const [unlockedBadgeCelebration, setUnlockedBadgeCelebration] =
    useState<UserBadge | null>(null);

  // Web Notification Daily Reminder Hook
  const reminder = useNotificationReminder({
    onNavigateToCheckIn: () => setActiveTab("checkin"),
  });

  // User Psychological Profile State (Latest + History for Administrative Reporting)
  const [userLog, setUserLog] = useState<PsychologicalLog | null>(() => {
    const saved = localStorage.getItem("ssma_psychological_log");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.warn("Could not parse saved psychological log", e);
      }
    }
    return null;
  });

  const [psychologicalLogs, setPsychologicalLogs] = useState<PsychologicalLog[]>(
    () => {
      const savedHistory = localStorage.getItem(
        "ssma_psychological_logs_history"
      );
      if (savedHistory) {
        try {
          const parsed = JSON.parse(savedHistory);
          if (Array.isArray(parsed)) return parsed;
        } catch (e) {
          console.warn("Could not parse saved psychological logs history", e);
        }
      }
      const single = localStorage.getItem("ssma_psychological_log");
      if (single) {
        try {
          return [JSON.parse(single)];
        } catch {
          return [];
        }
      }
      return [];
    }
  );

  // Training Performance History State
  const [attempts, setAttempts] = useState<TrainingAttempt[]>(() => {
    const saved = localStorage.getItem("ssma_training_attempts");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.warn("Could not parse saved training attempts", e);
      }
    }
    return [];
  });

  // Check LGPD consent on mount
  useEffect(() => {
    const agreed = localStorage.getItem("ssma_lgpd_consent_agreed");
    if (!agreed) {
      setShowLGPDModal(true);
    }
  }, []);

  function handleAcceptLGPD() {
    localStorage.setItem("ssma_lgpd_consent_agreed", "true");
    setShowLGPDModal(false);
  }

  function handleUpdateCustomLogo(logoDataUrl: string | null) {
    setCustomLogo(logoDataUrl);
    if (logoDataUrl) {
      localStorage.setItem("ssma_custom_logo", logoDataUrl);
    } else {
      localStorage.removeItem("ssma_custom_logo");
    }
  }

  function handleUpdateLicenseExpirationDate(dateStr: string) {
    setLicenseExpirationDate(dateStr);
    localStorage.setItem("ssma_license_expiration_date", dateStr);
  }

  function handleUpdateLicenseKey(key: string) {
    setLicenseKey(key);
    localStorage.setItem("ssma_enterprise_license_key", key);
  }

  function handleUpdateDynamicKey(key: string) {
    setDynamicKey(key);
    localStorage.setItem("ssma_dynamic_exchange_key", key);
  }

  function handleRestoreLocalData(data: {
    attempts?: TrainingAttempt[];
    userLog?: PsychologicalLog | null;
    psychologicalLogs?: PsychologicalLog[];
  }) {
    if (data.attempts !== undefined) {
      setAttempts(data.attempts);
      localStorage.setItem(
        "ssma_training_attempts",
        JSON.stringify(data.attempts.slice(0, 50))
      );
    }
    if (data.userLog !== undefined) {
      setUserLog(data.userLog);
      if (data.userLog) {
        localStorage.setItem(
          "ssma_psychological_log",
          JSON.stringify(data.userLog)
        );
      } else {
        localStorage.removeItem("ssma_psychological_log");
      }
    }
    if (data.psychologicalLogs !== undefined) {
      setPsychologicalLogs(data.psychologicalLogs);
      localStorage.setItem(
        "ssma_psychological_logs_history",
        JSON.stringify(data.psychologicalLogs.slice(0, 100))
      );
    } else if (data.userLog) {
      setPsychologicalLogs((prev) => {
        const updated = [data.userLog!, ...prev].slice(0, 100);
        localStorage.setItem(
          "ssma_psychological_logs_history",
          JSON.stringify(updated)
        );
        return updated;
      });
    } else if (data.userLog === null) {
      setPsychologicalLogs([]);
      localStorage.removeItem("ssma_psychological_logs_history");
    }
  }

  // Update current scenario when sector changes
  function handleSelectSector(sectorId: number) {
    setSelectedSectorId(sectorId);
    const targetSector = ECONOMIC_SECTORS.find((s) => s.id === sectorId);
    if (!targetSector) return;

    const found = INITIAL_SCENARIOS.find(
      (sc) => sc.sector === targetSector.name
    );
    if (found) {
      setCurrentScenario(found);
    }
  }

  // Next Scenario: query backend AI generator or next from curated
  async function handleNextScenario() {
    setIsGeneratingAI(true);
    const targetSector = ECONOMIC_SECTORS.find(
      (s) => s.id === selectedSectorId
    );
    const sectorName = targetSector ? targetSector.name : "Construção Civil";

    try {
      const res = await fetch("/api/scenarios/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sector: sectorName,
          riskLevel: "Alto",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.scenario) {
          setCurrentScenario(data.scenario);
          return;
        }
      }
    } catch (e) {
      console.warn(
        "Failed to generate dynamic AI scenario, picking from curated pool",
        e
      );
    } finally {
      setIsGeneratingAI(false);
    }

    const sectorScenarios = INITIAL_SCENARIOS.filter(
      (s) => s.sector === sectorName
    );
    const nextOne =
      sectorScenarios[Math.floor(Math.random() * sectorScenarios.length)];
    if (nextOne) {
      setCurrentScenario(nextOne);
    }
  }

  function handleCheckInCompleted(log: PsychologicalLog) {
    setUserLog(log);
    localStorage.setItem("ssma_psychological_log", JSON.stringify(log));
    setPsychologicalLogs((prev) => {
      const updated = [log, ...prev].slice(0, 100);
      localStorage.setItem(
        "ssma_psychological_logs_history",
        JSON.stringify(updated)
      );
      return updated;
    });

    if (log.totalMentalLoad >= 7) {
      setActiveTab("decompression");
    } else {
      setActiveTab("training");
    }
  }

  function handleAttemptCompleted(attempt: TrainingAttempt) {
    setAttempts((prev) => {
      const updated = [attempt, ...prev];
      localStorage.setItem(
        "ssma_training_attempts",
        JSON.stringify(updated.slice(0, 50))
      );

      const newlyUnlocked = USER_BADGES.find(
        (b) => b.requiredScenarios === updated.length
      );
      if (newlyUnlocked) {
        setUnlockedBadgeCelebration(newlyUnlocked);
      }

      return updated;
    });
  }

  function handlePlayGeneratedScenario(scenario: TestScenario) {
    const sec = ECONOMIC_SECTORS.find((s) => s.name === scenario.sector);
    if (sec) {
      setSelectedSectorId(sec.id);
    }
    setCurrentScenario(scenario);
    setActiveTab("training");
  }

  // Settings Tab Access Control
  function handleSelectSettingsTab(subTab: "general" | "developer" = "general") {
    setSettingsInitialSubTab(subTab);
    if (!isPasswordRequired || isSettingsUnlocked) {
      setActiveTab("settings");
    } else {
      setShowPasswordModal(true);
    }
  }

  function handlePasswordSuccess() {
    setIsSettingsUnlocked(true);
    setShowPasswordModal(false);
    setActiveTab("settings");
  }

  function handleUpdatePassword(newPass: string) {
    setSettingsPassword(newPass);
    localStorage.setItem("ssma_settings_password", newPass);
  }

  function handleResetPasswordToDefault() {
    setSettingsPassword("keysander5361");
    localStorage.setItem("ssma_settings_password", "keysander5361");
  }

  function handleTogglePasswordRequired(required: boolean) {
    setIsPasswordRequired(required);
    localStorage.setItem("ssma_settings_password_required", String(required));
  }

  function handleLockSessionNow() {
    setIsSettingsUnlocked(false);
    setActiveTab("menu");
  }

  function handleToggleMotion(enabled: boolean) {
    setMotionEnabled(enabled);
    localStorage.setItem("ssma_motion_enabled", String(enabled));
  }

  function handleClearHistory() {
    setAttempts([]);
    localStorage.removeItem("ssma_training_attempts");
  }

  // Calculate high-level training stats
  const totalAttempts = attempts.length;
  const correctCount = attempts.filter((a) => a.isCorrect).length;
  const accuracy =
    totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 100;
  const activeSector =
    ECONOMIC_SECTORS.find((s) => s.id === selectedSectorId) ||
    ECONOMIC_SECTORS[0];

  const tabMotionProps = motionEnabled
    ? {
        initial: { opacity: 0, y: 12, scale: 0.995 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: -10, scale: 0.995 },
        transition: {
          duration: 0.22,
          ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
        },
      }
    : {};

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-teal-600 selection:text-white transition-colors duration-200">
      {/* Splash Screen on Entry with Centered Corporate Logo */}
      <AnimatePresence>
        {showSplash && (
          <SplashScreen
            onFinish={() => setShowSplash(false)}
            customLogo={customLogo}
          />
        )}
      </AnimatePresence>

      {/* LGPD Consent Modal */}
      <LGPDConsentModal isOpen={showLGPDModal} onAccept={handleAcceptLGPD} />

      {/* Settings Password Prompt Modal */}
      <PasswordPromptModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSuccess={handlePasswordSuccess}
        currentPassword={settingsPassword}
        onResetToDefault={handleResetPasswordToDefault}
      />

      {/* Exact-Day License Expiration Alert Modal */}
      <LicenseExpirationModal
        isOpen={showExpirationModal}
        onClose={() => setShowExpirationModal(false)}
        onOpenDeveloperLicenseTab={() => handleSelectSettingsTab("developer")}
        expirationDate={licenseExpirationDate}
        licenseKey={licenseKey}
        dynamicKey={dynamicKey}
        developerEmail={
          localStorage.getItem("ssma_developer_contact") ||
          "beisander2@gmail.com"
        }
      />

      {/* Badge Unlock Celebration Modal */}
      <BadgeUnlockModal
        badge={unlockedBadgeCelebration}
        onClose={() => setUnlockedBadgeCelebration(null)}
        onViewAllBadges={() => {
          setUnlockedBadgeCelebration(null);
          setActiveTab("menu");
        }}
      />

      {/* Simplified Clean Header / Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedSectorId={selectedSectorId}
        setSelectedSectorId={handleSelectSector}
        userLog={userLog}
        onOpenLGPDModal={() => setShowLGPDModal(true)}
        isSettingsPasswordProtected={isPasswordRequired}
        isSettingsUnlocked={isSettingsUnlocked}
        onSelectSettingsTab={() => handleSelectSettingsTab("general")}
        motionEnabled={motionEnabled}
        customLogo={customLogo}
      />

      {/* Web Notification In-App Toast Banner */}
      <NotificationReminderToast
        alert={reminder.inAppAlert}
        onDismiss={reminder.dismissInAppAlert}
        onNavigateToCheckIn={() => setActiveTab("checkin")}
      />

      {/* Content Area with Dynamic Animated Transitions */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <AnimatePresence mode="wait">
          {/* VIEW 0: BENTO GRID MENU (MAIN MENU) */}
          {activeTab === "menu" && (
            <motion.div key="tab-menu-content" {...tabMotionProps}>
              <BentoGridMenu
                onSelectModule={(module) => setActiveTab(module)}
                userLog={userLog}
                totalAttempts={totalAttempts}
                accuracy={accuracy}
                currentSectorName={activeSector.name}
              />
            </motion.div>
          )}

          {/* VIEW 1: TRAINING / SIMULATOR */}
          {activeTab === "training" && (
            <motion.div
              key="tab-training-content"
              {...tabMotionProps}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveTab("menu")}
                  className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-teal-700 transition-colors cursor-pointer px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 shadow-2xs"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-teal-600" />
                  <span>
                    {language === "es"
                      ? "Volver al Menú Principal"
                      : language === "en"
                      ? "Back to Main Menu"
                      : "Voltar ao Menu Principal"}
                  </span>
                </button>
                <span className="text-xs text-slate-500 font-semibold">
                  Simulador SST • Time-Attack
                </span>
              </div>

              <SectorGrid
                selectedSectorId={selectedSectorId}
                onSelectSector={(s) => handleSelectSector(s.id)}
              />

              {/* Performance Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shrink-0">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 font-semibold block">
                      {t("statNormativeAccuracy")}
                    </span>
                    <span className="text-base font-extrabold text-slate-900">
                      {accuracy}%
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shrink-0">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 font-semibold block">
                      {t("statEvaluatedScenarios")}
                    </span>
                    <span className="text-base font-extrabold text-slate-900">
                      {totalAttempts}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
                    <Flame className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 font-semibold block">
                      {t("statActiveTimeAttack")}
                    </span>
                    <span className="text-base font-extrabold text-amber-800">
                      {userLog && userLog.totalMentalLoad >= 7
                        ? t("statLoadHigh")
                        : userLog && userLog.totalMentalLoad <= 4
                        ? t("statLoadChallenge")
                        : t("statLoadStandard")}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 font-semibold block">
                      {t("statCurrentSector")}
                    </span>
                    <span className="text-xs font-extrabold text-slate-900 truncate max-w-[130px] block">
                      {activeSector.name}
                    </span>
                  </div>
                </div>
              </div>

              <ScenarioPlayer
                scenario={currentScenario}
                userLog={userLog}
                onNextScenario={handleNextScenario}
                onOpenDecompression={() => setActiveTab("decompression")}
                onAttemptCompleted={handleAttemptCompleted}
                isGeneratingAI={isGeneratingAI}
              />
            </motion.div>
          )}

          {/* VIEW 2: CHECK-IN EMOCIONAL */}
          {activeTab === "checkin" && (
            <motion.div
              key="tab-checkin-content"
              {...tabMotionProps}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveTab("menu")}
                  className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-teal-700 transition-colors cursor-pointer px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 shadow-2xs"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-teal-600" />
                  <span>
                    {language === "es"
                      ? "Volver al Menú Principal"
                      : language === "en"
                      ? "Back to Main Menu"
                      : "Voltar ao Menu Principal"}
                  </span>
                </button>
              </div>

              <CheckInView
                onCheckInCompleted={handleCheckInCompleted}
                currentSector={activeSector.name}
                currentSectorId={activeSector.id}
                reminderConfig={reminder.config}
                onOpenReminderSettings={() =>
                  handleSelectSettingsTab("general")
                }
                onSendTestNotification={reminder.sendTestNotification}
              />
            </motion.div>
          )}

          {/* VIEW 3: DECOMPRESSÃO */}
          {activeTab === "decompression" && (
            <motion.div
              key="tab-decompression-content"
              {...tabMotionProps}
              className="max-w-4xl mx-auto space-y-4"
            >
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveTab("menu")}
                  className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-teal-700 transition-colors cursor-pointer px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 shadow-2xs"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-teal-600" />
                  <span>
                    {language === "es"
                      ? "Volver al Menú Principal"
                      : language === "en"
                      ? "Back to Main Menu"
                      : "Voltar ao Menu Principal"}
                  </span>
                </button>
              </div>

              <DecompressionModule onFinish={() => setActiveTab("training")} />
            </motion.div>
          )}

          {/* VIEW 4: GERADOR IA */}
          {activeTab === "generator" && (
            <motion.div
              key="tab-generator-content"
              {...tabMotionProps}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveTab("menu")}
                  className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-teal-700 transition-colors cursor-pointer px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 shadow-2xs"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-teal-600" />
                  <span>
                    {language === "es"
                      ? "Volver al Menú Principal"
                      : language === "en"
                      ? "Back to Main Menu"
                      : "Voltar ao Menu Principal"}
                  </span>
                </button>
              </div>

              <AIGeneratorView
                onLoadScenarioToPlay={handlePlayGeneratedScenario}
                initialSectorName={activeSector.name}
              />
            </motion.div>
          )}

          {/* VIEW 5: PAINEL SESMT & LGPD */}
          {activeTab === "sesmt" && (
            <motion.div
              key="tab-sesmt-content"
              {...tabMotionProps}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveTab("menu")}
                  className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-teal-700 transition-colors cursor-pointer px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 shadow-2xs"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-teal-600" />
                  <span>
                    {language === "es"
                      ? "Volver al Menú Principal"
                      : language === "en"
                      ? "Back to Main Menu"
                      : "Voltar ao Menu Principal"}
                  </span>
                </button>
              </div>

              <SESMTDashboard
                attempts={attempts}
                psychologicalLogs={psychologicalLogs}
              />
            </motion.div>
          )}

          {/* VIEW 6: CONFIGURAÇÕES & MODO DESARROLLADOR */}
          {activeTab === "settings" && (
            <motion.div
              key="tab-settings-content"
              {...tabMotionProps}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveTab("menu")}
                  className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-teal-700 transition-colors cursor-pointer px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 shadow-2xs"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-teal-600" />
                  <span>
                    {language === "es"
                      ? "Volver al Menú Principal"
                      : language === "en"
                      ? "Back to Main Menu"
                      : "Voltar ao Menu Principal"}
                  </span>
                </button>
              </div>

              <SettingsView
                currentPassword={settingsPassword}
                onUpdatePassword={handleUpdatePassword}
                onResetPassword={handleResetPasswordToDefault}
                isPasswordRequired={isPasswordRequired}
                onTogglePasswordRequired={handleTogglePasswordRequired}
                onLockSessionNow={handleLockSessionNow}
                motionEnabled={motionEnabled}
                onToggleMotion={handleToggleMotion}
                onClearHistory={handleClearHistory}
                totalAttempts={totalAttempts}
                attempts={attempts}
                userLog={userLog}
                onRestoreLocalData={handleRestoreLocalData}
                customLogo={customLogo}
                onUpdateCustomLogo={handleUpdateCustomLogo}
                licenseExpirationDate={licenseExpirationDate}
                onUpdateLicenseExpirationDate={
                  handleUpdateLicenseExpirationDate
                }
                licenseKey={licenseKey}
                onUpdateLicenseKey={handleUpdateLicenseKey}
                dynamicKey={dynamicKey}
                onUpdateDynamicKey={handleUpdateDynamicKey}
                onTriggerExpirationPopupNow={() => setShowExpirationModal(true)}
                initialSubTab={settingsInitialSubTab}
                themePreference={themePreference}
                resolvedTheme={resolvedTheme}
                systemTheme={systemTheme}
                onChangeThemePreference={setThemePreference}
                notificationReminder={reminder}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Clean Corporate Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-slate-600 dark:text-slate-400 text-xs text-center space-y-2 transition-colors">
        <div className="flex flex-wrap justify-center items-center gap-4">
          <span className="text-slate-800 font-bold">{t("footerRights")}</span>
          <span>•</span>
          <span>{t("footerNorms")}</span>
          <span>•</span>
          <button
            type="button"
            onClick={() => setShowLGPDModal(true)}
            className="text-teal-700 font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            {t("footerLgpd")}
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
        <p className="text-[11px] text-slate-500 max-w-2xl mx-auto px-4">
          {t("footerDisclaimer")}
        </p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
