import React from "react";
import { Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RecordsStackParamList } from "@/app/types";
import { Screen } from "@/ui/Screen";
import { AppHeader } from "@/ui/AppHeader";
import { Icon } from "@/ui/Icon";
import { BentoCard } from "@/ui/BentoCard";
import { PrimaryButton } from "@/ui/PrimaryButton";
import { SecondaryButton } from "@/ui/SecondaryButton";
import { AIDisclaimer } from "@/ui/AIDisclaimer";
import { AI_CONSENT_POINTS } from "@/constants/copy";
import { useAuthStore } from "@/store/useAuthStore";
import { colors } from "@/theme";

type Props = NativeStackScreenProps<RecordsStackParamList, "AIConsent">;

/**
 * NEW SCREEN (UX review §5, P1): first-use AI consent interstitial.
 * Shown once before the first analysis; recorded in local state.
 */
export function AIConsentScreen({ navigation }: Props) {
  const setAiConsent = useAuthStore((s) => s.setAiConsent);

  return (
    <Screen contentClassName="px-md pb-lg">
      <AppHeader title="Before your first analysis" />
      <View className="items-center my-md">
        <View className="w-20 h-20 rounded-full bg-primary-fixed items-center justify-center">
          <Icon name="auto_awesome" size={40} color={colors.onPrimaryFixed} />
        </View>
      </View>

      {AI_CONSENT_POINTS.map((p) => (
        <BentoCard key={p.title} className="mb-sm">
          <View className="flex-row items-start gap-sm">
            <View className="w-10 h-10 rounded-full bg-surface-container items-center justify-center">
              <Icon name={p.icon} size={20} color={colors.primaryContainer} />
            </View>
            <View className="flex-1">
              <Text className="font-inter-semibold text-body-lg text-on-surface">{p.title}</Text>
              <Text className="font-inter text-body-sm text-on-surface-variant mt-0.5">
                {p.body}
              </Text>
            </View>
          </View>
        </BentoCard>
      ))}

      <AIDisclaimer />

      <View className="mt-lg gap-sm">
        <PrimaryButton
          label="I Understand and Authorize Analysis"
          onPress={() => {
            setAiConsent(true);
            navigation.replace("InsightsDashboard");
          }}
        />
        <SecondaryButton label="Not Now" onPress={() => navigation.goBack()} />
      </View>
    </Screen>
  );
}
