import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RecordsStackParamList } from "@/app/types";
import { Screen } from "@/ui/Screen";
import { AppHeader } from "@/ui/AppHeader";
import { Icon } from "@/ui/Icon";
import { PrimaryButton } from "@/ui/PrimaryButton";
import { TrustFooter } from "@/ui/TrustFooter";
import { mockRecords } from "@/features/records/mocks";
import { colors } from "@/theme";

type Props = NativeStackScreenProps<RecordsStackParamList, "ShareRecords">;

const DURATIONS = ["24 hours", "7 days", "30 days"];

/** Share Records - time-boxed, revocable access (prototype + Privacy link). */
export function ShareRecordsScreen({ navigation }: Props) {
  const [selected, setSelected] = useState<string[]>([mockRecords[0].id]);
  const [duration, setDuration] = useState("7 days");
  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  return (
    <Screen contentClassName="px-md pb-lg">
      <AppHeader title="Share Records" />
      <Text className="font-inter text-body-sm text-on-surface-variant mb-md">
        Create a secure, time-limited link for your doctor. You can revoke
        access anytime from Privacy & Security.
      </Text>

      <Text className="font-inter-semibold text-body-sm text-on-surface mb-xs">
        Select records ({selected.length})
      </Text>
      {mockRecords.map((r) => {
        const on = selected.includes(r.id);
        return (
          <Pressable
            key={r.id}
            onPress={() => toggle(r.id)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: on }}
            accessibilityLabel={`${r.title}, ${r.date}`}
            className={`flex-row items-center gap-sm rounded-xl border p-sm mb-xs min-h-[56px] ${
              on ? "border-secondary bg-secondary-container/40" : "border-outline-variant bg-surface-container-lowest"
            }`}
          >
            <Icon
              name={on ? "check_box" : "check_box_outline_blank"}
              size={22}
              color={on ? colors.secondary : colors.outline}
            />
            <View className="flex-1">
              <Text className="font-inter-medium text-body-sm text-on-surface">{r.title}</Text>
              <Text className="font-inter text-[11px] text-on-surface-variant">{r.date}</Text>
            </View>
          </Pressable>
        );
      })}

      <Text className="font-inter-semibold text-body-sm text-on-surface mt-md mb-xs">
        Link expires after
      </Text>
      <View className="flex-row gap-xs mb-lg">
        {DURATIONS.map((d) => (
          <Pressable
            key={d}
            onPress={() => setDuration(d)}
            accessibilityRole="radio"
            accessibilityState={{ selected: duration === d }}
            className={`px-md py-xs rounded-full border min-h-[44px] justify-center ${
              duration === d ? "border-primary bg-primary-fixed" : "border-outline-variant bg-surface-container-lowest"
            }`}
          >
            <Text
              className={`font-inter-medium text-[12px] ${
                duration === d ? "text-on-primary-fixed" : "text-on-surface"
              }`}
            >
              {d}
            </Text>
          </Pressable>
        ))}
      </View>

      <PrimaryButton
        label="Generate Secure Link"
        icon="link"
        disabled={selected.length === 0}
        onPress={() => navigation.goBack()}
      />
      <TrustFooter variant="data" />
    </Screen>
  );
}
