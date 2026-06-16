import React from "react";
import { Pressable, Text, View } from "react-native";
import { Icon } from "./Icon";
import { colors } from "@/theme";

interface RadioCardProps {
  icon?: string;
  title: string;
  subtitle?: string;
  selected: boolean;
  onPress: () => void;
  disabled?: boolean;
  trailing?: React.ReactNode;
}

/** Selectable card - collection method, addresses, labs, consult modes. */
export function RadioCard({
  icon,
  title,
  subtitle,
  selected,
  onPress,
  disabled,
  trailing,
}: RadioCardProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="radio"
      accessibilityState={{ selected, disabled: !!disabled }}
      accessibilityLabel={`${title}${subtitle ? `, ${subtitle}` : ""}`}
      className={`flex-row items-center gap-sm rounded-2xl p-md mb-sm border-2 min-h-[64px] ${
        selected
          ? "border-primary bg-primary-fixed/40"
          : "border-outline-variant bg-surface-container-lowest"
      } ${disabled ? "opacity-50" : ""}`}
    >
      {icon ? (
        <View
          className={`w-11 h-11 rounded-full items-center justify-center ${
            selected ? "bg-primary" : "bg-surface-container"
          }`}
        >
          <Icon
            name={icon}
            size={22}
            color={selected ? colors.onPrimary : colors.primaryContainer}
          />
        </View>
      ) : null}
      <View className="flex-1">
        <Text className="font-inter-semibold text-body-lg text-on-surface">{title}</Text>
        {subtitle ? (
          <Text className="font-inter text-body-sm text-on-surface-variant">{subtitle}</Text>
        ) : null}
      </View>
      {trailing}
      <Icon
        name={selected ? "radio_button_checked" : "radio_button_unchecked"}
        size={22}
        color={selected ? colors.primary : colors.outline}
      />
    </Pressable>
  );
}
