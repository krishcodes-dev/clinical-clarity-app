import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RecordsStackParamList } from "@/app/types";
import { Screen } from "@/ui/Screen";
import { AppHeader } from "@/ui/AppHeader";
import { Icon } from "@/ui/Icon";
import { BentoCard } from "@/ui/BentoCard";
import { EmptyState } from "@/ui/EmptyState";
import { ErrorState } from "@/ui/ErrorState";
import { AIDisclaimer } from "@/ui/AIDisclaimer";
import { PrimaryButton } from "@/ui/PrimaryButton";
import { SecondaryButton } from "@/ui/SecondaryButton";
import { colors } from "@/theme";
import { InsightState } from "@/features/ai-insights/types";
import { AI_EMERGENCY } from "@/constants/copy";

type Props = NativeStackScreenProps<RecordsStackParamList, "InsightsDashboard">;

/**
 * AI Insights Dashboard - all seven prototype result states preserved as a
 * single parameterized screen: no_reports, first_report, healthy, critical,
 * incomplete, conflict, error. A dev state-switcher strip is included for
 * design review walkthroughs.
 */
export function InsightsDashboardScreen({ navigation, route }: Props) {
  const [state, setState] = useState<InsightState>(route.params?.state ?? "critical");

  return (
    <Screen scroll={false} contentClassName="px-0">
      <AppHeader title="AI Health Insights" />

      {/* Design-review state switcher (remove before production) */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="grow-0 px-md">
        <View className="flex-row gap-xs pb-xs">
          {(["no_reports", "first_report", "healthy", "critical", "incomplete", "conflict", "error"] as InsightState[]).map((s) => (
            <Pressable
              key={s}
              onPress={() => setState(s)}
              className={`px-xs py-1 rounded-full ${state === s ? "bg-primary" : "bg-surface-container"}`}
            >
              <Text className={`font-inter-medium text-[10px] ${state === s ? "text-on-primary" : "text-on-surface-variant"}`}>
                {s.replace("_", " ")}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <ScrollView className="flex-1 px-md" contentContainerClassName="pb-lg">
        {state === "no_reports" && (
          <EmptyState
            icon="analytics"
            title="No reports to analyze"
            body="Upload a medical report or complete a diagnostic test to unlock AI-powered insights."
            primaryLabel="Upload Report"
            onPrimary={() => navigation.navigate("UploadRecord")}
          />
        )}

        {state === "first_report" && (
          <>
            <BentoCard tone="primary" className="mt-sm">
              <View className="flex-row items-center gap-xs mb-1">
                <Icon name="auto_awesome" size={16} color={colors.secondaryFixedDim} />
                <Text className="font-inter-semibold text-[12px] text-secondary-fixed-dim uppercase">
                  First Analysis Complete*
                </Text>
              </View>
              <Text className="font-inter-semibold text-headline-md text-on-primary">
                Welcome to your health baseline
              </Text>
              <Text className="font-inter text-body-sm text-primary-fixed mt-1">
                We analyzed your first report. As you add more, trends and
                comparisons will unlock automatically.
              </Text>
            </BentoCard>
            <PrimaryButton
              label="See Key Findings"
              className="mt-md"
              onPress={() => navigation.navigate("KeyFindings")}
            />
          </>
        )}

        {state === "healthy" && (
          <>
            <BentoCard tone="secondary" className="mt-sm items-center py-lg">
              <Icon name="favorite" size={44} color={colors.onSecondaryContainer} />
              <Text className="font-inter-bold text-headline-md text-on-secondary-fixed mt-sm">
                Excellent Health Status
              </Text>
              <Text className="font-inter text-body-sm text-on-secondary-container text-center mt-1">
                All 21 analyzed markers are within their reference ranges. Keep
                up your current routine.
              </Text>
            </BentoCard>
            <SecondaryButton
              label="View All Markers"
              className="mt-md"
              onPress={() => navigation.navigate("KeyFindings")}
            />
          </>
        )}

        {state === "critical" && (
          <>
            <View className="bg-error-container rounded-2xl p-md mt-sm">
              <View className="flex-row items-center gap-xs mb-1">
                <Icon name="emergency" size={18} color={colors.onErrorContainer} />
                <Text className="font-inter-bold text-[12px] text-on-error-container uppercase">
                  Needs Attention*
                </Text>
              </View>
              <Text className="font-inter-semibold text-headline-md text-on-error-container">
                HbA1c: 7.4% (above target range)
              </Text>
              <Text className="font-inter text-body-sm text-on-error-container mt-1">
                Reference: 4.0 – 5.6%. This level is associated with diabetes
                and benefits from clinical management. The raw value is shown
                above. Always verify against the original report.
              </Text>
              <Text className="font-inter-medium text-[12px] text-on-error-container mt-sm">
                {AI_EMERGENCY}
              </Text>
            </View>
            <PrimaryButton
              label="Consult an Endocrinologist"
              icon="medical_services"
              className="mt-md"
              onPress={() =>
                (navigation.getParent() as any)?.navigate("CareTab", {
                  screen: "DoctorListing",
                  params: { specialtyId: "endo" },
                })
              }
            />
            <SecondaryButton
              label="View Key Findings"
              className="mt-sm"
              onPress={() => navigation.navigate("KeyFindings")}
            />
            <SecondaryButton
              label="Recommended Next Steps"
              className="mt-sm"
              onPress={() => navigation.navigate("NextSteps")}
            />
          </>
        )}

        {state === "incomplete" && (
          <>
            <BentoCard tone="low" className="mt-sm items-center py-lg">
              <Icon name="rule" size={44} color={colors.surfaceTint} />
              <Text className="font-inter-bold text-headline-md text-on-surface mt-sm">
                Report partially readable
              </Text>
              <Text className="font-inter text-body-sm text-on-surface-variant text-center mt-1">
                We extracted 6 of ~14 markers because some pages were blurry or
                cropped. Insights below may be incomplete.
              </Text>
            </BentoCard>
            <PrimaryButton label="Re-upload Clearer Copy" icon="upload_file" className="mt-md" onPress={() => navigation.navigate("UploadRecord")} />
            <SecondaryButton label="Continue with Partial Data" className="mt-sm" onPress={() => navigation.navigate("KeyFindings")} />
          </>
        )}

        {state === "conflict" && (
          <>
            <BentoCard tone="low" className="mt-sm">
              <View className="flex-row items-center gap-xs mb-1">
                <Icon name="difference" size={18} color={colors.surfaceTint} />
                <Text className="font-inter-bold text-[12px] text-on-surface-variant uppercase">
                  Data Conflict Detected
                </Text>
              </View>
              <Text className="font-inter-semibold text-body-lg text-on-surface">
                External report disagrees with your history
              </Text>
              <Text className="font-inter text-body-sm text-on-surface-variant mt-1">
                The uploaded report lists HbA1c 6.1% (Sep 2025), but your
                verified lab history shows 7.4% (Aug 2025). Different labs or
                units can cause this. Choose which to keep in your trends.
              </Text>
            </BentoCard>
            <PrimaryButton label="Keep Verified Lab Value" className="mt-md" onPress={() => navigation.navigate("KeyFindings")} />
            <SecondaryButton label="Keep Both, Flag Uploaded" className="mt-sm" onPress={() => navigation.navigate("KeyFindings")} />
          </>
        )}

        {state === "error" && (
          <ErrorState
            icon="report_problem"
            title="Analysis hit a snag"
            body="We couldn't process this document. It may be password-protected or in an unsupported format. Your file was not stored."
            retryLabel="Try Another File"
            onRetry={() => navigation.navigate("UploadRecord")}
          />
        )}

        {state !== "no_reports" && state !== "error" && (
          <AIDisclaimer emergency={state === "critical"} />
        )}
      </ScrollView>
    </Screen>
  );
}
