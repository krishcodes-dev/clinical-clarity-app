import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HomeStackParamList } from "@/app/types";
import { Screen } from "@/ui/Screen";
import { AppHeader } from "@/ui/AppHeader";
import { Icon } from "@/ui/Icon";
import { EmptyState } from "@/ui/EmptyState";
import { ReminderCard } from "@/features/reminders/components/ReminderCard";
import { BentoCard } from "@/ui/BentoCard";
import { useRemindersStore } from "@/store/useRemindersStore";
import { colors } from "@/theme";
import { ReminderType } from "@/features/reminders/types";

type Props = NativeStackScreenProps<HomeStackParamList, "RemindersToday">;

const CATEGORIES: { id: ReminderType | "all"; icon: string; label: string }[] = [
  { id: "all", icon: "apps", label: "All" },
  { id: "medication", icon: "medication", label: "Meds" },
  { id: "appointment", icon: "calendar_today", label: "Appts" },
  { id: "test", icon: "science", label: "Tests" },
  { id: "vaccination", icon: "vaccines", label: "Vax" },
  { id: "lifestyle", icon: "self_improvement", label: "Lifestyle" },
];

const WEEK = [
  { dow: "SAT", day: 22 }, { dow: "SUN", day: 23 }, { dow: "MON", day: 24 },
  { dow: "TUE", day: 25 }, { dow: "WED", day: 26 }, { dow: "THU", day: 27 },
];

/** Reminders Dashboard (canonical) - pushed from the Home "Today" strip. */
export function RemindersTodayScreen({ navigation }: Props) {
  const reminders = useRemindersStore((s) => s.reminders);
  const setReminderStatus = useRemindersStore((s) => s.setReminderStatus);
  const [cat, setCat] = useState<ReminderType | "all">("all");
  const [selectedDay, setSelectedDay] = useState(24);

  const filtered = reminders.filter((r) => cat === "all" || r.type === cat);
  const overdue = filtered.filter((r) => r.status === "overdue" || r.status === "missed");
  const upcoming = filtered.filter((r) => r.status === "upcoming");

  return (
    <Screen scroll={false} contentClassName="px-0">
      <AppHeader
        title="Reminders"
        actions={[{ icon: "add", label: "Create reminder", onPress: () => navigation.navigate("CreateReminder") }]}
      />
      <ScrollView className="flex-1 px-md" contentContainerClassName="pb-xl">
        <Text className="font-inter-semibold text-body-lg text-on-surface mt-xs">
          Today's Schedule · Monday, Oct 24
        </Text>

        {/* Week strip */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-sm">
          <View className="flex-row gap-xs">
            {WEEK.map((d) => {
              const on = selectedDay === d.day;
              return (
                <Pressable
                  key={d.day}
                  onPress={() => setSelectedDay(d.day)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: on }}
                  accessibilityLabel={`${d.dow} ${d.day}`}
                  className={`w-12 py-xs rounded-xl items-center ${
                    on ? "bg-primary" : "bg-surface-container-low"
                  }`}
                >
                  <Text className={`font-inter-medium text-[11px] ${on ? "text-primary-fixed" : "text-on-surface-variant"}`}>
                    {d.dow}
                  </Text>
                  <Text className={`font-inter-bold text-body-lg ${on ? "text-on-primary" : "text-on-surface"}`}>
                    {d.day}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>

        {/* Category chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-md">
          <View className="flex-row gap-xs">
            {CATEGORIES.map((c) => {
              const on = cat === c.id;
              return (
                <Pressable
                  key={c.id}
                  onPress={() => setCat(c.id)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: on }}
                  className={`flex-row items-center gap-1 px-sm py-xs rounded-full border min-h-[40px] ${
                    on ? "border-secondary bg-secondary-container" : "border-outline-variant bg-surface-container-lowest"
                  }`}
                >
                  <Icon name={c.icon} size={16} color={on ? colors.onSecondaryContainer : colors.onSurfaceVariant} />
                  <Text className={`font-inter-medium text-[12px] ${on ? "text-on-secondary-container" : "text-on-surface"}`}>
                    {c.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>

        {filtered.length === 0 ? (
          <EmptyState
            icon="notifications_off"
            title="No active reminders"
            body="Stay consistent with medication, hydration and appointment nudges."
            primaryLabel="Create a Reminder"
            onPrimary={() => navigation.navigate("CreateReminder")}
          />
        ) : (
          <>
            {overdue.length > 0 && (
              <>
                <View className="flex-row items-center gap-xs mt-lg mb-xs">
                  <Icon name="error" size={18} color={colors.error} />
                  <Text className="font-inter-semibold text-body-sm text-error">Overdue</Text>
                </View>
                {overdue.map((r) => (
                  <ReminderCard
                    key={r.id}
                    reminder={r}
                    onPress={() => navigation.navigate("MissedReminder", { reminderId: r.id })}
                    onDone={() => setReminderStatus(r.id, "done")}
                  />
                ))}
              </>
            )}
            <Text className="font-inter-semibold text-body-sm text-on-surface mt-lg mb-xs">
              Upcoming Today
            </Text>
            {upcoming.map((r) => (
              <ReminderCard
                key={r.id}
                reminder={r}
                onPress={() => navigation.navigate("ReminderDetails", { reminderId: r.id })}
                onDone={() => setReminderStatus(r.id, "done")}
              />
            ))}
          </>
        )}

        {/* AI tip */}
        <BentoCard tone="secondary" className="mt-md">
          <View className="flex-row items-center gap-xs mb-1">
            <Icon name="auto_awesome" size={16} color={colors.onSecondaryContainer} />
            <Text className="font-inter-semibold text-[12px] text-on-secondary-container uppercase">
              AI Tip
            </Text>
          </View>
          <Text className="font-inter text-body-sm text-on-secondary-fixed">
            Users who set "Morning Meds" reminders are 40% more consistent. Set
            yours now!
          </Text>
        </BentoCard>
      </ScrollView>
    </Screen>
  );
}
