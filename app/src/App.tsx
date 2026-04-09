import { useState, useCallback } from 'react';
import ChatView from './components/ChatView';
import GardenView from './components/GardenView';
import SkillsView from './components/SkillsView';
import WeeklyView from './components/WeeklyView';
import StarlView from './components/StarlView';
import NavBar from './components/NavBar';
import { getStreak, getMonthLoggedDays, getAllSkills, getTotalDays, getLevel } from './services/storage';
import type { SkillRecord as _SkillRecord } from './services/storage';

type Page = 'chat' | 'garden' | 'skills' | 'weekly' | 'star';

// Revision counter to force re-reads from localStorage
export default function App() {
  const [activePage, setActivePage] = useState<Page>('chat');
  const [revision, setRevision] = useState(0);

  // Bump revision to trigger re-renders in child components
  const refreshData = useCallback(() => {
    setRevision((r) => r + 1);
  }, []);

  // Derive all data from storage on every render (cheap reads from localStorage)
  const streak = getStreak();
  const now = new Date();
  const loggedDays = getMonthLoggedDays(now.getFullYear(), now.getMonth());
  const allSkills = getAllSkills();
  const totalDays = getTotalDays();
  const levelInfo = getLevel();
  const collectedSkills = allSkills.length;

  // Suppress unused variable warning — revision is read to trigger re-render
  void revision;

  return (
    <div className="flex flex-col h-dvh bg-white">
      {/* Page content */}
      <div className="flex-1 overflow-hidden">
        {activePage === 'chat' && (
          <ChatView
            onSkillCollected={refreshData}
            streak={streak}
            loggedDays={loggedDays}
          />
        )}

        {activePage === 'garden' && (
          <div className="h-full overflow-y-auto">
            <GardenView
              loggedDays={loggedDays}
              totalDays={totalDays}
              levelInfo={levelInfo}
              allSkills={allSkills}
            />
          </div>
        )}

        {activePage === 'skills' && (
          <div className="h-full overflow-y-auto">
            <SkillsView allSkills={allSkills} />
          </div>
        )}

        {activePage === 'weekly' && (
          <div className="h-full overflow-y-auto">
            <WeeklyView />
          </div>
        )}

        {activePage === 'star' && (
          <div className="h-full overflow-y-auto">
            <StarlView />
          </div>
        )}
      </div>

      {/* Bottom navigation */}
      <NavBar
        active={activePage}
        onNavigate={setActivePage}
        skillCount={collectedSkills}
      />
    </div>
  );
}
