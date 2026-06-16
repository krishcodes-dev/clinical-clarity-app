import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CareStackParamList } from "@/app/types";
import { Screen } from "@/ui/Screen";
import { AppHeader } from "@/ui/AppHeader";
import { Icon } from "@/ui/Icon";
import { BentoCard } from "@/ui/BentoCard";
import { PrimaryButton } from "@/ui/PrimaryButton";
import { mockAppointments } from "@/features/consultations/mocks";
import { colors } from "@/theme";

type Props = NativeStackScreenProps<CareStackParamList, "PreCallCheck">;

type CheckStatus = "pending" | "checking" | "ok";

const CHECKS: { key: string; icon: string; label: string; sub: string }[] = [
  { key: "camera", icon: "videocam", label: "Camera", sub: "Permission & preview" },
  { key: "mic", icon: "mic", label: "Microphone", sub: "Input level test" },
  { key: "network", icon: "wifi", label: "Connection", sub: "Bandwidth check" },
];

/**
 * NEW SCREEN (UX review §5, P1): pre-call device check - prevents the most
 * common telehealth failure at the moment of highest user anxiety.
 */
export function PreCallCheckScreen({ navigation, route }: Props) {
  const apt = mockAppointments.find((a) => a.id === route.params.appointmentId) ?? mockAppointments[0];
  const [statuses, setStatuses] = useState<Record<string, CheckStatus>>({
    camera: "checking",
    mic: "pending",
    network: "pending",
  });

  useEffect(() => {
    const t1 = setTimeout(() => setStatuses((s) => ({ ...s, camera: "ok", mic: "checking" })), 900);
    const t2 = setTimeout(() => setStatuses((s) => ({ ...s, mic: "ok", network: "checking" })), 1800);
    const t3 = setTimeout(() => setStatuses((s) => ({ ...s, network: "ok" })), 2700);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const allOk = Object.values(statuses).every((s) => s === "ok");

  return (
    <Screen scroll={false} contentClassName="px-0">
      <AppHeader title="Device Check" />
      <View className="flex-1 px-md pt-sm">
        <Text className="font-inter text-body-sm text-on-surface-variant mb-md">
          Getting you ready for your {apt.mode} consult with {apt.doctorName} at {apt.time}.
        </Text>

        {/* Camera preview mock */}
        <View className="h-44 rounded-3xl bg-inverse-surface items-center justify-center mb-md overflow-hidden">
          <Icon name="person" size={64} color={colors.surfaceTint} />
          <Text className="font-inter text-[12px] text-inverse-on-surface mt-xs">
            Camera preview
          </Text>
          <View className="absolute bottom-sm left-sm flex-row items-center gap-1 bg-secondary-container px-xs py-1 rounded-full">
            <View className="w-2 h-2 rounded-full bg-secondary" />
            <Text className="font-inter-medium text-[11px] text-on-secondary-container">Looking good</Text>
          </View>
        </View>

        {CHECKS.map((c) => {
          const st = statuses[c.key];
          return (
            <Animated.View key={c.key} entering={FadeIn.duration(250)}>
              <BentoCard className="mb-xs">
                <View className="flex-row items-center gap-sm">
                  <View className="w-10 h-10 rounded-full bg-surface-container items-center justify-center">
                    <Icon name={c.icon} size={20} color={colors.primaryContainer} />
                  </View>
                  <View className="flex-1">
                    <Text className="font-inter-semibold text-body-sm text-on-surface">{c.label}</Text>
                    <Text className="font-inter text-[11px] text-on-surface-variant">{c.sub}</Text>
                  </View>
                  {st === "ok" ? (
                    <Icon name="check_circle" size={22} color={colors.secondary} />
                  ) : st === "checking" ? (
                    <Text className="font-inter text-[11px] text-on-surface-variant">Checking…</Text>
                  ) : (
                    <Icon name="circle" size={18} color={colors.outlineVariant} />
                  )}
                </View>
              </BentoCard>
            </Animated.View>
          );
        })}

        <View className="flex-row items-start gap-xs bg-surface-container-low rounded-xl p-sm mt-xs">
          <Icon name="lock" size={16} color={colors.secondary} />
          <Text className="flex-1 font-inter text-[12px] text-on-surface-variant">
            Your consultation is end-to-end encrypted and never recorded without
            your explicit consent.
          </Text>
        </View>
      </View>
      <View className="px-md pb-md">
        <PrimaryButton
          label={allOk ? "Enter Waiting Room" : "Running checks…"}
          disabled={!allOk}
          icon="meeting_room"
          onPress={() => navigation.replace("WaitingRoom", { appointmentId: apt.id })}
        />
      </View>
    </Screen>
  );
}
