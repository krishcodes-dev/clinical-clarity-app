import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HomeStackParamList } from "@/app/types";
import { Screen } from "@/ui/Screen";
import { AppHeader } from "@/ui/AppHeader";
import { Icon } from "@/ui/Icon";
import { TextField } from "@/ui/TextField";
import { PrimaryButton } from "@/ui/PrimaryButton";
import { useRemindersStore } from "@/store/useRemindersStore";
import { colors } from "@/theme";
import { ReminderType } from "@/features/reminders/types";

type Props = NativeStackScreenProps<HomeStackParamList, "CreateReminder">;

const TYPES: { id: ReminderType; icon: string; label: string }[] = [
  { id: "medication", icon: "medication", label: "Medication" },
  { id: "appointment", icon: "calendar_today", label: "Appointment" },
  { id: "test", icon: "science", label: "Test" },
  { id: "hydration", icon: "water_drop", label: "Hydration" },
  { id: "lifestyle", icon: "self_improvement", label: "Lifestyle" },
  { id: "vaccination", icon: "vaccines", label: "Vaccination" },
];

const TIMES = ["08:00 AM", "12:00 PM", "02:00 PM", "06:00 PM", "08:00 PM", "10:00 PM"];
const REPEATS = ["Once", "Daily", "Weekdays", "Weekly"];

/** Create New Health Reminder - full-screen modal, tab bar hidden. */
export function CreateReminderScreen({ navigation, route }: Props) {
  const addReminders = useRemindersStore((s) => s.addReminders);
  const [title, setTitle] = useState(route.params?.prefillTitle ?? "");
  const [type, setType] = useState<ReminderType>("medication");
  const [time, setTime] = useState(route.params?.prefillTime ?? "08:00 AM");
  const [repeat, setRepeat] = useState("Daily");

  const save = () => {
    addReminders([
      {
        id: `rem-${Date.now()}`,
        title: title || "New reminder",
        type,
        time,
        dateLabel: "Today",
        status: "upcoming",
        recurring: repeat === "Once" ? undefined : repeat,
      },
    ]);
    navigation.goBack();
  };

  return (
    <Screen contentClassName="px-md pb-lg">
      <AppHeader title="Create Reminder" />
      <TextField
        label="What should we remind you about?"
        placeholder="e.g. Vitamin D3 supplement"
        value={title}
        onChangeText={setTitle}
      />

      <Text className="font-inter-medium text-body-sm text-on-surface-variant mb-1">Type</Text>
      <View className="flex-row flex-wrap gap-xs mb-md">
        {TYPES.map((t) => {
          const on = type === t.id;
          return (
            <Pressable
              key={t.id}
              onPress={() => setType(t.id)}
              accessibilityRole="radio"
              accessibilityState={{ selected: on }}
              className={`flex-row items-center gap-1 px-sm py-xs rounded-full border min-h-[44px] ${
                on ? "border-primary bg-primary-fixed" : "border-outline-variant bg-surface-container-lowest"
              }`}
            >
              <Icon name={t.icon} size={16} color={on ? colors.onPrimaryFixed : colors.onSurfaceVariant} />
              <Text className={`font-inter-medium text-[12px] ${on ? "text-on-primary-fixed" : "text-on-surface"}`}>
                {t.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text className="font-inter-medium text-body-sm text-on-surface-variant mb-1">Time</Text>
      <View className="flex-row flex-wrap gap-xs mb-md">
        {TIMES.map((t) => (
          <Pressable
            key={t}
            onPress={() => setTime(t)}
            accessibilityRole="radio"
            accessibilityState={{ selected: time === t }}
            className={`px-sm py-xs rounded-xl border min-h-[44px] justify-center ${
              time === t ? "border-primary bg-primary-fixed" : "border-outline-variant bg-surface-container-lowest"
            }`}
          >
            <Text className={`font-inter-medium text-[12px] ${time === t ? "text-on-primary-fixed" : "text-on-surface"}`}>
              {t}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text className="font-inter-medium text-body-sm text-on-surface-variant mb-1">Repeat</Text>
      <View className="flex-row flex-wrap gap-xs mb-lg">
        {REPEATS.map((r) => (
          <Pressable
            key={r}
            onPress={() => setRepeat(r)}
            accessibilityRole="radio"
            accessibilityState={{ selected: repeat === r }}
            className={`px-md py-xs rounded-full border min-h-[44px] justify-center ${
              repeat === r ? "border-secondary bg-secondary-container" : "border-outline-variant bg-surface-container-lowest"
            }`}
          >
            <Text className={`font-inter-medium text-[12px] ${repeat === r ? "text-on-secondary-container" : "text-on-surface"}`}>
              {r}
            </Text>
          </Pressable>
        ))}
      </View>

      <PrimaryButton label="Save Reminder" icon="notifications_active" onPress={save} />
    </Screen>
  );
}
