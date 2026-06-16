import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CareStackParamList } from "@/app/types";
import { Screen } from "@/ui/Screen";
import { AppHeader } from "@/ui/AppHeader";
import { Icon } from "@/ui/Icon";
import { BentoCard } from "@/ui/BentoCard";
import { PrimaryButton } from "@/ui/PrimaryButton";
import { mockAppointments } from "@/features/consultations/mocks";
import { colors } from "@/theme";

type Props = NativeStackScreenProps<CareStackParamList, "RescheduleAppointment">;

const DAYS = ["Tomorrow", "Wed, Oct 26", "Thu, Oct 27", "Fri, Oct 28"];
const SLOTS = ["09:00 AM", "10:30 AM", "11:30 AM", "02:00 PM", "04:30 PM", "06:00 PM"];

/**
 * NEW SCREEN (UX review §5, P2): destination for the prototype's dead-end
 * "Reschedule" buttons. Change-summary confirm pattern.
 */
export function RescheduleAppointmentScreen({ navigation, route }: Props) {
  const apt = mockAppointments.find((a) => a.id === route.params.appointmentId) ?? mockAppointments[0];
  const [day, setDay] = useState<string | null>(null);
  const [slot, setSlot] = useState<string | null>(null);

  return (
    <Screen contentClassName="px-md pb-lg">
      <AppHeader title="Reschedule Appointment" />
      <BentoCard tone="lowest">
        <Text className="font-inter-medium text-medical-term text-on-surface-variant uppercase mb-xs">
          Current
        </Text>
        <Text className="font-inter-semibold text-body-sm text-on-surface">
          {apt.doctorName} · {apt.date}, {apt.time}
        </Text>
        <View className="flex-row items-center gap-xs my-xs">
          <Icon name="arrow_downward" size={16} color={colors.secondary} />
          <Text className="font-inter-medium text-[12px] text-secondary">New schedule</Text>
        </View>
        <Text className="font-inter-semibold text-body-sm text-primary">
          {day && slot ? `${day} · ${slot}` : "Pick a new day and slot below"}
        </Text>
      </BentoCard>

      <Text className="font-inter-semibold text-body-sm text-on-surface mt-lg mb-xs">Day</Text>
      <View className="flex-row flex-wrap gap-xs">
        {DAYS.map((d) => (
          <Pressable
            key={d}
            onPress={() => setDay(d)}
            accessibilityRole="radio"
            accessibilityState={{ selected: day === d }}
            className={`px-md py-xs rounded-xl border min-h-[44px] justify-center ${
              day === d ? "border-primary bg-primary" : "border-outline-variant bg-surface-container-lowest"
            }`}
          >
            <Text className={`font-inter-medium text-[12px] ${day === d ? "text-on-primary" : "text-on-surface"}`}>
              {d}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text className="font-inter-semibold text-body-sm text-on-surface mt-md mb-xs">Slot</Text>
      <View className="flex-row flex-wrap gap-xs">
        {SLOTS.map((s) => (
          <Pressable
            key={s}
            onPress={() => setSlot(s)}
            accessibilityRole="radio"
            accessibilityState={{ selected: slot === s }}
            className={`px-sm py-xs rounded-xl border min-h-[44px] justify-center ${
              slot === s ? "border-primary bg-primary" : "border-outline-variant bg-surface-container-lowest"
            }`}
          >
            <Text className={`font-inter-medium text-[12px] ${slot === s ? "text-on-primary" : "text-on-surface"}`}>
              {s}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text className="font-inter text-[12px] text-on-surface-variant mt-md">
        Free rescheduling until 2 hours before the consultation. The doctor will
        be notified automatically.
      </Text>
      <PrimaryButton
        label="Confirm New Time"
        disabled={!day || !slot}
        className="mt-md"
        onPress={() => navigation.goBack()}
      />
    </Screen>
  );
}
