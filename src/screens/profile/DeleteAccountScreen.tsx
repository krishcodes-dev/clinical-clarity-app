import React, { useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { CommonActions } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ProfileStackParamList } from "@/app/types";
import { Screen } from "@/ui/Screen";
import { AppHeader } from "@/ui/AppHeader";
import { Icon } from "@/ui/Icon";
import { PrimaryButton } from "@/ui/PrimaryButton";
import { SecondaryButton } from "@/ui/SecondaryButton";
import { colors } from "@/theme";
import { authFetch } from "@/utils/api";
import { useAuthStore } from "@/store/useAuthStore";

type Props = NativeStackScreenProps<ProfileStackParamList, "DeleteAccount">;

const CONSEQUENCES = [
  "All lab reports and uploaded records are permanently erased",
  "Health trends and AI insight history cannot be recovered",
  "Active bookings are cancelled (eligible amounts refunded)",
  "Prescriptions and consultation summaries are deleted",
];

export function DeleteAccountScreen({ navigation }: Props) {
  const clearSession = useAuthStore((s) => s.clearSession);
  const [acknowledged, setAcknowledged] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await authFetch("/users/me", { method: "DELETE" });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        Alert.alert("Error", body.message ?? "Could not delete account. Please try again.");
        return;
      }

      clearSession();

      // ProfileStack → Tab navigator → Root stack — reset to Auth.
      navigation.getParent()?.getParent()?.dispatch(
        CommonActions.reset({ index: 0, routes: [{ name: "Auth", params: { screen: "Login" } }] })
      );
    } catch {
      Alert.alert("Network Error", "Unable to reach the server. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      "Delete Account",
      "This is permanent. Your data will be erased after 30 days and cannot be recovered.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: handleDelete },
      ]
    );
  };

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
          Tip: export your full EHR from Privacy & Security before deleting —
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
          label={loading ? "Deleting…" : "Delete My Account"}
          destructive
          disabled={!acknowledged || loading}
          onPress={confirmDelete}
        />
        <SecondaryButton label="Keep My Account" onPress={() => navigation.goBack()} />
      </View>
    </Screen>
  );
}
