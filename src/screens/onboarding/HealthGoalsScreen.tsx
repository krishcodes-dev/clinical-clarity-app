import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { OnboardingStackParamList } from "@/app/types";
import { OnboardingShell } from "./OnboardingShell";
import { Icon } from "@/ui/Icon";
import { colors } from "@/theme";

type Props = NativeStackScreenProps<OnboardingStackParamList, "HealthGoals">;

const GOALS = [
  { id: "g1", icon: "monitor_heart", label: "Manage a condition" },
  { id: "g2", icon: "trending_up", label: "Track health trends" },
  { id: "g3", icon: "event_available", label: "Stay on top of checkups" },
  { id: "g4", icon: "family_restroom", label: "Care for family" },
  { id: "g5", icon: "fitness_center", label: "Improve fitness" },
  { id: "g6", icon: "psychology", label: "Understand my reports" },
];

/** Skippable per UX review §4.1. */
export function HealthGoalsScreen({ navigation }: Props) {
  const [selected, setSelected] = useState<string[]>([]);
  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  return (
    <OnboardingShell
      step={2}
      title="What brings you here?"
      subtitle="Pick any that apply to personalize your dashboard."
      ctaLabel="Continue"
      onNext={() => navigation.navigate("BasicProfile")}
      skippable
      onSkip={() => navigation.navigate("BasicProfile")}
    >
      <View className="flex-row flex-wrap gap-sm mt-sm">
        {GOALS.map((g) => {
          const on = selected.includes(g.id);
          return (
            <Pressable
              key={g.id}
              onPress={() => toggle(g.id)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: on }}
              accessibilityLabel={g.label}
              className={`w-[48%] rounded-2xl border-2 p-md items-start gap-xs min-h-[96px] ${
                on
                  ? "border-secondary bg-secondary-container/50"
                  : "border-outline-variant bg-surface-container-lowest"
              }`}
            >
              <Icon
                name={g.icon}
                size={26}
                color={on ? colors.onSecondaryContainer : colors.primaryContainer}
              />
              <Text className="font-inter-semibold text-body-sm text-on-surface">
                {g.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </OnboardingShell>
  );
}
