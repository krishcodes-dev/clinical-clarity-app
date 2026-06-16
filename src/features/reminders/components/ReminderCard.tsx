import React from "react";
import { Pressable, Text, View } from "react-native";
import { Icon } from "@/ui/Icon";
import { colors } from "@/theme";
import { Reminder } from "../types";

const TYPE_ICON: Record<Reminder["type"], string> = {
  medication: "medication",
  appointment: "event",
  test: "biotech",
  hydration: "water_drop",
  lifestyle: "self_improvement",
  vaccination: "vaccines",
};

interface ReminderCardProps {
  reminder: Reminder;
  onPress: () => void;
  onDone?: () => void;
}

export function ReminderCard({ reminder, onPress, onDone }: ReminderCardProps) {
  const overdue = reminder.status === "overdue" || reminder.status === "missed";
  const done = reminder.status === "done";
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${reminder.title} at ${reminder.time}, ${reminder.status}`}
      className={`flex-row items-center gap-sm rounded-2xl p-sm mb-xs border ${
        overdue
          ? "bg-error-container/40 border-error-container"
          : "bg-surface-container-lowest border-outline-variant"
      } ${done ? "opacity-60" : ""}`}
    >
      <View
        className={`w-11 h-11 rounded-full items-center justify-center ${
          overdue ? "bg-error-container" : "bg-surface-container"
        }`}
      >
        <Icon
          name={TYPE_ICON[reminder.type]}
          size={22}
          color={overdue ? colors.onErrorContainer : colors.primaryContainer}
        />
      </View>
      <View className="flex-1">
        {overdue ? (
          <Text className="font-inter-semibold text-[11px] text-on-error-container uppercase">
            Overdue
          </Text>
        ) : null}
        <Text
          className={`font-inter-semibold text-body-sm text-on-surface ${
            done ? "line-through" : ""
          }`}
        >
          {reminder.title}
        </Text>
        <Text className="font-inter text-[12px] text-on-surface-variant">
          {reminder.dateLabel}, {reminder.time}
          {reminder.subtitle ? ` • ${reminder.subtitle}` : ""}
        </Text>
      </View>
      {onDone && !done ? (
        <Pressable
          onPress={onDone}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={`Mark ${reminder.title} done`}
          className="w-11 h-11 rounded-full border border-outline items-center justify-center"
        >
          <Icon name="check" size={20} color={colors.secondary} />
        </Pressable>
      ) : done ? (
        <Icon name="check_circle" size={24} color={colors.secondary} />
      ) : null}
    </Pressable>
  );
}
