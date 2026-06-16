import React from "react";
import { Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HomeStackParamList } from "@/app/types";
import { Screen } from "@/ui/Screen";
import { AppHeader } from "@/ui/AppHeader";
import { Icon } from "@/ui/Icon";
import { BentoCard } from "@/ui/BentoCard";
import { PrimaryButton } from "@/ui/PrimaryButton";
import { SecondaryButton } from "@/ui/SecondaryButton";
import { useRemindersStore } from "@/store/useRemindersStore";
import { colors } from "@/theme";

type Props = NativeStackScreenProps<HomeStackParamList, "ReminderDetails">;

export function ReminderDetailsScreen({ navigation, route }: Props) {
  const reminder = useRemindersStore((s) =>
    s.reminders.find((r) => r.id === route.params.reminderId)
  );
  const setReminderStatus = useRemindersStore((s) => s.setReminderStatus);

  if (!reminder) return null;

  return (
    <Screen contentClassName="px-md pb-lg">
      <AppHeader title="Reminder Details" />
      <BentoCard tone="low" className="items-center py-lg">
        <View className="w-16 h-16 rounded-full bg-primary-fixed items-center justify-center mb-sm">
          <Icon name="notifications_active" size={32} color={colors.onPrimaryFixed} />
        </View>
        <Text className="font-inter-bold text-headline-md text-on-surface text-center">
          {reminder.title}
        </Text>
        {reminder.subtitle ? (
          <Text className="font-inter text-body-sm text-on-surface-variant mt-1">
            {reminder.subtitle}
          </Text>
        ) : null}
      </BentoCard>

      <View className="flex-row gap-sm mt-sm">
        <BentoCard tone="lowest" className="flex-1 items-center">
          <Text className="font-inter-medium text-medical-term text-on-surface-variant uppercase">Time</Text>
          <Text className="font-inter-bold text-body-lg text-on-surface mt-1">{reminder.time}</Text>
        </BentoCard>
        <BentoCard tone="lowest" className="flex-1 items-center">
          <Text className="font-inter-medium text-medical-term text-on-surface-variant uppercase">Repeats</Text>
          <Text className="font-inter-bold text-body-lg text-on-surface mt-1">
            {reminder.recurring ?? "Once"}
          </Text>
        </BentoCard>
      </View>

      {reminder.fromPrescriptionId ? (
        <BentoCard tone="lowest" className="mt-sm">
          <View className="flex-row items-center gap-xs">
            <Icon name="prescriptions" size={18} color={colors.secondary} />
            <Text className="flex-1 font-inter text-body-sm text-on-surface-variant">
              Created from your prescription by Dr. Anil Kulkarni (May 20, 2025).
            </Text>
          </View>
        </BentoCard>
      ) : null}

      <View className="mt-lg gap-sm">
        <PrimaryButton
          label="Mark as Done"
          icon="check"
          onPress={() => {
            setReminderStatus(reminder.id, "done");
            navigation.goBack();
          }}
        />
        <SecondaryButton label="Snooze 30 minutes" icon="snooze" onPress={() => navigation.goBack()} />
        <SecondaryButton
          label="Edit Reminder"
          icon="edit"
          onPress={() =>
            navigation.navigate("CreateReminder", {
              prefillTitle: reminder.title,
              prefillTime: reminder.time,
            })
          }
        />
      </View>
    </Screen>
  );
}
