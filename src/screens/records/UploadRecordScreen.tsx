import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RecordsStackParamList } from "@/app/types";
import { Screen } from "@/ui/Screen";
import { AppHeader } from "@/ui/AppHeader";
import { Icon } from "@/ui/Icon";
import { PrimaryButton } from "@/ui/PrimaryButton";
import { SecondaryButton } from "@/ui/SecondaryButton";
import { TrustFooter } from "@/ui/TrustFooter";
import { useAuthStore } from "@/store/useAuthStore";
import { colors } from "@/theme";

type Props = NativeStackScreenProps<RecordsStackParamList, "UploadRecord">;

type UploadState = "idle" | "processing" | "success";

const METHODS = [
  { icon: "picture_as_pdf", title: "PDF Upload", sub: "Standard reports" },
  { icon: "image", title: "Image Upload", sub: "JPG, PNG files" },
  { icon: "photo_camera", title: "Camera Scan", sub: "Mobile capture" },
];

/** Upload Record - idle → processing → success states from the prototype. */
export function UploadRecordScreen({ navigation }: Props) {
  const [state, setState] = useState<UploadState>("idle");
  const aiConsentGiven = useAuthStore((s) => s.aiConsentGiven);

  const startUpload = () => {
    setState("processing");
    setTimeout(() => setState("success"), 2200);
  };

  return (
    <Screen contentClassName="px-md pb-lg">
      <AppHeader title="Upload Medical Record" />

      {state === "idle" && (
        <>
          <View className="flex-row gap-sm mb-md">
            {METHODS.map((m) => (
              <Pressable
                key={m.title}
                onPress={startUpload}
                accessibilityRole="button"
                accessibilityLabel={`${m.title}, ${m.sub}`}
                className="flex-1 bg-surface-container-low rounded-2xl items-center py-md"
              >
                <Icon name={m.icon} size={26} color={colors.primaryContainer} />
                <Text className="font-inter-semibold text-[12px] text-on-surface mt-xs text-center">
                  {m.title}
                </Text>
                <Text className="font-inter text-[10px] text-on-surface-variant">{m.sub}</Text>
              </Pressable>
            ))}
          </View>

          <Pressable
            onPress={startUpload}
            accessibilityRole="button"
            accessibilityLabel="Browse files to upload, maximum 20 megabytes"
            className="border-2 border-dashed border-outline-variant rounded-3xl items-center py-xl bg-surface-container-lowest"
          >
            <Icon name="cloud_upload" size={44} color={colors.surfaceTint} />
            <Text className="font-inter-semibold text-body-lg text-on-surface mt-sm">
              Tap to browse files
            </Text>
            <Text className="font-inter text-[12px] text-on-surface-variant mt-1">
              PDF, JPG or PNG · MAX 20MB
            </Text>
          </Pressable>

          <View className="bg-surface-container-low rounded-2xl p-md mt-md">
            <Text className="font-inter-semibold text-body-sm text-on-surface mb-1">
              How we process your records
            </Text>
            <Text className="font-inter text-[12px] text-on-surface-variant">
              Our clinical-grade AI identifies markers, medication names and date
              ranges, then synthesizes them into your Health Trends dashboard.
            </Text>
          </View>
          <TrustFooter variant="upload" />
        </>
      )}

      {state === "processing" && (
        <Animated.View entering={FadeIn.duration(250)} className="items-center py-xl">
          <View className="w-24 h-24 rounded-full bg-primary-fixed items-center justify-center mb-md">
            <Icon name="auto_awesome" size={44} color={colors.onPrimaryFixed} />
          </View>
          <Text className="font-inter-bold text-headline-md text-on-surface">
            Processing Document…
          </Text>
          <Text className="font-inter text-body-sm text-on-surface-variant mt-1 text-center">
            Our AI is extracting medical data points
          </Text>
          <View className="w-full h-1.5 bg-surface-container-high rounded-full mt-lg overflow-hidden">
            <View className="h-full w-2/3 bg-secondary rounded-full" />
          </View>
        </Animated.View>
      )}

      {state === "success" && (
        <Animated.View entering={FadeIn.duration(250)} className="items-center py-xl">
          <View className="w-24 h-24 rounded-full bg-secondary-container items-center justify-center mb-md">
            <Icon name="check_circle" size={48} color={colors.onSecondaryContainer} />
          </View>
          <Text className="font-inter-bold text-headline-md text-on-surface">
            Securely Uploaded
          </Text>
          <Text className="font-inter text-body-sm text-on-surface-variant mt-1">
            blood_report_jan_2024.pdf
          </Text>
          <View className="self-stretch mt-lg gap-sm">
            <PrimaryButton
              label="View AI Insights"
              icon="auto_awesome"
              onPress={() =>
                navigation.replace(aiConsentGiven ? "InsightsDashboard" : "AIConsent")
              }
            />
            <SecondaryButton label="Upload Another" onPress={() => setState("idle")} />
          </View>
        </Animated.View>
      )}
    </Screen>
  );
}
