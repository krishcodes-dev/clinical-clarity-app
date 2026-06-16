import React from "react";
import { Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HomeStackParamList } from "@/app/types";
import { Screen } from "@/ui/Screen";
import { AppHeader } from "@/ui/AppHeader";
import { Icon } from "@/ui/Icon";
import { PrimaryButton } from "@/ui/PrimaryButton";
import { SecondaryButton } from "@/ui/SecondaryButton";
import { useRemindersStore } from "@/store/useRemindersStore";
import { colors } from "@/theme";

type Props = NativeStackScreenProps<HomeStackParamList, "MissedReminder">;

/** Missed-reminder escalation (prototype's "Missed Reminder - Critical"). */
export function MissedReminderScreen({ navigation, route }: Props) {
  const reminder = useRemindersStore((s) =>
    s.reminders.find((r) => r.id === route.params.reminderId)
  );
  const setReminderStatus = useRemindersStore((s) => s.setReminderStatus);
  if (!reminder) return null;

  return (
    <Screen scroll={false} contentClassName="px-md pb-lg justify-center">
      <View className="items-center mb-lg">
        <View className="w-24 h-24 rounded-full bg-error-container items-center justify-center mb-md">
          <Icon name="notification_important" size={44} color={colors.onErrorContainer} />
        </View>
        <Text className="font-inter-semibold text-[12px] text-error uppercase">
          Missed Reminder
        </Text>
        <Text className="font-inter-bold text-headline-lg-mobile text-on-surface text-center mt-1">
          {reminder.title}
        </Text>
        <Text className="font-inter text-body-sm text-on-surface-variant text-center mt-xs">
          Scheduled for {reminder.dateLabel}, {reminder.time}
          {reminder.subtitle ? ` · ${reminder.subtitle}` : ""}.
        </Text>
        {reminder.type === "medication" ? (
          <View className="bg-surface-container-low rounded-xl p-sm mt-md">
            <Text className="font-inter text-[12px] text-on-surface-variant text-center">
              If you're unsure whether to take a missed dose, check your
              prescription notes or ask your doctor. Do not double up.
            </Text>
          </View>
        ) : null}
      </View>

      <View className="gap-sm">
        <PrimaryButton
          label="Mark as Taken"
          icon="check"
          onPress={() => {
            setReminderStatus(reminder.id, "done");
            navigation.goBack();
          }}
        />
        <SecondaryButton label="Snooze 30 minutes" icon="snooze" onPress={() => navigation.goBack()} />
        <SecondaryButton
          label="Skip this time"
          onPress={() => {
            setReminderStatus(reminder.id, "missed");
            navigation.goBack();
          }}
        />
      </View>
    </Screen>
  );
}
