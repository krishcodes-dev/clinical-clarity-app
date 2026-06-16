import React from "react";
import { Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CareStackParamList } from "@/app/types";
import { Screen } from "@/ui/Screen";
import { AppHeader } from "@/ui/AppHeader";
import { Icon } from "@/ui/Icon";
import { BentoCard } from "@/ui/BentoCard";
import { mockPrescriptions } from "@/features/consultations/mocks";
import { colors } from "@/theme";

type Props = NativeStackScreenProps<CareStackParamList, "MyPrescriptions">;

/** Lists all prescriptions received from online consultations. */
export function MyPrescriptionsScreen({ navigation }: Props) {
  return (
    <Screen contentClassName="px-md pb-lg">
      <AppHeader title="My Prescriptions" />
      <Text className="font-inter text-body-sm text-on-surface-variant mb-md">
        Prescriptions from your video consultations.
      </Text>

      {mockPrescriptions.length === 0 ? (
        <BentoCard tone="low" className="items-center py-lg">
          <Icon name="description" size={44} color={colors.onSurfaceVariant} />
          <Text className="font-inter-bold text-headline-md text-on-surface mt-sm">
            No prescriptions yet
          </Text>
          <Text className="font-inter text-body-sm text-on-surface-variant text-center mt-1">
            Prescriptions from your consultations will appear here automatically.
          </Text>
        </BentoCard>
      ) : (
        mockPrescriptions.map((rx) => (
          <BentoCard
            key={rx.id}
            tone="lowest"
            className="mb-sm"
            onPress={() => navigation.navigate("PrescriptionViewer", { prescriptionId: rx.id })}
            accessibilityLabel={`Prescription from ${rx.doctorName}, ${rx.date}`}
          >
            <View className="flex-row items-start justify-between">
              <View className="flex-1 pr-sm">
                <Text className="font-inter-medium text-[10px] text-on-surface-variant uppercase tracking-wider">
                  Prescription
                </Text>
                <Text className="font-inter-semibold text-body-lg text-on-surface mt-0.5">
                  {rx.doctorName}
                </Text>
                <Text className="font-inter text-[12px] text-on-surface-variant mt-0.5">
                  {rx.specialty} · {rx.date}
                </Text>
                {rx.diagnosisNote && (
                  <Text className="font-inter text-[12px] text-on-surface-variant mt-xs" numberOfLines={2}>
                    {rx.diagnosisNote}
                  </Text>
                )}
                <View className="flex-row items-center gap-1 mt-sm">
                  <Icon name="medication" size={14} color={colors.secondary} />
                  <Text className="font-inter-medium text-body-sm text-secondary">
                    {rx.medications.length} Medication{rx.medications.length !== 1 ? "s" : ""}
                  </Text>
                </View>
              </View>
              <View className="flex-row items-center gap-1 mt-sm">
                <Text className="font-inter-semibold text-body-sm text-secondary">View</Text>
                <Icon name="chevron_right" size={16} color={colors.secondary} />
              </View>
            </View>
          </BentoCard>
        ))
      )}
    </Screen>
  );
}
