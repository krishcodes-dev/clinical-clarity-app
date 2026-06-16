import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { OnboardingStackParamList } from "@/app/types";
import { Screen } from "@/ui/Screen";
import { Icon } from "@/ui/Icon";
import { PrimaryButton } from "@/ui/PrimaryButton";
import { BentoCard } from "@/ui/BentoCard";
import { useAuthStore } from "@/store/useAuthStore";
import { colors } from "@/theme";

type Props = NativeStackScreenProps<OnboardingStackParamList, "Consent">;

const ITEMS = [
  {
    icon: "description",
    title: "Terms of Service",
    body: "How Clinical Clarity works, your rights, and our responsibilities.",
  },
  {
    icon: "shield_lock",
    title: "Privacy Policy",
    body: "What data we store, how it's encrypted, and who can see it (only you, unless you share).",
  },
  {
    icon: "health_and_safety",
    title: "Health-Data Processing",
    body: "Your explicit authorization for us to store and process medical records you add.",
  },
];

/**
 * NEW SCREEN (UX review §5, P1): explicit recorded consent before any
 * health data is collected.
 */
export function ConsentScreen({ navigation }: Props) {
  const [checked, setChecked] = useState(false);
  const setOnboardingConsent = useAuthStore((s) => s.setOnboardingConsent);

  return (
    <Screen scroll={false} contentClassName="px-0">
      <ScrollView className="flex-1 px-md" contentContainerClassName="pb-md">
        <Text className="font-inter-bold text-headline-lg-mobile text-on-surface mt-lg">
          Your data, your consent
        </Text>
        <Text className="font-inter text-body-sm text-on-surface-variant mt-1 mb-lg">
          Before we begin, please review how your health information is handled.
        </Text>
        {ITEMS.map((i) => (
          <BentoCard key={i.title} className="mb-sm" onPress={() => {}}>
            <View className="flex-row items-center gap-sm">
              <View className="w-11 h-11 rounded-full bg-surface-container items-center justify-center">
                <Icon name={i.icon} size={22} color={colors.primaryContainer} />
              </View>
              <View className="flex-1">
                <Text className="font-inter-semibold text-body-lg text-on-surface">{i.title}</Text>
                <Text className="font-inter text-[12px] text-on-surface-variant">{i.body}</Text>
              </View>
              <Icon name="open_in_new" size={18} color={colors.outline} />
            </View>
          </BentoCard>
        ))}
      </ScrollView>
      <View className="px-md pb-md">
        <Pressable
          onPress={() => setChecked((v) => !v)}
          accessibilityRole="checkbox"
          accessibilityState={{ checked }}
          className="flex-row items-start gap-sm mb-md min-h-[48px]"
        >
          <Icon
            name={checked ? "check_box" : "check_box_outline_blank"}
            size={24}
            color={checked ? colors.secondary : colors.outline}
          />
          <Text className="flex-1 font-inter text-body-sm text-on-surface">
            I have read and agree to the Terms of Service and Privacy Policy, and
            I authorize Clinical Clarity to process health data I provide.
          </Text>
        </Pressable>
        <PrimaryButton
          label="Agree & Continue"
          disabled={!checked}
          onPress={() => {
            setOnboardingConsent(true);
            navigation.navigate("Welcome");
          }}
        />
      </View>
    </Screen>
  );
}
