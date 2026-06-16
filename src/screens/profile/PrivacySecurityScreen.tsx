import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ProfileStackParamList } from "@/app/types";
import { Screen } from "@/ui/Screen";
import { AppHeader } from "@/ui/AppHeader";
import { Icon } from "@/ui/Icon";
import { BentoCard } from "@/ui/BentoCard";
import { ToggleRow } from "@/ui/ToggleRow";
import { TrustFooter } from "@/ui/TrustFooter";
import { useAuthStore } from "@/store/useAuthStore";
import { colors } from "@/theme";

type Props = NativeStackScreenProps<ProfileStackParamList, "PrivacySecurity">;

const SHARED = [
  { who: "Dr. Anil Kulkarni", what: "HbA1c Report", until: "Expires in 5 days" },
  { who: "Dr. Sneha Patil", what: "Health Profile", until: "Expires in 1 day" },
];

/** Privacy & Security - shared-records access log, permissions, app lock. */
export function PrivacySecurityScreen({ navigation }: Props) {
  const appLockEnabled = useAuthStore((s) => s.appLockEnabled);
  const [analytics, setAnalytics] = useState(false);
  const [secondOpinion, setSecondOpinion] = useState(false);

  return (
    <Screen contentClassName="px-md pb-lg">
      <AppHeader title="Privacy & Security" />

      {/* App lock */}
      <Pressable
        onPress={() => navigation.navigate("AppLockSetup")}
        accessibilityRole="button"
        accessibilityLabel={`App lock, currently ${appLockEnabled ? "on" : "off"}`}
        className="flex-row items-center gap-sm bg-surface-container-lowest border border-outline-variant rounded-2xl p-md mb-sm min-h-[64px]"
      >
        <View className="w-11 h-11 rounded-full bg-primary-fixed items-center justify-center">
          <Icon name="fingerprint" size={24} color={colors.onPrimaryFixed} />
        </View>
        <View className="flex-1">
          <Text className="font-inter-semibold text-body-lg text-on-surface">App Lock</Text>
          <Text className="font-inter text-[12px] text-on-surface-variant">
            PIN / biometric lock for your health vault
          </Text>
        </View>
        <View className={`px-xs py-1 rounded-full ${appLockEnabled ? "bg-secondary-container" : "bg-surface-container-high"}`}>
          <Text className={`font-inter-semibold text-[11px] ${appLockEnabled ? "text-on-secondary-container" : "text-on-surface-variant"}`}>
            {appLockEnabled ? "ON" : "OFF"}
          </Text>
        </View>
      </Pressable>

      {/* Shared records access log */}
      <Text className="font-inter-semibold text-headline-md text-on-surface mt-sm mb-sm">
        Shared Records
      </Text>
      {SHARED.map((s) => (
        <BentoCard key={s.who} className="mb-xs">
          <View className="flex-row items-center gap-sm">
            <Icon name="share" size={20} color={colors.primaryContainer} />
            <View className="flex-1">
              <Text className="font-inter-semibold text-body-sm text-on-surface">{s.who}</Text>
              <Text className="font-inter text-[12px] text-on-surface-variant">
                {s.what} · {s.until}
              </Text>
            </View>
            <Pressable accessibilityRole="button" accessibilityLabel={`Revoke access for ${s.who}`} className="min-h-[40px] justify-center">
              <Text className="font-inter-semibold text-[12px] text-error">Revoke</Text>
            </Pressable>
          </View>
        </BentoCard>
      ))}

      {/* Data permissions */}
      <Text className="font-inter-semibold text-headline-md text-on-surface mt-md mb-sm">
        Data Permissions
      </Text>
      <ToggleRow
        icon="psychology"
        title="Human second-opinion review"
        subtitle="Allow named clinicians to review AI analyses you flag"
        value={secondOpinion}
        onValueChange={setSecondOpinion}
      />
      <ToggleRow
        icon="query_stats"
        title="Anonymized product analytics"
        subtitle="Help improve the app. This never includes health data."
        value={analytics}
        onValueChange={setAnalytics}
      />

      <Pressable accessibilityRole="button" className="flex-row items-center gap-xs mt-sm min-h-[44px]">
        <Icon name="download" size={18} color={colors.secondary} />
        <Text className="font-inter-semibold text-body-sm text-secondary">
          Download all my data (EHR export)
        </Text>
      </Pressable>

      <TrustFooter variant="data" />
    </Screen>
  );
}
