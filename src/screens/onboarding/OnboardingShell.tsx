import React from "react";
import { Pressable, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Screen } from "@/ui/Screen";
import { PrimaryButton } from "@/ui/PrimaryButton";

interface OnboardingShellProps {
  step: number; // 1-based of 5
  title: string;
  subtitle: string;
  ctaLabel: string;
  onNext: () => void;
  /** UX review §4.1: Goals & Interests must be skippable. */
  skippable?: boolean;
  onSkip?: () => void;
  ctaDisabled?: boolean;
  children: React.ReactNode;
}

const TOTAL = 5;

/** Shared onboarding chrome: progress bar, skip affordance, sticky CTA. */
export function OnboardingShell({
  step,
  title,
  subtitle,
  ctaLabel,
  onNext,
  skippable,
  onSkip,
  ctaDisabled,
  children,
}: OnboardingShellProps) {
  const navigation = useNavigation();
  const pct = Math.round((step / TOTAL) * 100);
  return (
    <Screen scroll={false} contentClassName="px-0">
      <View className="px-md pt-sm">
        <View className="flex-row items-center justify-between mb-xs">
          <Text className="font-inter-medium text-[12px] text-on-surface-variant">
            Step {step} of {TOTAL} · {pct}% complete
          </Text>
          {skippable ? (
            <Pressable
              onPress={onSkip}
              accessibilityRole="button"
              accessibilityLabel="Skip this step"
              hitSlop={12}
              className="min-h-[44px] justify-center"
            >
              <Text className="font-inter-semibold text-body-sm text-secondary">Skip</Text>
            </Pressable>
          ) : null}
        </View>
        <View
          className="h-1.5 bg-surface-container-high rounded-full overflow-hidden"
          accessibilityRole="progressbar"
          accessibilityValue={{ min: 0, max: 100, now: pct }}
        >
          <View className="h-full bg-secondary rounded-full" style={{ width: `${pct}%` }} />
        </View>
        <Text className="font-inter-bold text-headline-lg-mobile text-on-surface mt-lg">
          {title}
        </Text>
        <Text className="font-inter text-body-sm text-on-surface-variant mt-1">{subtitle}</Text>
      </View>
      <View className="flex-1 px-md pt-md">{children}</View>
      <View className="px-md pb-md">
        <PrimaryButton label={ctaLabel} onPress={onNext} disabled={ctaDisabled} />
      </View>
    </Screen>
  );
}
