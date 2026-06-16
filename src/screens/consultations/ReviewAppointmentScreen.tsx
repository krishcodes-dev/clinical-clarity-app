import React from "react";
import { Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CareStackParamList } from "@/app/types";
import { Screen } from "@/ui/Screen";
import { AppHeader } from "@/ui/AppHeader";
import { Icon } from "@/ui/Icon";
import { BentoCard } from "@/ui/BentoCard";
import { BillSummary } from "@/features/booking/components/BillSummary";
import { TrustFooter } from "@/ui/TrustFooter";
import { PrimaryButton } from "@/ui/PrimaryButton";
import { useCareStore } from "@/store/useCareStore";
import { mockDoctors } from "@/features/consultations/mocks";
import { colors } from "@/theme";

type Props = NativeStackScreenProps<CareStackParamList, "ReviewAppointment">;

/** Review Appointment - consult-funnel review step (tab bar hidden). */
export function ReviewAppointmentScreen({ navigation, route }: Props) {
  const doctor = mockDoctors.find((d) => d.id === route.params.doctorId) ?? mockDoctors[0];
  const updateConsultDraft = useCareStore((s) => s.updateConsultDraft);
  const { slot, mode } = route.params;

  return (
    <Screen contentClassName="px-md pb-lg">
      <AppHeader title="Review Appointment" />
      <BentoCard tone="lowest">
        <View className="flex-row items-center gap-sm">
          <View className="w-12 h-12 rounded-full bg-primary-fixed items-center justify-center">
            <Text className="font-inter-bold text-body-lg text-on-primary-fixed">
              {doctor.name.replace("Dr. ", "").split(" ").map((n) => n[0]).join("")}
            </Text>
          </View>
          <View className="flex-1">
            <Text className="font-inter-semibold text-body-lg text-on-surface">{doctor.name}</Text>
            <Text className="font-inter text-[12px] text-on-surface-variant">
              {doctor.specialty} • {doctor.yearsExp} yrs exp.
            </Text>
          </View>
        </View>
        <View className="flex-row gap-sm mt-md">
          <View className="flex-1 bg-surface-container-low rounded-xl p-sm">
            <Text className="font-inter text-[11px] text-on-surface-variant">Slot</Text>
            <Text className="font-inter-semibold text-body-sm text-on-surface">{slot}</Text>
          </View>
          <View className="flex-1 bg-surface-container-low rounded-xl p-sm">
            <Text className="font-inter text-[11px] text-on-surface-variant">Mode</Text>
            <Text className="font-inter-semibold text-body-sm text-on-surface capitalize">
              {mode} consult
            </Text>
          </View>
        </View>
      </BentoCard>

      {/* Share-records prompt - Care ↔ Records bridge */}
      <BentoCard tone="low" className="mt-sm">
        <View className="flex-row items-center gap-sm">
          <Icon name="clinical_notes" size={20} color={colors.primaryContainer} />
          <Text className="flex-1 font-inter text-body-sm text-on-surface-variant">
            Your latest HbA1c report will be shared with {doctor.name} for this
            consultation. Manage in Privacy & Security.
          </Text>
        </View>
      </BentoCard>

      <View className="mt-md">
        <BillSummary
          lines={[
            { label: `${doctor.specialty} consultation`, amount: doctor.fee },
            { label: "Platform fee", amount: 49 },
          ]}
        />
      </View>

      <PrimaryButton
        label="Confirm & Pay"
        icon="payments"
        className="mt-md"
        onPress={() => {
          updateConsultDraft({ doctor, mode, slotLabel: slot });
          navigation.navigate("CarePayment");
        }}
      />
      <TrustFooter variant="payment" />
    </Screen>
  );
}
