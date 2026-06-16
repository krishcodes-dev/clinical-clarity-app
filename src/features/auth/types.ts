/** ---------- User & account ---------- */
export interface User {
  id: string;
  name: string;
  firstName: string;
  phone: string;
  email: string;
  avatarInitials: string;
  profileCompletion: number; // 0–100
  dob?: string;
  gender?: string;
  bloodGroup?: string;
  heightCm?: number;
  weightKg?: number;
}

export interface Address {
  id: string;
  label: "Home" | "Work" | "Other";
  line1: string;
  line2: string;
  serviceable: boolean;
  instructions?: string;
}
