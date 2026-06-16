import React, { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CareStackParamList } from "@/app/types";
import { Icon } from "@/ui/Icon";
import { mockAppointments } from "@/features/consultations/mocks";
import { colors } from "@/theme";

type Props = NativeStackScreenProps<CareStackParamList, "VideoCall">;

/**
 * NEW SCREEN (UX review §5, P1): in-consultation video room.
 * Full-screen dark canvas, PiP self-view, mute/camera/chat/end controls.
 */
export function VideoCallScreen({ navigation, route }: Props) {
  const apt = mockAppointments.find((a) => a.id === route.params.appointmentId) ?? mockAppointments[0];
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const mm = Math.floor(elapsed / 60);
  const ss = String(elapsed % 60).padStart(2, "0");

  const CONTROLS = [
    {
      icon: muted ? "mic_off" : "mic",
      label: muted ? "Unmute" : "Mute",
      active: muted,
      onPress: () => setMuted((v) => !v),
    },
    {
      icon: cameraOff ? "videocam_off" : "videocam",
      label: cameraOff ? "Camera on" : "Camera off",
      active: cameraOff,
      onPress: () => setCameraOff((v) => !v),
    },
    {
      icon: "chat",
      label: "Open chat",
      active: false,
      onPress: () => navigation.navigate("ChatConsult", { appointmentId: apt.id }),
    },
  ];

  return (
    <View className="flex-1 bg-tertiary">
      {/* Remote video canvas (mock) */}
      <View className="flex-1 items-center justify-center">
        <View className="w-32 h-32 rounded-full bg-tertiary-container items-center justify-center">
          <Text className="font-inter-bold text-headline-lg text-tertiary-fixed">
            {apt.doctorName.replace("Dr. ", "").split(" ").map((n) => n[0]).join("")}
          </Text>
        </View>
        <Text className="font-inter-semibold text-body-lg text-on-tertiary mt-md">
          {apt.doctorName}
        </Text>
        <Text className="font-inter text-[12px] text-tertiary-fixed-dim">{apt.specialty}</Text>
      </View>

      {/* Top status bar */}
      <View className="absolute top-14 left-md right-md flex-row items-center justify-between">
        <View className="flex-row items-center gap-1 bg-tertiary-container/90 px-sm py-1 rounded-full">
          <View className="w-2 h-2 rounded-full bg-error" />
          <Text className="font-inter-medium text-[12px] text-tertiary-fixed">
            {mm}:{ss}
          </Text>
        </View>
        <View className="flex-row items-center gap-1 bg-tertiary-container/90 px-sm py-1 rounded-full">
          <Icon name="lock" size={12} color={colors.secondaryFixedDim} />
          <Text className="font-inter-medium text-[11px] text-tertiary-fixed">Encrypted</Text>
        </View>
      </View>

      {/* PiP self view */}
      <View className="absolute bottom-36 right-md w-24 h-32 rounded-2xl bg-tertiary-container items-center justify-center border border-on-tertiary-fixed-variant">
        {cameraOff ? (
          <Icon name="videocam_off" size={24} color={colors.tertiaryFixedDim} />
        ) : (
          <Icon name="person" size={32} color={colors.tertiaryFixedDim} />
        )}
        <Text className="font-inter text-[10px] text-tertiary-fixed-dim mt-1">You</Text>
      </View>

      {/* Controls */}
      <View className="absolute bottom-10 left-0 right-0 flex-row items-center justify-center gap-md">
        {CONTROLS.map((c) => (
          <Pressable
            key={c.label}
            onPress={c.onPress}
            accessibilityRole="button"
            accessibilityLabel={c.label}
            className={`w-14 h-14 rounded-full items-center justify-center ${
              c.active ? "bg-on-tertiary" : "bg-tertiary-container"
            }`}
          >
            <Icon
              name={c.icon}
              size={24}
              color={c.active ? colors.tertiary : colors.tertiaryFixed}
            />
          </Pressable>
        ))}
        <Pressable
          onPress={() => navigation.replace("PostVisitSummary", { appointmentId: apt.id })}
          accessibilityRole="button"
          accessibilityLabel="End call"
          className="w-16 h-16 rounded-full bg-error items-center justify-center"
        >
          <Icon name="call_end" size={28} color={colors.onError} />
        </Pressable>
      </View>
    </View>
  );
}
