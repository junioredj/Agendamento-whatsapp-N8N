
export interface Appointment {
  id: string;
  customerName: string;
  service: string;
  time: string;
  date: string;
  value: number;
}

export interface DayStats {
  date: string;
  appointments: number;
  totalRevenue: number;
}

export interface Plan {
  name: string;
  price: string;
  description: string;
  features: string[];
  recommended?: boolean;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
