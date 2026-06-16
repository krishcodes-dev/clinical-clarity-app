import React from "react";
import { ActivityIndicator, Pressable, Text } from "react-native";
import { Icon } from "./Icon";
import { colors } from "@/theme";

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  icon?: string;
  disabled?: boolean;
  loading?: boolean;
  destructive?: boolean;
  className?: string;
}

/** Filled M3 button - navy primary, 48dp min height. */
export function PrimaryButton({
  label,
  onPress,
  icon,
  disabled,
  loading,
  destructive,
  className = "",
}: PrimaryButtonProps) {
  const bg = destructive ? "bg-error" : "bg-primary";
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      className={`${bg} ${disabled ? "opacity-40" : "active:opacity-85"} min-h-[48px] rounded-full flex-row items-center justify-center px-lg gap-xs ${className}`}
    >
      {loading ? (
        <ActivityIndicator color={colors.onPrimary} />
      ) : (
        <>
          {icon ? <Icon name={icon} size={20} color={colors.onPrimary} /> : null}
          <Text className="font-inter-semibold text-label-bold text-on-primary">
            {label}
          </Text>
        </>
      )}
    </Pressable>
  );
}
