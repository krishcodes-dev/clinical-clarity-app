import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ProfileStackParamList } from "@/app/types";
import { Screen } from "@/ui/Screen";
import { AppHeader } from "@/ui/AppHeader";
import { Icon } from "@/ui/Icon";
import { PrimaryButton } from "@/ui/PrimaryButton";
import { ToggleRow } from "@/ui/ToggleRow";
import { useAuthStore } from "@/store/useAuthStore";
import { colors } from "@/theme";

type Props = NativeStackScreenProps<ProfileStackParamList, "AppLockSetup">;

/**
 * NEW SCREEN (UX review §5, P2): PIN/biometric app lock - an EHR app on a
 * shared or lost phone needs a local lock. UI-only mock.
 */
export function AppLockSetupScreen({ navigation }: Props) {
  const setAppLock = useAuthStore((s) => s.setAppLock);
  const appLockEnabled = useAuthStore((s) => s.appLockEnabled);
  const [pin, setPin] = useState("");
  const [biometric, setBiometric] = useState(true);

  const press = (d: string) => {
    if (d === "del") setPin((p) => p.slice(0, -1));
    else if (pin.length < 4) setPin((p) => p + d);
  };

  return (
    <Screen scroll={false} contentClassName="px-0">
      <AppHeader title="App Lock" />
      <View className="flex-1 px-md items-center pt-md">
        <View className="w-16 h-16 rounded-full bg-primary-fixed items-center justify-center mb-sm">
          <Icon name="fingerprint" size={32} color={colors.onPrimaryFixed} />
        </View>
        <Text className="font-inter-semibold text-body-lg text-on-surface">
          {appLockEnabled ? "Change your 4-digit PIN" : "Set a 4-digit PIN"}
        </Text>
        <Text className="font-inter text-[12px] text-on-surface-variant mt-1 mb-md">
          Required to open your health vault
        </Text>

        {/* PIN dots */}
        <View className="flex-row gap-sm mb-lg" accessible accessibilityLabel={`${pin.length} of 4 digits entered`}>
          {[0, 1, 2, 3].map((i) => (
            <View
              key={i}
              className={`w-4 h-4 rounded-full ${i < pin.length ? "bg-primary" : "bg-surface-container-high"}`}
            />
          ))}
        </View>

        {/* Keypad */}
        <View className="flex-row flex-wrap justify-center" style={{ width: 264 }}>
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"].map((d, i) => (
            <Pressable
              key={i}
              disabled={d === ""}
              onPress={() => press(d)}
              accessibilityRole="button"
              accessibilityLabel={d === "del" ? "Delete digit" : d}
              className={`w-20 h-16 m-1 rounded-2xl items-center justify-center ${
                d === "" ? "" : "bg-surface-container-low active:bg-surface-container-high"
              }`}
            >
              {d === "del" ? (
                <Icon name="backspace" size={22} color={colors.onSurfaceVariant} />
              ) : (
                <Text className="font-inter-semibold text-headline-md text-on-surface">{d}</Text>
              )}
            </Pressable>
          ))}
        </View>

        <View className="self-stretch mt-md">
          <ToggleRow
            icon="fingerprint"
            title="Unlock with biometrics"
            subtitle="Face ID / fingerprint when available"
            value={biometric}
            onValueChange={setBiometric}
          />
        </View>
      </View>
      <View className="px-md pb-md">
        <PrimaryButton
          label="Enable App Lock"
          icon="lock"
          disabled={pin.length !== 4}
          onPress={() => {
            setAppLock(true, pin);
            navigation.goBack();
          }}
        />
      </View>
    </Screen>
  );
}
