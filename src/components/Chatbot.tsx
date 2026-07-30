import React, { useState } from 'react';
import { ChatMessage } from '../types';
import { sendChatMessage } from '../api';
import { Send, Bot, User, AlertTriangle } from 'lucide-react';

export const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: 'flora', text: "Hi, I am Flora. Tell me what you are studying or what is making today difficult." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const replyMsg = await sendChatMessage(userMsg.text);
      setMessages(prev => [...prev, replyMsg]);
    } catch {
      setMessages(prev => [...prev, { sender: 'flora', text: "I'm having trouble connecting right now, but remember to take things one step at a time." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[500px]">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Bot className="w-6 h-6 text-indigo-600" /> Flora Well-being & Study Assistant
      </h2>

      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.sender === 'flora' && <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center"><Bot className="w-5 h-5 text-indigo-600" /></div>}
            <div className={`p-4 rounded-2xl max-w-md text-sm ${m.sender === 'user' ? 'bg-indigo-600 text-white' : m.urgent ? 'bg-red-50 text-red-900 border border-red-200' : 'bg-gray-100 text-gray-800'}`}>
              {m.urgent && <div className="flex items-center gap-1 font-bold mb-1 text-red-600"><AlertTriangle className="w-4 h-4" /> Important Support Notice</div>}
              {m.text}
            </div>
            {m.sender === 'user' && <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"><User className="w-5 h-5 text-gray-600" /></div>}
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} className="flex gap-2">
        <input
          type="text"
          placeholder="Ask Flora for help, focus tips, or stress relief..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500"
        />
        <button type="submit" disabled={loading} className="px-5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-50">
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};
