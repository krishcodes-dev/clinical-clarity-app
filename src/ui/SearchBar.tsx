import React from "react";
import { Pressable, TextInput, View } from "react-native";
import { Icon } from "./Icon";
import { colors } from "@/theme";

interface SearchBarProps {
  placeholder: string;
  value?: string;
  onChangeText?: (t: string) => void;
  onSubmit?: () => void;
  /** Render as a non-editable button that navigates to a search screen. */
  asButton?: boolean;
  onPress?: () => void;
}

export function SearchBar({
  placeholder,
  value,
  onChangeText,
  onSubmit,
  asButton,
  onPress,
}: SearchBarProps) {
  const inner = (
    <View className="flex-row items-center gap-xs bg-surface-container-lowest border border-outline-variant rounded-full px-md min-h-[48px]">
      <Icon name="search" size={20} color={colors.onSurfaceVariant} />
      <TextInput
        editable={!asButton}
        pointerEvents={asButton ? "none" : "auto"}
        placeholder={placeholder}
        placeholderTextColor={colors.outline}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        returnKeyType="search"
        accessibilityLabel={placeholder}
        className="flex-1 font-inter text-body-lg text-on-surface py-2"
      />
    </View>
  );
  if (asButton) {
    return (
      <Pressable onPress={onPress} accessibilityRole="search" accessibilityLabel={placeholder}>
        {inner}
      </Pressable>
    );
  }
  return inner;
}
