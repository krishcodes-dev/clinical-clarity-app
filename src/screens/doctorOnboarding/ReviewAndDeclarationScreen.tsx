import React, { useState } from "react";
import { Alert, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CommonActions } from "@react-navigation/native";
import { DoctorStackParamList } from "@/app/types";
import { Screen } from "@/ui/Screen";
import { AppHeader } from "@/ui/AppHeader";
import { PrimaryButton } from "@/ui/PrimaryButton";
import { DoctorProfileSummaryCard } from "@/ui/DoctorProfileSummaryCard";
import { DeclarationCard } from "@/ui/DeclarationCard";
import { ProfileLockedBanner } from "@/ui/ProfileLockedBanner";
import { Icon } from "@/ui/Icon";
import { colors } from "@/theme";
import { useDoctorOnboardingStore } from "@/store/useDoctorOnboardingStore";
import { REQUIRED_DOCUMENT_TYPES } from "@/features/doctorOnboarding/types";
import { ApiError } from "@/features/doctorOnboarding/api";

type Props = NativeStackScreenProps<DoctorStackParamList, "ReviewAndDeclaration">;

const DOC_LABELS: Record<string, string> = {
  medical_degree: "Medical Degree",
  medical_council_registration: "Registration Certificate",
  government_id: "Government ID",
  profile_photo: "Profile Photo",
};

export function ReviewAndDeclarationScreen({ navigation }: Props) {
  const { profile, patchProfile, submitForReview, lockedNotice } = useDoctorOnboardingStore();
  const [accepted, setAccepted] = useState(profile?.declarationAccepted ?? false);
  const [submitting, setSubmitting] = useState(false);

  if (!profile) return null;

  const presentTypes = new Set(profile.documents.map((d) => d.documentType));

  const toggleDeclaration = async () => {
    const next = !accepted;
    setAccepted(next);
    try {
      await patchProfile({ declarationAccepted: next });
    } catch {
      setAccepted(!next);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await submitForReview();
      navigation.dispatch(
        CommonActions.reset({ index: 0, routes: [{ name: "VerificationStatus" }] })
      );
    } catch (e) {
      if (e instanceof ApiError && e.status === 400 && e.code === "PROFILE_INCOMPLETE") {
        Alert.alert("Profile incomplete", e.message);
      } else if (!(e instanceof ApiError && e.status === 423)) {
        const message = e instanceof Error ? e.message : "Couldn't submit for review.";
        Alert.alert("Submission failed", message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen contentClassName="px-md pb-lg">
      <AppHeader title="Review & Declaration" />
      {lockedNotice ? <ProfileLockedBanner message={lockedNotice} /> : null}

      <DoctorProfileSummaryCard profile={profile} />

      <View className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-md mb-md">
        <Text className="font-inter-semibold text-headline-md text-on-surface mb-sm">Documents</Text>
        {REQUIRED_DOCUMENT_TYPES.map((type) => (
          <View key={type} className="flex-row items-center gap-sm py-1">
            <Icon
              name={presentTypes.has(type) ? "check_circle" : "radio_button_unchecked"}
              size={18}
              color={presentTypes.has(type) ? colors.success : colors.outline}
            />
            <Text className="font-inter text-body-sm text-on-surface">{DOC_LABELS[type]}</Text>
          </View>
        ))}
      </View>

      <View className="mb-md">
        <DeclarationCard checked={accepted} onToggle={toggleDeclaration} disabled={profile.profileLocked} />
      </View>

      <PrimaryButton
        label="Submit For Verification"
        disabled={!accepted || profile.profileLocked}
        loading={submitting}
        onPress={handleSubmit}
      />
    </Screen>
  );
}
