import React from "react";
import { Text, View } from "react-native";
import { Icon } from "./Icon";
import { colors } from "@/theme";

interface TimelineItemProps {
  label: string;
  date?: string | null;
  status: "completed" | "pending";
  isLast?: boolean;
}

export function TimelineItem({ label, date, status, isLast }: TimelineItemProps) {
  const completed = status === "completed";
  return (
    <View className="flex-row" accessibilityLabel={`${label}: ${completed ? "completed" : "pending"}`}>
      <View className="items-center mr-sm">
        <View
          className={`w-7 h-7 rounded-full items-center justify-center ${
            completed ? "bg-secondary" : "bg-surface-container-high"
          }`}
        >
          <Icon
            name={completed ? "check" : "schedule"}
            size={16}
            color={completed ? colors.onSecondary : colors.onSurfaceVariant}
          />
        </View>
        {!isLast ? (
          <View className={`w-[2px] flex-1 my-1 ${completed ? "bg-secondary" : "bg-outline-variant"}`} />
        ) : null}
      </View>
      <View className="flex-1 pb-lg">
        <Text className="font-inter-semibold text-body-lg text-on-surface">{label}</Text>
        <Text
          className={`font-inter text-body-sm ${completed ? "text-success" : "text-on-surface-variant"}`}
        >
          {completed ? "Completed" : "Pending"}
          {date ? ` · ${date}` : ""}
        </Text>
      </View>
    </View>
  );
}
