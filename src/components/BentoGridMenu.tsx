import React from "react";
import {
  Brain,
  HeartPulse,
  Wind,
  Bot,
  BarChart3,
  ShieldCheck,
  ArrowRight,
  Flame,
  Lock,
  Sparkles,
  Trophy,
  Activity,
  Layers,
  Building2,
  Mail,
} from "lucide-react";
import { motion } from "motion/react";
import { useLanguage } from "../i18n/LanguageContext";
import { PsychologicalLog } from "../types";

export type ModuleTab = "training" | "checkin" | "decompression" | "generator" | "sesmt";

interface Props {
  onSelectModule: (module: ModuleTab) => void;
  userLog: PsychologicalLog | null;
  totalAttempts: number;
  accuracy: number;
  currentSectorName: string;
}

export function BentoGridMenu({
  onSelectModule,
  userLog,
  totalAttempts,
  accuracy,
  currentSectorName,
}: Props) {
  const { t, language } = useLanguage();
  const mentalLoad = userLog?.totalMentalLoad ?? 0;

  return (
    <div className="space-y-6 max-w-6xl mx-auto w-full">
      {/* Bento Grid Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-800/80 p-6 rounded-3xl border border-slate-700/60 shadow-lg backdrop-blur-md">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs font-semibold mb-1.5">
            <Layers className="w-3.5 h-3.5" />
            <span>
              {language === "es"
                ? "Centro de Control Operativo"
                : language === "en"
                ? "Operations Control Center"
                : "Centro de Controle Operacional"}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {language === "es"
              ? "Menú Principal • Módulos SST"
              : language === "en"
              ? "Main Menu • OSH Modules"
              : "Menu Principal • Módulos SST"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            {language === "es"
              ? "Seleccione un módulo interactivo para iniciar simulaciones, registros profilácticos o auditoría de gestión."
              : language === "en"
              ? "Select an interactive module to start simulations, psychological logs, or management audit."
              : "Selecione um módulo interativo para iniciar simulações, registros profiláticos ou auditoria de gestão."}
          </p>
        </div>

        {/* Live Status Summary Chip */}
        <div className="flex items-center gap-3 bg-slate-900/70 p-3 rounded-2xl border border-slate-700/60 text-xs self-start sm:self-auto">
          <div className="text-right">
            <span className="text-slate-400 block text-[11px]">
              {language === "es" ? "Sector Activo" : language === "en" ? "Active Sector" : "Setor Ativo"}
            </span>
            <span className="font-bold text-white max-w-[130px] truncate block">
              {currentSectorName}
            </span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-500/40 text-teal-300 flex items-center justify-center shrink-0">
            <Building2 className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Bento Grid Layout - Interactive Square Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* CARD 1: SIMULADOR SST (Square Bento Card) */}
        <motion.button
          type="button"
          onClick={() => onSelectModule("training")}
          whileHover={{ y: -5, scale: 1.015 }}
          whileTap={{ scale: 0.985 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="group relative p-6 rounded-3xl bg-slate-800/90 border border-slate-700/70 hover:border-teal-500/80 shadow-lg hover:shadow-teal-950/40 text-left flex flex-col justify-between aspect-square transition-colors cursor-pointer overflow-hidden"
        >
          {/* Subtle hover gradient glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl group-hover:bg-teal-500/20 transition-all pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-teal-500/15 border border-teal-500/30 text-teal-400 flex items-center justify-center shadow-inner group-hover:bg-teal-500/25 group-hover:text-teal-300 transition-colors">
                <Brain className="w-7 h-7" />
              </div>
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/40">
                Time-Attack
              </span>
            </div>

            <h3 className="text-xl font-bold text-white group-hover:text-teal-300 transition-colors">
              {t("tabTraining")}
            </h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              {language === "es"
                ? "Entrenamiento reactivo y toma de decisiones técnicas bajo presión normativa estricta (NRs)."
                : language === "en"
                ? "Time-attack safety decision simulator under strict regulatory standards (OSH)."
                : "Treinamento reativo e tomada de decisão técnica sob pressão normativa estrita (NRs)."}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-700/60 flex items-center justify-between">
            <div className="text-xs font-mono text-slate-400">
              <span className="text-white font-bold">{accuracy}%</span> precisão •{" "}
              <span className="text-teal-300 font-bold">{totalAttempts}</span> cenários
            </div>
            <div className="w-8 h-8 rounded-xl bg-slate-900/80 flex items-center justify-center text-teal-400 group-hover:translate-x-1 group-hover:bg-teal-600 group-hover:text-white transition-all shadow-sm">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </motion.button>

        {/* CARD 2: CHECK-IN EMOCIONAL (Square Bento Card) */}
        <motion.button
          type="button"
          onClick={() => onSelectModule("checkin")}
          whileHover={{ y: -5, scale: 1.015 }}
          whileTap={{ scale: 0.985 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="group relative p-6 rounded-3xl bg-slate-800/90 border border-slate-700/70 hover:border-rose-500/80 shadow-lg hover:shadow-rose-950/40 text-left flex flex-col justify-between aspect-square transition-colors cursor-pointer overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl group-hover:bg-rose-500/20 transition-all pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center shadow-inner group-hover:bg-rose-500/25 group-hover:text-rose-300 transition-colors">
                <HeartPulse className="w-7 h-7" />
              </div>
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                LGPD Art. 11/13
              </span>
            </div>

            <h3 className="text-xl font-bold text-white group-hover:text-rose-300 transition-colors">
              {t("tabCheckin")}
            </h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              {language === "es"
                ? "Registro anónimo de carga mental, estrés, fatiga y aptitud psicofísica antes y después del turno."
                : language === "en"
                ? "Anonymous tracking of mental load, fatigue, anxiety, and fitness-for-duty pre/post shift."
                : "Registro anônimo de carga mental, estresse, fadiga e aptidão psicofísica antes e após o turno."}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-700/60 flex items-center justify-between">
            <div className="text-xs text-slate-400">
              {userLog ? (
                <span>
                  Carga atual: <strong className="text-rose-300">{userLog.totalMentalLoad}/10</strong>
                </span>
              ) : (
                <span className="text-amber-300 font-medium">0 registros • Pendente</span>
              )}
            </div>
            <div className="w-8 h-8 rounded-xl bg-slate-900/80 flex items-center justify-center text-rose-400 group-hover:translate-x-1 group-hover:bg-rose-600 group-hover:text-white transition-all shadow-sm">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </motion.button>

        {/* CARD 3: MÓDULO DESCOMPRESSÃO (Square Bento Card) */}
        <motion.button
          type="button"
          onClick={() => onSelectModule("decompression")}
          whileHover={{ y: -5, scale: 1.015 }}
          whileTap={{ scale: 0.985 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="group relative p-6 rounded-3xl bg-slate-800/90 border border-slate-700/70 hover:border-cyan-500/80 shadow-lg hover:shadow-cyan-950/40 text-left flex flex-col justify-between aspect-square transition-colors cursor-pointer overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shadow-inner group-hover:bg-cyan-500/25 group-hover:text-cyan-300 transition-colors">
                <Wind className="w-7 h-7" />
              </div>
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                Profilaxia
              </span>
            </div>

            <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
              {t("tabDecompression")}
            </h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              {language === "es"
                ? "Pausa activa con respiración diafragmática 4-7-8, grounding sensorial y micro-pausas ergonómicas."
                : language === "en"
                ? "Active recovery with 4-7-8 diaphragmatic breathing, 5-4-3-2-1 grounding, and ergonomic breaks."
                : "Pausa ativa com respiração diafragmática 4-7-8, grounding sensorial e micro-pausas ergonômicas."}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-700/60 flex items-center justify-between">
            <span className="text-xs font-medium text-cyan-300">
              3 Protocolos Clínicos
            </span>
            <div className="w-8 h-8 rounded-xl bg-slate-900/80 flex items-center justify-center text-cyan-400 group-hover:translate-x-1 group-hover:bg-cyan-600 group-hover:text-white transition-all shadow-sm">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </motion.button>

        {/* CARD 4: GERADOR DE CENÁRIOS IA (Square Bento Card) */}
        <motion.button
          type="button"
          onClick={() => onSelectModule("generator")}
          whileHover={{ y: -5, scale: 1.015 }}
          whileTap={{ scale: 0.985 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="group relative p-6 rounded-3xl bg-slate-800/90 border border-slate-700/70 hover:border-purple-500/80 shadow-lg hover:shadow-purple-950/40 text-left flex flex-col justify-between aspect-square transition-colors cursor-pointer overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center shadow-inner group-hover:bg-purple-500/25 group-hover:text-purple-300 transition-colors">
                <Bot className="w-7 h-7" />
              </div>
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                IA Generativa
              </span>
            </div>

            <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
              {t("tabGenerator")}
            </h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              {language === "es"
                ? "Simulación de incidentes y fiscalizaciones imprevistas creadas por IA con validación legal estricta."
                : language === "en"
                ? "Dynamic incident generator with zero-hallucination compliance checking."
                : "Simulação de incidentes e fiscalizações imprevistas criadas por IA com validação legal estrita."}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-700/60 flex items-center justify-between">
            <span className="text-xs font-medium text-purple-300">
              6 Setores Econômicos
            </span>
            <div className="w-8 h-8 rounded-xl bg-slate-900/80 flex items-center justify-center text-purple-400 group-hover:translate-x-1 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-sm">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </motion.button>

        {/* CARD 5: PAINEL SST & PRIVACIDADE + ENVIO EMAIL (Spans 2 columns on lg for balanced bento grid) */}
        <motion.button
          type="button"
          onClick={() => onSelectModule("sesmt")}
          whileHover={{ y: -5, scale: 1.015 }}
          whileTap={{ scale: 0.985 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="group relative p-6 rounded-3xl bg-slate-800/90 border border-slate-700/70 hover:border-emerald-500/80 shadow-lg hover:shadow-emerald-950/40 text-left flex flex-col justify-between md:col-span-2 lg:col-span-2 transition-colors cursor-pointer overflow-hidden min-h-[220px]"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-inner group-hover:bg-emerald-500/25 group-hover:text-emerald-300 transition-colors">
                  <BarChart3 className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {t("tabSesmt")}
                  </h3>
                  <span className="text-xs text-slate-400">
                    SESMT & CIPA • Painel Executivo
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  <Mail className="w-3.5 h-3.5" />
                  Envio Gmail
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-slate-900 border border-slate-700 text-slate-300">
                  SHA-256
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
              {language === "es"
                ? "Visualización de métricas agregadas por sector, blindaje regulatorio contra uso punitivo, tabla de hashes criptográficos y botón directo para enviar el reporte confidencial por Gmail."
                : language === "en"
                ? "Aggregated sector metrics, non-punitive privacy shielding, cryptographic SHA-256 logs, and direct Gmail executive report dispatch."
                : "Visualização de métricas agregadas por setor, blindagem regulatória contra uso punitivo, tabela de hashes criptográficos e botão direto para enviar o relatório confidencial por Gmail."}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-700/60 flex items-center justify-between mt-4">
            <div className="flex items-center gap-2 text-xs text-emerald-300 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Conformidade Total LGPD Art. 11/13 • Pronto para Uso Interno</span>
            </div>
            <div className="w-8 h-8 rounded-xl bg-slate-900/80 flex items-center justify-center text-emerald-400 group-hover:translate-x-1 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </motion.button>
      </div>
    </div>
  );
}
