import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "@/app/types";
import { Screen } from "@/ui/Screen";
import { Icon } from "@/ui/Icon";
import { PrimaryButton } from "@/ui/PrimaryButton";
import { SecondaryButton } from "@/ui/SecondaryButton";
import { colors } from "@/theme";

type Props = NativeStackScreenProps<AuthStackParamList, "AccountLocked">;

const LOCK_SECONDS = 5 * 60;

/** "Too Many OTP Attempts" - transactional state, nav shell suppressed. */
export function AccountLockedScreen({ navigation }: Props) {
  const [remaining, setRemaining] = useState(LOCK_SECONDS);

  useEffect(() => {
    const t = setInterval(() => setRemaining((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  const mm = Math.floor(remaining / 60);
  const ss = String(remaining % 60).padStart(2, "0");

  return (
    <Screen scroll={false} contentClassName="px-md pb-lg justify-center">
      <View className="items-center">
        <View className="w-28 h-28 rounded-full bg-error-container items-center justify-center mb-lg">
          <Icon name="lock_clock" size={52} color={colors.onErrorContainer} />
        </View>
        <Text className="font-inter-bold text-headline-lg-mobile text-on-surface text-center">
          Account Temporarily Locked
        </Text>
        <Text className="font-inter text-body-sm text-on-surface-variant text-center mt-xs px-md">
          Too many incorrect attempts. For the security of your health records,
          please wait before trying again.
        </Text>
        <View
          className="bg-surface-container rounded-2xl px-lg py-sm mt-lg"
          accessibilityLiveRegion="polite"
          accessibilityLabel={`Retry available in ${mm} minutes ${ss} seconds`}
        >
          <Text className="font-inter-bold text-headline-lg text-primary text-center">
            {mm}:{ss}
          </Text>
          <Text className="font-inter text-[12px] text-on-surface-variant text-center">
            until you can retry
          </Text>
        </View>
      </View>

      <View className="mt-xl gap-sm">
        <PrimaryButton
          label="Retry Verification"
          disabled={remaining > 0}
          onPress={() => navigation.goBack()}
        />
        <SecondaryButton label="Contact Support" icon="support_agent" onPress={() => {}} />
        <View className="flex-row items-center justify-center gap-1 mt-xs">
          <Icon name="verified_user" size={14} color={colors.secondary} />
          <Text className="font-inter text-[12px] text-on-surface-variant">
            This lockout protects your medical data.
          </Text>
        </View>
      </View>
    </Screen>
  );
}
