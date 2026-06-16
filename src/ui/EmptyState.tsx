import React from "react";
import { Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Icon } from "./Icon";
import { PrimaryButton } from "./PrimaryButton";
import { SecondaryButton } from "./SecondaryButton";
import { colors } from "@/theme";

interface EmptyStateProps {
  icon: string;
  title: string;
  body: string;
  primaryLabel?: string;
  onPrimary?: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
}

/** Shared empty-state pattern (EHR empty, no reminders, empty cart, no results…). */
export function EmptyState({
  icon,
  title,
  body,
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
}: EmptyStateProps) {
  return (
    <Animated.View
      entering={FadeInDown.duration(350)}
      className="flex-1 items-center justify-center px-lg py-xl"
    >
      <View className="w-24 h-24 rounded-full bg-surface-container items-center justify-center mb-lg">
        <Icon name={icon} size={40} color={colors.surfaceTint} />
      </View>
      <Text className="font-inter-bold text-headline-lg-mobile text-on-surface text-center mb-xs">
        {title}
      </Text>
      <Text className="font-inter text-body-sm text-on-surface-variant text-center mb-lg">
        {body}
      </Text>
      {primaryLabel && onPrimary ? (
        <PrimaryButton label={primaryLabel} onPress={onPrimary} className="self-stretch" />
      ) : null}
      {secondaryLabel && onSecondary ? (
        <SecondaryButton
          label={secondaryLabel}
          onPress={onSecondary}
          className="self-stretch mt-sm"
        />
      ) : null}
    </Animated.View>
  );
}
