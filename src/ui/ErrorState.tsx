import React from "react";
import { Text, View } from "react-native";
import { Icon } from "./Icon";
import { PrimaryButton } from "./PrimaryButton";
import { colors } from "@/theme";

interface ErrorStateProps {
  title: string;
  body: string;
  retryLabel?: string;
  onRetry?: () => void;
  icon?: string;
}

export function ErrorState({
  title,
  body,
  retryLabel = "Try Again",
  onRetry,
  icon = "error_outline",
}: ErrorStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-lg">
      <View className="w-24 h-24 rounded-full bg-error-container items-center justify-center mb-lg">
        <Icon name={icon} size={40} color={colors.onErrorContainer} />
      </View>
      <Text className="font-inter-bold text-headline-lg-mobile text-on-surface text-center mb-xs">
        {title}
      </Text>
      <Text className="font-inter text-body-sm text-on-surface-variant text-center mb-lg">
        {body}
      </Text>
      {onRetry ? <PrimaryButton label={retryLabel} onPress={onRetry} className="self-stretch" /> : null}
    </View>
  );
}
