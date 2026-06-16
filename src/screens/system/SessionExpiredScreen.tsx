import React from "react";
import { Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/app/types";
import { Screen } from "@/ui/Screen";
import { Icon } from "@/ui/Icon";
import { PrimaryButton } from "@/ui/PrimaryButton";
import { colors } from "@/theme";

type Props = NativeStackScreenProps<RootStackParamList, "SessionExpired">;

/** Session timeout - security-first messaging, re-auth CTA. */
export function SessionExpiredScreen({ navigation }: Props) {
  return (
    <Screen scroll={false} contentClassName="px-md pb-lg justify-center">
      <View className="items-center mb-xl">
        <View className="w-28 h-28 rounded-full bg-surface-container items-center justify-center mb-lg">
          <Icon name="schedule" size={52} color={colors.primaryContainer} />
        </View>
        <Text className="font-inter-bold text-headline-lg-mobile text-on-surface text-center">
          Session Expired
        </Text>
        <Text className="font-inter text-body-sm text-on-surface-variant text-center mt-xs px-md">
          For your security, we signed you out after a period of inactivity.
          Your health records remain protected.
        </Text>
      </View>
      <PrimaryButton
        label="Sign In Again"
        icon="login"
        onPress={() => navigation.replace("Auth", { screen: "Login" })}
      />
      <View className="flex-row items-center justify-center gap-1 mt-md">
        <Icon name="verified_user" size={14} color={colors.secondary} />
        <Text className="font-inter text-[12px] text-on-surface-variant">
          Automatic sign-out protects sensitive medical data.
        </Text>
      </View>
    </Screen>
  );
}
