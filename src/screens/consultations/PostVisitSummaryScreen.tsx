import React from "react";
import { Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CareStackParamList } from "@/app/types";
import { Screen } from "@/ui/Screen";
import { AppHeader } from "@/ui/AppHeader";
import { Icon } from "@/ui/Icon";
import { BentoCard } from "@/ui/BentoCard";
import { PrimaryButton } from "@/ui/PrimaryButton";
import { SecondaryButton } from "@/ui/SecondaryButton";
import { mockAppointments, mockPrescriptions } from "@/features/consultations/mocks";
import { colors } from "@/theme";

type Props = NativeStackScreenProps<CareStackParamList, "PostVisitSummary">;

/**
 * NEW SCREEN (UX review §5, P1): post-visit summary - closes the
 * consultation loop and feeds the EHR + Reminders features.
 */
export function PostVisitSummaryScreen({ navigation, route }: Props) {
  const apt = mockAppointments.find((a) => a.id === route.params.appointmentId) ?? mockAppointments[0];
  const rx = mockPrescriptions[0];

  return (
    <Screen contentClassName="px-md pb-lg">
      <AppHeader title="Visit Summary" back={false} />
      <View className="items-center my-md">
        <View className="w-16 h-16 rounded-full bg-secondary-container items-center justify-center mb-sm">
          <Icon name="task_alt" size={32} color={colors.onSecondaryContainer} />
        </View>
        <Text className="font-inter-bold text-headline-md text-on-surface">
          Consultation Complete
        </Text>
        <Text className="font-inter text-body-sm text-on-surface-variant mt-1">
          {apt.doctorName} · {apt.specialty} · 14 min
        </Text>
      </View>

      <Animated.View entering={FadeInDown.delay(150).duration(350)}>
        <BentoCard tone="lowest">
          <Text className="font-inter-medium text-medical-term text-on-surface-variant uppercase mb-xs">
            Doctor's Note
          </Text>
          <Text className="font-inter text-body-sm text-on-surface">{rx.diagnosisNote}</Text>
        </BentoCard>

        <BentoCard tone="low" className="mt-sm">
          <Text className="font-inter-medium text-medical-term text-on-surface-variant uppercase mb-xs">
            Key Points Discussed
          </Text>
          {[
            "Reviewed HbA1c trend: improving but above target",
            "Start Metformin 500mg twice daily with food",
            "Continue Vitamin D3 supplementation",
            "Re-test HbA1c in 3 months",
          ].map((p) => (
            <View key={p} className="flex-row items-start gap-xs py-0.5">
              <Icon name="check" size={16} color={colors.secondary} />
              <Text className="flex-1 font-inter text-body-sm text-on-surface-variant">{p}</Text>
            </View>
          ))}
        </BentoCard>

        <BentoCard tone="secondary" className="mt-sm">
          <View className="flex-row items-center gap-sm">
            <Icon name="prescriptions" size={24} color={colors.onSecondaryContainer} />
            <View className="flex-1">
              <Text className="font-inter-semibold text-body-sm text-on-secondary-fixed">
                e-Prescription issued
              </Text>
              <Text className="font-inter text-[12px] text-on-secondary-container">
                {rx.medications.length} medications · saved to your records
              </Text>
            </View>
          </View>
        </BentoCard>

        <View className="mt-lg gap-sm">
          <PrimaryButton
            label="View e-Prescription"
            icon="prescriptions"
            onPress={() => navigation.navigate("PrescriptionViewer", { prescriptionId: rx.id })}
          />
          <SecondaryButton
            label="Set Medication Reminders"
            icon="notifications_active"
            onPress={() => navigation.navigate("PrescriptionToReminders", { prescriptionId: rx.id })}
          />
          <SecondaryButton label="Done" onPress={() => navigation.popToTop()} />
        </View>

        {/* Rating */}
        <BentoCard tone="low" className="mt-md items-center">
          <Text className="font-inter-semibold text-body-sm text-on-surface mb-xs">
            How was your consultation?
          </Text>
          <View className="flex-row gap-xs">
            {[1, 2, 3, 4, 5].map((i) => (
              <Icon key={i} name="star" size={28} color={i <= 4 ? "#eab308" : colors.outlineVariant} accessibilityLabel={`Rate ${i} stars`} />
            ))}
          </View>
        </BentoCard>
      </Animated.View>
    </Screen>
  );
}
