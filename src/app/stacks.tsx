import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  AuthStackParamList,
  BookStackParamList,
  CareStackParamList,
  HomeStackParamList,
  OnboardingStackParamList,
  ProfileStackParamList,
  RecordsStackParamList,
} from "./types";

// Auth
import { LoginScreen } from "@/screens/auth/LoginScreen";
import { MobileNumberScreen } from "@/screens/auth/MobileNumberScreen";
import { OTPVerificationScreen } from "@/screens/auth/OTPVerificationScreen";
import { AccountLockedScreen } from "@/screens/auth/AccountLockedScreen";

// Onboarding
import { ConsentScreen } from "@/screens/onboarding/ConsentScreen";
import { WelcomeScreen } from "@/screens/onboarding/WelcomeScreen";
import { HealthGoalsScreen } from "@/screens/onboarding/HealthGoalsScreen";
import { BasicProfileScreen } from "@/screens/onboarding/BasicProfileScreen";
import { HealthInterestsScreen } from "@/screens/onboarding/HealthInterestsScreen";
import { RecommendationsScreen } from "@/screens/onboarding/RecommendationsScreen";

// Home + reminders
import { HomeDashboardScreen } from "@/screens/home/HomeDashboardScreen";
import { NotificationCenterScreen } from "@/screens/home/NotificationCenterScreen";
import { RemindersTodayScreen } from "@/screens/reminders/RemindersTodayScreen";
import { ReminderDetailsScreen } from "@/screens/reminders/ReminderDetailsScreen";
import { CreateReminderScreen } from "@/screens/reminders/CreateReminderScreen";
import { MissedReminderScreen } from "@/screens/reminders/MissedReminderScreen";

// Booking
import { BookLandingScreen } from "@/screens/booking/BookLandingScreen";
import { SearchResultsScreen } from "@/screens/booking/SearchResultsScreen";
import { CategoryExplorerScreen } from "@/screens/booking/CategoryExplorerScreen";
import { TestListingScreen } from "@/screens/booking/TestListingScreen";
import { TestDetailsScreen } from "@/screens/booking/TestDetailsScreen";
import { PackageDetailsScreen } from "@/screens/booking/PackageDetailsScreen";
import { CartScreen } from "@/screens/booking/CartScreen";
import { CollectionMethodScreen } from "@/screens/booking/CollectionMethodScreen";
import { CollectionAddressScreen } from "@/screens/booking/CollectionAddressScreen";
import { SelectLabScreen } from "@/screens/booking/SelectLabScreen";
import { SelectSlotScreen } from "@/screens/booking/SelectSlotScreen";
import { ReviewBookingScreen } from "@/screens/booking/ReviewBookingScreen";
import { PaymentScreen } from "@/screens/booking/PaymentScreen";
import { PaymentFailedScreen } from "@/screens/booking/PaymentFailedScreen";
import { BookingConfirmedScreen } from "@/screens/booking/BookingConfirmedScreen";
import { TrackBookingScreen } from "@/screens/booking/TrackBookingScreen";
import { ReportReadyScreen } from "@/screens/booking/ReportReadyScreen";
import { BookingCancellationScreen } from "@/screens/booking/BookingCancellationScreen";
import { RefundStatusScreen } from "@/screens/booking/RefundStatusScreen";
import { RescheduleBookingScreen } from "@/screens/booking/RescheduleBookingScreen";

// Records & AI insights
import { EHRDashboardScreen } from "@/screens/records/EHRDashboardScreen";
import { RecordCategoriesScreen } from "@/screens/records/RecordCategoriesScreen";
import { RecordDetailsScreen } from "@/screens/records/RecordDetailsScreen";
import { SourceReportViewerScreen } from "@/screens/records/SourceReportViewerScreen";
import { HealthTimelineScreen } from "@/screens/records/HealthTimelineScreen";
import { TrendsScreen } from "@/screens/records/TrendsScreen";
import { UploadRecordScreen } from "@/screens/records/UploadRecordScreen";
import { ShareRecordsScreen } from "@/screens/records/ShareRecordsScreen";
import { AIConsentScreen } from "@/screens/ai-insights/AIConsentScreen";
import { InsightsDashboardScreen } from "@/screens/ai-insights/InsightsDashboardScreen";
import { KeyFindingsScreen } from "@/screens/ai-insights/KeyFindingsScreen";
import { NextStepsScreen } from "@/screens/ai-insights/NextStepsScreen";

