import React from "react";
import { Text, View } from "react-native";
import { BentoCard } from "@/ui/BentoCard";
import { FastingBadge } from "@/ui/Badges";
import { Icon } from "@/ui/Icon";
import { colors } from "@/theme";
import { DiagnosticTest } from "../types";
import { formatINR, percentOff } from "@/utils/currency";

interface TestCardProps {
  test: DiagnosticTest;
  onPress: () => void;
}

export function TestCard({ test, onPress }: TestCardProps) {
  const off = percentOff(test.mrp, test.price);
  return (
    <BentoCard
      onPress={onPress}
      className="mb-sm"
      accessibilityLabel={`${test.name}, ${test.price} rupees, ${off} percent off, report in ${test.reportEtaHours} hours`}
    >
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-sm">
          <Text className="font-inter-semibold text-body-lg text-on-surface">
            {test.name}
          </Text>
          <Text className="font-inter text-body-sm text-on-surface-variant mt-1" numberOfLines={2}>
            {test.description}
          </Text>
          <View className="flex-row items-center gap-sm mt-xs">
            <View className="flex-row items-center gap-1">
              <Icon name="schedule" size={14} color={colors.onSurfaceVariant} />
              <Text className="font-inter text-[12px] text-on-surface-variant">
                Report in {test.reportEtaHours}h
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Icon name="science" size={14} color={colors.onSurfaceVariant} />
              <Text className="font-inter text-[12px] text-on-surface-variant">
                {test.parameters} parameter{test.parameters > 1 ? "s" : ""}
              </Text>
            </View>
          </View>
          {test.fastingHours ? (
            <View className="mt-xs">
              <FastingBadge hours={test.fastingHours} />
            </View>
          ) : null}
        </View>
        <View className="items-end">
          <Text className="font-inter text-[12px] text-outline line-through">
            {formatINR(test.mrp)}
          </Text>
          <Text className="font-inter-bold text-price-display text-on-surface">
            {formatINR(test.price)}
          </Text>
          <View className="bg-success-container px-xs py-0.5 rounded-md mt-1">
            <Text className="font-inter-bold text-[11px] text-success">{off}% OFF</Text>
          </View>
        </View>
      </View>
    </BentoCard>
  );
}
