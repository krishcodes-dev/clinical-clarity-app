/** ---------- Consultations ---------- */
export type ConsultMode = "video" | "audio" | "chat";

export interface Specialty {
  id: string;
  name: string;
  icon: string;
  doctorCount: number;
}

export interface Doctor {
  id: string;
  name: string;
  specialtyId: string;
  specialty: string;
  yearsExp: number;
  rating: number;
  reviews: number;
  fee: number;
  languages: string[];
  about: string;
  nextSlots: string[];
  modes: ConsultMode[];
}

export type AppointmentStatus =
  | "upcoming"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "missed";

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  mode: ConsultMode;
  date: string;
  time: string;
  status: AppointmentStatus;
  fee: number;
  prescriptionId?: string;
}

export interface Medication {
  name: string;
  dose: string;
  frequency: string; // "1-0-1"
  durationDays: number;
  timing: string[]; // ["08:00 AM", "08:00 PM"]
  withFood: boolean;
}

export interface Prescription {
  id: string;
  appointmentId: string;
  doctorName: string;
  specialty: string;
  date: string;
  diagnosisNote: string;
  medications: Medication[];
  followUpDays?: number;
}

export interface ChatMessage {
  id: string;
  from: "user" | "doctor" | "system";
  text: string;
  time: string;
}
