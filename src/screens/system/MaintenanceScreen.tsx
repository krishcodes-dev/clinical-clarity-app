import React from "react";
import { Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/app/types";
import { Screen } from "@/ui/Screen";
import { Icon } from "@/ui/Icon";
import { SecondaryButton } from "@/ui/SecondaryButton";
import { colors } from "@/theme";

type Props = NativeStackScreenProps<RootStackParamList, "Maintenance">;

const STEPS = [
  { label: "Database upgrade", done: true },
  { label: "Security patching", done: true },
  { label: "Service verification", done: false },
];

/** System maintenance state with status timeline (prototype's Maintenance Mode). */
export function MaintenanceScreen({ navigation }: Props) {
  return (
    <Screen scroll={false} contentClassName="px-md pb-lg justify-center">
      <View className="items-center mb-lg">
        <View className="w-28 h-28 rounded-full bg-surface-container items-center justify-center mb-lg">
          <Icon name="engineering" size={52} color={colors.primaryContainer} />
        </View>
        <Text className="font-inter-bold text-headline-lg-mobile text-on-surface text-center">
          Scheduled Maintenance
        </Text>
        <Text className="font-inter text-body-sm text-on-surface-variant text-center mt-xs px-md">
          We're improving Clinical Clarity. Expected back by 2:00 AM. Your data
          is safe and untouched.
        </Text>
      </View>

      <View className="bg-surface-container-low rounded-2xl p-md">
        {STEPS.map((s) => (
          <View key={s.label} className="flex-row items-center gap-sm py-xs">
            <Icon
              name={s.done ? "check_circle" : "hourglass_top"}
              size={20}
              color={s.done ? colors.secondary : colors.outline}
            />
            <Text className="font-inter-medium text-body-sm text-on-surface">{s.label}</Text>
          </View>
        ))}
      </View>

      <SecondaryButton
        label="Check Again"
        icon="refresh"
        onPress={() => navigation.goBack()}
        className="mt-lg"
      />
    </Screen>
  );
}
