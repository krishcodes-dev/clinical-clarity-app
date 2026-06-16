import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CareStackParamList } from "@/app/types";
import { Screen } from "@/ui/Screen";
import { AppHeader } from "@/ui/AppHeader";
import { Icon } from "@/ui/Icon";
import { BentoCard } from "@/ui/BentoCard";
import { SecondaryButton } from "@/ui/SecondaryButton";
import { mockAppointments } from "@/features/consultations/mocks";
import { colors } from "@/theme";

type Props = NativeStackScreenProps<CareStackParamList, "WaitingRoom">;

/**
 * NEW SCREEN (UX review §5, P1): waiting room - sets expectations and
 * reduces abandonment. Auto-joins the call when the doctor is "ready".
 */
export function WaitingRoomScreen({ navigation, route }: Props) {
  const apt = mockAppointments.find((a) => a.id === route.params.appointmentId) ?? mockAppointments[0];
  const [secondsLeft, setSecondsLeft] = useState(8);
  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(withTiming(1.15, { duration: 900 }), -1, true);
  }, [pulse]);

  useEffect(() => {
    if (secondsLeft <= 0) {
      navigation.replace(apt.mode === "chat" ? "ChatConsult" : "VideoCall", {
        appointmentId: apt.id,
      });
      return;
    }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secondsLeft, navigation, apt]);

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: 2 - pulse.value,
  }));

  return (
    <Screen scroll={false} contentClassName="px-0">
      <AppHeader title="Waiting Room" />
      <View className="flex-1 items-center justify-center px-md">
        <View className="items-center justify-center mb-lg">
          <Animated.View
            style={ringStyle}
            className="absolute w-36 h-36 rounded-full border-2 border-secondary"
          />
          <View className="w-28 h-28 rounded-full bg-primary-fixed items-center justify-center">
            <Text className="font-inter-bold text-headline-lg text-on-primary-fixed">
              {apt.doctorName.replace("Dr. ", "").split(" ").map((n) => n[0]).join("")}
            </Text>
          </View>
        </View>
        <Text className="font-inter-bold text-headline-md text-on-surface text-center">
          {apt.doctorName} joins in ~{secondsLeft}s
        </Text>
        <Text className="font-inter text-body-sm text-on-surface-variant text-center mt-xs">
          Stay on this screen. Your {apt.mode} consult will start automatically.
        </Text>

        <BentoCard tone="low" className="self-stretch mt-lg">
          <Text className="font-inter-semibold text-body-sm text-on-surface mb-1">
            While you wait
          </Text>
          <Text className="font-inter text-[12px] text-on-surface-variant">
            • Keep your questions handy{"\n"}• Your HbA1c report has been shared
            with the doctor{"\n"}• Find a quiet, well-lit spot
          </Text>
        </BentoCard>
      </View>
      <View className="px-md pb-md">
        <SecondaryButton label="Leave Waiting Room" onPress={() => navigation.goBack()} />
      </View>
    </Screen>
  );
}
