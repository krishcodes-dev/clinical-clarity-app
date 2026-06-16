import React, { useState } from "react";
import { Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BookStackParamList } from "@/app/types";
import { Screen } from "@/ui/Screen";
import { AppHeader } from "@/ui/AppHeader";
import { FunnelStepper } from "@/ui/FunnelStepper";
import { Icon } from "@/ui/Icon";
import { RadioCard } from "@/ui/RadioCard";
import { PrimaryButton } from "@/ui/PrimaryButton";
import { useBookingStore } from "@/store/useBookingStore";
import { mockLabs } from "@/features/booking/mocks";
import { colors } from "@/theme";

type Props = NativeStackScreenProps<BookStackParamList, "SelectLab">;

/** Select Lab - accreditation surfaced as a trust signal. */
export function SelectLabScreen({ navigation }: Props) {
  const updateBookingDraft = useBookingStore((s) => s.updateBookingDraft);
  const [labId, setLabId] = useState(mockLabs[0].id);

  return (
    <Screen scroll={false} contentClassName="px-0">
      <AppHeader title="Select Lab" />
      <FunnelStepper current={1} />
      <View className="flex-1 px-md pt-sm">
        <Text className="font-inter text-body-sm text-on-surface-variant mb-md">
          All partner labs are accredited and quality-audited.
        </Text>
        {mockLabs.map((lab) => (
          <RadioCard
            key={lab.id}
            icon="domain"
            title={lab.name}
            subtitle={`${lab.distanceKm} km away · ${lab.accreditation}`}
            selected={labId === lab.id}
            onPress={() => setLabId(lab.id)}
            trailing={
              <View className="items-end mr-xs">
                <View className="flex-row items-center gap-0.5">
                  <Icon name="star" size={14} color="#eab308" />
                  <Text className="font-inter-semibold text-[12px] text-on-surface">
                    {lab.rating}
                  </Text>
                </View>
                <Text className="font-inter text-[11px] text-on-surface-variant">
                  {lab.nextAvailable}
                </Text>
              </View>
            }
          />
        ))}
      </View>
      <View className="px-md pb-md">
        <PrimaryButton
          label="Continue to Scheduling"
          onPress={() => {
            updateBookingDraft({ labId });
            navigation.navigate("SelectSlot");
          }}
        />
      </View>
    </Screen>
  );
}