// Consultations
import { CareLandingScreen } from "@/screens/consultations/CareLandingScreen";
import { SpecialtySelectionScreen } from "@/screens/consultations/SpecialtySelectionScreen";
import { DoctorListingScreen } from "@/screens/consultations/DoctorListingScreen";
import { DoctorProfileScreen } from "@/screens/consultations/DoctorProfileScreen";
import { ReviewAppointmentScreen } from "@/screens/consultations/ReviewAppointmentScreen";
import { CarePaymentScreen } from "@/screens/consultations/CarePaymentScreen";
import { AppointmentConfirmedScreen } from "@/screens/consultations/AppointmentConfirmedScreen";
import { MyAppointmentsScreen } from "@/screens/consultations/MyAppointmentsScreen";
import { RescheduleAppointmentScreen } from "@/screens/consultations/RescheduleAppointmentScreen";
import { PreCallCheckScreen } from "@/screens/consultations/PreCallCheckScreen";
import { WaitingRoomScreen } from "@/screens/consultations/WaitingRoomScreen";
import { VideoCallScreen } from "@/screens/consultations/VideoCallScreen";
import { ChatConsultScreen } from "@/screens/consultations/ChatConsultScreen";
import { PostVisitSummaryScreen } from "@/screens/consultations/PostVisitSummaryScreen";
import { PrescriptionViewerScreen } from "@/screens/consultations/PrescriptionViewerScreen";
import { PrescriptionToRemindersScreen } from "@/screens/consultations/PrescriptionToRemindersScreen";
import { MyPrescriptionsScreen } from "@/screens/consultations/MyPrescriptionsScreen";
import { OriginalPrescriptionScreen } from "@/screens/consultations/OriginalPrescriptionScreen";

// Profile
import { UserProfileScreen } from "@/screens/profile/UserProfileScreen";
import { EditProfileScreen } from "@/screens/profile/EditProfileScreen";
import { HealthProfileScreen } from "@/screens/profile/HealthProfileScreen";
import { SettingsScreen } from "@/screens/profile/SettingsScreen";
import { NotificationSettingsScreen } from "@/screens/profile/NotificationSettingsScreen";
import { PrivacySecurityScreen } from "@/screens/profile/PrivacySecurityScreen";
import { AppLockSetupScreen } from "@/screens/profile/AppLockSetupScreen";
import { HelpSupportScreen } from "@/screens/profile/HelpSupportScreen";
import { DeleteAccountScreen } from "@/screens/profile/DeleteAccountScreen";

const opts = { headerShown: false } as const;

const AuthNav = createNativeStackNavigator<AuthStackParamList>();
export function AuthStack() {
  return (
    <AuthNav.Navigator screenOptions={opts}>
      <AuthNav.Screen name="Login" component={LoginScreen} />
      <AuthNav.Screen name="MobileNumber" component={MobileNumberScreen} />
      <AuthNav.Screen name="OTPVerification" component={OTPVerificationScreen} />
      <AuthNav.Screen name="AccountLocked" component={AccountLockedScreen} />
    </AuthNav.Navigator>
  );
}

const OnbNav = createNativeStackNavigator<OnboardingStackParamList>();
export function OnboardingStack() {
  return (
    <OnbNav.Navigator screenOptions={opts}>
      <OnbNav.Screen name="Consent" component={ConsentScreen} />
      <OnbNav.Screen name="Welcome" component={WelcomeScreen} />
      <OnbNav.Screen name="HealthGoals" component={HealthGoalsScreen} />
      <OnbNav.Screen name="BasicProfile" component={BasicProfileScreen} />
      <OnbNav.Screen name="HealthInterests" component={HealthInterestsScreen} />
      <OnbNav.Screen name="Recommendations" component={RecommendationsScreen} />
    </OnbNav.Navigator>
  );
}

const HomeNav = createNativeStackNavigator<HomeStackParamList>();
export function HomeStack() {
  return (
    <HomeNav.Navigator screenOptions={opts}>
      <HomeNav.Screen name="HomeDashboard" component={HomeDashboardScreen} />
      <HomeNav.Screen name="NotificationCenter" component={NotificationCenterScreen} />
      <HomeNav.Screen name="RemindersToday" component={RemindersTodayScreen} />
      <HomeNav.Screen name="ReminderDetails" component={ReminderDetailsScreen} />
      <HomeNav.Screen name="CreateReminder" component={CreateReminderScreen} />
      <HomeNav.Screen name="MissedReminder" component={MissedReminderScreen} />
    </HomeNav.Navigator>
  );
}

