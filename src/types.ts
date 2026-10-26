export interface SectorInfo {
  id: number;
  name: string;
  shortCode: string;
  norms: string;
  normList: string[];
  focusDescription: string;
  iconName: string;
  riskClass: "Pelo CNAE";
  primaryColor: string;
}

export interface ScenarioOption {
  id: string;
  text: string;
  is_correct: boolean;
  justification: string;
}

export interface TestScenario {
  scenario_id: string;
  sector: string;
  norm_reference: string;
  situation_description: string;
  environmental_conditions: string;
  human_factor_pressure: string;
  options: ScenarioOption[];
  risk_level: "Moderado" | "Alto" | "Crítico";
}

export interface PsychologicalLog {
  id?: string;
  userId: string;
  workerHash?: string;
  shiftStage: "START" | "END";
  anxietyScore: number;
  fatigueScore: number;
  focusScore?: number;
  totalMentalLoad: number;
  decompressionTriggered: boolean;
  loggedAt: string;
}

export interface TrainingAttempt {
  id: string;
  scenarioId: string;
  sector: string;
  normReference: string;
  selectedOptionId: string;
  isCorrect: boolean;
  timeSpentSeconds: number;
  allocatedTimeSeconds: number;
  mentalLoadAtTime: number;
  timestamp: string;
}

export interface SectorAggregatedStats {
  sectorId: number;
  sectorName: string;
  totalEvaluations: number;
  avgAnxiety: number;
  avgFatigue: number;
  avgMentalLoad: number;
  decompressionRate: number;
  riskLevel: "Estável" | "Moderado" | "Crítico";
  anonymizedLogs?: Array<{
    workerHash: string;
    decompressionTriggered: boolean;
    timestamp: string;
    shiftStage: string;
  }>;
}

export interface UserBadge {
  id: string;
  titleKey: string;
  defaultTitle: string;
  tagline: string;
  description: string;
  requiredScenarios: number;
  tier: number;
  iconName: "award" | "eye" | "file-check" | "zap" | "crown";
  colorClass: string;
  bgGlowClass: string;
  borderClass: string;
}
