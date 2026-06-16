import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { OnboardingStackParamList } from "@/app/types";
import { OnboardingShell } from "./OnboardingShell";

type Props = NativeStackScreenProps<OnboardingStackParamList, "HealthInterests">;

const INTERESTS = [
  "Diabetes", "Heart health", "Thyroid", "Nutrition", "Sleep", "Women's health",
  "Men's health", "Mental wellbeing", "Allergies", "Fitness", "Skin & hair", "Bone health",
];

/** Skippable per UX review §4.1. */
export function HealthInterestsScreen({ navigation }: Props) {
  const [picked, setPicked] = useState<string[]>([]);
  const toggle = (t: string) =>
    setPicked((s) => (s.includes(t) ? s.filter((x) => x !== t) : [...s, t]));

  return (
    <OnboardingShell
      step={4}
      title="Topics you care about"
      subtitle="We'll tailor educational insights to these areas."
      ctaLabel="Continue"
      onNext={() => navigation.navigate("Recommendations")}
      skippable
      onSkip={() => navigation.navigate("Recommendations")}
    >
      <View className="flex-row flex-wrap gap-xs mt-sm">
        {INTERESTS.map((t) => {
          const on = picked.includes(t);
          return (
            <Pressable
              key={t}
              onPress={() => toggle(t)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: on }}
              className={`px-md py-sm rounded-full border min-h-[44px] justify-center ${
                on
                  ? "border-secondary bg-secondary-container"
                  : "border-outline-variant bg-surface-container-lowest"
              }`}
            >
              <Text
                className={`font-inter-medium text-body-sm ${
                  on ? "text-on-secondary-container" : "text-on-surface"
                }`}
              >
                {t}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </OnboardingShell>
  );
}
