import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BookStackParamList } from "@/app/types";
import { Screen } from "@/ui/Screen";
import { AppHeader } from "@/ui/AppHeader";
import { Icon } from "@/ui/Icon";
import { BentoCard } from "@/ui/BentoCard";
import { PrimaryButton } from "@/ui/PrimaryButton";
import { mockBookings, mockDays, mockSlots } from "@/features/booking/mocks";
import { colors } from "@/theme";

type Props = NativeStackScreenProps<BookStackParamList, "RescheduleBooking">;

/**
 * NEW SCREEN (UX review §5, P2): the prototype had "Reschedule" buttons
 * with no destination. Change-summary confirm pattern.
 */
export function RescheduleBookingScreen({ navigation, route }: Props) {
  const booking = mockBookings.find((b) => b.id === route.params.bookingId) ?? mockBookings[0];
  const [dayId, setDayId] = useState("d6");
  const [slotId, setSlotId] = useState<string | null>(null);
  const day = mockDays.find((d) => d.id === dayId)!;
  const slot = mockSlots.find((s) => s.id === slotId);

  return (
    <Screen contentClassName="px-md pb-lg">
      <AppHeader title="Reschedule Booking" />

      {/* Change summary */}
      <BentoCard tone="lowest">
        <Text className="font-inter-medium text-medical-term text-on-surface-variant uppercase mb-xs">
          Current
        </Text>
        <Text className="font-inter-semibold text-body-sm text-on-surface">
          {booking.date}, {booking.time}
        </Text>
        <View className="flex-row items-center gap-xs my-xs">
          <Icon name="arrow_downward" size={16} color={colors.secondary} />
          <Text className="font-inter-medium text-[12px] text-secondary">New schedule</Text>
        </View>
        <Text className="font-inter-semibold text-body-sm text-primary">
          {slot ? `${day.dow}, ${day.month} ${day.day} · ${slot.time}` : "Pick a new slot below"}
        </Text>
      </BentoCard>

      <Text className="font-inter-semibold text-body-sm text-on-surface mt-lg mb-xs">Day</Text>
      <View className="flex-row gap-xs">
        {mockDays.slice(2).map((d) => {
          const on = dayId === d.id;
          const disabled = d.slotsAvailable === 0;
          return (
            <Pressable
              key={d.id}
              disabled={disabled}
              onPress={() => setDayId(d.id)}
              accessibilityRole="button"
              accessibilityState={{ selected: on, disabled }}
              className={`w-14 py-xs rounded-xl items-center ${
                on ? "bg-primary" : disabled ? "bg-surface-container-high opacity-50" : "bg-surface-container-low"
              }`}
            >
              <Text className={`font-inter-medium text-[10px] ${on ? "text-primary-fixed" : "text-on-surface-variant"}`}>
                {d.dow}
              </Text>
              <Text className={`font-inter-bold text-body-lg ${on ? "text-on-primary" : "text-on-surface"}`}>
                {d.day}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text className="font-inter-semibold text-body-sm text-on-surface mt-md mb-xs">Slot</Text>
      <View className="flex-row flex-wrap gap-xs">
        {mockSlots
          .filter((s) => s.available)
          .map((s) => {
            const on = slotId === s.id;
            return (
              <Pressable
                key={s.id}
                onPress={() => setSlotId(s.id)}
                accessibilityRole="radio"
                accessibilityState={{ selected: on }}
                className={`px-sm py-xs rounded-xl border min-h-[44px] justify-center ${
                  on ? "border-primary bg-primary" : "border-outline-variant bg-surface-container-lowest"
                }`}
              >
                <Text className={`font-inter-medium text-[12px] ${on ? "text-on-primary" : "text-on-surface"}`}>
                  {s.time}
                </Text>
              </Pressable>
            );
          })}
      </View>

      <Text className="font-inter text-[12px] text-on-surface-variant mt-md">
        Rescheduling is free until 24 hours before your appointment.
      </Text>
      <PrimaryButton
        label="Confirm New Schedule"
        disabled={!slotId}
        className="mt-md"
        onPress={() => navigation.goBack()}
      />
    </Screen>
  );
}
