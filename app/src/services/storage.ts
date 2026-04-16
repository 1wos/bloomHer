// BloomHer localStorage service
// 모든 페이지가 이 하나의 저장소를 공유

export type VerificationState = 'pending' | 'approved' | 'edited' | 'rejected';

export interface SkillRecord {
  name: string;
  icon: string;
  count: number;
  lastDate: string;
  category: string;
}

export interface EntrySkillItem {
  id: string;
  name: string;
  icon: string;
  description: string;
  verification?: VerificationState;
  editedName?: string;
}

export interface EntryRecord {
  id: string;
  date: string;
  input: string;
  skills: EntrySkillItem[];
  type: 'daily' | 'starl';
}

export interface BloomHerData {
  entries: EntryRecord[];
  skills: Record<string, SkillRecord>;
  loggedDays: string[];
  streak: number;
  lastLogDate: string;
}

const STORAGE_KEY = 'bloomher_data';

function getDefaultData(): BloomHerData {
  return {
    entries: [],
    skills: {},
    loggedDays: [],
    streak: 0,
    lastLogDate: '',
  };
}

// 짧은 uuid 유사 id 생성 (backward compatible fallback 포함)
function shortId(): string {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID().slice(0, 8);
    }
  } catch {
    // fall through
  }
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// 기존 데이터 호환성 보정: id/verification 기본값 주입
function normalizeData(data: BloomHerData): BloomHerData {
  if (!data || !Array.isArray(data.entries)) return data;
  for (const entry of data.entries) {
    if (!entry || !Array.isArray(entry.skills)) continue;
    entry.skills = entry.skills.map((s) => {
      const skill = s as Partial<EntrySkillItem> & {
        name: string;
        icon: string;
        description: string;
      };
      return {
        id: skill.id ?? shortId(),
        name: skill.name,
        icon: skill.icon,
        description: skill.description,
        verification: skill.verification ?? 'pending',
        editedName: skill.editedName,
      };
    });
  }
  return data;
}

export function loadData(): BloomHerData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as BloomHerData;
      return normalizeData(parsed);
    }
  } catch (e) {
    console.warn('[BloomHer] Failed to load data:', e);
  }
  return getDefaultData();
}

function saveData(data: BloomHerData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('[BloomHer] Failed to save data:', e);
  }
}

// 오늘 날짜 (YYYY-MM-DD)
function today(): string {
  return new Date().toISOString().split('T')[0];
}

// 스트릭 계산
function calculateStreak(loggedDays: string[]): number {
  if (loggedDays.length === 0) return 0;

  const sorted = [...loggedDays].sort().reverse();
  const todayStr = today();
  const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  // 오늘 또는 어제 기록이 없으면 스트릭 0
  if (sorted[0] !== todayStr && sorted[0] !== yesterdayStr) return 0;

  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);
    const diff = (prev.getTime() - curr.getTime()) / 86400000;
    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

// 스킬 수집 (Collect 버튼)
export function collectSkill(
  skillName: string,
  skillIcon: string,
  _skillDescription: string,
  _userInput: string,
  category: string = 'general'
): BloomHerData {
  const data = loadData();
  const todayStr = today();

  // 스킬 카운트 업데이트
  if (data.skills[skillName]) {
    data.skills[skillName].count += 1;
    data.skills[skillName].lastDate = todayStr;
  } else {
    data.skills[skillName] = {
      name: skillName,
      icon: skillIcon,
      count: 1,
      lastDate: todayStr,
      category,
    };
  }

  // 오늘 기록 추가 (중복 방지)
  if (!data.loggedDays.includes(todayStr)) {
    data.loggedDays.push(todayStr);
  }

  // 스트릭 업데이트
  data.streak = calculateStreak(data.loggedDays);
  data.lastLogDate = todayStr;

  saveData(data);
  return data;
}

