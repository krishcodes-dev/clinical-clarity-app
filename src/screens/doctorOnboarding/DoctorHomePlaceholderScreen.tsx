import React from "react";
import { Text, View } from "react-native";
import { Screen } from "@/ui/Screen";
import { AppHeader } from "@/ui/AppHeader";
import { Icon } from "@/ui/Icon";
import { colors } from "@/theme";

/** Placeholder landing for verified doctors until the full dashboard is built. */
export function DoctorHomePlaceholderScreen() {
  return (
    <Screen contentClassName="px-md pb-lg" scroll={false}>
      <AppHeader title="Doctor Dashboard" back={false} />
      <View className="flex-1 items-center justify-center">
        <View className="w-24 h-24 rounded-full bg-secondary-container items-center justify-center mb-lg">
          <Icon name="medical_services" size={40} color={colors.onSecondaryContainer} />
        </View>
        <Text className="font-inter-bold text-headline-lg-mobile text-on-surface text-center mb-xs">
          Doctor Dashboard Coming Soon
        </Text>
        <Text className="font-inter text-body-sm text-on-surface-variant text-center">
          You're verified! Patient consultations and scheduling tools will appear here.
        </Text>
      </View>
    </Screen>
  );
}
