import React from "react";
import { Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BookStackParamList } from "@/app/types";
import { Screen } from "@/ui/Screen";
import { AppHeader } from "@/ui/AppHeader";
import { Icon } from "@/ui/Icon";
import { BentoCard } from "@/ui/BentoCard";
import { StatusChip } from "@/ui/Badges";
import { SecondaryButton } from "@/ui/SecondaryButton";
import { mockBookings } from "@/features/booking/mocks";
import { colors } from "@/theme";

type Props = NativeStackScreenProps<BookStackParamList, "TrackBooking">;

const MILESTONES = [
  { key: "confirmed", label: "Booking confirmed", time: "Oct 22, 4:12 PM" },
  { key: "collector_assigned", label: "Collector assigned", time: "Oct 25, 8:05 AM" },
  { key: "sample_collected", label: "Sample collected", time: "" },
  { key: "processing", label: "Lab processing", time: "" },
  { key: "report_ready", label: "Report ready", time: "" },
];

/**
 * Track Booking with phlebotomist trust card (UX review §5 P2:
 * collector name, verified ID, live status - the trust apex of home collection).
 */
export function TrackBookingScreen({ navigation, route }: Props) {
  const booking = mockBookings.find((b) => b.id === route.params.bookingId) ?? mockBookings[0];
  const activeIdx = MILESTONES.findIndex((m) => m.key === booking.status);

  return (
    <Screen contentClassName="px-md pb-lg">
      <AppHeader title="Track Your Booking" />
      <BentoCard tone="lowest">
        <View className="flex-row items-center justify-between">
          <View className="flex-1 pr-sm">
            <Text className="font-inter-semibold text-body-lg text-on-surface">
              {booking.testName}
            </Text>
            <Text className="font-inter text-[12px] text-on-surface-variant mt-0.5">
              {booking.date}, {booking.time} · {booking.labName}
            </Text>
          </View>
          <StatusChip label="In Progress" tone="info" />
        </View>
      </BentoCard>

      {/* Phlebotomist card */}
      {booking.collector ? (
        <BentoCard tone="primary" className="mt-sm">
          <View className="flex-row items-center gap-sm">
            <View className="w-12 h-12 rounded-full bg-primary-fixed items-center justify-center">
              <Text className="font-inter-bold text-body-lg text-on-primary-fixed">
                {booking.collector.name.split(" ").map((n) => n[0]).join("")}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="font-inter-semibold text-body-lg text-on-primary">
                {booking.collector.name}
              </Text>
              <View className="flex-row items-center gap-xs">
                {booking.collector.idVerified && (
                  <View className="flex-row items-center gap-0.5">
                    <Icon name="verified" size={13} color={colors.secondaryFixedDim} />
                    <Text className="font-inter-medium text-[11px] text-secondary-fixed-dim">
                      ID Verified
                    </Text>
                  </View>
                )}
                <View className="flex-row items-center gap-0.5">
                  <Icon name="star" size={13} color="#eab308" />
                  <Text className="font-inter-medium text-[11px] text-primary-fixed">
                    {booking.collector.rating}
                  </Text>
                </View>
              </View>
            </View>
            <View className="items-end">
              <Text className="font-inter-bold text-headline-md text-secondary-fixed-dim">
                {booking.collector.etaMinutes} min
              </Text>
              <Text className="font-inter text-[11px] text-primary-fixed">on the way</Text>
            </View>
          </View>
        </BentoCard>
      ) : null}

      {/* Milestone timeline */}
      <Text className="font-inter-semibold text-headline-md text-on-surface mt-lg mb-sm">
        Status
      </Text>
      {MILESTONES.map((m, i) => {
        const done = i <= activeIdx;
        const current = i === activeIdx;
        return (
          <View key={m.key} className="flex-row gap-sm">
            <View className="items-center">
              <View
                className={`w-7 h-7 rounded-full items-center justify-center ${
                  done ? "bg-secondary" : "bg-surface-container-high"
                }`}
              >
                <Icon
                  name={done ? "check" : "circle"}
                  size={14}
                  color={done ? colors.onSecondary : colors.outline}
                />
              </View>
              {i < MILESTONES.length - 1 && (
                <View className={`w-0.5 flex-1 min-h-[28px] ${done ? "bg-secondary" : "bg-outline-variant"}`} />
              )}
            </View>
            <View className="flex-1 pb-md">
              <Text
                className={`font-inter-semibold text-body-sm ${
                  current ? "text-primary" : done ? "text-on-surface" : "text-on-surface-variant"
                }`}
              >
                {m.label}
              </Text>
              {m.time ? (
                <Text className="font-inter text-[11px] text-on-surface-variant">{m.time}</Text>
              ) : null}
            </View>
          </View>
        );
      })}

      <View className="gap-sm mt-xs">
        <SecondaryButton
          label="Reschedule"
          icon="edit_calendar"
          onPress={() => navigation.navigate("RescheduleBooking", { bookingId: booking.id })}
        />
        <SecondaryButton
          label="Cancel Booking"
          icon="close"
          onPress={() => navigation.navigate("BookingCancellation", { bookingId: booking.id })}
        />
      </View>
    </Screen>
  );
}
