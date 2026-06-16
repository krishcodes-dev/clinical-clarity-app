import React from "react";
import { Text, View } from "react-native";
import Animated, { FadeInDown, ZoomIn } from "react-native-reanimated";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BookStackParamList } from "@/app/types";
import { Screen } from "@/ui/Screen";
import { Icon } from "@/ui/Icon";
import { BentoCard } from "@/ui/BentoCard";
import { PrimaryButton } from "@/ui/PrimaryButton";
import { SecondaryButton } from "@/ui/SecondaryButton";
import { useBookingStore } from "@/store/useBookingStore";
import { useRemindersStore } from "@/store/useRemindersStore";
import { mockDays } from "@/features/booking/mocks";
import { colors } from "@/theme";

type Props = NativeStackScreenProps<BookStackParamList, "BookingConfirmed">;

/**
 * Booking Confirmed (canonical "Refined" + ported micro-animations from
 * the "Interactive" variant). Offers a fasting reminder - feature 1 ↔ 5
 * bridge (UX review §7.3).
 */
export function BookingConfirmedScreen({ navigation }: Props) {
  const draft = useBookingStore((s) => s.bookingDraft);
  const addReminders = useRemindersStore((s) => s.addReminders);
  const resetBookingDraft = useBookingStore((s) => s.resetBookingDraft);
  const clearCart = useBookingStore((s) => s.clearCart);
  const test = draft.test;
  const day = mockDays.find((d) => d.id === draft.dayId);

  const finish = (to: "track" | "home") => {
    resetBookingDraft();
    clearCart();
    if (to === "track") navigation.replace("TrackBooking", { bookingId: "bk1" });
    else navigation.popToTop();
  };

  return (
    <Screen contentClassName="px-md pb-lg">
      <View className="items-center mt-xl mb-lg">
        <Animated.View
          entering={ZoomIn.duration(450)}
          className="w-24 h-24 rounded-full bg-secondary-container items-center justify-center mb-md"
        >
          <Icon name="check_circle" size={56} color={colors.onSecondaryContainer} />
        </Animated.View>
        <Text className="font-inter-bold text-headline-lg-mobile text-on-surface text-center">
          Booking Confirmed!
        </Text>
        <Text className="font-inter text-body-sm text-on-surface-variant text-center mt-xs">
          Booking ID #CC-2025-08412 · Confirmation sent to your phone
        </Text>
      </View>

      <Animated.View entering={FadeInDown.delay(200).duration(400)}>
        <BentoCard tone="lowest">
          <Text className="font-inter-semibold text-body-lg text-on-surface">
            {test?.name ?? "Diagnostic Test"}
          </Text>
          <View className="flex-row items-center gap-sm mt-xs">
            <View className="flex-row items-center gap-1">
              <Icon name="calendar_today" size={14} color={colors.onSurfaceVariant} />
              <Text className="font-inter text-[12px] text-on-surface-variant">
                {day ? `${day.dow}, ${day.month} ${day.day}` : "Fri, Oct 25"}
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Icon name="schedule" size={14} color={colors.onSurfaceVariant} />
              <Text className="font-inter text-[12px] text-on-surface-variant">
                {draft.slot?.time ?? "10:00 – 11:00 AM"}
              </Text>
            </View>
          </View>
          <View className="flex-row items-center gap-1 mt-xs">
            <Icon name={draft.method === "lab" ? "domain" : "home"} size={14} color={colors.onSurfaceVariant} />
            <Text className="font-inter text-[12px] text-on-surface-variant">
              {draft.method === "lab" ? "Lab visit" : "Home collection (phlebotomist will visit)"}
            </Text>
          </View>
        </BentoCard>

        {test?.fastingHours ? (
          <BentoCard tone="secondary" className="mt-sm">
            <View className="flex-row items-center gap-xs mb-1">
              <Icon name="notifications_active" size={16} color={colors.onSecondaryContainer} />
              <Text className="font-inter-semibold text-[12px] text-on-secondary-container uppercase">
                Smart Reminder
              </Text>
            </View>
            <Text className="font-inter text-body-sm text-on-secondary-fixed">
              {test.fastingHours}h fasting required. Want a "stop eating by{" "}
              {test.fastingHours === 10 ? "midnight" : "10 PM"}" reminder the
              night before?
            </Text>
            <SecondaryButton
              label="Add Fasting Reminder"
              className="mt-sm bg-surface-container-lowest"
              onPress={() =>
                addReminders([
                  {
                    id: `rem-fast-${Date.now()}`,
                    title: "Start fasting for HbA1c test",
                    subtitle: "No food or sugary drinks",
                    type: "test",
                    time: "11:59 PM",
                    dateLabel: "Oct 24",
                    status: "upcoming",
                  },
                ])
              }
            />
          </BentoCard>
        ) : null}

        <View className="mt-lg gap-sm">
          <PrimaryButton label="Track My Booking" icon="route" onPress={() => finish("track")} />
          <SecondaryButton label="Back to Home" onPress={() => finish("home")} />
        </View>
      </Animated.View>
    </Screen>
  );
}
