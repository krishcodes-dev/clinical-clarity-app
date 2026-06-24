import React from "react";
import { Text, View } from "react-native";
import { Icon } from "./Icon";
import { colors } from "@/theme";

export function ProfileLockedBanner({ message }: { message: string }) {
  return (
    <View
      className="flex-row items-start gap-sm bg-error-container rounded-2xl p-md mb-md"
      accessibilityRole="alert"
    >
      <Icon name="lock" size={20} color={colors.onErrorContainer} />
      <Text className="flex-1 font-inter text-body-sm text-on-error-container">{message}</Text>
    </View>
  );
}
