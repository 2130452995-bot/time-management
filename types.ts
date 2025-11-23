export interface Step {
  id: string;
  text: string;
  encouragement: string; // Small encouraging text for this specific step
  isCompleted: boolean;
}

export interface TaskData {
  id: string;
  originalInput: string;
  title: string;
  steps: Step[];
  overallEncouragement: string; // General advice
  imageUrl?: string;
  createdAt: number;
  completedAt?: number;
  isCompleted: boolean;
}

export type AppView = 'input' | 'active' | 'history';

// API Response Types
export interface PlanResponse {
  title: string;
  steps: {
    text: string;
    encouragement: string;
  }[];
  overallEncouragement: string;
}