export type ExperienceLevel = 'novice' | 'intermediate' | 'expert';

export interface ExperienceProfile {
  label: string;
  prompts: string[];
}

const PROFILES: Record<ExperienceLevel, ExperienceProfile> = {
  novice: {
    label: 'Beginner',
    prompts: [
      'What stocks should a beginner buy?',
      'Explain what P/E ratio means',
      'How do I build a portfolio?',
      'What is diversification?',
      'What are ETFs?',
    ],
  },
  intermediate: {
    label: 'Intermediate',
    prompts: [
      'What are today\'s top momentum plays?',
      'Analyze my watchlist risk',
      'Compare NVDA vs AMD for Q2',
      'What macro signals should I watch?',
      'Identify sector rotation opportunities',
    ],
  },
  expert: {
    label: 'Expert',
    prompts: [
      'Run a factor analysis on my portfolio',
      'What is the yield curve signaling?',
      'Identify arbitrage in semis',
      'Summarize today\'s Fed commentary impact',
      'What are the highest-conviction AI trades?',
    ],
  },
};

function mapApiLevelToExperience(
  level: string | null | undefined,
): ExperienceLevel {
  if (!level) return 'intermediate';
  if (level === 'beginner') return 'novice';
  if (level === 'advanced') return 'expert';
  if (level === 'novice' || level === 'intermediate' || level === 'expert') {
    return level as ExperienceLevel;
  }
  return 'intermediate';
}

export function getExperienceProfile(
  level?: ExperienceLevel | null,
): ExperienceProfile {
  const key = level ?? 'intermediate';
  return PROFILES[key] ?? PROFILES.intermediate;
}

export function getSuggestedPrompts(
  prefs: {
    experience_level?: string | null;
    risk_tolerance?: string | null;
    interests?: string[];
  } | null,
): string[] {
  const level = mapApiLevelToExperience(prefs?.experience_level);
  const profile = getExperienceProfile(level);
  const base = [...profile.prompts];

  if (prefs?.interests && prefs.interests.length > 0) {
    base.unshift(`Explain the outlook for ${prefs.interests[0]} this week.`);
  }

  return base.slice(0, 5);
}
