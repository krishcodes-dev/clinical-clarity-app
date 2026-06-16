import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ProfileStackParamList } from "@/app/types";
import { Screen } from "@/ui/Screen";
import { AppHeader } from "@/ui/AppHeader";
import { Icon } from "@/ui/Icon";
import { ToggleRow } from "@/ui/ToggleRow";
import { useSettingsStore } from "@/store/useSettingsStore";
import { colors } from "@/theme";

type Props = NativeStackScreenProps<ProfileStackParamList, "Settings">;

/** Settings - language, units, appearance, accessibility. */
export function SettingsScreen({ navigation }: Props) {
  const plainLanguage = useSettingsStore((s) => s.plainLanguage);
  const togglePlainLanguage = useSettingsStore((s) => s.togglePlainLanguage);
  const [largeText, setLargeText] = useState(false);
  const [haptics, setHaptics] = useState(true);

  const ROWS: { icon: string; label: string; value: string; route?: keyof ProfileStackParamList }[] = [
    { icon: "language", label: "Language", value: "English (US)" },
    { icon: "straighten", label: "Units", value: "Metric (kg, cm)" },
    { icon: "palette", label: "Appearance", value: "Light" },
    { icon: "notifications", label: "Notifications", value: "Manage", route: "NotificationSettings" },
    { icon: "shield_lock", label: "Privacy & Security", value: "Manage", route: "PrivacySecurity" },
  ];

  return (
    <Screen contentClassName="px-md pb-lg">
      <AppHeader title="Settings" />

      {ROWS.map((r) => (
        <Pressable
          key={r.label}
          onPress={() => r.route && navigation.navigate(r.route as never)}
          accessibilityRole="button"
          accessibilityLabel={`${r.label}: ${r.value}`}
          className="flex-row items-center gap-sm bg-surface-container-lowest border border-outline-variant rounded-2xl p-sm mb-xs min-h-[56px]"
        >
          <View className="w-10 h-10 rounded-full bg-surface-container items-center justify-center">
            <Icon name={r.icon} size={20} color={colors.primaryContainer} />
          </View>
          <Text className="flex-1 font-inter-semibold text-body-sm text-on-surface">{r.label}</Text>
          <Text className="font-inter text-[12px] text-on-surface-variant">{r.value}</Text>
          <Icon name="chevron_right" size={20} color={colors.outline} />
        </Pressable>
      ))}

      <Text className="font-inter-semibold text-headline-md text-on-surface mt-md mb-sm">
        Accessibility
      </Text>
      <ToggleRow
        icon="translate"
        title="Plain-language medical terms"
        subtitle="Explain findings in simple words everywhere"
        value={plainLanguage}
        onValueChange={togglePlainLanguage}
      />
      <ToggleRow
        icon="format_size"
        title="Larger text"
        subtitle="Boost type size across the app"
        value={largeText}
        onValueChange={setLargeText}
      />
      <ToggleRow
        icon="vibration"
        title="Haptic feedback"
        subtitle="Vibrate on key actions"
        value={haptics}
        onValueChange={setHaptics}
      />

      <Text className="font-inter-semibold text-headline-md text-on-surface mt-md mb-sm">
        Account
      </Text>
      <Pressable
        onPress={() => navigation.navigate("DeleteAccount")}
        accessibilityRole="button"
        accessibilityLabel="Delete account"
        className="flex-row items-center gap-sm bg-surface-container-lowest border border-error-container rounded-2xl p-sm min-h-[56px]"
      >
        <View className="w-10 h-10 rounded-full bg-error-container items-center justify-center">
          <Icon name="delete_forever" size={20} color={colors.onErrorContainer} />
        </View>
        <View className="flex-1">
          <Text className="font-inter-semibold text-body-sm text-error">Delete Account</Text>
          <Text className="font-inter text-[12px] text-on-surface-variant">
            Permanently erase your data and records
          </Text>
        </View>
        <Icon name="chevron_right" size={20} color={colors.error} />
      </Pressable>
    </Screen>
  );
}