const BookNav = createNativeStackNavigator<BookStackParamList>();
export function BookStack() {
  return (
    <BookNav.Navigator screenOptions={opts}>
      <BookNav.Screen name="BookLanding" component={BookLandingScreen} />
      <BookNav.Screen name="SearchResults" component={SearchResultsScreen} />
      <BookNav.Screen name="CategoryExplorer" component={CategoryExplorerScreen} />
      <BookNav.Screen name="TestListing" component={TestListingScreen} />
      <BookNav.Screen name="TestDetails" component={TestDetailsScreen} />
      <BookNav.Screen name="PackageDetails" component={PackageDetailsScreen} />
      <BookNav.Screen name="Cart" component={CartScreen} />
      <BookNav.Screen name="CollectionMethod" component={CollectionMethodScreen} />
      <BookNav.Screen name="CollectionAddress" component={CollectionAddressScreen} />
      <BookNav.Screen name="SelectLab" component={SelectLabScreen} />
      <BookNav.Screen name="SelectSlot" component={SelectSlotScreen} />
      <BookNav.Screen name="ReviewBooking" component={ReviewBookingScreen} />
      <BookNav.Screen name="Payment" component={PaymentScreen} />
      <BookNav.Screen name="PaymentFailed" component={PaymentFailedScreen} />
      <BookNav.Screen name="BookingConfirmed" component={BookingConfirmedScreen} />
      <BookNav.Screen name="TrackBooking" component={TrackBookingScreen} />
      <BookNav.Screen name="ReportReady" component={ReportReadyScreen} />
      <BookNav.Screen name="BookingCancellation" component={BookingCancellationScreen} />
      <BookNav.Screen name="RefundStatus" component={RefundStatusScreen} />
      <BookNav.Screen name="RescheduleBooking" component={RescheduleBookingScreen} />
    </BookNav.Navigator>
  );
}

const RecNav = createNativeStackNavigator<RecordsStackParamList>();
export function RecordsStack() {
  return (
    <RecNav.Navigator screenOptions={opts}>
      <RecNav.Screen name="EHRDashboard" component={EHRDashboardScreen} />
      <RecNav.Screen name="RecordCategories" component={RecordCategoriesScreen} />
      <RecNav.Screen name="RecordDetails" component={RecordDetailsScreen} />
      <RecNav.Screen name="SourceReportViewer" component={SourceReportViewerScreen} />
      <RecNav.Screen name="HealthTimeline" component={HealthTimelineScreen} />
      <RecNav.Screen name="Trends" component={TrendsScreen} />
      <RecNav.Screen name="UploadRecord" component={UploadRecordScreen} />
      <RecNav.Screen name="ShareRecords" component={ShareRecordsScreen} />
      <RecNav.Screen name="AIConsent" component={AIConsentScreen} />
      <RecNav.Screen name="InsightsDashboard" component={InsightsDashboardScreen} />
      <RecNav.Screen name="KeyFindings" component={KeyFindingsScreen} />
      <RecNav.Screen name="NextSteps" component={NextStepsScreen} />
    </RecNav.Navigator>
  );
}

const CareNav = createNativeStackNavigator<CareStackParamList>();
export function CareStack() {
  return (
    <CareNav.Navigator screenOptions={opts}>
      <CareNav.Screen name="CareLanding" component={CareLandingScreen} />
      <CareNav.Screen name="SpecialtySelection" component={SpecialtySelectionScreen} />
      <CareNav.Screen name="DoctorListing" component={DoctorListingScreen} />
      <CareNav.Screen name="DoctorProfile" component={DoctorProfileScreen} />
      <CareNav.Screen name="ReviewAppointment" component={ReviewAppointmentScreen} />
      <CareNav.Screen name="CarePayment" component={CarePaymentScreen} />
      <CareNav.Screen name="AppointmentConfirmed" component={AppointmentConfirmedScreen} />
      <CareNav.Screen name="MyAppointments" component={MyAppointmentsScreen} />
      <CareNav.Screen name="RescheduleAppointment" component={RescheduleAppointmentScreen} />
      <CareNav.Screen name="PreCallCheck" component={PreCallCheckScreen} />
      <CareNav.Screen name="WaitingRoom" component={WaitingRoomScreen} />
      <CareNav.Screen name="VideoCall" component={VideoCallScreen} />
      <CareNav.Screen name="ChatConsult" component={ChatConsultScreen} />
      <CareNav.Screen name="PostVisitSummary" component={PostVisitSummaryScreen} />
      <CareNav.Screen name="PrescriptionViewer" component={PrescriptionViewerScreen} />
      <CareNav.Screen name="PrescriptionToReminders" component={PrescriptionToRemindersScreen} />
      <CareNav.Screen name="MyPrescriptions" component={MyPrescriptionsScreen} />
      <CareNav.Screen name="OriginalPrescription" component={OriginalPrescriptionScreen} />
    </CareNav.Navigator>
  );
}

const ProfNav = createNativeStackNavigator<ProfileStackParamList>();
export function ProfileStack() {
  return (
    <ProfNav.Navigator screenOptions={opts}>
      <ProfNav.Screen name="UserProfile" component={UserProfileScreen} />
      <ProfNav.Screen name="EditProfile" component={EditProfileScreen} />
      <ProfNav.Screen name="HealthProfile" component={HealthProfileScreen} />
      <ProfNav.Screen name="Settings" component={SettingsScreen} />
      <ProfNav.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
      <ProfNav.Screen name="PrivacySecurity" component={PrivacySecurityScreen} />
      <ProfNav.Screen name="AppLockSetup" component={AppLockSetupScreen} />
      <ProfNav.Screen name="HelpSupport" component={HelpSupportScreen} />
      <ProfNav.Screen name="DeleteAccount" component={DeleteAccountScreen} />
    </ProfNav.Navigator>
  );
}
