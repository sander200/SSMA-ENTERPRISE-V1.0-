import { UserBadge } from "../types";

export const USER_BADGES: UserBadge[] = [
  {
    id: "safety-novice",
    titleKey: "badgeSafetyNovice",
    defaultTitle: "Safety Novice",
    tagline: "Primeiro passo na conformidade operacional",
    description: "Concluiu seu 1º cenário de treinamento sob normas regulamentadoras (NRs).",
    requiredScenarios: 1,
    tier: 1,
    iconName: "award",
    colorClass: "text-emerald-400 bg-emerald-500/15 border-emerald-500/40",
    bgGlowClass: "bg-emerald-500/15 group-hover:bg-emerald-500/25",
    borderClass: "border-emerald-500/50 hover:border-emerald-400",
  },
  {
    id: "risk-spotter",
    titleKey: "badgeRiskSpotter",
    defaultTitle: "Risk Spotter",
    tagline: "Vigilância técnica e identificação de perigos",
    description: "Superou 3 cenários de risco ocupacional com análise técnica assertiva.",
    requiredScenarios: 3,
    tier: 2,
    iconName: "eye",
    colorClass: "text-cyan-400 bg-cyan-500/15 border-cyan-500/40",
    bgGlowClass: "bg-cyan-500/15 group-hover:bg-cyan-500/25",
    borderClass: "border-cyan-500/50 hover:border-cyan-400",
  },
  {
    id: "compliance-practitioner",
    titleKey: "badgeCompliancePractitioner",
    defaultTitle: "Compliance Practitioner",
    tagline: "Aplicação consistente de NRs em campo",
    description: "Alcançou 5 cenários resolvidos demonstrando retenção das normas de segurança.",
    requiredScenarios: 5,
    tier: 3,
    iconName: "file-check",
    colorClass: "text-blue-400 bg-blue-500/15 border-blue-500/40",
    bgGlowClass: "bg-blue-500/15 group-hover:bg-blue-500/25",
    borderClass: "border-blue-500/50 hover:border-blue-400",
  },
  {
    id: "compliance-expert",
    titleKey: "badgeComplianceExpert",
    defaultTitle: "Compliance Expert",
    tagline: "Domínio avançado de segurança e saúde no trabalho",
    description: "Completou 10 cenários normativos demonstrando rapidez, consistência e rigor técnico.",
    requiredScenarios: 10,
    tier: 4,
    iconName: "zap",
    colorClass: "text-amber-400 bg-amber-500/15 border-amber-500/40",
    bgGlowClass: "bg-amber-500/15 group-hover:bg-amber-500/25",
    borderClass: "border-amber-500/50 hover:border-amber-400",
  },
  {
    id: "master-guardian",
    titleKey: "badgeMasterGuardian",
    defaultTitle: "Master Safety Guardian",
    tagline: "Liderança e excelência em prevenção de acidentes",
    description: "Completou 20 cenários de simulação, tornando-se referência institucional de zero acidente.",
    requiredScenarios: 20,
    tier: 5,
    iconName: "crown",
    colorClass: "text-purple-400 bg-purple-500/15 border-purple-500/40",
    bgGlowClass: "bg-purple-500/15 group-hover:bg-purple-500/25",
    borderClass: "border-purple-500/50 hover:border-purple-400",
  },
];

export interface BadgeProgress {
  badge: UserBadge;
  isUnlocked: boolean;
  progressPercent: number;
  currentCount: number;
  remainingCount: number;
}

/**
 * Returns the status and progress for every badge based on completed scenario count
 */
export function getBadgesStatus(completedCount: number): BadgeProgress[] {
  return USER_BADGES.map((badge) => {
    const isUnlocked = completedCount >= badge.requiredScenarios;
    const progressPercent = Math.min(
      100,
      Math.round((completedCount / badge.requiredScenarios) * 100)
    );
    const remainingCount = Math.max(0, badge.requiredScenarios - completedCount);

    return {
      badge,
      isUnlocked,
      progressPercent,
      currentCount: completedCount,
      remainingCount,
    };
  });
}

/**
 * Returns the highest unlocked badge, or null if none unlocked yet
 */
export function getHighestUnlockedBadge(completedCount: number): UserBadge | null {
  const unlocked = USER_BADGES.filter((b) => completedCount >= b.requiredScenarios);
  if (unlocked.length === 0) return null;
  return unlocked[unlocked.length - 1];
}

/**
 * Returns the next badge in line to be unlocked, or null if all unlocked
 */
export function getNextBadgeToUnlock(completedCount: number): UserBadge | null {
  return USER_BADGES.find((b) => completedCount < b.requiredScenarios) || null;
}
