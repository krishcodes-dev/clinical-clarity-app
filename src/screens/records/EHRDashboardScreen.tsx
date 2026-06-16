import React from "react";
import { Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RecordsStackParamList } from "@/app/types";
import { Screen } from "@/ui/Screen";
import { Icon } from "@/ui/Icon";
import { SectionHeader } from "@/ui/SectionHeader";
import { BentoCard } from "@/ui/BentoCard";
import { RecordCard } from "@/features/records/components/RecordCard";
import { EmptyState } from "@/ui/EmptyState";
import { TrustFooter } from "@/ui/TrustFooter";
import { useAuthStore } from "@/store/useAuthStore";
import { mockRecords } from "@/features/records/mocks";
import { colors } from "@/theme";

type Props = NativeStackScreenProps<RecordsStackParamList, "EHRDashboard">;

/** EHR Dashboard - records hub with empty state for first-time users. */
export function EHRDashboardScreen({ navigation }: Props) {
  const aiConsentGiven = useAuthStore((s) => s.aiConsentGiven);
  const hasRecords = mockRecords.length > 0;

  const goInsights = () =>
    navigation.navigate(aiConsentGiven ? "InsightsDashboard" : "AIConsent");

  if (!hasRecords) {
    return (
      <Screen scroll={false} contentClassName="px-md pb-lg">
        <Text className="font-inter-bold text-headline-lg-mobile text-on-surface mt-sm">
          Health Records
        </Text>
        <EmptyState
          icon="analytics"
          title="No reports available yet"
          body="Upload a medical report or complete a diagnostic test to unlock your AI-powered insights and personalized trends."
          primaryLabel="Upload Report"
          onPrimary={() => navigation.navigate("UploadRecord")}
          secondaryLabel="Book a Test"
          onSecondary={() => navigation.getParent()?.navigate("BookTab" as never)}
        />
        <TrustFooter variant="vault" />
      </Screen>
    );
  }

  return (
    <Screen contentClassName="px-md pb-lg">
      <View className="flex-row items-center justify-between mt-sm">
        <Text className="font-inter-bold text-headline-lg-mobile text-on-surface">
          Health Records
        </Text>
        <View className="flex-row">
          <Icon name="search" color={colors.onSurface} accessibilityLabel="Search records" />
        </View>
      </View>
      <Text className="font-inter text-body-sm text-on-surface-variant mt-0.5 mb-md">
        Your private, lifelong health vault
      </Text>

      {/* Quick views */}
      <View className="flex-row flex-wrap justify-between">
        {[
          { icon: "auto_awesome", label: "AI Insights", onPress: goInsights },
          { icon: "timeline", label: "Timeline", onPress: () => navigation.navigate("HealthTimeline") },
          { icon: "insights", label: "Trends", onPress: () => navigation.navigate("Trends") },
          { icon: "category", label: "Categories", onPress: () => navigation.navigate("RecordCategories") },
        ].map((a) => (
          <BentoCard
            key={a.label}
            tone="low"
            className="w-[48.5%] mb-sm flex-row items-center gap-xs py-sm"
            onPress={a.onPress}
            accessibilityLabel={a.label}
          >
            <Icon name={a.icon} size={20} color={colors.primaryContainer} />
            <Text className="font-inter-semibold text-body-sm text-on-surface">{a.label}</Text>
          </BentoCard>
        ))}
      </View>

      {/* Upload CTA */}
      <BentoCard
        tone="primary"
        onPress={() => navigation.navigate("UploadRecord")}
        accessibilityLabel="Upload a medical record"
      >
        <View className="flex-row items-center gap-sm">
          <View className="w-12 h-12 rounded-full bg-primary-fixed items-center justify-center">
            <Icon name="upload_file" size={24} color={colors.onPrimaryFixed} />
          </View>
          <View className="flex-1">
            <Text className="font-inter-semibold text-body-lg text-on-primary">
              Upload Medical Record
            </Text>
            <Text className="font-inter text-[12px] text-primary-fixed">
              PDF, image or camera scan · AI insights in minutes
            </Text>
          </View>
          <Icon name="chevron_right" size={22} color={colors.primaryFixedDim} />
        </View>
      </BentoCard>

      <SectionHeader
        title="Recent Records"
        actionLabel="Share"
        onAction={() => navigation.navigate("ShareRecords")}
      />
      {mockRecords.map((r) => (
        <RecordCard
          key={r.id}
          record={r}
          onPress={() => navigation.navigate("RecordDetails", { recordId: r.id })}
        />
      ))}
      <TrustFooter variant="vault" />
    </Screen>
  );
}
