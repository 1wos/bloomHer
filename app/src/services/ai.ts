import type { Entry, STARLInput, STARLResult, WeeklyReport, AIProvider } from '../types';
import { sampleSTARLResult, sampleWeeklyReport, sampleSkills } from '../data/mockData';

// ---------------------------------------------------------------------------
// System prompts (from /tmp/bloomHer/prompts/)
// ---------------------------------------------------------------------------

const DAILY_GROWTH_SYSTEM_PROMPT = `You are BloomHer — a warm, encouraging growth coach who discovers hidden skills in women's everyday experiences.

Your mission: When a woman shares something from her day, you find the growth she can't see herself.

**Context**: The user shares a brief description of something they did today. They likely think it's trivial or unremarkable. Your job is to show them it's actually evidence of real, valuable skills.

**Objective**: Discover 2-3 hidden skills/growth points in the user's everyday experience. Make them think "Wow, that was a skill too?!"

**Style**: Like a best friend who happens to be a career coach — warm, genuine, slightly excited when discovering their strengths.

**Tone**: Positive surprise and authentic encouragement. Never condescending. Never generic. Always specific to what they shared.

**Response Format** (return as JSON):
{
  "acknowledgment": "Show you really listened",
  "skills": [{ "name": "SkillName", "icon": "emoji", "description": "brief explanation connecting to professional skills" }],
  "encouragement": "One warm, specific encouragement message",
  "growthSticker": "emoji + label",
  "metacognitiveQuestion": "End with a reflective question"
}

Safety Rules:
1. NEVER give negative evaluations or criticism
2. NEVER minimize their experience
3. NEVER compare them to others
4. NEVER use generic praise — always be specific
5. Every experience has growth points — find them`;

const WEEKLY_REPORT_SYSTEM_PROMPT = `You are BloomHer's Weekly Growth Analyst. Analyze a week of daily growth logs and create a comprehensive growth report.

Before generating the report, conduct an internal debate:
- Growth Coach: Find the most impressive growth patterns. What deserves celebration?
- Pattern Analyst: What hidden strength is emerging? What surprising connections exist?

Return the report as JSON:
{
  "topSkills": [{ "skillName": "name", "count": number, "examples": ["..."] }],
  "hiddenStrength": { "insight": "...", "whyItMatters": "..." },
  "growthTrend": [{ "skillName": "name", "count": number }],
  "nextOpportunity": "one suggestion framed as exciting opportunity",
  "empoweringMessage": "celebratory closing message",
  "metacognitiveQuestion": "reflective question"
}

Safety Rules:
1. NEVER compare to other users
2. NEVER frame any week as "bad"
3. If logging was inconsistent, celebrate the days they did log
4. NEVER suggest they "should have done more"`;

const STARL_SYSTEM_PROMPT = `You are BloomHer's Experience Architect. You help women transform everyday experiences into structured, powerful stories using the STAR(L) framework.

STAR(L):
- S (Situation): What was the context?
- T (Task): What was the goal or role?
- A (Action): What specifically did you do?
- R (Result): What was the outcome?
- L (Learned): What did you learn about yourself? <- THIS IS THE KEY

Given STAR(L) input from the user, enhance and structure it. Then discover 3-5 hidden skills.

Return as JSON:
{
  "structured": {
    "situation": "enhanced situation description",
    "task": "enhanced task description",
    "action": "enhanced action description with detail",
    "result": "enhanced result description",
    "learned": "empowering metacognitive insight"
  },
  "skillsDiscovered": [{ "name": "SkillName", "explanation": "why this experience demonstrates this skill" }],
  "oneLineSummary": "powerful one-sentence summary the user can use anywhere",
  "metacognitiveQuestion": "reflective closing question"
}

Safety Rules:
1. NEVER dismiss any experience as "too small"
2. NEVER add experiences the user didn't mention
3. Frame failure as resilience and learning
4. "L (Learned)" must always be empowering
5. The STAR(L) should feel like THEIR story`;

// ---------------------------------------------------------------------------
// Provider detection
// ---------------------------------------------------------------------------

function detectProvider(): AIProvider {
  const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const grokKey = import.meta.env.VITE_GROK_API_KEY;

  if (geminiKey && geminiKey.length > 0) return 'gemini';
  if (grokKey && grokKey.length > 0) return 'grok';
  return 'mock';
}

// ---------------------------------------------------------------------------
// Gemini API
// ---------------------------------------------------------------------------

async function callGemini(systemPrompt: string, userMessage: string): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: [{ parts: [{ text: userMessage }] }],
        generationConfig: {
          temperature: 0.8,
          topP: 0.95,
          responseMimeType: 'application/json',
        },
      }),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini API error: ${response.status} - ${err}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
}

// ---------------------------------------------------------------------------
// Grok API (xAI — OpenAI-compatible endpoint)
// ---------------------------------------------------------------------------

async function callGrok(systemPrompt: string, userMessage: string): Promise<string> {
  const apiKey = import.meta.env.VITE_GROK_API_KEY;
  const response = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'grok-3-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.8,
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Grok API error: ${response.status} - ${err}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? '';
}

