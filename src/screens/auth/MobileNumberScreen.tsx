import React, { useState } from "react";
import { Alert, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "@/app/types";
import { Screen } from "@/ui/Screen";
import { AppHeader } from "@/ui/AppHeader";
import { TextField } from "@/ui/TextField";
import { PrimaryButton } from "@/ui/PrimaryButton";
import { api } from "@/utils/api";

type Props = NativeStackScreenProps<AuthStackParamList, "MobileNumber">;

export function MobileNumberScreen({ navigation }: Props) {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const valid = phone.replace(/\D/g, "").length >= 10;

  const handleSend = async () => {
    setLoading(true);
    try {
      const res = await api.requestOtp(phone);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        Alert.alert("Error", body.message ?? "Could not send OTP. Please try again.");
        return;
      }
      navigation.navigate("OTPVerification", { phone });
    } catch {
      Alert.alert("Network Error", "Unable to reach the server. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen scroll={false} contentClassName="px-0">
      <AppHeader title="Enter Mobile Number" />
      <View className="flex-1 px-md pt-lg">
        <Text className="font-inter text-body-lg text-on-surface-variant mb-lg">
          We will send a 6-digit OTP via SMS to confirm it's you.
        </Text>
        <TextField
          label="Mobile number"
          placeholder="+91 98XXX XXXXX"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
          autoFocus
        />
        <PrimaryButton
          label={loading ? "Sending…" : "Send Verification Code"}
          disabled={!valid || loading}
          onPress={handleSend}
        />
        <Text className="font-inter text-[12px] text-on-surface-variant text-center mt-md">
          By continuing you agree to our Terms of Service and Privacy Policy.
        </Text>
      </View>
    </Screen>
  );
}
