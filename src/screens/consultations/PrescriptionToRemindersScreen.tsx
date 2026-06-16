import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CareStackParamList } from "@/app/types";
import { Screen } from "@/ui/Screen";
import { AppHeader } from "@/ui/AppHeader";
import { Icon } from "@/ui/Icon";
import { BentoCard } from "@/ui/BentoCard";
import { PrimaryButton } from "@/ui/PrimaryButton";
import { useRemindersStore } from "@/store/useRemindersStore";
import { mockPrescriptions } from "@/features/consultations/mocks";
import { colors } from "@/theme";

type Props = NativeStackScreenProps<CareStackParamList, "PrescriptionToReminders">;

/**
 * NEW SCREEN (UX review §5, P1): prescription → reminder mapping.
 * "We found N medications - set reminders?" - the stated point of
 * feature 5.2 and the bridge between features 4 and 5.
 */
export function PrescriptionToRemindersScreen({ navigation, route }: Props) {
  const rx = mockPrescriptions.find((p) => p.id === route.params.prescriptionId) ?? mockPrescriptions[0];
  const addReminders = useRemindersStore((s) => s.addReminders);
  const [enabled, setEnabled] = useState<Record<string, boolean>>(
    Object.fromEntries(rx.medications.map((m) => [m.name, true]))
  );
  const count = Object.values(enabled).filter(Boolean).length;

  const create = () => {
    const items = rx.medications
      .filter((m) => enabled[m.name])
      .flatMap((m) =>
        m.timing.map((t, i) => ({
          id: `rem-${m.name}-${i}-${Date.now()}`,
          title: `${m.name} ${m.dose}`,
          subtitle: m.withFood ? "Take with food" : "Take on empty stomach",
          type: "medication" as const,
          time: t,
          dateLabel: "Daily",
          status: "upcoming" as const,
          recurring: "Daily",
          fromPrescriptionId: rx.id,
        }))
      );
    addReminders(items);
    navigation.popToTop();
  };

  return (
    <Screen contentClassName="px-md pb-lg">
      <AppHeader title="Set Medication Reminders" />
      <BentoCard tone="primary">
        <View className="flex-row items-center gap-xs mb-1">
          <Icon name="auto_awesome" size={16} color={colors.secondaryFixedDim} />
          <Text className="font-inter-semibold text-[12px] text-secondary-fixed-dim uppercase">
            From Your Prescription
          </Text>
        </View>
        <Text className="font-inter text-body-sm text-primary-fixed">
          We found {rx.medications.length} medications in {rx.doctorName}'s
          prescription. Reminder times are pre-filled from the dosage schedule -
          adjust anything before saving.
        </Text>
      </BentoCard>

      {rx.medications.map((m) => {
        const on = enabled[m.name];
        return (
          <Pressable
            key={m.name}
            onPress={() => setEnabled((e) => ({ ...e, [m.name]: !e[m.name] }))}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: on }}
            accessibilityLabel={`${m.name} ${m.dose}, ${m.timing.length} daily reminders`}
            className={`rounded-2xl border-2 p-md mt-sm ${
              on ? "border-secondary bg-surface-container-lowest" : "border-outline-variant bg-surface-container-low opacity-70"
            }`}
          >
            <View className="flex-row items-center gap-sm">
              <Icon
                name={on ? "check_box" : "check_box_outline_blank"}
                size={24}
                color={on ? colors.secondary : colors.outline}
              />
              <View className="flex-1">
                <Text className="font-inter-semibold text-body-lg text-on-surface">
                  {m.name} {m.dose}
                </Text>
                <Text className="font-inter text-[12px] text-on-surface-variant">
                  {m.durationDays} days · {m.withFood ? "with food" : "empty stomach"}
                </Text>
              </View>
            </View>
            <View className="flex-row gap-xs mt-sm ml-9">
              {m.timing.map((t) => (
                <View key={t} className="flex-row items-center gap-1 bg-surface-container px-sm py-1 rounded-full">
                  <Icon name="schedule" size={13} color={colors.onSurfaceVariant} />
                  <Text className="font-inter-medium text-[12px] text-on-surface">{t}</Text>
                </View>
              ))}
            </View>
          </Pressable>
        );
      })}

      <Text className="font-inter text-[12px] text-on-surface-variant mt-md">
        Reminders run for each medication's full course and stop automatically.
        You can edit or pause them anytime from Home → Reminders.
      </Text>
      <PrimaryButton
        label={`Create ${count > 0 ? count : ""} Reminder${count === 1 ? "" : "s"}`}
        icon="notifications_active"
        disabled={count === 0}
        className="mt-md"
        onPress={create}
      />
    </Screen>
  );
}
