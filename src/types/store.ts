export interface Medication {
  id: string;
  slug?: string;
  name: string;
  dose: string;
  frequency: string;
  time: string[];
  type: string;
  conditionId?: string;
  description?: string;
  sideEffects?: string[];
  warnings?: string[];
  selfCare?: string[];
}

export interface UserProfile {
  name: string;
  isPremium: boolean;
  streakDays: number;
  points: number;
  badges: string[];
  conditions: string[];
  allergies: string[];
  remindersEnabled: boolean;
}

export interface LogEntry {
  medicationId: string;
  dateStr: string;
  taken: boolean;
}

export interface AppStoreValue {
  user: UserProfile;
  medications: Medication[];
  logs: LogEntry[];
  checkIn: (medicationId: string, dateStr: string) => void;
  addMedication: (medication: Medication) => void;
  updateUser: (updates: Partial<UserProfile>) => void;
}
