import React, { useState } from "react";
import { Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ProfileStackParamList } from "@/app/types";
import { Screen } from "@/ui/Screen";
import { AppHeader } from "@/ui/AppHeader";
import { Icon } from "@/ui/Icon";
import { ToggleRow } from "@/ui/ToggleRow";
import { colors } from "@/theme";

type Props = NativeStackScreenProps<ProfileStackParamList, "NotificationSettings">;

/**
 * Notification Settings - merged canonical screen (UX review §6: the two
 * near-identical prototype settings screens confused the IA).
 */
export function NotificationSettingsScreen(_props: Props) {
  const [prefs, setPrefs] = useState({
    medication: true,
    appointments: true,
    tests: true,
    reports: true,
    insights: true,
    marketing: false,
  });
  const set = (k: keyof typeof prefs) => (v: boolean) => setPrefs((p) => ({ ...p, [k]: v }));

  return (
    <Screen contentClassName="px-md pb-lg">
      <AppHeader title="Notifications" />

      <Text className="font-inter-semibold text-headline-md text-on-surface mb-sm">
        Medical Reminders
      </Text>
      <ToggleRow icon="medication" title="Medication reminders" subtitle="Doses from prescriptions & manual reminders" value={prefs.medication} onValueChange={set("medication")} />
      <ToggleRow icon="event" title="Appointments" subtitle="Consults, reschedules and pre-call nudges" value={prefs.appointments} onValueChange={set("appointments")} />
      <ToggleRow icon="biotech" title="Test reminders" subtitle="Fasting alerts and collection-day reminders" value={prefs.tests} onValueChange={set("tests")} />

      <Text className="font-inter-semibold text-headline-md text-on-surface mt-md mb-sm">
        Insights & General
      </Text>
      <ToggleRow icon="lab_research" title="Report updates" subtitle="When results arrive and are analyzed" value={prefs.reports} onValueChange={set("reports")} />
      <ToggleRow icon="auto_awesome" title="AI recommendations" subtitle="Educational insights from your trends" value={prefs.insights} onValueChange={set("insights")} />
      <ToggleRow icon="campaign" title="Offers & news" subtitle="Packages, discounts and product updates" value={prefs.marketing} onValueChange={set("marketing")} />

      <View className="flex-row items-start gap-xs bg-surface-container-low rounded-xl p-sm mt-sm">
        <Icon name="info" size={16} color={colors.onSurfaceVariant} />
        <Text className="flex-1 font-inter text-[12px] text-on-surface-variant">
          Critical safety alerts (e.g. urgent lab values) are always delivered
          and can't be turned off.
        </Text>
      </View>
    </Screen>
  );
}
