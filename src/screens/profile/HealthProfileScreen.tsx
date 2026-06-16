import React from "react";
import { Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ProfileStackParamList } from "@/app/types";
import { Screen } from "@/ui/Screen";
import { AppHeader } from "@/ui/AppHeader";
import { Icon } from "@/ui/Icon";
import { BentoCard } from "@/ui/BentoCard";
import { SecondaryButton } from "@/ui/SecondaryButton";
import { mockUser } from "@/features/auth/mocks";
import { colors } from "@/theme";

type Props = NativeStackScreenProps<ProfileStackParamList, "HealthProfile">;

/** Health Profile - the clinical identity behind reference ranges. */
export function HealthProfileScreen({ navigation }: Props) {
  return (
    <Screen contentClassName="px-md pb-lg">
      <AppHeader title="Health Profile" />

      <View className="flex-row flex-wrap justify-between">
        {[
          { icon: "cake", label: "Age", value: "38 yrs" },
          { icon: "wc", label: "Sex", value: mockUser.gender ?? "-" },
          { icon: "bloodtype", label: "Blood Group", value: mockUser.bloodGroup ?? "-" },
          { icon: "height", label: "Height", value: `${mockUser.heightCm} cm` },
          { icon: "monitor_weight", label: "Weight", value: `${mockUser.weightKg} kg` },
          { icon: "calculate", label: "BMI", value: "23.4" },
        ].map((v) => (
          <BentoCard key={v.label} tone="low" className="w-[31.5%] mb-sm items-center py-sm">
            <Icon name={v.icon} size={20} color={colors.primaryContainer} />
            <Text className="font-inter-bold text-body-sm text-on-surface mt-1">{v.value}</Text>
            <Text className="font-inter text-[10px] text-on-surface-variant">{v.label}</Text>
          </BentoCard>
        ))}
      </View>

      <BentoCard className="mt-xs">
        <Text className="font-inter-medium text-medical-term text-on-surface-variant uppercase mb-xs">
          Known Conditions
        </Text>
        <View className="flex-row flex-wrap gap-xs">
          {["Type 2 Diabetes", "Vitamin D insufficiency"].map((c) => (
            <View key={c} className="bg-error-container/60 px-sm py-1 rounded-full">
              <Text className="font-inter-medium text-[12px] text-on-error-container">{c}</Text>
            </View>
          ))}
        </View>
      </BentoCard>

      <BentoCard className="mt-sm">
        <Text className="font-inter-medium text-medical-term text-on-surface-variant uppercase mb-xs">
          Allergies
        </Text>
        <View className="flex-row flex-wrap gap-xs">
          {["Penicillin", "Peanuts"].map((a) => (
            <View key={a} className="bg-[#ffefcf] px-sm py-1 rounded-full">
              <Text className="font-inter-medium text-[12px] text-[#8a5a00]">{a}</Text>
            </View>
          ))}
        </View>
      </BentoCard>

      <BentoCard className="mt-sm">
        <Text className="font-inter-medium text-medical-term text-on-surface-variant uppercase mb-xs">
          Current Medications
        </Text>
        {["Metformin 500mg (twice daily)", "Vitamin D3 2000 IU (daily)"].map((m) => (
          <View key={m} className="flex-row items-center gap-xs py-0.5">
            <Icon name="medication" size={16} color={colors.secondary} />
            <Text className="font-inter text-body-sm text-on-surface-variant">{m}</Text>
          </View>
        ))}
      </BentoCard>

      <View className="flex-row items-start gap-xs bg-surface-container-low rounded-xl p-sm mt-sm mb-md">
        <Icon name="emergency" size={16} color={colors.error} />
        <Text className="flex-1 font-inter text-[12px] text-on-surface-variant">
          This profile is shown to doctors during consultations and used to
          personalize AI reference ranges.
        </Text>
      </View>

      <SecondaryButton label="Update Health Details" icon="edit" onPress={() => navigation.navigate("EditProfile")} />
    </Screen>
  );
}