// 엔트리 추가 (채팅 or STAR(L) 결과)
export function addEntry(entry: EntryRecord): BloomHerData {
  const data = loadData();
  const todayStr = today();

  // 새로 들어오는 엔트리의 스킬에 id/verification 자동 주입
  const normalizedEntry: EntryRecord = {
    ...entry,
    skills: (entry.skills ?? []).map((s) => {
      const skill = s as Partial<EntrySkillItem> & {
        name: string;
        icon: string;
        description: string;
      };
      return {
        id: skill.id ?? shortId(),
        name: skill.name,
        icon: skill.icon,
        description: skill.description,
        verification: skill.verification ?? 'pending',
        editedName: skill.editedName,
      };
    }),
  };

  data.entries.push(normalizedEntry);

  if (!data.loggedDays.includes(todayStr)) {
    data.loggedDays.push(todayStr);
  }

  data.streak = calculateStreak(data.loggedDays);
  data.lastLogDate = todayStr;

  saveData(data);
  return data;
}

// 스킬의 verification 상태 업데이트 (HITL)
export function setSkillVerification(
  entryId: string,
  skillId: string,
  state: VerificationState,
  editedName?: string
): BloomHerData {
  const data = loadData();
  const entry = data.entries.find((e) => e.id === entryId);
  if (entry) {
    const skill = entry.skills.find((s) => s.id === skillId);
    if (skill) {
      skill.verification = state;
      if (state === 'edited' && editedName !== undefined) {
        skill.editedName = editedName;
      }
    }
  }
  saveData(data);
  return data;
}

// 특정 날짜에 approved/edited 처리된 스킬만 반환
export function getApprovedSkillsByDate(
  date: string
): Array<{ name: string; icon: string }> {
  const data = loadData();
  const result: Array<{ name: string; icon: string }> = [];
  for (const entry of data.entries) {
    if (entry.date !== date) continue;
    for (const skill of entry.skills) {
      const v = skill.verification ?? 'pending';
      if (v === 'approved' || v === 'edited') {
        result.push({
          name: skill.editedName && v === 'edited' ? skill.editedName : skill.name,
          icon: skill.icon,
        });
      }
    }
  }
  return result;
}

// 전체 verification 통계
export function getVerificationStats(): {
  approved: number;
  edited: number;
  rejected: number;
  pending: number;
} {
  const data = loadData();
  const stats = { approved: 0, edited: 0, rejected: 0, pending: 0 };
  for (const entry of data.entries) {
    for (const skill of entry.skills) {
      const v: VerificationState = skill.verification ?? 'pending';
      stats[v] += 1;
    }
  }
  return stats;
}

// 이번 주 엔트리 가져오기 (Weekly Report용)
export function getWeekEntries(): EntryRecord[] {
  const data = loadData();
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 86400000);
  const weekAgoStr = weekAgo.toISOString().split('T')[0];

  return data.entries.filter((e) => e.date >= weekAgoStr);
}

// 특정 월의 기록된 날 가져오기 (Garden용)
export function getMonthLoggedDays(year: number, month: number): number[] {
  const data = loadData();
  const prefix = `${year}-${String(month + 1).padStart(2, '0')}`;
  return data.loggedDays
    .filter((d) => d.startsWith(prefix))
    .map((d) => parseInt(d.split('-')[2]));
}

// 전체 스킬 목록 (Skills 탭용)
export function getAllSkills(): SkillRecord[] {
  const data = loadData();
  return Object.values(data.skills).sort((a, b) => b.count - a.count);
}

// 스트릭 가져오기
export function getStreak(): number {
  const data = loadData();
  return data.streak;
}

// 총 기록 일수
export function getTotalDays(): number {
  const data = loadData();
  return data.loggedDays.length;
}

// 레벨 계산
export function getLevel(): { level: number; label: string; emoji: string; progress: number } {
  const days = getTotalDays();
  if (days >= 121) return { level: 5, label: 'Garden', emoji: '🌸', progress: 100 };
  if (days >= 61) return { level: 4, label: 'Tree', emoji: '🌳', progress: ((days - 61) / 60) * 100 };
  if (days >= 31) return { level: 3, label: 'Flower', emoji: '🌷', progress: ((days - 31) / 30) * 100 };
  if (days >= 15) return { level: 2, label: 'Sprout', emoji: '🌿', progress: ((days - 15) / 16) * 100 };
  return { level: 1, label: 'Seed', emoji: '🌱', progress: (days / 14) * 100 };
}

// 데이터 초기화 (개발용)
export function resetData() {
  localStorage.removeItem(STORAGE_KEY);
}
