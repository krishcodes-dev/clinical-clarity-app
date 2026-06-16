import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CareStackParamList } from "@/app/types";
import { Screen } from "@/ui/Screen";
import { AppHeader } from "@/ui/AppHeader";
import { Icon } from "@/ui/Icon";
import { BentoCard } from "@/ui/BentoCard";
import { PrimaryButton } from "@/ui/PrimaryButton";
import { mockDoctors } from "@/features/consultations/mocks";
import { formatINR } from "@/utils/currency";
import { colors } from "@/theme";
import { ConsultMode } from "@/features/consultations/types";

type Props = NativeStackScreenProps<CareStackParamList, "DoctorProfile">;

const MODE_META: Record<ConsultMode, { icon: string; label: string }> = {
  video: { icon: "videocam", label: "Video" },
  audio: { icon: "call", label: "Audio" },
  chat: { icon: "chat", label: "Chat" },
};

/** Doctor Profile with inline slot + mode selection (consult funnel entry). */
export function DoctorProfileScreen({ navigation, route }: Props) {
  const doctor = mockDoctors.find((d) => d.id === route.params.doctorId) ?? mockDoctors[0];
  const [slot, setSlot] = useState<string | null>(null);
  const [mode, setMode] = useState<ConsultMode>("video");

  return (
    <Screen contentClassName="px-md pb-lg">
      <AppHeader title="Doctor Profile" />
      <View className="items-center mb-md">
        <View className="w-20 h-20 rounded-full bg-primary-fixed items-center justify-center mb-sm">
          <Text className="font-inter-bold text-headline-md text-on-primary-fixed">
            {doctor.name.replace("Dr. ", "").split(" ").map((n) => n[0]).join("")}
          </Text>
        </View>
        <Text className="font-inter-bold text-headline-md text-on-surface">{doctor.name}</Text>
        <Text className="font-inter text-body-sm text-on-surface-variant">
          {doctor.specialty} • {doctor.yearsExp} yrs experience
        </Text>
        <View className="flex-row items-center gap-1 mt-1">
          <Icon name="star" size={16} color="#eab308" />
          <Text className="font-inter-semibold text-body-sm text-on-surface">
            {doctor.rating.toFixed(1)}
          </Text>
          <Text className="font-inter text-[12px] text-on-surface-variant">
            ({doctor.reviews} reviews)
          </Text>
        </View>
      </View>

      <BentoCard tone="low">
        <Text className="font-inter-semibold text-body-sm text-on-surface mb-1">About</Text>
        <Text className="font-inter text-body-sm text-on-surface-variant">{doctor.about}</Text>
        <Text className="font-inter text-[12px] text-on-surface-variant mt-xs">
          Languages: {doctor.languages.join(", ")}
        </Text>
      </BentoCard>

      {/* Mode selection */}
      <Text className="font-inter-semibold text-body-sm text-on-surface mt-md mb-xs">
        Consultation mode
      </Text>
      <View className="flex-row gap-xs">
        {doctor.modes.map((m) => {
          const meta = MODE_META[m];
          const on = mode === m;
          return (
            <Pressable
              key={m}
              onPress={() => setMode(m)}
              accessibilityRole="radio"
              accessibilityState={{ selected: on }}
              accessibilityLabel={`${meta.label} consultation`}
              className={`flex-1 flex-row items-center justify-center gap-1 py-sm rounded-xl border min-h-[48px] ${
                on ? "border-primary bg-primary-fixed" : "border-outline-variant bg-surface-container-lowest"
              }`}
            >
              <Icon name={meta.icon} size={18} color={on ? colors.onPrimaryFixed : colors.onSurfaceVariant} />
              <Text className={`font-inter-semibold text-[12px] ${on ? "text-on-primary-fixed" : "text-on-surface"}`}>
                {meta.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Slots */}
      <Text className="font-inter-semibold text-body-sm text-on-surface mt-md mb-xs">
        Next available slots
      </Text>
      <View className="flex-row flex-wrap gap-xs">
        {doctor.nextSlots.map((s) => {
          const on = slot === s;
          return (
            <Pressable
              key={s}
              onPress={() => setSlot(s)}
              accessibilityRole="radio"
              accessibilityState={{ selected: on }}
              className={`px-md py-xs rounded-xl border min-h-[44px] justify-center ${
                on ? "border-primary bg-primary" : "border-outline-variant bg-surface-container-lowest"
              }`}
            >
              <Text className={`font-inter-medium text-[12px] ${on ? "text-on-primary" : "text-on-surface"}`}>
                {s}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View className="flex-row items-center justify-between mt-lg mb-sm">
        <Text className="font-inter text-body-sm text-on-surface-variant">Consultation fee</Text>
        <Text className="font-inter-bold text-price-display text-primary">{formatINR(doctor.fee)}</Text>
      </View>
      <PrimaryButton
        label="Review Appointment"
        disabled={!slot}
        onPress={() =>
          slot &&
          navigation.navigate("ReviewAppointment", { doctorId: doctor.id, slot, mode })
        }
      />
    </Screen>
  );
}
