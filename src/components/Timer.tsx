import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, CheckCircle } from 'lucide-react';
import { Subject } from '../types';

interface TimerProps {
  subjects: Subject[];
  onCompleteSession: (subjectId: number, minutes: number) => void;
}

export const Timer: React.FC<TimerProps> = ({ subjects, onCompleteSession }) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<number>(subjects[0]?.id || 0);
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isBreak, setIsBreak] = useState<boolean>(false);

  useEffect(() => {
    if (subjects.length > 0 && !subjects.some(s => s.id === selectedSubjectId)) {
      setSelectedSubjectId(subjects[0].id);
    }
  }, [subjects]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      if (!isBreak && selectedSubjectId) {
        onCompleteSession(selectedSubjectId, 25);
      }
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, isBreak, selectedSubjectId, onCompleteSession]);

  const toggleTimer = () => setIsRunning(!isRunning);
  const resetTimer = (minutes: number, breakMode: boolean) => {
    setIsRunning(false);
    setIsBreak(breakMode);
    setTimeLeft(minutes * 60);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
      <h2 className="text-xl font-bold text-gray-800 mb-4">{isBreak ? 'Break Time ☕' : 'Pomodoro Timer 🍅'}</h2>
      
      <div className="w-full max-w-xs mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Target Subject</label>
        <select
          value={selectedSubjectId}
          onChange={(e) => setSelectedSubjectId(Number(e.target.value))}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
        >
          {subjects.map(sub => (
            <option key={sub.id} value={sub.id}>{sub.name} (Diff: {sub.difficulty})</option>
          ))}
        </select>
      </div>

      <div className="text-6xl font-black text-indigo-600 mb-6">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={toggleTimer}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold shadow hover:bg-indigo-700 transition"
        >
          {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={() => resetTimer(isBreak ? 5 : 25, isBreak)}
          className="flex items-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition"
        >
          <RotateCcw className="w-5 h-5" /> Reset
        </button>
      </div>

      <div className="flex gap-2 text-sm">
        <button onClick={() => resetTimer(25, false)} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg">Study (25m)</button>
        <button onClick={() => resetTimer(5, true)} className="px-3 py-1 bg-green-50 text-green-700 rounded-lg">Short Break (5m)</button>
      </div>
    </div>
  );
};
