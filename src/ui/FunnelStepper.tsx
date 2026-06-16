import React from "react";
import { Text, View } from "react-native";

/**
 * Standardized 4-step booking funnel header (UX review §4.2:
 * "Test → Schedule → Review → Pay" - replaces inconsistent steppers).
 */
export const BOOKING_STEPS = ["Test", "Schedule", "Review", "Pay"] as const;

export function FunnelStepper({ current }: { current: number }) {
  return (
    <View
      className="flex-row items-center justify-center gap-xs py-sm"
      accessibilityLabel={`Step ${current + 1} of ${BOOKING_STEPS.length}: ${BOOKING_STEPS[current]}`}
    >
      {BOOKING_STEPS.map((step, i) => (
        <React.Fragment key={step}>
          <View className="flex-row items-center gap-1">
            <View
              className={`w-6 h-6 rounded-full items-center justify-center ${
                i < current
                  ? "bg-secondary"
                  : i === current
                  ? "bg-primary"
                  : "bg-surface-container-high"
              }`}
            >
              <Text
                className={`font-inter-semibold text-[11px] ${
                  i <= current ? "text-on-primary" : "text-on-surface-variant"
                }`}
              >
                {i + 1}
              </Text>
            </View>
            <Text
              className={`font-inter-medium text-[12px] ${
                i === current ? "text-on-surface" : "text-on-surface-variant"
              }`}
            >
              {step}
            </Text>
          </View>
          {i < BOOKING_STEPS.length - 1 ? (
            <View className="w-4 h-[1px] bg-outline-variant" />
          ) : null}
        </React.Fragment>
      ))}
    </View>
  );
}
