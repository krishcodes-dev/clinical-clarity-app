import React from "react";
import { Pressable, Text, View } from "react-native";

interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function SectionHeader({ title, actionLabel, onAction }: SectionHeaderProps) {
  return (
    <View className="flex-row items-center justify-between mt-lg mb-sm">
      <Text
        className="font-inter-semibold text-headline-md text-on-surface"
        accessibilityRole="header"
      >
        {title}
      </Text>
      {actionLabel ? (
        <Pressable onPress={onAction} accessibilityRole="button" hitSlop={8}>
          <Text className="font-inter-semibold text-body-sm text-secondary">
            {actionLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
