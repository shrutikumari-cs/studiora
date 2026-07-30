import React, { useState } from 'react';
import { Subject, PlannerResponse } from '../types';
import { distributeMinutes, createSubject, deleteSubject } from '../api';
import { Plus, Trash2, Calculator } from 'lucide-react';

interface StudyPlannerProps {
  subjects: Subject[];
  onRefresh: () => void;
}

export const StudyPlanner: React.FC<StudyPlannerProps> = ({ subjects, onRefresh }) => {
  const [name, setName] = useState('');
  const [difficulty, setDifficulty] = useState(5);
  const [plannedMinutes, setPlannedMinutes] = useState(60);
  const [availableMinutes, setAvailableMinutes] = useState(120);
  const [planResult, setPlanResult] = useState<PlannerResponse | null>(null);

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await createSubject({ name, difficulty, planned_minutes: plannedMinutes, color: 'blue' });
    setName('');
    onRefresh();
  };

  const handleDelete = async (id: number) => {
    await deleteSubject(id);
    onRefresh();
  };

  const handleGeneratePlan = async () => {
    if (subjects.length === 0) return;
    const payloadSubjects = subjects.map(s => ({ subject_id: s.id, name: s.name, difficulty: s.difficulty }));
    const res = await distributeMinutes(availableMinutes, payloadSubjects);
    setPlanResult(res);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Subjects & Difficulty</h2>
        <form onSubmit={handleAddSubject} className="space-y-4 mb-6">
          <input
            type="text"
            placeholder="Subject Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded-lg"
            required
          />
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-xs text-gray-500">Difficulty (1-10): {difficulty}</label>
              <input
                type="range"
                min="1"
                max="10"
                value={difficulty}
                onChange={(e) => setDifficulty(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-500">Planned Target (mins)</label>
              <input
                type="number"
                value={plannedMinutes}
                onChange={(e) => setPlannedMinutes(Number(e.target.value))}
                className="w-full p-1 border rounded-lg"
              />
            </div>
          </div>
          <button type="submit" className="w-full py-2 bg-indigo-600 text-white rounded-lg font-semibold flex justify-center items-center gap-2">
            <Plus className="w-4 h-4" /> Add Subject
          </button>
        </form>

        <div className="space-y-2 max-h-60 overflow-y-auto">
          {subjects.map(sub => (
            <div key={sub.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
              <div>
                <h4 className="font-semibold text-gray-800">{sub.name}</h4>
                <p className="text-xs text-gray-500">Difficulty: {sub.difficulty} | Done: {sub.completed_minutes}m</p>
              </div>
              <button onClick={() => handleDelete(sub.id)} className="text-red-500 hover:text-red-700">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Flora Study Distributor</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Available Minutes Today</label>
            <input
              type="number"
              value={availableMinutes}
              onChange={(e) => setAvailableMinutes(Number(e.target.value))}
              className="w-full p-2 border rounded-lg"
            />
          </div>
          <button
            onClick={handleGeneratePlan}
            disabled={subjects.length === 0}
            className="w-full py-2 bg-emerald-600 text-white rounded-lg font-semibold flex justify-center items-center gap-2 mb-4 disabled:opacity-50"
          >
            <Calculator className="w-4 h-4" /> Generate Intelligent Plan
          </button>

          {planResult && (
            <div className="space-y-3 bg-emerald-50 p-4 rounded-xl border border-emerald-100">
              <p className="text-xs text-emerald-800 font-medium">{planResult.message}</p>
              <div className="space-y-1">
                {planResult.plan.map(item => (
                  <div key={item.subject_id} className="flex justify-between text-sm">
                    <span className="font-medium text-gray-700">{item.name}</span>
                    <span className="font-bold text-emerald-700">{item.allocated_minutes} mins</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
