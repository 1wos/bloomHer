import type { Entry, Skill, WeeklyReport, STARLResult } from '../types';

export const sampleSkills: Skill[] = [
  {
    name: 'Analytical Thinking',
    icon: '🔍',
    description: 'Processing multiple data points and finding patterns',
    category: 'analytical',
  },
  {
    name: 'Decision-Making',
    icon: '💡',
    description: 'Evaluating options under constraints to choose the best path',
    category: 'analytical',
  },
  {
    name: 'Communication',
    icon: '💬',
    description: 'Clearly conveying ideas and actively listening to others',
    category: 'communication',
  },
  {
    name: 'Empathy',
    icon: '💜',
    description: 'Understanding and sharing the feelings of others',
    category: 'emotional',
  },
  {
    name: 'Creative Problem-Solving',
    icon: '🎨',
    description: 'Finding innovative solutions when standard approaches fail',
    category: 'creative',
  },
  {
    name: 'Time Management',
    icon: '⏰',
    description: 'Prioritizing tasks and managing deadlines effectively',
    category: 'management',
  },
  {
    name: 'Adaptability',
    icon: '⚡',
    description: 'Adjusting quickly to new situations and unexpected changes',
    category: 'leadership',
  },
  {
    name: 'Initiative',
    icon: '🚀',
    description: 'Taking action without being asked, self-starting',
    category: 'leadership',
  },
];

export const sampleEntries: Entry[] = [
  {
    id: '1',
    date: '2026-04-03',
    content: 'Compared discounts at the grocery store and saved 20% on the weekly budget',
    skills: [sampleSkills[0], sampleSkills[1]],
    encouragement: 'Your grocery shopping uses the same skills as business strategy!',
    createdAt: '2026-04-03T19:30:00Z',
  },
  {
    id: '2',
    date: '2026-04-04',
    content: 'Listened to my friend who was going through a tough time for an hour',
    skills: [sampleSkills[2], sampleSkills[3]],
    encouragement: 'Active listening is a powerful professional skill, not just being nice.',
    createdAt: '2026-04-04T21:00:00Z',
  },
  {
    id: '3',
    date: '2026-04-05',
    content: 'Tried a new recipe and substituted ingredients I was missing',
    skills: [sampleSkills[4], sampleSkills[7]],
    encouragement: 'Adapting on the fly is entrepreneurial thinking in action!',
    createdAt: '2026-04-05T20:15:00Z',
  },
  {
    id: '4',
    date: '2026-04-06',
    content: 'Reorganized the kids\' study schedule for the new semester',
    skills: [sampleSkills[5], sampleSkills[0]],
    encouragement: 'You just did what project managers do at top companies!',
    createdAt: '2026-04-06T18:45:00Z',
  },
  {
    id: '5',
    date: '2026-04-07',
    content: 'Handled an unexpected schedule change at work without stress',
    skills: [sampleSkills[6], sampleSkills[1]],
    encouragement: 'Most people freeze when plans change. You made it better.',
    createdAt: '2026-04-07T17:30:00Z',
  },
  {
    id: '6',
    date: '2026-04-08',
    content: 'Helped a coworker debug their presentation at the last minute',
    skills: [sampleSkills[2], sampleSkills[4]],
    encouragement: 'Jumping in to help under pressure shows both leadership and technical skill.',
    createdAt: '2026-04-08T19:00:00Z',
  },
  {
    id: '7',
    date: '2026-04-09',
    content: 'Planned next month\'s family budget with a new spreadsheet method',
    skills: [sampleSkills[0], sampleSkills[7]],
    encouragement: 'Creating systems from scratch is what architects and engineers do!',
    createdAt: '2026-04-09T20:30:00Z',
  },
];

export const sampleWeeklyReport: WeeklyReport = {
  weekStart: '2026-04-03',
  weekEnd: '2026-04-09',
  topSkills: [
    {
      skill: sampleSkills[0],
      count: 4,
      examples: [
        'grocery price comparison',
        'study schedule reorganization',
        'budget spreadsheet',
        'presentation debugging',
      ],
    },
    {
      skill: sampleSkills[2],
      count: 3,
      examples: [
        'friend counseling',
        'coworker collaboration',
        'family budget discussion',
      ],
    },
    {
      skill: sampleSkills[1],
      count: 2,
      examples: [
        'budget optimization',
        'schedule change handling',
      ],
    },
  ],
  hiddenStrength: {
    insight:
      'Every time you faced an unexpected change this week, you didn\'t just cope — you improved the original plan.',
    whyItMatters:
      'That\'s not just adaptability. That\'s creative problem-solving under pressure. Many people freeze when plans change. You make things better.',
  },
  growthTrend: [
    { skillName: 'Analytical Thinking', count: 4 },
    { skillName: 'Communication', count: 3 },
    { skillName: 'Decision-Making', count: 2 },
    { skillName: 'Adaptability', count: 2 },
    { skillName: 'Initiative', count: 2 },
  ],
  nextOpportunity:
    'Your communication skills showed up 3 times this week. What if you tried sharing your opinion first in one group setting? Your analytical mind + communication combo could make a real impact.',
  growthGrass: [true, true, true, true, true, true, true],
  empoweringMessage:
    'You accomplished more this week than you realize. Every small action was building something bigger — a pattern of someone who analyzes, communicates, and adapts. That\'s not ordinary. That\'s leadership in the making.',
  metacognitiveQuestion:
    'Looking at your top skills this week, which one surprised you the most?',
};

export const sampleSTARLResult: STARLResult = {
  structured: {
    situation:
      'You discovered an interesting recipe on YouTube and decided to try it, despite not having all the required ingredients.',
    task:
      'Successfully prepare a new dish by adapting the recipe to what you had available.',
    action:
      'Researched and selected a recipe independently. Assessed available ingredients vs. required ones. Made creative substitutions based on knowledge of flavors and textures. Executed the recipe from start to finish, managing timing and multiple steps.',
    result:
      'Completed a dish you\'d never made before, using your own adaptations.',
    learned:
      'You have the ability to take initiative on something completely new, and when faced with constraints, you don\'t give up — you innovate. That\'s not just cooking. That\'s entrepreneurial thinking.',
  },
  skillsDiscovered: [
    {
      name: 'Initiative',
      explanation: 'You chose to try something new without anyone asking you to',
    },
    {
      name: 'Creative Problem-Solving',
      explanation: 'Missing ingredients became an opportunity, not an obstacle',
    },
    {
      name: 'Self-Directed Learning',
      explanation: 'You taught yourself through YouTube — independent learning ability',
    },
    {
      name: 'Project Management',
      explanation: 'Coordinating multiple steps with timing = workflow management',
    },
  ],
  oneLineSummary:
    'I independently identified a learning opportunity, adapted to resource constraints through creative substitution, and successfully delivered a complete outcome on the first attempt.',
  metacognitiveQuestion:
    'Before today, would you have described "trying a new recipe" as evidence of entrepreneurial thinking and project management?',
};
