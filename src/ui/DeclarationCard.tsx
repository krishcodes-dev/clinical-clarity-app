import React from "react";
import { Pressable, Text, View } from "react-native";
import { Icon } from "./Icon";
import { colors } from "@/theme";

const DECLARATION_TEXT =
  "I confirm that all information and documents submitted are accurate, authentic, and belong to me. I understand that submitting false information may result in account suspension or removal.";

interface DeclarationCardProps {
  checked: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export function DeclarationCard({ checked, onToggle, disabled }: DeclarationCardProps) {
  return (
    <Pressable
      onPress={onToggle}
      disabled={disabled}
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled: !!disabled }}
      className={`flex-row items-start gap-sm rounded-2xl p-md border bg-surface-container-lowest ${
        checked ? "border-primary" : "border-outline-variant"
      } ${disabled ? "opacity-50" : ""}`}
    >
      <Icon
        name={checked ? "check_box" : "check_box_outline_blank"}
        size={24}
        color={checked ? colors.secondary : colors.outline}
      />
      <View className="flex-1">
        <Text className="font-inter-semibold text-body-sm text-on-surface mb-1">Declaration</Text>
        <Text className="font-inter text-[12px] text-on-surface-variant">{DECLARATION_TEXT}</Text>
      </View>
    </Pressable>
  );
}
