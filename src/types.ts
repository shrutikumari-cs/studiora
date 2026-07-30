export type Theme = "pink" | "blue" | "white" | "black" | "green" | "yellow";

export interface Subject {
  id: number;
  name: string;
  difficulty: number;
  planned_minutes: number;
  completed_minutes: number;
  color: Theme;
  created_at: string;
}

export interface Deadline {
  id: number;
  title: string;
  subject: string;
  due_date: string;
  progress: number;
  created_at: string;
}

export interface PlannerItem {
  subject_id: number;
  name: string;
  difficulty: number;
  allocated_minutes: number;
}

export interface PlannerResponse {
  total_minutes: number;
  plan: PlannerItem[];
  message: string;
}

export interface ChatMessage {
  sender: "user" | "flora";
  text: string;
  urgent?: boolean;
  category?: string;
}
