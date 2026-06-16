import React from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CareStackParamList } from "@/app/types";
import { Screen } from "@/ui/Screen";
import { AppHeader } from "@/ui/AppHeader";
import { Icon } from "@/ui/Icon";
import { BentoCard } from "@/ui/BentoCard";
import { PrimaryButton } from "@/ui/PrimaryButton";
import { SecondaryButton } from "@/ui/SecondaryButton";
import { TrustFooter } from "@/ui/TrustFooter";
import { mockPrescriptions } from "@/features/consultations/mocks";
import { colors } from "@/theme";

type Props = NativeStackScreenProps<CareStackParamList, "PrescriptionViewer">;

/**
 * NEW SCREEN (UX review §5, P1): e-prescription viewer - feature 4 promises
 * "view prescriptions"; also the trigger surface for feature 5.2.
 */
export function PrescriptionViewerScreen({ navigation, route }: Props) {
  const rx = mockPrescriptions.find((p) => p.id === route.params.prescriptionId) ?? mockPrescriptions[0];

  return (
    <Screen contentClassName="px-md pb-lg">
      <AppHeader
        title="e-Prescription"
        actions={[{ icon: "download", label: "Download prescription" }, { icon: "share", label: "Share prescription" }]}
      />

      {/* Prescription document card */}
      <BentoCard tone="lowest">
        <View className="flex-row items-center justify-between border-b border-outline-variant pb-sm mb-sm">
          <View>
            <Text className="font-inter-bold text-body-lg text-on-surface">{rx.doctorName}</Text>
            <Text className="font-inter text-[12px] text-on-surface-variant">
              {rx.specialty} · {rx.date}
            </Text>
          </View>
          <View className="flex-row items-center gap-1 bg-secondary-container px-xs py-1 rounded-full">
            <Icon name="verified" size={13} color={colors.onSecondaryContainer} />
            <Text className="font-inter-semibold text-[11px] text-on-secondary-container">
              Digitally Signed
            </Text>
          </View>
        </View>
        <Text className="font-inter text-[12px] text-on-surface-variant mb-sm">
          Patient: Arjun Mehta · 38 yrs · Rx ID {rx.id.toUpperCase()}-2025
        </Text>
        <Text className="font-inter-medium text-medical-term text-on-surface-variant uppercase mb-xs">
          Diagnosis
        </Text>
        <Text className="font-inter text-body-sm text-on-surface mb-sm">{rx.diagnosisNote}</Text>

        {/* View original prescription PDF */}
        <Pressable
          onPress={() => navigation.navigate("OriginalPrescription", { prescriptionId: rx.id })}
          accessibilityRole="button"
          accessibilityLabel="View original prescription document"
          className="flex-row items-center gap-xs self-start bg-surface-container px-sm py-xs rounded-full"
        >
          <Icon name="picture_as_pdf" size={14} color={colors.secondary} />
          <Text className="font-inter-medium text-[12px] text-secondary">View Original PDF</Text>
        </Pressable>
      </BentoCard>

      <Text className="font-inter-semibold text-headline-md text-on-surface mt-md mb-sm">
        Medications ({rx.medications.length})
      </Text>
      {rx.medications.map((m) => (
        <BentoCard key={m.name} className="mb-sm">
          <View className="flex-row items-center gap-sm">
            <View className="w-11 h-11 rounded-full bg-primary-fixed items-center justify-center">
              <Icon name="medication" size={22} color={colors.onPrimaryFixed} />
            </View>
            <View className="flex-1">
              <Text className="font-inter-semibold text-body-lg text-on-surface">
                {m.name} {m.dose}
              </Text>
              <Text className="font-inter text-[12px] text-on-surface-variant">
                {m.frequency} · {m.durationDays} days · {m.withFood ? "with food" : "empty stomach"}
              </Text>
              <Text className="font-inter text-[12px] text-on-surface-variant">
                Timing: {m.timing.join(", ")}
              </Text>
            </View>
          </View>
        </BentoCard>
      ))}

      {rx.followUpDays ? (
        <View className="flex-row items-center gap-xs bg-surface-container-low rounded-xl p-sm mb-md">
          <Icon name="event_repeat" size={18} color={colors.secondary} />
          <Text className="flex-1 font-inter text-[12px] text-on-surface-variant">
            Follow-up recommended in {rx.followUpDays} days with a fresh HbA1c report.
          </Text>
        </View>
      ) : null}

      <PrimaryButton
        label="Set Reminders for These Medications"
        icon="notifications_active"
        onPress={() => navigation.navigate("PrescriptionToReminders", { prescriptionId: rx.id })}
      />
      <TrustFooter variant="vault" />
    </Screen>
  );
}
