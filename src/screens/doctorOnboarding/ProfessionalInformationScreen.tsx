import React, { useMemo, useState } from "react";
import { Alert, FlatList, Modal, Pressable, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { DoctorStackParamList } from "@/app/types";
import { Screen } from "@/ui/Screen";
import { AppHeader } from "@/ui/AppHeader";
import { TextField } from "@/ui/TextField";
import { PrimaryButton } from "@/ui/PrimaryButton";
import { SecondaryButton } from "@/ui/SecondaryButton";
import { SearchBar } from "@/ui/SearchBar";
import { Icon } from "@/ui/Icon";
import { ProfileLockedBanner } from "@/ui/ProfileLockedBanner";
import { useDoctorOnboardingStore } from "@/store/useDoctorOnboardingStore";
import { SPECIALIZATIONS } from "@/constants/specializations";
import { colors } from "@/theme";
import { ApiError } from "@/features/doctorOnboarding/api";

type Props = NativeStackScreenProps<DoctorStackParamList, "ProfessionalInformation">;

export function ProfessionalInformationScreen({ navigation }: Props) {
  const { profile, patchProfile, lockedNotice } = useDoctorOnboardingStore();
  const locked = profile?.profileLocked ?? false;

  const [registrationNumber, setRegistrationNumber] = useState(profile?.registrationNumber ?? "");
  const [qualification, setQualification] = useState(profile?.qualification ?? "");
  const [specialization, setSpecialization] = useState(profile?.specialization ?? "");
  const [yearsOfExperience, setYearsOfExperience] = useState(
    profile?.yearsOfExperience != null ? String(profile.yearsOfExperience) : ""
  );
  const [consultationFee, setConsultationFee] = useState(
    profile?.consultationFee != null ? String(profile.consultationFee) : ""
  );
  const [currentHospital, setCurrentHospital] = useState(profile?.currentHospital ?? "");
  const [bio, setBio] = useState(profile?.bio ?? "");
  const [specializationModalOpen, setSpecializationModalOpen] = useState(false);
  const [specializationQuery, setSpecializationQuery] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const filteredSpecializations = useMemo(
    () =>
      SPECIALIZATIONS.filter((s) => s.toLowerCase().includes(specializationQuery.toLowerCase())),
    [specializationQuery]
  );

  const buildPayload = () => ({
    registrationNumber: registrationNumber.trim() || undefined,
    qualification: qualification.trim() || undefined,
    specialization: specialization.trim() || undefined,
    yearsOfExperience: yearsOfExperience ? Number(yearsOfExperience) : undefined,
    consultationFee: consultationFee ? Number(consultationFee) : undefined,
    currentHospital: currentHospital.trim() || null,
    bio: bio.trim() || null,
  });

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!registrationNumber.trim()) next.registrationNumber = "Registration number is required";
    if (!qualification.trim()) next.qualification = "Qualification is required";
    if (!specialization.trim()) next.specialization = "Specialization is required";
    if (!yearsOfExperience.trim()) next.yearsOfExperience = "Years of experience is required";
    if (!consultationFee.trim()) next.consultationFee = "Consultation fee is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSave = async (andContinue: boolean) => {
    if (andContinue && !validate()) return;
    setSaving(true);
    try {
      await patchProfile(buildPayload());
      if (andContinue) {
        navigation.navigate("DocumentUpload");
      } else {
        navigation.goBack();
      }
    } catch (e) {
      if (e instanceof ApiError && e.status === 423) {
        // Banner already shown via store's lockedNotice.
      } else {
        const message = e instanceof Error ? e.message : "Something went wrong. Please try again.";
        Alert.alert("Couldn't save profile", message);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen contentClassName="px-md pb-lg">
      <AppHeader title="Professional Information" />
      {lockedNotice ? <ProfileLockedBanner message={lockedNotice} /> : null}

      <TextField
        label="Registration Number *"
        value={registrationNumber}
        onChangeText={setRegistrationNumber}
        editable={!locked}
        error={errors.registrationNumber}
        autoCapitalize="characters"
      />
      <TextField
        label="Qualification *"
        value={qualification}
        onChangeText={setQualification}
        editable={!locked}
        error={errors.qualification}
        placeholder="e.g. MBBS, MD"
      />

      <View className="mb-md">
        <Text className="font-inter-medium text-body-sm text-on-surface-variant mb-1">
          Specialization *
        </Text>
        <Pressable
          onPress={() => !locked && setSpecializationModalOpen(true)}
          accessibilityRole="button"
          accessibilityLabel="Select specialization"
          className={`flex-row items-center justify-between bg-surface-container-lowest border rounded-xl px-md min-h-[52px] ${
            errors.specialization ? "border-error" : "border-outline-variant"
          }`}
        >
          <Text
            className={`font-inter text-body-lg ${specialization ? "text-on-surface" : "text-outline"}`}
          >
            {specialization || "Select specialization"}
          </Text>
          <Icon name="expand_more" size={20} color={colors.outline} />
        </Pressable>
        {errors.specialization ? (
          <Text className="font-inter text-[12px] text-error mt-1">{errors.specialization}</Text>
        ) : null}
      </View>

      <TextField
        label="Years of Experience *"
        value={yearsOfExperience}
        onChangeText={setYearsOfExperience}
        editable={!locked}
        error={errors.yearsOfExperience}
        keyboardType="numeric"
      />
      <TextField
        label="Consultation Fee *"
        value={consultationFee}
        onChangeText={setConsultationFee}
        editable={!locked}
        error={errors.consultationFee}
        keyboardType="numeric"
      />
      <TextField
        label="Current Hospital"
        value={currentHospital}
        onChangeText={setCurrentHospital}
        editable={!locked}
      />
      <TextField
        label="Bio"
        value={bio}
        onChangeText={setBio}
        editable={!locked}
        multiline
        numberOfLines={4}
        style={{ minHeight: 100, textAlignVertical: "top" }}
      />

      <PrimaryButton
        label="Save & Continue"
        onPress={() => handleSave(true)}
        loading={saving}
        disabled={locked}
        className="mb-sm"
      />
      <SecondaryButton label="Save Draft" onPress={() => handleSave(false)} disabled={locked || saving} />

      <Modal visible={specializationModalOpen} animationType="slide" onRequestClose={() => setSpecializationModalOpen(false)}>
        <Screen contentClassName="px-md pb-lg" scroll={false}>
          <View className="flex-row items-center justify-between py-sm">
            <Text className="font-inter-semibold text-headline-md text-on-surface">
              Select Specialization
            </Text>
            <Pressable
              onPress={() => setSpecializationModalOpen(false)}
              accessibilityRole="button"
              accessibilityLabel="Close"
              hitSlop={8}
            >
              <Icon name="close" size={24} color={colors.onSurface} />
            </Pressable>
          </View>
          <View className="mb-md">
            <SearchBar
              placeholder="Search specialization"
              value={specializationQuery}
              onChangeText={setSpecializationQuery}
            />
          </View>
          <FlatList
            data={filteredSpecializations}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => {
                  setSpecialization(item);
                  setSpecializationModalOpen(false);
                  setSpecializationQuery("");
                }}
                accessibilityRole="button"
                className="py-md border-b border-outline-variant"
              >
                <Text className="font-inter text-body-lg text-on-surface">{item}</Text>
              </Pressable>
            )}
          />
        </Screen>
      </Modal>
    </Screen>
  );
}
