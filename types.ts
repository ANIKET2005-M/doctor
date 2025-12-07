
export interface Reminder {
  time: string;
  label: string;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  purpose: string;
  instructions: string; // Mapped from patient_instruction
  sideEffects?: string; // Kept for backward compatibility
  safety_notes: string[];
  reminder_slots: string[];
  schedule?: Reminder[];
  expiryDate?: string;
}

export interface ScanResult {
  summary: string;
  medications: Medication[];
}

export interface PharmacyTips {
  guide: string;
  tips: string[];
}

export interface Profile {
  id: string;
  name: string;
  avatarUrl: string;
  relationship: 'Self' | 'Parent' | 'Child' | 'Spouse' | 'Other';
  medications: Medication[];
  age?: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
  sources?: { title: string; uri: string }[];
}

export interface PharmacyLocation {
  name: string;
  address: string;
  rating?: string;
  openNow?: boolean;
  uri?: string;
}

export interface PharmacyStructuredItem {
  name: string;
  distance: string;
  travel_time: string;
  rating: string;
  reviews_count: string;
}

export interface PharmacyStructuredData {
  pharmacies: PharmacyStructuredItem[];
}

export interface MedicineAnalysis {
  name: string;
  description: string;
  uses: string[];
  warnings: string[];
  side_effects: string[];
}

export enum AppTab {
  HOME = 'home',
  SCAN = 'scan',
  MED_ID = 'med_id',
  CHAT = 'chat',
  MAPS = 'maps',
  PROFILE = 'profile'
}
