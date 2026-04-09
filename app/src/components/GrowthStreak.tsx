import { useState } from 'react';

interface GrowthStreakProps {
  streak: number;
  loggedDays: number[];
}

export default function GrowthStreak({ streak, loggedDays }: GrowthStreakProps) {
  const [expanded, setExpanded] = useState(false);

  const today = new Date();
  const currentDay = today.getDate();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const monthName = today.toLocaleString('default', { month: 'long' });

  const dots = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="px-5 pt-4 pb-2">
      {/* Main streak bar */}
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-purple to-purple-light flex items-center justify-center shadow-sm">
              <span className="text-white text-lg font-semibold">{streak}</span>
            </div>
            {streak >= 7 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-warm rounded-full flex items-center justify-center text-[10px] shadow-sm">
                🔥
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-text">
              {streak} day streak
            </p>
            <p className="text-xs text-text-muted">
              Keep blooming, you are doing great!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Mini preview dots (last 7 days) */}
          {Array.from({ length: 7 }, (_, i) => {
            const day = currentDay - 6 + i;
            const isLogged = loggedDays.includes(day);
            const isToday = day === currentDay;
            return (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  isToday
                    ? 'bg-green ring-2 ring-green/30'
                    : isLogged
                    ? 'bg-purple'
                    : 'bg-border'
                }`}
              />
            );
          })}
          <svg
            className={`w-4 h-4 text-text-muted ml-1 transition-transform duration-300 ${
              expanded ? 'rotate-180' : ''
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Expanded calendar */}
      {expanded && (
        <div className="mt-3 pt-3 border-t border-border animate-fade-in-up">
          <p className="text-xs font-medium text-text-muted mb-2">{monthName}</p>
          <div className="grid grid-cols-7 gap-1.5">
            {dots.map((day) => {
              const isLogged = loggedDays.includes(day);
              const isToday = day === currentDay;
              const isFuture = day > currentDay;
              return (
                <div
                  key={day}
                  className={`
                    w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-medium
                    transition-all duration-200
                    ${isFuture ? 'text-text-muted/40' : ''}
                    ${isToday ? 'ring-2 ring-green/40 bg-green/10 text-green-dark font-semibold' : ''}
                    ${isLogged && !isToday ? 'bg-purple text-white animate-dot' : ''}
                    ${!isLogged && !isToday && !isFuture ? 'text-text-muted bg-lavender/50' : ''}
                  `}
                  style={isLogged ? { animationDelay: `${(day % 7) * 30}ms` } : {}}
                >
                  {day}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
