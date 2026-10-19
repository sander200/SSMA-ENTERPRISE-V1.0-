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
import { ECONOMIC_SECTORS, INITIAL_SCENARIOS } from "./data/sectors";
import { TestScenario, PsychologicalLog, TrainingAttempt } from "./types";
import { Trophy, CheckCircle, Flame, Shield, ArrowUpRight, ArrowLeft } from "lucide-react";
import { LanguageProvider, useLanguage } from "./i18n/LanguageContext";
import { motion, AnimatePresence } from "motion/react";

function AppContent() {
  const { t, language } = useLanguage();

  // Splash Screen State
  const [showSplash, setShowSplash] = useState<boolean>(() => {
    // Show splash on every reload for professional first-entry experience
    return true;
  });

  // Tab State - Starts on Bento Grid Menu
  const [activeTab, setActiveTab] = useState<TabType>("menu");
  const [selectedSectorId, setSelectedSectorId] = useState<number>(1);
  const [currentScenario, setCurrentScenario] = useState<TestScenario>(INITIAL_SCENARIOS[0]);
  const [isGeneratingAI, setIsGeneratingAI] = useState<boolean>(false);
  const [showLGPDModal, setShowLGPDModal] = useState<boolean>(false);

  // Settings & Password State
  const [settingsPassword, setSettingsPassword] = useState<string>(() => {
    return localStorage.getItem("ssma_settings_password") || "admin123";
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

  // User Psychological Profile State - Zero mock start for live enterprise recording
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

  // Training Performance History State - Zero mock start
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

  // Update current scenario when sector changes
  function handleSelectSector(sectorId: number) {
    setSelectedSectorId(sectorId);
    const targetSector = ECONOMIC_SECTORS.find((s) => s.id === sectorId);
    if (!targetSector) return;

    // Find initial scenario for this sector
    const found = INITIAL_SCENARIOS.find((sc) => sc.sector === targetSector.name);
    if (found) {
      setCurrentScenario(found);
    }
  }

  // Next Scenario: query backend AI generator or next from curated
  async function handleNextScenario() {
    setIsGeneratingAI(true);
    const targetSector = ECONOMIC_SECTORS.find((s) => s.id === selectedSectorId);
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
      console.warn("Failed to generate dynamic AI scenario, picking from curated pool", e);
    } finally {
      setIsGeneratingAI(false);
    }

    // Curated fallback
    const sectorScenarios = INITIAL_SCENARIOS.filter((s) => s.sector === sectorName);
    const nextOne = sectorScenarios[Math.floor(Math.random() * sectorScenarios.length)];
    if (nextOne) {
      setCurrentScenario(nextOne);
    }
  }

  function handleCheckInCompleted(log: PsychologicalLog) {
    setUserLog(log);
    localStorage.setItem("ssma_psychological_log", JSON.stringify(log));

    // If load is high, offer decompression
    if (log.totalMentalLoad >= 7) {
      setActiveTab("decompression");
    } else {
      setActiveTab("training");
    }
  }

  function handleAttemptCompleted(attempt: TrainingAttempt) {
    setAttempts((prev) => {
      const updated = [attempt, ...prev];
      localStorage.setItem("ssma_training_attempts", JSON.stringify(updated.slice(0, 50)));
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
  function handleSelectSettingsTab() {
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
    setSettingsPassword("admin123");
    localStorage.setItem("ssma_settings_password", "admin123");
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
  const accuracy = totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 100;
  const activeSector =
    ECONOMIC_SECTORS.find((s) => s.id === selectedSectorId) || ECONOMIC_SECTORS[0];

  const tabMotionProps = motionEnabled
    ? {
        initial: { opacity: 0, y: 12, scale: 0.995 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: -10, scale: 0.995 },
        transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
      }
    : {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-white">
      {/* Splash Screen on Entry */}
      <AnimatePresence>
        {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
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

      {/* Main Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedSectorId={selectedSectorId}
        setSelectedSectorId={handleSelectSector}
        userLog={userLog}
        onOpenLGPDModal={() => setShowLGPDModal(true)}
        isSettingsPasswordProtected={isPasswordRequired}
        isSettingsUnlocked={isSettingsUnlocked}
        onSelectSettingsTab={handleSelectSettingsTab}
        motionEnabled={motionEnabled}
      />

      {/* Content Area with Dynamic Animated Transitions */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <AnimatePresence mode="wait">
          {/* VIEW 0: BENTO GRID MENU (MAIN MENU) */}
          {activeTab === "menu" && (
            <motion.div
              key="tab-menu-content"
              {...tabMotionProps}
            >
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
              {/* Return to Bento Menu header link */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveTab("menu")}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-teal-300 transition-colors cursor-pointer px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-750 border border-slate-700/60"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-teal-400" />
                  <span>
                    {language === "es"
                      ? "Volver al Menú Principal"
                      : language === "en"
                      ? "Back to Main Menu"
                      : "Voltar ao Menu Principal"}
                  </span>
                </button>
                <span className="text-xs text-slate-400">
                  Simulação em Tempo Real • Time-Attack
                </span>
              </div>

              {/* Sector Selector Cards */}
              <SectorGrid
                selectedSectorId={selectedSectorId}
                onSelectSector={(s) => handleSelectSector(s.id)}
              />

              {/* Performance Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-800/80 p-4 rounded-2xl border border-slate-700/70 shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">
                      {t("statNormativeAccuracy")}
                    </span>
                    <span className="text-base font-bold text-white">{accuracy}%</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">
                      {t("statEvaluatedScenarios")}
                    </span>
                    <span className="text-base font-bold text-white">{totalAttempts}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                    <Flame className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">
                      {t("statActiveTimeAttack")}
                    </span>
                    <span className="text-base font-bold text-amber-300">
                      {userLog && userLog.totalMentalLoad >= 7
                        ? t("statLoadHigh")
                        : userLog && userLog.totalMentalLoad <= 4
                        ? t("statLoadChallenge")
                        : t("statLoadStandard")}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">
                      {t("statCurrentSector")}
                    </span>
                    <span className="text-xs font-bold text-slate-200 truncate max-w-[130px] block">
                      {activeSector.name}
                    </span>
                  </div>
                </div>
              </div>

              {/* Scenario Player Component */}
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
                  className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-teal-300 transition-colors cursor-pointer px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-750 border border-slate-700/60"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-teal-400" />
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
                  className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-teal-300 transition-colors cursor-pointer px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-750 border border-slate-700/60"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-teal-400" />
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
                  className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-teal-300 transition-colors cursor-pointer px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-750 border border-slate-700/60"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-teal-400" />
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
                  className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-teal-300 transition-colors cursor-pointer px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-750 border border-slate-700/60"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-teal-400" />
                  <span>
                    {language === "es"
                      ? "Volver al Menú Principal"
                      : language === "en"
                      ? "Back to Main Menu"
                      : "Voltar ao Menu Principal"}
                  </span>
                </button>
              </div>

              <SESMTDashboard />
            </motion.div>
          )}

          {/* VIEW 6: CONFIGURAÇÕES */}
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
                  className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-teal-300 transition-colors cursor-pointer px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-750 border border-slate-700/60"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-teal-400" />
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
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer - Visible APK download button removed */}
      <footer className="border-t border-slate-800/80 bg-slate-900/90 py-6 text-slate-400 text-xs text-center space-y-2">
        <div className="flex flex-wrap justify-center items-center gap-4">
          <span className="text-slate-300 font-semibold">{t("footerRights")}</span>
          <span>•</span>
          <span>{t("footerNorms")}</span>
          <span>•</span>
          <button
            type="button"
            onClick={() => setShowLGPDModal(true)}
            className="text-teal-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            {t("footerLgpd")}
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
        <p className="text-[11px] text-slate-400 max-w-2xl mx-auto px-4">
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
