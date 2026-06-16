import React from "react";
import { Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CareStackParamList } from "@/app/types";
import { Screen } from "@/ui/Screen";
import { AppHeader } from "@/ui/AppHeader";
import { Icon } from "@/ui/Icon";
import { BentoCard } from "@/ui/BentoCard";
import { mockSpecialties } from "@/features/consultations/mocks";
import { colors } from "@/theme";

type Props = NativeStackScreenProps<CareStackParamList, "SpecialtySelection">;

/** Specialty Selection grid. */
export function SpecialtySelectionScreen({ navigation }: Props) {
  return (
    <Screen contentClassName="px-md pb-lg">
      <AppHeader title="Specialties" />
      <View className="flex-row flex-wrap justify-between">
        {mockSpecialties.map((s, i) => (
          <BentoCard
            key={s.id}
            tone={(["aqua", "sky", "indigo", "mint"] as const)[i % 4]}
            className="w-[48.5%] mb-sm"
            onPress={() => navigation.navigate("DoctorListing", { specialtyId: s.id })}
            accessibilityLabel={`${s.name}, ${s.doctorCount} doctors`}
          >
            <View className="w-11 h-11 rounded-full bg-surface-container-lowest items-center justify-center mb-xs">
              <Icon name={s.icon} size={22} color={colors.primaryContainer} />
            </View>
            <Text className="font-inter-semibold text-body-sm text-on-surface">{s.name}</Text>
            <Text className="font-inter text-[11px] text-on-surface-variant mt-0.5">
              {s.doctorCount} doctors
            </Text>
          </BentoCard>
        ))}
      </View>
    </Screen>
  );
}
