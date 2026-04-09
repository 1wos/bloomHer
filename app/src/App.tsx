import { useState } from 'react';
import ChatView from './components/ChatView';
import GardenView from './components/GardenView';
import SkillsView from './components/SkillsView';
import WeeklyView from './components/WeeklyView';
import StarlView from './components/StarlView';
import NavBar from './components/NavBar';

type Page = 'chat' | 'garden' | 'skills' | 'weekly' | 'star';


export default function App() {
  const [activePage, setActivePage] = useState<Page>('chat');
  const [collectedSkills, setCollectedSkills] = useState(0);

  const handleSkillCollected = () => {
    setCollectedSkills((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col h-dvh bg-white">
      {/* Page content */}
      <div className="flex-1 overflow-hidden">
        {activePage === 'chat' && (
          <ChatView onSkillCollected={handleSkillCollected} />
        )}

        {activePage === 'garden' && (
          <div className="h-full overflow-y-auto">
            <GardenView />
          </div>
        )}

        {activePage === 'skills' && (
          <div className="h-full overflow-y-auto">
            <SkillsView />
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
