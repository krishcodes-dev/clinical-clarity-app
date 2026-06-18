import React, { useEffect, useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "@/app/types";
import { Screen } from "@/ui/Screen";
import { AppHeader } from "@/ui/AppHeader";
import { OTPInput } from "@/ui/OTPInput";
import { PrimaryButton } from "@/ui/PrimaryButton";
import { CommonActions } from "@react-navigation/native";
import { api } from "@/utils/api";
import { useAuthStore } from "@/store/useAuthStore";

type Props = NativeStackScreenProps<AuthStackParamList, "OTPVerification">;

const MAX_ATTEMPTS = 3;

export function OTPVerificationScreen({ navigation, route }: Props) {
  const { phone } = route.params;
  const setSession = useAuthStore((s) => s.setSession);

  const [otp, setOtp] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendIn, setResendIn] = useState(30);

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setInterval(() => setResendIn((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [resendIn]);

  const verify = async () => {
    setLoading(true);
    try {
      const res = await api.verifyOtp(phone, otp);
      const data = await res.json();

      if (!res.ok) {
        // Show a specific message for blocked accounts instead of "wrong OTP"
        if (data?.code === "USER_BLOCKED") {
          Alert.alert("Account Blocked", "This account has been blocked. Please contact support.");
          return;
        }
        const next = attempts + 1;
        setAttempts(next);
        setError(true);
        setOtp("");
        if (next >= MAX_ATTEMPTS) navigation.navigate("AccountLocked");
        return;
      }

      setSession(data.user, data.accessToken, data.refreshToken);

      const rootNav = navigation.getParent();
      if (data.user.isNewUser) {
        rootNav?.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "Onboarding" as never, params: { screen: "Consent" } }],
          })
        );
      } else {
        rootNav?.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "Main" as never, params: {} }],
          })
        );
      }
    } catch {
      Alert.alert("Network Error", "Unable to reach the server. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendIn(30);
    try {
      await api.requestOtp(phone);
    } catch {
      Alert.alert("Network Error", "Could not resend OTP. Check your connection.");
    }
  };

  return (
    <Screen scroll={false} contentClassName="px-0">
      <AppHeader title="Verify Number" />
      <View className="flex-1 px-md pt-lg">
        <Text className="font-inter text-body-lg text-on-surface-variant mb-lg">
          Enter the 6-digit code sent to{" "}
          <Text className="font-inter-semibold text-on-surface">{phone}</Text>
        </Text>

        <OTPInput value={otp} onChange={(v) => { setOtp(v); setError(false); }} error={error} />

        {error ? (
          <Animated.View
            entering={FadeIn.duration(250)}
            className="bg-error-container rounded-xl p-sm mt-md"
            accessibilityLiveRegion="polite"
          >
            <Text className="font-inter-semibold text-body-sm text-on-error-container">
              Incorrect code. {MAX_ATTEMPTS - attempts} attempt
              {MAX_ATTEMPTS - attempts === 1 ? "" : "s"} remaining.
            </Text>
            <Text className="font-inter text-[12px] text-on-error-container mt-0.5">
              Check the latest SMS or request a new code.
            </Text>
          </Animated.View>
        ) : null}

        <PrimaryButton
          label={loading ? "Verifying…" : "Verify & Continue"}
          disabled={otp.length !== 6 || loading}
          onPress={verify}
          className="mt-lg"
        />

        <Pressable
          disabled={resendIn > 0 || loading}
          onPress={handleResend}
          accessibilityRole="button"
          className="mt-md items-center min-h-[48px] justify-center"
        >
          <Text
            className={`font-inter-semibold text-body-sm ${resendIn > 0 ? "text-outline" : "text-secondary"}`}
          >
            {resendIn > 0 ? `Resend code in 0:${String(resendIn).padStart(2, "0")}` : "Resend code"}
          </Text>
        </Pressable>
      </View>
    </Screen>
  );
}
