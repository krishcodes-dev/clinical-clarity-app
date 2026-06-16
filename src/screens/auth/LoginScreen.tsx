import React from "react";
import { Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "@/app/types";
import { Screen } from "@/ui/Screen";
import { Icon } from "@/ui/Icon";
import { PrimaryButton } from "@/ui/PrimaryButton";
import { TrustFooter } from "@/ui/TrustFooter";
import { colors } from "@/theme";
import { BRAND } from "@/constants/copy";

type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

/** Secure login entry - phone-first per the prototype's Login Flow. */
export function LoginScreen({ navigation }: Props) {
  return (
    <Screen scroll={false} contentClassName="px-md pb-lg justify-between">
      <View className="items-center mt-xl">
        <View className="w-16 h-16 rounded-2xl bg-primary items-center justify-center mb-md">
          <Icon name="health_and_safety" size={36} color={colors.onPrimary} />
        </View>
        <Text className="font-inter-bold text-headline-lg-mobile text-on-surface">
          Welcome to {BRAND}
        </Text>
        <Text className="font-inter text-body-sm text-on-surface-variant text-center mt-xs px-lg">
          Book tests, understand reports, and keep your lifelong health record in
          one secure place.
        </Text>
      </View>

      <Animated.View entering={FadeInDown.duration(400)} className="gap-sm">
        <View className="bg-surface-container-low rounded-2xl p-md">
          <View className="flex-row items-center gap-sm mb-sm">
            <Icon name="lock" size={18} color={colors.secondary} />
            <Text className="font-inter-medium text-body-sm text-on-surface-variant flex-1">
              Sign in with your mobile number to receive a one-time code.
            </Text>
          </View>
          <PrimaryButton
            label="Continue with Mobile Number"
            icon="smartphone"
            onPress={() => navigation.navigate("MobileNumber")}
          />
        </View>
        <TrustFooter variant="data" />
      </Animated.View>
    </Screen>
  );
}
