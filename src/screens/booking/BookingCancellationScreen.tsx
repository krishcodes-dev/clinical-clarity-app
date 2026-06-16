import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BookStackParamList } from "@/app/types";
import { Screen } from "@/ui/Screen";
import { AppHeader } from "@/ui/AppHeader";
import { Icon } from "@/ui/Icon";
import { BentoCard } from "@/ui/BentoCard";
import { PrimaryButton } from "@/ui/PrimaryButton";
import { SecondaryButton } from "@/ui/SecondaryButton";
import { mockBookings } from "@/features/booking/mocks";
import { formatINR } from "@/utils/currency";
import { colors } from "@/theme";

type Props = NativeStackScreenProps<BookStackParamList, "BookingCancellation">;

const REASONS = [
  "Schedule conflict",
  "Booked by mistake",
  "Found a better price",
  "Doctor advised against it",
  "Other",
];

/** Booking cancellation with reason capture and refund preview. */
export function BookingCancellationScreen({ navigation, route }: Props) {
  const booking = mockBookings.find((b) => b.id === route.params.bookingId) ?? mockBookings[0];
  const [reason, setReason] = useState<string | null>(null);

  return (
    <Screen contentClassName="px-md pb-lg">
      <AppHeader title="Cancel Booking" />
      <BentoCard tone="lowest">
        <Text className="font-inter-semibold text-body-lg text-on-surface">{booking.testName}</Text>
        <Text className="font-inter text-[12px] text-on-surface-variant mt-0.5">
          {booking.date}, {booking.time} · {formatINR(booking.amount)}
        </Text>
      </BentoCard>

      <View className="flex-row items-start gap-xs bg-secondary-container/60 rounded-xl p-sm mt-sm">
        <Icon name="payments" size={18} color={colors.onSecondaryContainer} />
        <Text className="flex-1 font-inter text-[12px] text-on-secondary-container">
          Free cancellation until 24h before collection. You'll receive a full
          refund of {formatINR(booking.amount)} to your original payment method.
        </Text>
      </View>

      <Text className="font-inter-semibold text-body-lg text-on-surface mt-lg mb-sm">
        Why are you cancelling?
      </Text>
      {REASONS.map((r) => (
        <Pressable
          key={r}
          onPress={() => setReason(r)}
          accessibilityRole="radio"
          accessibilityState={{ selected: reason === r }}
          className={`flex-row items-center gap-sm rounded-xl border p-sm mb-xs min-h-[48px] ${
            reason === r ? "border-primary bg-primary-fixed/40" : "border-outline-variant bg-surface-container-lowest"
          }`}
        >
          <Icon
            name={reason === r ? "radio_button_checked" : "radio_button_unchecked"}
            size={20}
            color={reason === r ? colors.primary : colors.outline}
          />
          <Text className="font-inter text-body-sm text-on-surface">{r}</Text>
        </Pressable>
      ))}

      <View className="mt-lg gap-sm">
        <PrimaryButton
          label="Confirm Cancellation"
          destructive
          disabled={!reason}
          onPress={() => navigation.replace("RefundStatus", { bookingId: booking.id })}
        />
        <SecondaryButton label="Keep My Booking" onPress={() => navigation.goBack()} />
      </View>
    </Screen>
  );
}
