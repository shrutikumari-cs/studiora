import { Subject, Deadline, PlannerResponse, ChatMessage, Theme } from "./types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export async function fetchSubjects(): Promise<Subject[]> {
  const res = await fetch(`${API_URL}/subjects`);
  if (!res.ok) throw new Error("Failed to fetch subjects");
  return res.json();
}

export async function createSubject(data: { name: string; difficulty: number; planned_minutes: number; color: Theme }): Promise<Subject> {
  const res = await fetch(`${API_URL}/subjects`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create subject");
  return res.json();
}

export async function deleteSubject(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/subjects/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete subject");
}

export async function completeSession(subjectId: number, minutes: number): Promise<Subject> {
  const res = await fetch(`${API_URL}/subjects/${subjectId}/complete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ minutes }),
  });
  if (!res.ok) throw new Error("Failed to log completed session");
  return res.json();
}

export async function fetchDeadlines(): Promise<Deadline[]> {
  const res = await fetch(`${API_URL}/deadlines`);
  if (!res.ok) throw new Error("Failed to fetch deadlines");
  return res.json();
}

export async function createDeadline(data: { title: string; subject: string; due_date: string; progress: number }): Promise<Deadline> {
  const res = await fetch(`${API_URL}/deadlines`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create deadline");
  return res.json();
}

export async function deleteDeadline(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/deadlines/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete deadline");
}

export async function distributeMinutes(availableMinutes: number, subjects: { subject_id: number; name: string; difficulty: number }[]): Promise<PlannerResponse> {
  const res = await fetch(`${API_URL}/planner/distribute`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ available_minutes: availableMinutes, subjects }),
  });
  if (!res.ok) throw new Error("Failed to generate study plan");
  return res.json();
}

export async function sendChatMessage(message: string): Promise<ChatMessage> {
  const res = await fetch(`${API_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
  if (!res.ok) throw new Error("Failed to communicate with Flora");
  const data = await res.json();
  return { sender: "flora", text: data.reply, urgent: data.urgent, category: data.category };
}

export async function fetchRandomQuote(kind: "banner" | "completion"): Promise<string> {
  const res = await fetch(`${API_URL}/quotes/random?kind=${kind}`);
  if (!res.ok) throw new Error("Failed to fetch quote");
  const data = await res.json();
  return data.quote;
}
