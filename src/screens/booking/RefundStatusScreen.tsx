import React from "react";
import { Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BookStackParamList } from "@/app/types";
import { Screen } from "@/ui/Screen";
import { AppHeader } from "@/ui/AppHeader";
import { Icon } from "@/ui/Icon";
import { BentoCard } from "@/ui/BentoCard";
import { PrimaryButton } from "@/ui/PrimaryButton";
import { mockBookings } from "@/features/booking/mocks";
import { formatINR } from "@/utils/currency";
import { colors } from "@/theme";

type Props = NativeStackScreenProps<BookStackParamList, "RefundStatus">;

const STAGES = [
  { label: "Refund initiated", time: "Today, 2:14 PM", done: true },
  { label: "Processing with bank", time: "1–2 business days", done: false },
  { label: "Credited via UPI · arjun@okhdfc", time: "Expected by Oct 28", done: false },
];

/**
 * NEW SCREEN (UX review §5, P2): "money must visibly come back" -
 * closes the cancellation loop.
 */
export function RefundStatusScreen({ navigation, route }: Props) {
  const booking = mockBookings.find((b) => b.id === route.params.bookingId) ?? mockBookings[0];

  return (
    <Screen contentClassName="px-md pb-lg">
      <AppHeader title="Refund Status" back={false} />
      <BentoCard tone="secondary" className="items-center py-lg">
        <Icon name="currency_exchange" size={40} color={colors.onSecondaryContainer} />
        <Text className="font-inter-bold text-price-display text-on-secondary-fixed mt-sm">
          {formatINR(booking.amount)}
        </Text>
        <Text className="font-inter text-body-sm text-on-secondary-container mt-1">
          Full refund · {booking.testName}
        </Text>
      </BentoCard>

      <Text className="font-inter-semibold text-headline-md text-on-surface mt-lg mb-sm">
        Refund Timeline
      </Text>
      {STAGES.map((s, i) => (
        <View key={s.label} className="flex-row gap-sm">
          <View className="items-center">
            <View
              className={`w-7 h-7 rounded-full items-center justify-center ${
                s.done ? "bg-secondary" : "bg-surface-container-high"
              }`}
            >
              <Icon name={s.done ? "check" : "schedule"} size={14} color={s.done ? colors.onSecondary : colors.outline} />
            </View>
            {i < STAGES.length - 1 && (
              <View className={`w-0.5 flex-1 min-h-[24px] ${s.done ? "bg-secondary" : "bg-outline-variant"}`} />
            )}
          </View>
          <View className="flex-1 pb-md">
            <Text className="font-inter-semibold text-body-sm text-on-surface">{s.label}</Text>
            <Text className="font-inter text-[11px] text-on-surface-variant">{s.time}</Text>
          </View>
        </View>
      ))}

      <Text className="font-inter text-[12px] text-on-surface-variant mt-xs mb-lg">
        Refund reference: RF-2025-1142. If it hasn't arrived by Oct 28, contact
        support and we'll chase it for you.
      </Text>
      <PrimaryButton label="Done" onPress={() => navigation.popToTop()} />
    </Screen>
  );
}
