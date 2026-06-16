import React from "react";
import { Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RecordsStackParamList } from "@/app/types";
import { Screen } from "@/ui/Screen";
import { AppHeader } from "@/ui/AppHeader";
import { Icon } from "@/ui/Icon";
import { BentoCard } from "@/ui/BentoCard";
import { AIDisclaimer } from "@/ui/AIDisclaimer";
import { SecondaryButton } from "@/ui/SecondaryButton";
import { mockFindings } from "@/features/ai-insights/mocks";
import { colors } from "@/theme";
import { FindingSeverity } from "@/features/ai-insights/types";

type Props = NativeStackScreenProps<RecordsStackParamList, "KeyFindings">;

const SEV: Record<FindingSeverity, { icon: string; label: string; cls: string; txt: string }> = {
  critical: { icon: "emergency", label: "Needs attention", cls: "bg-error-container", txt: "text-on-error-container" },
  attention: { icon: "warning", label: "Worth watching", cls: "bg-[#ffefcf]", txt: "text-[#8a5a00]" },
  normal: { icon: "check_circle", label: "Within range", cls: "bg-secondary-container", txt: "text-on-secondary-container" },
};

/** Key Findings - severity-grouped, value + reference always visible. */
export function KeyFindingsScreen({ navigation }: Props) {
  return (
    <Screen contentClassName="px-md pb-lg">
      <AppHeader title="Key Findings" />
      <Text className="font-inter text-body-sm text-on-surface-variant mb-md">
        From your latest analyzed reports. Tap a finding to open the source record.
      </Text>
      {mockFindings.map((f) => {
        const sev = SEV[f.severity];
        return (
          <BentoCard
            key={f.id}
            className="mb-sm"
            onPress={() => navigation.navigate("RecordDetails", { recordId: f.recordId })}
            accessibilityLabel={`${sev.label}: ${f.title}. ${f.markerName} ${f.value}, reference ${f.referenceRange}`}
          >
            <View className={`flex-row items-center gap-1 self-start px-xs py-1 rounded-full ${sev.cls}`}>
              <Icon name={sev.icon} size={13} color={colors.onSurfaceVariant} />
              <Text className={`font-inter-semibold text-[11px] ${sev.txt}`}>{sev.label}</Text>
            </View>
            <Text className="font-inter-semibold text-body-lg text-on-surface mt-xs">
              {f.title}
            </Text>
            <View className="flex-row items-baseline gap-xs mt-1">
              <Text className="font-inter-bold text-headline-md text-primary">{f.value}</Text>
              <Text className="font-inter text-[12px] text-on-surface-variant">
                {f.markerName} · ref {f.referenceRange}
              </Text>
            </View>
            <Text className="font-inter text-body-sm text-on-surface-variant mt-xs">
              {f.summary}
            </Text>
          </BentoCard>
        );
      })}
      <SecondaryButton
        label="Recommended Next Steps"
        icon="arrow_forward"
        className="mt-xs"
        onPress={() => navigation.navigate("NextSteps")}
      />
      <AIDisclaimer emergency />
    </Screen>
  );
}
