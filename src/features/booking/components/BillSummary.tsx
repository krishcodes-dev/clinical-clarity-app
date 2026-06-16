import React from "react";
import { Text, View } from "react-native";
import { Icon } from "@/ui/Icon";
import { colors } from "@/theme";
import { formatINR } from "@/utils/currency";

interface BillLine {
  label: string;
  amount: number;
}

interface BillSummaryProps {
  lines: BillLine[];
  totalLabel?: string;
  /** Optional savings row (Tata 1mg-style "Total savings" highlight). */
  savings?: number;
}

/** Bill summary card - booking review & payment screens (₹, en-IN format). */
export function BillSummary({ lines, totalLabel = "Total Amount", savings }: BillSummaryProps) {
  const total = lines.reduce((a, l) => a + l.amount, 0);
  return (
    <View className="bg-surface-container-lowest rounded-2xl p-md border border-outline-variant">
      <Text className="font-inter-semibold text-body-lg text-on-surface mb-sm">
        Bill Summary
      </Text>
      {lines.map((l) => (
        <View key={l.label} className="flex-row justify-between py-1">
          <Text className="font-inter text-body-sm text-on-surface-variant">{l.label}</Text>
          <Text className="font-inter-medium text-body-sm text-on-surface">
            {l.amount === 0 ? "FREE" : formatINR(l.amount)}
          </Text>
        </View>
      ))}
      <View className="h-[1px] bg-outline-variant my-sm" />
      <View className="flex-row justify-between items-center">
        <Text className="font-inter-semibold text-body-lg text-on-surface">{totalLabel}</Text>
        <Text
          className="font-inter-bold text-price-display text-primary"
          accessibilityLabel={`${totalLabel} ${total} rupees`}
        >
          {formatINR(total)}
        </Text>
      </View>
      {savings && savings > 0 ? (
        <View className="flex-row items-center gap-xs bg-success-container rounded-lg px-sm py-xs mt-sm">
          <Icon name="savings" size={16} color={colors.success} />
          <Text className="font-inter-semibold text-[12px] text-on-success-container">
            You save {formatINR(savings)} on this order
          </Text>
        </View>
      ) : null}
    </View>
  );
}
