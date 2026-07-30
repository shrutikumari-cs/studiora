import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { StudyPlanner } from './components/StudyPlanner';
import { Timer } from './components/Timer';
import { DeadlineTracker } from './components/DeadlineTracker';
import { Chatbot } from './components/Chatbot';
import { Subject, Deadline, Theme } from './types';
import { fetchSubjects, fetchDeadlines, completeSession, fetchRandomQuote } from './api';

export default function App() {
  const [theme, setTheme] = useState<Theme>('blue');
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [bannerQuote, setBannerQuote] = useState<string>('Loading inspiration...');

  const loadData = async () => {
    try {
      const [subs, deads] = await Promise.all([fetchSubjects(), fetchDeadlines()]);
      setSubjects(subs);
      setDeadlines(deads);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
    fetchRandomQuote('banner').then(setBannerQuote).catch(() => {});
  }, []);

  const handleCompleteSession = async (subjectId: number, minutes: number) => {
    await completeSession(subjectId, minutes);
    loadData();
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <Header theme={theme} setTheme={setTheme} bannerQuote={bannerQuote} />
      
      <main className="max-w-7xl mx-auto px-4 mt-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <StudyPlanner subjects={subjects} onRefresh={loadData} />
          </div>
          <div>
            <Timer subjects={subjects} onCompleteSession={handleCompleteSession} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <DeadlineTracker deadlines={deadlines} onRefresh={loadData} />
          <Chatbot />
        </div>
      </main>
    </div>
  );
}
