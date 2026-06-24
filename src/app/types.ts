import { NavigatorScreenParams } from "@react-navigation/native";
import { ConsultMode } from "@/features/consultations/types";
import { InsightState } from "@/features/ai-insights/types";
import { TestCategoryKind } from "@/features/booking/types";

/** ---------- Auth & onboarding ---------- */
export type AuthStackParamList = {
  Login: undefined;
  MobileNumber: undefined;
  OTPVerification: { phone: string };
  AccountLocked: undefined;
};

export type OnboardingStackParamList = {
  Consent: undefined;
  Welcome: undefined;
  HealthGoals: undefined;
  BasicProfile: undefined;
  HealthInterests: undefined;
  Recommendations: undefined;
};

/** ---------- Tab stacks ---------- */
export type HomeStackParamList = {
  HomeDashboard: undefined;
  NotificationCenter: undefined;
  RemindersToday: undefined;
  ReminderDetails: { reminderId: string };
  CreateReminder: { prefillTitle?: string; prefillTime?: string } | undefined;
  MissedReminder: { reminderId: string };
};

export type BookStackParamList = {
  BookLanding: undefined;
  SearchResults: { query: string };
  CategoryExplorer: { kind: TestCategoryKind };
  TestListing: { categoryId: string };
  TestDetails: { testId: string };
  PackageDetails: { packageId: string };
  Cart: undefined;
  CollectionMethod: undefined;
  CollectionAddress: undefined;
  SelectLab: undefined;
  SelectSlot: undefined;
  ReviewBooking: undefined;
  Payment: undefined;
  PaymentFailed: undefined;
  BookingConfirmed: undefined;
  TrackBooking: { bookingId: string };
  ReportReady: { bookingId: string };
  BookingCancellation: { bookingId: string };
  RefundStatus: { bookingId: string };
  RescheduleBooking: { bookingId: string };
};

export type RecordsStackParamList = {
  EHRDashboard: undefined;
  RecordCategories: undefined;
  RecordDetails: { recordId: string };
  SourceReportViewer: { recordId: string };
  HealthTimeline: undefined;
  Trends: undefined;
  UploadRecord: undefined;
  ShareRecords: undefined;
  AIConsent: undefined;
  InsightsDashboard: { state?: InsightState } | undefined;
  KeyFindings: undefined;
  NextSteps: undefined;
};

export type CareStackParamList = {
  CareLanding: undefined;
  SpecialtySelection: undefined;
  DoctorListing: { specialtyId?: string } | undefined;
  DoctorProfile: { doctorId: string };
  ReviewAppointment: { doctorId: string; slot: string; mode: ConsultMode };
  CarePayment: undefined;
  AppointmentConfirmed: undefined;
  MyAppointments: undefined;
  RescheduleAppointment: { appointmentId: string };
  PreCallCheck: { appointmentId: string };
  WaitingRoom: { appointmentId: string };
  VideoCall: { appointmentId: string };
  ChatConsult: { appointmentId: string };
  PostVisitSummary: { appointmentId: string };
  PrescriptionViewer: { prescriptionId: string };
  PrescriptionToReminders: { prescriptionId: string };
  MyPrescriptions: undefined;
  OriginalPrescription: { prescriptionId: string };
};

export type ProfileStackParamList = {
  UserProfile: undefined;
  EditProfile: undefined;
  HealthProfile: undefined;
  Settings: undefined;
  NotificationSettings: undefined;
  PrivacySecurity: undefined;
  AppLockSetup: undefined;
  HelpSupport: undefined;
  DeleteAccount: undefined;
};

/** ---------- Doctor onboarding & verification ---------- */
export type DoctorStackParamList = {
  VerificationStatus: undefined;
  ProfessionalInformation: undefined;
  DocumentUpload: undefined;
  ReviewAndDeclaration: undefined;
  DoctorHomePlaceholder: undefined;
};

/** ---------- Tabs & root ---------- */
export type MainTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  BookTab: NavigatorScreenParams<BookStackParamList>;
  RecordsTab: NavigatorScreenParams<RecordsStackParamList>;
  CareTab: NavigatorScreenParams<CareStackParamList>;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList>;
};

export type RootStackParamList = {
  Splash: undefined;
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Onboarding: NavigatorScreenParams<OnboardingStackParamList>;
  /**
   * Single authenticated entry point. The component mounted here picks
   * DoctorStack vs MainTabs based on `user.role` (see RootNavigator.tsx) -
   * login screens (OTP/Google/Apple/Admin) just reset here, none of them
   * need to know about roles.
   */
  Main: NavigatorScreenParams<MainTabParamList> | NavigatorScreenParams<DoctorStackParamList>;
  /** Global system states - overlay any route. */
  Offline: undefined;
  Maintenance: undefined;
  SessionExpired: undefined;
};

/**
 * Routes that suppress the bottom tab bar (UX review rule:
 * funnels, payment, calls and full-screen transactional states are
 * task-focused - the shell returns on hub screens).
 */
export const TAB_BAR_HIDDEN_ROUTES = new Set<string>([
  // Booking funnel
  "CollectionMethod",
  "CollectionAddress",
  "SelectLab",
  "SelectSlot",
  "ReviewBooking",
  "Payment",
  "PaymentFailed",
  "BookingConfirmed",
  "BookingCancellation",
  "RescheduleBooking",
  // Consultation funnel + visit loop
  "ReviewAppointment",
  "CarePayment",
  "AppointmentConfirmed",
  "RescheduleAppointment",
  "PreCallCheck",
  "WaitingRoom",
  "VideoCall",
  "ChatConsult",
  // Full-screen modals & consents
  "UploadRecord",
  "AIConsent",
  "ShareRecords",
  "CreateReminder",
  "AppLockSetup",
  "DeleteAccount",
  "SourceReportViewer",
  "OriginalPrescription",
]);
