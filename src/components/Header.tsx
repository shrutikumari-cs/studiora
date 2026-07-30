import React from 'react';
import { BookOpen } from 'lucide-react';
import { Theme } from '../types';

interface HeaderProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  bannerQuote: string;
}

export const Header: React.FC<HeaderProps> = ({ theme, setTheme, bannerQuote }) => {
  return (
    <header className={`p-4 shadow-md transition-colors duration-300 theme-${theme} bg-white border-b`}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-8 h-8 text-indigo-600" />
          <h1 className="text-2xl font-bold tracking-tight text-gray-800">Studiora</h1>
        </div>
        
        <div className="text-sm italic text-gray-600 max-w-xl text-center">
          "{bannerQuote}"
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500 uppercase">Theme:</span>
          {(['blue', 'pink', 'green', 'yellow'] as Theme[]).map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`w-6 h-6 rounded-full border-2 ${theme === t ? 'border-indigo-600 scale-110' : 'border-transparent'}`}
              style={{ backgroundColor: t === 'blue' ? '#3b82f6' : t === 'pink' ? '#ec4899' : t === 'green' ? '#10b981' : '#f59e0b' }}
              aria-label={t}
            />
          ))}
        </div>
      </div>
    </header>
  );
};
