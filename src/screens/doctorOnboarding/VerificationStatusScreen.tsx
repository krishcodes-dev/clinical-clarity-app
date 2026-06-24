import React, { useCallback, useEffect, useState } from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { DoctorStackParamList } from "@/app/types";
import { AppHeader } from "@/ui/AppHeader";
import { PrimaryButton } from "@/ui/PrimaryButton";
import { SecondaryButton } from "@/ui/SecondaryButton";
import { LoadingSkeleton } from "@/ui/LoadingSkeleton";
import { ErrorState } from "@/ui/ErrorState";
import { VerificationStatusBadge } from "@/ui/VerificationStatusBadge";
import { VerificationProgressCard } from "@/ui/VerificationProgressCard";
import { VerificationChecklist } from "@/ui/VerificationChecklist";
import { TimelineItem } from "@/ui/TimelineItem";
import { DoctorProfileSummaryCard } from "@/ui/DoctorProfileSummaryCard";
import { useDoctorOnboardingStore } from "@/store/useDoctorOnboardingStore";
import { useAuthStore } from "@/store/useAuthStore";
import { deriveOnboardingProgress } from "@/features/doctorOnboarding/progress";

type Props = NativeStackScreenProps<DoctorStackParamList, "VerificationStatus">;

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

export function VerificationStatusScreen({ navigation }: Props) {
  const { profile, isLoading, error, fetchProfile } = useDoctorOnboardingStore();
  const doctorName = useAuthStore((s) => s.user?.full_name) ?? "Doctor";
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchProfile();
    setRefreshing(false);
  }, [fetchProfile]);

  if (isLoading && !profile) {
    return (
      <SafeAreaView edges={["top"]} className="flex-1 bg-background">
        <AppHeader title="Verification" back={false} />
        <View className="px-md">
          <LoadingSkeleton count={3} />
        </View>
      </SafeAreaView>
    );
  }

  if (error && !profile) {
    return (
      <SafeAreaView edges={["top"]} className="flex-1 bg-background">
        <AppHeader title="Verification" back={false} />
        <ErrorState title="Couldn't load verification status" body={error} onRetry={fetchProfile} />
      </SafeAreaView>
    );
  }

  const progress = deriveOnboardingProgress(profile);
  const status = profile?.verificationStatus ?? "profile_incomplete";

  const checklistItems = [
    { label: "Professional Information", done: progress.profileComplete },
    { label: "Documents Uploaded", done: progress.documentsComplete },
    { label: "Declaration Accepted", done: progress.declarationAccepted },
    { label: "Submitted for Review", done: progress.submitted },
  ];

  const nextStep = (): keyof DoctorStackParamList => {
    if (!progress.profileComplete) return "ProfessionalInformation";
    if (!progress.documentsComplete) return "DocumentUpload";
    return "ReviewAndDeclaration";
  };

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-background">
      <AppHeader title="Verification" back={false} />
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-md pb-lg"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        <VerificationStatusBadge status={status} />

        {status === "profile_incomplete" && (
          <>
            <VerificationProgressCard doctorName={doctorName} progress={progress.percent} />
            <VerificationChecklist items={checklistItems} />
            <PrimaryButton
              label="Continue Verification"
              onPress={() => navigation.navigate(nextStep())}
            />
          </>
        )}

        {status === "under_review" && (
          <>
            <Text className="font-inter-bold text-headline-lg-mobile text-on-surface mt-md mb-1">
              Verification Under Review
            </Text>
            <Text className="font-inter text-body-sm text-on-surface-variant mb-md">
              Your documents are currently being reviewed by our verification team.
            </Text>
            <View className="bg-surface-container-low rounded-2xl p-md mb-md">
              <Text className="font-inter text-body-sm text-on-surface-variant">Submitted</Text>
              <Text className="font-inter-semibold text-body-lg text-on-surface mb-sm">
                {formatDate(profile?.submittedAt ?? null)}
              </Text>
              <Text className="font-inter text-body-sm text-on-surface-variant">
                Estimated Review Time
              </Text>
              <Text className="font-inter-semibold text-body-lg text-on-surface">
                1–3 Business Days
              </Text>
            </View>
            <TimelineSection profile={profile} />
          </>
        )}

        {status === "verified" && (
          <>
            <Text className="font-inter-bold text-headline-lg-mobile text-on-surface mt-md mb-1">
              Your account has been successfully verified.
            </Text>
            <Text className="font-inter text-body-sm text-on-surface-variant mb-md">
              Verified On {formatDate(profile?.verifiedAt ?? null)}
            </Text>
            <TimelineSection profile={profile} />
            {profile ? <DoctorProfileSummaryCard profile={profile} /> : null}
            <PrimaryButton
              label="Continue to Doctor Dashboard"
              onPress={() => navigation.navigate("DoctorHomePlaceholder")}
            />
          </>
        )}

        {status === "rejected" && (
          <>
            <Text className="font-inter-bold text-headline-lg-mobile text-on-surface mt-md mb-1">
              Verification Rejected
            </Text>
            <View className="bg-error-container rounded-2xl p-md mb-md">
              <Text className="font-inter-semibold text-body-sm text-on-error-container mb-1">
                Reason
              </Text>
              <Text className="font-inter text-body-sm text-on-error-container">
                {profile?.rejectionReason ?? "No reason provided."}
              </Text>
            </View>
            <TimelineSection profile={profile} />
            <PrimaryButton
              label="Edit Profile"
              onPress={() => navigation.navigate("ProfessionalInformation")}
            />
          </>
        )}

        {status === "suspended" && (
          <>
            <Text className="font-inter-bold text-headline-lg-mobile text-on-surface mt-md mb-1">
              Verification Suspended
            </Text>
            <View className="bg-error-container rounded-2xl p-md mb-md">
              <Text className="font-inter-semibold text-body-sm text-on-error-container mb-1">
                Reason
              </Text>
              <Text className="font-inter text-body-sm text-on-error-container">
                {profile?.suspensionReason ?? "No reason provided."}
              </Text>
            </View>
            <TimelineSection profile={profile} />
            <SecondaryButton
              label="Update Information"
              onPress={() => navigation.navigate("ProfessionalInformation")}
            />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function TimelineSection({ profile }: { profile: ReturnType<typeof useDoctorOnboardingStore.getState>["profile"] }) {
  const progress = deriveOnboardingProgress(profile);
  const steps = [
    { label: "Profile Created", status: progress.profileComplete ? "completed" : "pending", date: null },
    { label: "Documents Uploaded", status: progress.documentsComplete ? "completed" : "pending", date: null },
    {
      label: "Submitted For Review",
      status: progress.submitted ? "completed" : "pending",
      date: profile?.submittedAt ? formatDate(profile.submittedAt) : null,
    },
    {
      label: "Verification Approved",
      status: profile?.verificationStatus === "verified" ? "completed" : "pending",
      date: profile?.verifiedAt ? formatDate(profile.verifiedAt) : null,
    },
  ] as const;

  return (
    <View className="mb-md">
      {steps.map((s, i) => (
        <TimelineItem
          key={s.label}
          label={s.label}
          date={s.date}
          status={s.status}
          isLast={i === steps.length - 1}
        />
      ))}
    </View>
  );
}
