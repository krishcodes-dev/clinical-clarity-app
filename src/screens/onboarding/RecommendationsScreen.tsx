import React from "react";
import { CommonActions } from "@react-navigation/native";
import { Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { OnboardingStackParamList } from "@/app/types";
import { OnboardingShell } from "./OnboardingShell";
import { Icon } from "@/ui/Icon";
import { colors } from "@/theme";

type Props = NativeStackScreenProps<OnboardingStackParamList, "Recommendations">;

const RECS = [
  {
    icon: "biotech",
    title: "Comprehensive Health Package",
    body: "A sensible annual baseline covering 68 parameters.",
    tag: "Popular for your age group",
  },
  {
    icon: "auto_awesome",
    title: "Upload an old report",
    body: "Get instant plain-language insights from any past lab report.",
    tag: "2-minute start",
  },
  {
    icon: "notifications_active",
    title: "Set your first reminder",
    body: "Medication, hydration or appointment nudges.",
    tag: "Build the habit",
  },
];

/** Renders even with skipped steps (UX review §4.1). */
export function RecommendationsScreen({ navigation }: Props) {
  const finish = () =>
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Main" as never }],
      })
    );

  return (
    <OnboardingShell
      step={5}
      title="Recommended for you"
      subtitle="Good starting points based on what you shared."
      ctaLabel="Go to My Dashboard"
      onNext={finish}
    >
      <View className="gap-sm mt-sm">
        {RECS.map((r, i) => (
          <Animated.View
            key={r.title}
            entering={FadeInDown.delay(i * 100).duration(350)}
            className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-md"
          >
            <View className="flex-row items-center gap-sm">
              <View className="w-12 h-12 rounded-xl bg-primary-fixed items-center justify-center">
                <Icon name={r.icon} size={24} color={colors.onPrimaryFixed} />
              </View>
              <View className="flex-1">
                <Text className="font-inter-semibold text-body-lg text-on-surface">{r.title}</Text>
                <Text className="font-inter text-[12px] text-on-surface-variant">{r.body}</Text>
              </View>
            </View>
            <View className="bg-secondary-container self-start px-xs py-1 rounded-full mt-sm">
              <Text className="font-inter-semibold text-[11px] text-on-secondary-container">
                {r.tag}
              </Text>
            </View>
          </Animated.View>
        ))}
      </View>
    </OnboardingShell>
  );
}