// ---------------------------------------------------------------------------
// Unified caller with fallback
// ---------------------------------------------------------------------------

async function callAI(systemPrompt: string, userMessage: string): Promise<string> {
  const provider = detectProvider();

  if (provider === 'mock') {
    return ''; // caller handles mock fallback
  }

  try {
    if (provider === 'gemini') {
      return await callGemini(systemPrompt, userMessage);
    }
    return await callGrok(systemPrompt, userMessage);
  } catch (error) {
    console.warn(`[BloomHer AI] ${provider} failed, trying fallback...`, error);

    // Try the other provider as fallback
    try {
      if (provider === 'gemini' && import.meta.env.VITE_GROK_API_KEY) {
        return await callGrok(systemPrompt, userMessage);
      }
      if (provider === 'grok' && import.meta.env.VITE_GEMINI_API_KEY) {
        return await callGemini(systemPrompt, userMessage);
      }
    } catch (fallbackError) {
      console.warn('[BloomHer AI] Fallback also failed, using mock', fallbackError);
    }

    return ''; // empty string signals caller to use mock
  }
}

// ---------------------------------------------------------------------------
// Public API functions
// ---------------------------------------------------------------------------

/**
 * Discover growth/skills from a daily experience input.
 */
export async function discoverGrowth(
  input: string
): Promise<{ skills: { name: string; icon: string; description: string }[]; encouragement: string }> {
  const raw = await callAI(DAILY_GROWTH_SYSTEM_PROMPT, input);

  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      return {
        skills: parsed.skills ?? [],
        encouragement: parsed.encouragement ?? '',
      };
    } catch {
      console.warn('[BloomHer AI] Failed to parse discoverGrowth response');
    }
  }

  // Mock fallback
  const mockSkills = sampleSkills.slice(0, 3).map((s) => ({
    name: s.name,
    icon: s.icon,
    description: s.description,
  }));

  return {
    skills: mockSkills,
    encouragement:
      'What you shared shows real strength. Every small action builds something bigger — and you are building more than you realize!',
  };
}

/**
 * Generate a weekly growth report from a set of entries.
 */
export async function generateWeeklyReport(entries: Entry[]): Promise<WeeklyReport> {
  const entrySummary = entries
    .map((e) => `[${e.date}] ${e.content} (Skills: ${e.skills.map((s) => s.name).join(', ')})`)
    .join('\n');

  const raw = await callAI(
    WEEKLY_REPORT_SYSTEM_PROMPT,
    `Here are my daily logs for this week:\n\n${entrySummary}`
  );

  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      const report: WeeklyReport = {
        weekStart: entries[0]?.date ?? '',
        weekEnd: entries[entries.length - 1]?.date ?? '',
        topSkills: (parsed.topSkills ?? []).map(
          (ts: { skillName: string; count: number; examples: string[] }) => ({
            skill: {
              name: ts.skillName,
              icon: '🎯',
              description: '',
              category: 'analytical' as const,
            },
            count: ts.count,
            examples: ts.examples,
          })
        ),
        hiddenStrength: parsed.hiddenStrength ?? { insight: '', whyItMatters: '' },
        growthTrend: parsed.growthTrend ?? [],
        nextOpportunity: parsed.nextOpportunity ?? '',
        growthGrass: Array.from({ length: 7 }, (_, i) => i < entries.length),
        empoweringMessage: parsed.empoweringMessage ?? '',
        metacognitiveQuestion: parsed.metacognitiveQuestion ?? '',
      };
      return report;
    } catch {
      console.warn('[BloomHer AI] Failed to parse weekly report response');
    }
  }

  // Mock fallback
  return { ...sampleWeeklyReport };
}

/**
 * Structure a STAR(L) experience using AI enhancement.
 */
export async function structureSTARL(experience: STARLInput): Promise<STARLResult> {
  const userMessage = `Here is my experience in STAR(L) format:

S (Situation): ${experience.situation}
T (Task): ${experience.task}
A (Action): ${experience.action}
R (Result): ${experience.result}
L (Learned): ${experience.learned}

Please enhance this, discover hidden skills, and create a powerful one-sentence summary.`;

  const raw = await callAI(STARL_SYSTEM_PROMPT, userMessage);

  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      return {
        structured: parsed.structured ?? experience,
        skillsDiscovered: parsed.skillsDiscovered ?? [],
        oneLineSummary: parsed.oneLineSummary ?? '',
        metacognitiveQuestion: parsed.metacognitiveQuestion ?? '',
      };
    } catch {
      console.warn('[BloomHer AI] Failed to parse STARL response');
    }
  }

  // Mock fallback
  return {
    ...sampleSTARLResult,
    structured: {
      situation: experience.situation,
      task: experience.task,
      action: experience.action,
      result: experience.result,
      learned: experience.learned,
    },
  };
}

/**
 * Get the currently active AI provider.
 */
export function getActiveProvider(): AIProvider {
  return detectProvider();
}
