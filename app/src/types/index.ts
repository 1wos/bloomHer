export interface Entry {
  id: string;
  date: string;
  content: string;
  skills: Skill[];
  encouragement?: string;
  createdAt: string;
}

export interface Skill {
  name: string;
  icon: string;
  description: string;
  category: 'analytical' | 'communication' | 'leadership' | 'creative' | 'emotional' | 'management';
  count?: number;
}

export interface WeeklyReport {
  weekStart: string;
  weekEnd: string;
  topSkills: { skill: Skill; count: number; examples: string[] }[];
  hiddenStrength: {
    insight: string;
    whyItMatters: string;
  };
  growthTrend: { skillName: string; count: number }[];
  nextOpportunity: string;
  growthGrass: boolean[]; // 7 days, true = logged
  empoweringMessage: string;
  metacognitiveQuestion: string;
}

export interface STARLInput {
  situation: string;
  task: string;
  action: string;
  result: string;
  learned: string;
}

export interface ReasoningStep {
  label: string;
  content: string;
}

export type VerificationState = 'pending' | 'approved' | 'edited' | 'rejected';

export interface STARLResult {
  structured: {
    situation: string;
    task: string;
    action: string;
    result: string;
    learned: string;
  };
  skillsDiscovered: { name: string; explanation: string }[];
  oneLineSummary: string;
  metacognitiveQuestion: string;
  reasoningSteps?: ReasoningStep[];
}

export interface GrowthDiscoveryResult {
  acknowledgment: string;
  skills: Skill[];
  encouragement: string;
  growthSticker?: string;
  metacognitiveQuestion?: string;
  reasoningSteps?: ReasoningStep[];
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export type AIProvider = 'gemini' | 'grok' | 'mock';

export interface AIConfig {
  provider: AIProvider;
  apiKey?: string;
}
