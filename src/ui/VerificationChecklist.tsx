import React from "react";
import { Text, View } from "react-native";
import { Icon } from "./Icon";
import { colors } from "@/theme";

export interface ChecklistItem {
  label: string;
  done: boolean;
}

export function VerificationChecklist({ items }: { items: ChecklistItem[] }) {
  return (
    <View className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-md mb-md">
      {items.map((item, i) => (
        <View
          key={item.label}
          className={`flex-row items-center gap-sm ${i < items.length - 1 ? "mb-sm" : ""}`}
          accessibilityLabel={`${item.label}: ${item.done ? "completed" : "not completed"}`}
        >
          <Icon
            name={item.done ? "check_circle" : "radio_button_unchecked"}
            size={20}
            color={item.done ? colors.success : colors.outline}
          />
          <Text
            className={`font-inter-medium text-body-sm ${
              item.done ? "text-on-surface" : "text-on-surface-variant"
            }`}
          >
            {item.label}
          </Text>
        </View>
      ))}
    </View>
  );
}
