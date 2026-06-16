import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BookStackParamList } from "@/app/types";
import { Screen } from "@/ui/Screen";
import { AppHeader } from "@/ui/AppHeader";
import { FunnelStepper } from "@/ui/FunnelStepper";
import { Icon } from "@/ui/Icon";
import { EmptyState } from "@/ui/EmptyState";
import { PrimaryButton } from "@/ui/PrimaryButton";
import { useBookingStore } from "@/store/useBookingStore";
import { mockDays, mockSlots } from "@/features/booking/mocks";
import { colors } from "@/theme";

type Props = NativeStackScreenProps<BookStackParamList, "SelectSlot">;

const PERIODS = ["Morning", "Afternoon", "Evening"] as const;

/** Select Date & Slot - includes the "No Available Slots" state (Wed 26). */
export function SelectSlotScreen({ navigation }: Props) {
  const draft = useBookingStore((s) => s.bookingDraft);
  const updateBookingDraft = useBookingStore((s) => s.updateBookingDraft);
  const [dayId, setDayId] = useState(mockDays[3].id);
  const [slotId, setSlotId] = useState<string | null>(null);

  const day = useMemo(() => mockDays.find((d) => d.id === dayId)!, [dayId]);
  const noSlots = day.slotsAvailable === 0;

  return (
    <Screen scroll={false} contentClassName="px-0">
      <AppHeader title="Select Date & Slot" />
      <FunnelStepper current={1} />
      <ScrollView className="flex-1 px-md" contentContainerClassName="pb-md">
        {draft.test?.fastingHours ? (
          <View className="flex-row items-center gap-xs bg-error-container/50 rounded-xl p-sm mt-xs mb-sm">
            <Icon name="warning" size={16} color={colors.onErrorContainer} />
            <Text className="flex-1 font-inter text-[12px] text-on-error-container">
              {draft.test.fastingHours}h fasting required. Morning slots are
              usually easiest.
            </Text>
          </View>
        ) : null}

        {/* Day strip */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-xs py-xs">
            {mockDays.map((d) => {
              const on = dayId === d.id;
              return (
                <Pressable
                  key={d.id}
                  onPress={() => {
                    setDayId(d.id);
                    setSlotId(null);
                  }}
                  accessibilityRole="button"
                  accessibilityState={{ selected: on }}
                  accessibilityLabel={`${d.dow} ${d.month} ${d.day}, ${d.slotsAvailable} slots`}
                  className={`w-14 py-xs rounded-xl items-center ${
                    on ? "bg-primary" : d.slotsAvailable === 0 ? "bg-surface-container-high opacity-60" : "bg-surface-container-low"
                  }`}
                >
                  <Text className={`font-inter-medium text-[10px] ${on ? "text-primary-fixed" : "text-on-surface-variant"}`}>
                    {d.dow}
                  </Text>
                  <Text className={`font-inter-bold text-body-lg ${on ? "text-on-primary" : "text-on-surface"}`}>
                    {d.day}
                  </Text>
                  <Text className={`font-inter text-[9px] ${on ? "text-primary-fixed" : "text-on-surface-variant"}`}>
                    {d.month}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>

        {noSlots ? (
          <EmptyState
            icon="event_busy"
            title="No slots available"
            body="All collection slots for this day are taken. Try the next available day. Thursday has 8 open slots."
            primaryLabel="Jump to Next Available Day"
            onPrimary={() => setDayId("d6")}
          />
        ) : (
          PERIODS.map((p) => {
            const slots = mockSlots.filter((s) => s.period === p);
            if (slots.length === 0) return null;
            return (
              <View key={p} className="mt-md">
                <Text className="font-inter-semibold text-body-sm text-on-surface mb-xs">{p}</Text>
                <View className="flex-row flex-wrap gap-xs">
                  {slots.map((s) => {
                    const on = slotId === s.id;
                    return (
                      <Pressable
                        key={s.id}
                        disabled={!s.available}
                        onPress={() => setSlotId(s.id)}
                        accessibilityRole="radio"
                        accessibilityState={{ selected: on, disabled: !s.available }}
                        accessibilityLabel={`${s.time}${s.available ? "" : ", unavailable"}`}
                        className={`px-sm py-xs rounded-xl border min-h-[44px] justify-center ${
                          !s.available
                            ? "border-outline-variant bg-surface-container-high opacity-50"
                            : on
                            ? "border-primary bg-primary"
                            : "border-outline-variant bg-surface-container-lowest"
                        }`}
                      >
                        <Text
                          className={`font-inter-medium text-[12px] ${
                            on ? "text-on-primary" : "text-on-surface"
                          } ${!s.available ? "line-through" : ""}`}
                        >
                          {s.time}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
      <View className="px-md pb-md">
        <PrimaryButton
          label="Review Booking"
          disabled={noSlots || !slotId}
          onPress={() => {
            updateBookingDraft({
              dayId,
              slot: mockSlots.find((s) => s.id === slotId) ?? undefined,
            });
            navigation.navigate("ReviewBooking");
          }}
        />
      </View>
    </Screen>
  );
}
