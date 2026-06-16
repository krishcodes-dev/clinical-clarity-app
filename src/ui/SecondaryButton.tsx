import React from "react";
import { Pressable, Text } from "react-native";
import { Icon } from "./Icon";
import { colors } from "@/theme";

interface SecondaryButtonProps {
  label: string;
  onPress: () => void;
  icon?: string;
  disabled?: boolean;
  className?: string;
}

/** Outlined M3 button. */
export function SecondaryButton({
  label,
  onPress,
  icon,
  disabled,
  className = "",
}: SecondaryButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      className={`border border-outline ${disabled ? "opacity-40" : "active:bg-surface-container"} min-h-[48px] rounded-full flex-row items-center justify-center px-lg gap-xs ${className}`}
    >
      {icon ? <Icon name={icon} size={20} color={colors.primary} /> : null}
      <Text className="font-inter-semibold text-label-bold text-primary">{label}</Text>
    </Pressable>
  );
}
