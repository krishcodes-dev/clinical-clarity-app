import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RecordsStackParamList } from "@/app/types";
import { Screen } from "@/ui/Screen";
import { AppHeader } from "@/ui/AppHeader";
import { Icon } from "@/ui/Icon";
import { BentoCard } from "@/ui/BentoCard";
import { TrendChart } from "@/features/records/components/TrendChart";
import { AIDisclaimer } from "@/ui/AIDisclaimer";
import { TrustFooter } from "@/ui/TrustFooter";
import { mockTrends } from "@/features/records/mocks";
import { AI_DISCLAIMER_SHORT } from "@/constants/copy";
import { colors } from "@/theme";

type Props = NativeStackScreenProps<RecordsStackParamList, "Trends">;

const RANGES = ["3m", "1y", "24m"] as const;

/**
 * Merged Trends screen (UX review §4.4): replaces "Trends & History",
 * "Health Progress View" and the 24-month AI progress overview with one
 * screen + a time-range selector and the AI-analysis card.
 */
export function TrendsScreen({ navigation }: Props) {
  const [range, setRange] = useState<(typeof RANGES)[number]>("24m");

  return (
    <Screen contentClassName="px-md pb-lg">
      <AppHeader
        title="Trends & Progress"
        actions={[{ icon: "download", label: "Export EHR" }]}
      />
      <View className="flex-row items-center justify-between mb-md">
        <Text className="font-inter text-body-sm text-on-surface-variant flex-1">
          Longitudinal view of your verified diagnostic data.
        </Text>
        <View className="flex-row bg-surface-container rounded-full p-0.5">
          {RANGES.map((r) => (
            <Pressable
              key={r}
              onPress={() => setRange(r)}
              accessibilityRole="radio"
              accessibilityState={{ selected: range === r }}
              className={`px-sm py-1.5 rounded-full min-h-[36px] justify-center ${
                range === r ? "bg-primary" : ""
              }`}
            >
              <Text
                className={`font-inter-semibold text-[12px] ${
                  range === r ? "text-on-primary" : "text-on-surface-variant"
                }`}
              >
                {r}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* AI analysis card (from the Progress Overview design) */}
      <BentoCard tone="primary" className="mb-sm">
        <View className="flex-row items-center gap-xs mb-1">
          <Icon name="auto_awesome" size={16} color={colors.secondaryFixedDim} />
          <Text className="font-inter-semibold text-[12px] text-secondary-fixed-dim uppercase">
            AI Analysis*
          </Text>
        </View>
        <Text className="font-inter text-body-lg text-on-primary">
          "Your blood sugar markers show consistent improvement over {range === "24m" ? "24 months" : range}.
          The diet change recorded in Q3 2024 correlates with the 0.8% HbA1c drop."
        </Text>
        <Text className="font-inter text-[10px] text-primary-fixed opacity-70 mt-xs">
          {AI_DISCLAIMER_SHORT}
        </Text>
      </BentoCard>

      {mockTrends.map((t) => (
        <View key={t.id} className="mb-sm">
          <TrendChart series={t} />
        </View>
      ))}

      {/* Re-test bridge (UX review §7.3: AI trend → re-test booking) */}
      <BentoCard
        tone="secondary"
        onPress={() => (navigation.getParent() as any)?.navigate("BookTab", { screen: "TestDetails", params: { testId: "hba1c" } })}
        accessibilityLabel="HbA1c re-test due, book follow-up"
      >
        <View className="flex-row items-center gap-sm">
          <Icon name="event_repeat" size={24} color={colors.onSecondaryContainer} />
          <View className="flex-1">
            <Text className="font-inter-semibold text-body-sm text-on-secondary-fixed">
              HbA1c follow-up due
            </Text>
            <Text className="font-inter text-[12px] text-on-secondary-container">
              Your last test was 3+ months ago. Book a re-test to keep the trend current.
            </Text>
          </View>
          <Icon name="chevron_right" size={20} color={colors.onSecondaryContainer} />
        </View>
      </BentoCard>

      <TrustFooter variant="vault" />
      <AIDisclaimer />
    </Screen>
  );
}
