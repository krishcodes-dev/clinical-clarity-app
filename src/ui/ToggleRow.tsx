import React from "react";
import { Switch, Text, View } from "react-native";
import { Icon } from "./Icon";
import { colors } from "@/theme";

interface ToggleRowProps {
  icon?: string;
  title: string;
  subtitle?: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
}

/** Settings toggle row - notification prefs, privacy, plain-language. */
export function ToggleRow({ icon, title, subtitle, value, onValueChange }: ToggleRowProps) {
  return (
    <View
      className="flex-row items-center gap-sm bg-surface-container-lowest border border-outline-variant rounded-2xl p-sm mb-xs min-h-[56px]"
      accessible
      accessibilityRole="switch"
      accessibilityLabel={title}
      accessibilityState={{ checked: value }}
    >
      {icon ? (
        <View className="w-10 h-10 rounded-full bg-surface-container items-center justify-center">
          <Icon name={icon} size={20} color={colors.primaryContainer} />
        </View>
      ) : null}
      <View className="flex-1">
        <Text className="font-inter-semibold text-body-sm text-on-surface">{title}</Text>
        {subtitle ? (
          <Text className="font-inter text-[12px] text-on-surface-variant">{subtitle}</Text>
        ) : null}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ true: colors.secondary, false: colors.outlineVariant }}
        thumbColor={colors.surfaceContainerLowest}
      />
    </View>
  );
}
