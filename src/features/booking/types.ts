/** ---------- Booking (tests & packages) ---------- */
export type TestCategoryKind =
  | "organ"
  | "symptom"
  | "lifestyle"
  | "gender"
  | "imaging"
  | "special";

export interface TestCategory {
  id: string;
  kind: TestCategoryKind;
  name: string;
  icon: string;
  testCount: number;
}

export interface DiagnosticTest {
  id: string;
  name: string;
  shortName: string;
  description: string;
  price: number;
  /** Strike-through MRP for discount display (₹). */
  mrp: number;
  homeCollectionFee: number;
  fastingHours?: number;
  reportEtaHours: number;
  categoryIds: string[];
  popular?: boolean;
  parameters: number; // markers measured
}

export interface HealthPackage {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  testIds: string[];
  testCount: number;
  recommendedFor: string;
}

export interface Lab {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  distanceKm: number;
  accreditation: string; // e.g. "NABL / CAP Accredited"
  nextAvailable: string;
}

export interface TimeSlot {
  id: string;
  time: string; // "10:00 – 11:00 AM"
  period: "Morning" | "Afternoon" | "Evening";
  available: boolean;
}

export interface DayOption {
  id: string;
  dow: string; // "MON"
  day: number;
  month: string; // "OCT"
  slotsAvailable: number;
}

export type CollectionMethod = "home" | "lab";

export type BookingStatus =
  | "confirmed"
  | "collector_assigned"
  | "sample_collected"
  | "processing"
  | "report_ready"
  | "delayed"
  | "cancelled";

export interface Booking {
  id: string;
  testName: string;
  testId: string;
  status: BookingStatus;
  method: CollectionMethod;
  labName: string;
  date: string;
  time: string;
  amount: number;
  fastingHours?: number;
  collector?: PhleboCollector;
}

export interface PhleboCollector {
  name: string;
  idVerified: boolean;
  rating: number;
  etaMinutes: number;
  status: "assigned" | "on_the_way" | "arrived" | "collected";
}

export interface CartItem {
  id: string;
  kind: "test" | "package";
  refId: string;
  name: string;
  price: number;
  fastingHours?: number;
}

export type RefundStatus = "initiated" | "processing" | "credited";
