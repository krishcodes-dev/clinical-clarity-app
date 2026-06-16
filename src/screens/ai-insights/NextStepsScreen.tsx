import React from "react";
import { Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RecordsStackParamList } from "@/app/types";
import { Screen } from "@/ui/Screen";
import { AppHeader } from "@/ui/AppHeader";
import { Icon } from "@/ui/Icon";
import { BentoCard } from "@/ui/BentoCard";
import { AIDisclaimer } from "@/ui/AIDisclaimer";
import { mockNextSteps } from "@/features/ai-insights/mocks";
import { colors } from "@/theme";
import { NextStep } from "@/features/ai-insights/types";

type Props = NativeStackScreenProps<RecordsStackParamList, "NextSteps">;

const ACTION_META: Record<NextStep["action"], { icon: string; cta: string }> = {
  consult_doctor: { icon: "medical_services", cta: "Find Specialists" },
  book_test: { icon: "biotech", cta: "Book Test" },
  set_reminder: { icon: "notifications_active", cta: "Set Reminder" },
  lifestyle: { icon: "self_improvement", cta: "Learn More" },
};

/**
 * Recommended Next Steps - each card deep-links into the relevant feature
 * (the cross-feature bridges of UX review §7.3).
 */
export function NextStepsScreen({ navigation }: Props) {
  const act = (step: NextStep) => {
    const parent = navigation.getParent() as any;
    if (step.action === "consult_doctor")
      parent?.navigate("CareTab", { screen: "DoctorListing", params: { specialtyId: "endo" } });
    else if (step.action === "book_test")
      parent?.navigate("BookTab", { screen: "TestDetails", params: { testId: "hba1c" } });
    else if (step.action === "set_reminder")
      parent?.navigate("HomeTab", { screen: "CreateReminder", params: { prefillTitle: "Vitamin D3 Supplement" } });
  };

  return (
    <Screen contentClassName="px-md pb-lg">
      <AppHeader title="Recommended Next Steps" />
      <Text className="font-inter text-body-sm text-on-surface-variant mb-md">
        Practical actions based on your latest findings, listed in priority order.
      </Text>
      {mockNextSteps.map((s, i) => {
        const meta = ACTION_META[s.action];
        return (
          <BentoCard key={s.id} className="mb-sm" onPress={() => act(s)} accessibilityLabel={s.title}>
            <View className="flex-row items-start gap-sm">
              <View className="w-8 h-8 rounded-full bg-primary items-center justify-center">
                <Text className="font-inter-bold text-body-sm text-on-primary">{i + 1}</Text>
              </View>
              <View className="flex-1">
                <View className="flex-row items-center gap-xs">
                  <Text className="font-inter-semibold text-body-lg text-on-surface flex-1">
                    {s.title}
                  </Text>
                  {s.urgency === "soon" && (
                    <View className="bg-[#ffefcf] px-xs py-0.5 rounded-full">
                      <Text className="font-inter-semibold text-[10px] text-[#8a5a00]">SOON</Text>
                    </View>
                  )}
                </View>
                <Text className="font-inter text-body-sm text-on-surface-variant mt-0.5">
                  {s.description}
                </Text>
                <View className="flex-row items-center gap-1 mt-sm">
                  <Icon name={meta.icon} size={16} color={colors.secondary} />
                  <Text className="font-inter-semibold text-body-sm text-secondary">{meta.cta}</Text>
                  <Icon name="chevron_right" size={16} color={colors.secondary} />
                </View>
              </View>
            </View>
          </BentoCard>
        );
      })}
      <AIDisclaimer />
    </Screen>
  );
}
