export interface HealthFormData {
  // Personal Info
  chronologicalAge: number;
  gender: 'male' | 'female' | 'other';
  dietQuality: 'poor' | 'good' | 'excellent';
  stressLevel: 'low' | 'medium' | 'high';
  
  // Sleep & Lifestyle
  sleepHours: number;
  sleepQuality: 'poor' | 'fair' | 'good' | 'excellent';
  dailySteps: number;
  waterIntake: number;
  
  // Habits
  smoker: boolean;
  alcoholFrequency: 'never' | 'occasionally' | 'weekly' | 'daily';
  exerciseFrequency: 'never' | 'occasionally' | 'weekly' | 'daily';
  exerciseTime: number,
  
  // Health Metrics
  bmi: number;
  restingHeartRate: number;
  systolicBP: number;
  diastolicBP: number;
  cholesterolTotal: number;
  bloodSugar: number;
  oxygenSaturation: number,
  
  // Family History
  familyHeartDisease: boolean;
  familyDiabetes: boolean;
  familyCancer: boolean;
  familyLongevity: boolean;
}

export interface HealthResults {
  biologicalAge: number;
  healthScore: number;
  riskZone: 'low' | 'medium' | 'high';
  ageDifference: number;
  recommendations: Recommendation[];
  metrics: MetricAnalysis[];
}

export interface Recommendation {
  id: string;
  category: 'sleep' | 'exercise' | 'nutrition' | 'habits' | 'medical';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  icon: string;
}

export interface MetricAnalysis {
  name: string;
  value: number;
  status: 'excellent' | 'good' | 'moderate' | 'warning' | 'risk';
  optimal: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
