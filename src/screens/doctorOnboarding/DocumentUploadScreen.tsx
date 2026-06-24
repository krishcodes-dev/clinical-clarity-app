import React, { useState } from "react";
import { Alert, Text, View } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { DoctorStackParamList } from "@/app/types";
import { Screen } from "@/ui/Screen";
import { AppHeader } from "@/ui/AppHeader";
import { PrimaryButton } from "@/ui/PrimaryButton";
import { DocumentUploadCard, DocumentCardStatus } from "@/ui/DocumentUploadCard";
import { ProfileLockedBanner } from "@/ui/ProfileLockedBanner";
import { useDoctorOnboardingStore } from "@/store/useDoctorOnboardingStore";
import { DoctorDocumentType } from "@/features/doctorOnboarding/types";
import { ApiError } from "@/features/doctorOnboarding/api";

type Props = NativeStackScreenProps<DoctorStackParamList, "DocumentUpload">;

const REQUIRED_DOCS: { type: DoctorDocumentType; title: string; icon: string; usesCamera?: boolean }[] = [
  { type: "medical_degree", title: "Medical Degree", icon: "school" },
  { type: "medical_council_registration", title: "Medical Council Registration", icon: "verified_user" },
  { type: "government_id", title: "Government ID", icon: "badge" },
  { type: "profile_photo", title: "Profile Photo", icon: "photo_camera", usesCamera: true },
];

function buildMockFileUrl(fileName: string) {
  return `https://mock-storage.abhaya.dev/${Date.now()}-${encodeURIComponent(fileName)}`;
}

export function DocumentUploadScreen({ navigation }: Props) {
  const { profile, upsertDocument, lockedNotice } = useDoctorOnboardingStore();
  const [uploadingType, setUploadingType] = useState<DoctorDocumentType | null>(null);

  const documentByType = (type: DoctorDocumentType) =>
    profile?.documents.find((d) => d.documentType === type);

  const cardStatus = (type: DoctorDocumentType): DocumentCardStatus => {
    if (uploadingType === type) return "uploading";
    const doc = documentByType(type);
    if (!doc) return "missing";
    if (doc.verificationStatus === "rejected") return "rejected";
    return "uploaded";
  };

  const finishUpload = async (
    type: DoctorDocumentType,
    fileName: string,
    mimeType: string | undefined,
    fileSizeBytes: number | undefined
  ) => {
    setUploadingType(type);
    try {
      // Simulated upload latency - no real storage backend yet.
      await new Promise((resolve) => setTimeout(resolve, 1200));
      await upsertDocument(type, {
        fileUrl: buildMockFileUrl(fileName),
        originalFileName: fileName,
        mimeType,
        fileSizeBytes,
      });
    } catch (e) {
      if (!(e instanceof ApiError && e.status === 423)) {
        const message = e instanceof Error ? e.message : "Upload failed. Please try again.";
        Alert.alert("Upload failed", message);
      }
    } finally {
      setUploadingType(null);
    }
  };

  const pickDocument = async (type: DoctorDocumentType) => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["application/pdf", "image/*"],
      copyToCacheDirectory: true,
    });
    if (result.canceled || !result.assets?.length) return;
    const asset = result.assets[0];
    await finishUpload(type, asset.name, asset.mimeType, asset.size ?? undefined);
  };

  const pickPhoto = async (type: DoctorDocumentType, fromCamera: boolean) => {
    const permission = fromCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission needed", "Please grant access to continue.");
      return;
    }
    const result = fromCamera
      ? await ImagePicker.launchCameraAsync({ quality: 0.7 })
      : await ImagePicker.launchImageLibraryAsync({ quality: 0.7 });
    if (result.canceled || !result.assets?.length) return;
    const asset = result.assets[0];
    const fileName = asset.fileName ?? `profile-photo-${Date.now()}.jpg`;
    await finishUpload(type, fileName, asset.mimeType ?? "image/jpeg", asset.fileSize);
  };

  const handlePress = (type: DoctorDocumentType, usesCamera?: boolean) => {
    if (!usesCamera) {
      pickDocument(type);
      return;
    }
    Alert.alert("Profile Photo", "Choose a source", [
      { text: "Camera", onPress: () => pickPhoto(type, true) },
      { text: "Photo Library", onPress: () => pickPhoto(type, false) },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const allUploaded = REQUIRED_DOCS.every((d) => {
    const doc = documentByType(d.type);
    return !!doc && doc.verificationStatus !== "rejected";
  });

  return (
    <Screen contentClassName="px-md pb-lg">
      <AppHeader title="Document Upload" />
      {lockedNotice ? <ProfileLockedBanner message={lockedNotice} /> : null}

      <Text className="font-inter text-body-sm text-on-surface-variant mb-md">
        Upload the following documents to verify your identity and credentials.
      </Text>

      <View className="mb-md">
        {REQUIRED_DOCS.map((d) => (
          <DocumentUploadCard
            key={d.type}
            icon={d.icon}
            title={d.title}
            status={cardStatus(d.type)}
            fileName={documentByType(d.type)?.originalFileName ?? undefined}
            rejectionReason={documentByType(d.type)?.rejectionReason ?? undefined}
            disabled={profile?.profileLocked}
            onPress={() => handlePress(d.type, d.usesCamera)}
          />
        ))}
      </View>

      <View className="bg-surface-container-low rounded-2xl p-md mb-md">
        <Text className="font-inter-semibold text-body-sm text-on-surface mb-1">
          Completion Tracker
        </Text>
        {REQUIRED_DOCS.map((d) => (
          <View key={d.type} className="flex-row items-center justify-between py-1">
            <Text className="font-inter text-body-sm text-on-surface-variant">{d.title}</Text>
            <Text className="font-inter-semibold text-body-sm text-on-surface">
              {cardStatus(d.type) === "uploaded" ? "✓" : "—"}
            </Text>
          </View>
        ))}
      </View>

      <PrimaryButton
        label="Continue"
        disabled={!allUploaded}
        onPress={() => navigation.navigate("ReviewAndDeclaration")}
      />
    </Screen>
  );
}
