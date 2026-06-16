import React from "react";
import { Text, View } from "react-native";
import Animated, { FadeInDown, ZoomIn } from "react-native-reanimated";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CareStackParamList } from "@/app/types";
import { Screen } from "@/ui/Screen";
import { Icon } from "@/ui/Icon";
import { BentoCard } from "@/ui/BentoCard";
import { PrimaryButton } from "@/ui/PrimaryButton";
import { SecondaryButton } from "@/ui/SecondaryButton";
import { useCareStore } from "@/store/useCareStore";
import { colors } from "@/theme";

type Props = NativeStackScreenProps<CareStackParamList, "AppointmentConfirmed">;

/** Appointment Confirmed - success state with pre-call preparation CTA. */
export function AppointmentConfirmedScreen({ navigation }: Props) {
  const consultDraft = useCareStore((s) => s.consultDraft);
  const resetConsultDraft = useCareStore((s) => s.resetConsultDraft);
  const doctor = consultDraft.doctor;

  const done = (next?: "precall") => {
    resetConsultDraft();
    if (next === "precall") {
      navigation.replace("PreCallCheck", { appointmentId: "apt1" });
    } else {
      navigation.popToTop();
    }
  };

  return (
    <Screen contentClassName="px-md pb-lg">
      <View className="items-center mt-xl mb-lg">
        <Animated.View
          entering={ZoomIn.duration(450)}
          className="w-24 h-24 rounded-full bg-secondary-container items-center justify-center mb-md"
        >
          <Icon name="event_available" size={52} color={colors.onSecondaryContainer} />
        </Animated.View>
        <Text className="font-inter-bold text-headline-lg-mobile text-on-surface text-center">
          Appointment Confirmed!
        </Text>
        <Text className="font-inter text-body-sm text-on-surface-variant text-center mt-xs">
          Appointment ID #MC-2025-3307 · Details sent to your phone
        </Text>
      </View>

      <Animated.View entering={FadeInDown.delay(200).duration(400)}>
        <BentoCard tone="lowest">
          <View className="flex-row items-center gap-sm">
            <View className="w-12 h-12 rounded-full bg-primary-fixed items-center justify-center">
              <Text className="font-inter-bold text-body-lg text-on-primary-fixed">
                {(doctor?.name ?? "Dr. Sneha Patil").replace("Dr. ", "").split(" ").map((n) => n[0]).join("")}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="font-inter-semibold text-body-lg text-on-surface">
                {doctor?.name ?? "Dr. Sneha Patil"}
              </Text>
              <Text className="font-inter text-[12px] text-on-surface-variant">
                {doctor?.specialty ?? "General Physician"} · {consultDraft.mode ?? "video"} consult
              </Text>
            </View>
          </View>
          <View className="flex-row gap-sm mt-md">
            <View className="flex-1 bg-surface-container-low rounded-xl p-sm items-center">
              <Icon name="calendar_today" size={18} color={colors.primaryContainer} />
              <Text className="font-inter-semibold text-body-sm text-on-surface mt-1">Tomorrow</Text>
            </View>
            <View className="flex-1 bg-surface-container-low rounded-xl p-sm items-center">
              <Icon name="schedule" size={18} color={colors.primaryContainer} />
              <Text className="font-inter-semibold text-body-sm text-on-surface mt-1">
                {consultDraft.slotLabel ?? "10:30 AM"}
              </Text>
            </View>
          </View>
        </BentoCard>

        <BentoCard tone="low" className="mt-sm">
          <View className="flex-row items-start gap-sm">
            <Icon name="tips_and_updates" size={20} color={colors.secondary} />
            <Text className="flex-1 font-inter text-body-sm text-on-surface-variant">
              Run a quick camera & microphone check before your visit so the
              consultation starts smoothly.
            </Text>
          </View>
        </BentoCard>

        <View className="mt-lg gap-sm">
          <PrimaryButton label="Run Device Check Now" icon="videocam" onPress={() => done("precall")} />
          <SecondaryButton label="View My Appointments" icon="event_note" onPress={() => { navigation.replace("MyAppointments"); }} />
          <SecondaryButton label="Done" onPress={() => done()} />
        </View>
      </Animated.View>
    </Screen>
  );
}
