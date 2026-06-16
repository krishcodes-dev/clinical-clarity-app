import React from "react";
import { Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { OnboardingStackParamList } from "@/app/types";
import { OnboardingShell } from "./OnboardingShell";
import { Icon } from "@/ui/Icon";
import { colors } from "@/theme";

type Props = NativeStackScreenProps<OnboardingStackParamList, "Welcome">;

const FEATURES = [
  { icon: "biotech", title: "Book diagnostic tests", body: "Home collection or nearby labs." },
  { icon: "auto_awesome", title: "Understand your reports", body: "Plain-language AI explanations." },
  { icon: "clinical_notes", title: "Lifelong health vault", body: "Every record, organized and secure." },
  { icon: "medical_services", title: "Talk to doctors", body: "Video, audio or chat consultations." },
];

export function WelcomeScreen({ navigation }: Props) {
  return (
    <OnboardingShell
      step={1}
      title="Welcome to Clinical Clarity"
      subtitle="Everything your health needs, clearly explained in one place."
      ctaLabel="Get Started"
      onNext={() => navigation.navigate("HealthGoals")}
    >
      <View className="gap-sm mt-sm">
        {FEATURES.map((f, i) => (
          <Animated.View
            key={f.title}
            entering={FadeInDown.delay(i * 90).duration(350)}
            className="flex-row items-center gap-sm bg-surface-container-low rounded-2xl p-md"
          >
            <View className="w-11 h-11 rounded-full bg-secondary-container items-center justify-center">
              <Icon name={f.icon} size={22} color={colors.onSecondaryContainer} />
            </View>
            <View className="flex-1">
              <Text className="font-inter-semibold text-body-lg text-on-surface">{f.title}</Text>
              <Text className="font-inter text-[12px] text-on-surface-variant">{f.body}</Text>
            </View>
          </Animated.View>
        ))}
      </View>
    </OnboardingShell>
  );
}
