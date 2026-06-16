import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ProfileStackParamList } from "@/app/types";
import { Screen } from "@/ui/Screen";
import { AppHeader } from "@/ui/AppHeader";
import { Icon } from "@/ui/Icon";
import { PrimaryButton } from "@/ui/PrimaryButton";
import { SecondaryButton } from "@/ui/SecondaryButton";
import { colors } from "@/theme";

type Props = NativeStackScreenProps<ProfileStackParamList, "DeleteAccount">;

const CONSEQUENCES = [
  "All lab reports and uploaded records are permanently erased",
  "Health trends and AI insight history cannot be recovered",
  "Active bookings are cancelled (eligible amounts refunded)",
  "Prescriptions and consultation summaries are deleted",
];

/** Delete Account Confirmation - explicit, friction-by-design. */
export function DeleteAccountScreen({ navigation }: Props) {
  const [acknowledged, setAcknowledged] = useState(false);

  return (
    <Screen contentClassName="px-md pb-lg">
      <AppHeader title="Delete Account" />
      <View className="items-center my-md">
        <View className="w-20 h-20 rounded-full bg-error-container items-center justify-center">
          <Icon name="warning" size={40} color={colors.onErrorContainer} />
        </View>
        <Text className="font-inter-bold text-headline-lg-mobile text-on-surface text-center mt-md">
          This action is permanent
        </Text>
        <Text className="font-inter text-body-sm text-on-surface-variant text-center mt-xs">
          Deleting your account erases your entire health vault after a 30-day
          grace period.
        </Text>
      </View>

      <View className="bg-surface-container-lowest border border-error-container rounded-2xl p-md">
        {CONSEQUENCES.map((c) => (
          <View key={c} className="flex-row items-start gap-xs py-1">
            <Icon name="close" size={16} color={colors.error} />
            <Text className="flex-1 font-inter text-body-sm text-on-surface-variant">{c}</Text>
          </View>
        ))}
      </View>

      <View className="flex-row items-start gap-xs bg-surface-container-low rounded-xl p-sm mt-sm">
        <Icon name="download" size={16} color={colors.secondary} />
        <Text className="flex-1 font-inter text-[12px] text-on-surface-variant">
          Tip: export your full EHR from Privacy & Security before deleting -
          you may need these records for future care.
        </Text>
      </View>

      <Pressable
        onPress={() => setAcknowledged((v) => !v)}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: acknowledged }}
        className="flex-row items-start gap-sm mt-lg min-h-[48px]"
      >
        <Icon
          name={acknowledged ? "check_box" : "check_box_outline_blank"}
          size={24}
          color={acknowledged ? colors.error : colors.outline}
        />
        <Text className="flex-1 font-inter text-body-sm text-on-surface">
          I understand my medical records will be permanently deleted and cannot
          be recovered.
        </Text>
      </Pressable>

      <View className="mt-md gap-sm">
        <PrimaryButton
          label="Delete My Account"
          destructive
          disabled={!acknowledged}
          onPress={() => navigation.popToTop()}
        />
        <SecondaryButton label="Keep My Account" onPress={() => navigation.goBack()} />
      </View>
    </Screen>
  );
}
