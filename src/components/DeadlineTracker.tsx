import React, { useState } from 'react';
import { Deadline } from '../types';
import { createDeadline, deleteDeadline } from '../api';
import { Calendar, Plus, Trash2 } from 'lucide-react';

interface DeadlineTrackerProps {
  deadlines: Deadline[];
  onRefresh: () => void;
}

export const DeadlineTracker: React.FC<DeadlineTrackerProps> = ({ deadlines, onRefresh }) => {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [progress, setProgress] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !subject || !dueDate) return;
    await createDeadline({ title, subject, due_date: dueDate, progress });
    setTitle('');
    setSubject('');
    setDueDate('');
    setProgress(0);
    onRefresh();
  };

  const handleDelete = async (id: number) => {
    await deleteDeadline(id);
    onRefresh();
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-indigo-600" /> Deadline & Exam Tracker
      </h2>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <input
          type="text"
          placeholder="Task / Exam Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="p-2 border rounded-lg"
          required
        />
        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="p-2 border rounded-lg"
          required
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="p-2 border rounded-lg"
          required
        />
        <button type="submit" className="py-2 bg-indigo-600 text-white rounded-lg font-semibold flex justify-center items-center gap-2">
          <Plus className="w-4 h-4" /> Add Deadline
        </button>
      </form>

      <div className="space-y-3">
        {deadlines.map(d => (
          <div key={d.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border">
            <div>
              <h4 className="font-bold text-gray-800">{d.title}</h4>
              <p className="text-xs text-gray-500">{d.subject} • Due: {d.due_date}</p>
            </div>
            <button onClick={() => handleDelete(d.id)} className="text-red-500 hover:text-red-700">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
