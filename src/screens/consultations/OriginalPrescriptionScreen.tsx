import React from "react";
import { ScrollView, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CareStackParamList } from "@/app/types";
import { Screen } from "@/ui/Screen";
import { AppHeader } from "@/ui/AppHeader";
import { Icon } from "@/ui/Icon";
import { SecondaryButton } from "@/ui/SecondaryButton";
import { mockPrescriptions } from "@/features/consultations/mocks";
import { colors } from "@/theme";

type Props = NativeStackScreenProps<CareStackParamList, "OriginalPrescription">;

/** Stub screen showing a mock PDF-style prescription document. */
export function OriginalPrescriptionScreen({ navigation, route }: Props) {
  const rx = mockPrescriptions.find((p) => p.id === route.params.prescriptionId) ?? mockPrescriptions[0];

  return (
    <Screen scroll={false} contentClassName="px-0">
      <AppHeader
        title={`rx_${rx.id}.pdf`}
        actions={[
          { icon: "download", label: "Download" },
          { icon: "share", label: "Share" },
        ]}
      />
      <ScrollView className="flex-1 bg-surface-dim px-md" contentContainerClassName="py-md">
        {/* Mock PDF page */}
        <View className="bg-surface-container-lowest rounded-lg p-lg" style={{ minHeight: 560 }}>
          {/* Clinic header */}
          <View className="flex-row items-center justify-between border-b border-outline-variant pb-sm mb-md">
            <View>
              <Text className="font-inter-bold text-body-lg text-on-surface">
                Clinical Clarity Health
              </Text>
              <Text className="font-inter text-[11px] text-on-surface-variant">
                Veera Desai Road, Andheri West, Mumbai 400053
              </Text>
            </View>
            <Icon name="local_hospital" size={28} color={colors.outlineVariant} />
          </View>

          {/* Doctor info */}
          <Text className="font-inter-bold text-headline-md text-on-surface">{rx.doctorName}</Text>
          <Text className="font-inter text-[12px] text-on-surface-variant">
            {rx.specialty} · Reg. No. MH/12345/2012
          </Text>
          <Text className="font-inter text-[12px] text-on-surface-variant mb-md">
            Date: {rx.date}
          </Text>

          {/* Patient info */}
          <View className="bg-surface-container rounded-xl p-sm mb-md">
            <Text className="font-inter text-[12px] text-on-surface-variant">
              Patient: Arjun Mehta · 38 yrs · Male · O+
            </Text>
            <Text className="font-inter text-[12px] text-on-surface-variant">
              Rx ID: {rx.id.toUpperCase()}-2025
            </Text>
          </View>

          {/* Rx symbol + Diagnosis */}
          <View className="flex-row items-center gap-xs mb-xs">
            <Text className="font-inter-bold text-headline-lg-mobile text-primary">℞</Text>
            <Text className="font-inter-medium text-medical-term text-on-surface-variant uppercase">
              Diagnosis
            </Text>
          </View>
          <Text className="font-inter text-body-sm text-on-surface mb-md">{rx.diagnosisNote}</Text>

          {/* Medications table */}
          <View className="border border-outline-variant rounded-xl overflow-hidden mb-md">
            {/* Table header */}
            <View className="flex-row bg-surface-container px-sm py-xs">
              <Text className="font-inter-semibold text-[11px] text-on-surface-variant flex-[2]">Medicine</Text>
              <Text className="font-inter-semibold text-[11px] text-on-surface-variant flex-1 text-center">Dose</Text>
              <Text className="font-inter-semibold text-[11px] text-on-surface-variant flex-1 text-center">Freq.</Text>
              <Text className="font-inter-semibold text-[11px] text-on-surface-variant flex-1 text-right">Days</Text>
            </View>
            {/* Table rows */}
            {rx.medications.map((m, i) => (
              <View
                key={m.name}
                className={`flex-row px-sm py-xs ${i < rx.medications.length - 1 ? "border-b border-outline-variant/60" : ""}`}
              >
                <Text className="font-inter text-[12px] text-on-surface flex-[2]">{m.name}</Text>
                <Text className="font-inter text-[12px] text-on-surface flex-1 text-center">{m.dose}</Text>
                <Text className="font-inter text-[12px] text-on-surface flex-1 text-center">{m.frequency}</Text>
                <Text className="font-inter text-[12px] text-on-surface flex-1 text-right">{m.durationDays}</Text>
              </View>
            ))}
          </View>

          {/* Follow-up */}
          {rx.followUpDays ? (
            <Text className="font-inter text-[12px] text-on-surface-variant mb-md">
              Follow-up: {rx.followUpDays} days · Repeat HbA1c before next visit.
            </Text>
          ) : null}

          {/* Signature */}
          <View className="border-t border-outline-variant pt-sm mt-md">
            <View className="flex-row items-center gap-xs">
              <Icon name="verified" size={14} color={colors.secondary} />
              <Text className="font-inter-medium text-[11px] text-secondary">Digitally Signed</Text>
            </View>
            <Text className="font-inter-bold text-body-sm text-on-surface mt-xs">
              {rx.doctorName}
            </Text>
            <Text className="font-inter text-[10px] text-outline mt-xs">
              This is a computer-generated prescription. Document ID {rx.id.toUpperCase()}-2025.
            </Text>
          </View>
        </View>
      </ScrollView>
      <View className="px-md pb-md pt-xs">
        <SecondaryButton
          label="Back to Prescription Details"
          icon="arrow_back"
          onPress={() => navigation.goBack()}
        />
      </View>
    </Screen>
  );
}
