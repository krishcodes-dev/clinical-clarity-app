import React from "react";
import { Text, View } from "react-native";
import { BentoCard } from "./BentoCard";

interface VerificationProgressCardProps {
  doctorName: string;
  progress: number; // 0-100
}

/** Welcome + progress bar for the profile_incomplete state. */
export function VerificationProgressCard({ doctorName, progress }: VerificationProgressCardProps) {
  return (
    <BentoCard tone="low" className="mb-md">
      <Text className="font-inter-bold text-headline-lg-mobile text-on-surface">
        Welcome Dr. {doctorName}
      </Text>
      <Text className="font-inter text-body-sm text-on-surface-variant mt-1 mb-md">
        Complete your verification to start consulting patients.
      </Text>
      <View className="flex-row items-center justify-between mb-1">
        <Text className="font-inter-medium text-body-sm text-on-surface-variant">Progress</Text>
        <Text className="font-inter-semibold text-body-sm text-on-surface">{progress}%</Text>
      </View>
      <View
        className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden"
        accessibilityRole="progressbar"
        accessibilityValue={{ min: 0, max: 100, now: progress }}
      >
        <View className="h-full bg-secondary rounded-full" style={{ width: `${progress}%` }} />
      </View>
    </BentoCard>
  );
}
