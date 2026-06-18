import React, { useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { CommonActions } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ProfileStackParamList } from "@/app/types";
import { Screen } from "@/ui/Screen";
import { Icon } from "@/ui/Icon";
import { BentoCard } from "@/ui/BentoCard";
import { mockUser } from "@/features/auth/mocks";
import { colors } from "@/theme";
import { authFetch } from "@/utils/api";
import { getRefreshToken } from "@/utils/tokenStore";
import { useAuthStore } from "@/store/useAuthStore";

type Props = NativeStackScreenProps<ProfileStackParamList, "UserProfile">;

const MENU: { icon: string; label: string; sub: string; route: keyof ProfileStackParamList }[] = [
  { icon: "badge", label: "Health Profile", sub: "Vitals, allergies, conditions", route: "HealthProfile" },
  { icon: "notifications", label: "Notifications", sub: "Reminders, reports, insights", route: "NotificationSettings" },
  { icon: "shield_lock", label: "Privacy & Security", sub: "Sharing, permissions, app lock", route: "PrivacySecurity" },
  { icon: "settings", label: "Settings", sub: "Language, units, appearance", route: "Settings" },
  { icon: "help", label: "Help & Support", sub: "FAQs, tickets, live chat", route: "HelpSupport" },
  { icon: "delete_forever", label: "Delete Account", sub: "Permanently remove your data", route: "DeleteAccount" },
];

function navigateToAuth(navigation: Props["navigation"]) {
  // ProfileStack → Tab navigator → Root stack — reset to Auth.
  navigation.getParent()?.getParent()?.dispatch(
    CommonActions.reset({ index: 0, routes: [{ name: "Auth", params: { screen: "Login" } }] })
  );
}

export function UserProfileScreen({ navigation }: Props) {
  const clearSession = useAuthStore((s) => s.clearSession);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      const refreshToken = await getRefreshToken();
      if (refreshToken) {
        await authFetch("/auth/logout", {
          method: "POST",
          body: JSON.stringify({ refreshToken }),
        });
      }
    } catch {
      // Network failure — still clear local session and navigate away.
    } finally {
      clearSession();
      navigateToAuth(navigation);
    }
  };

  const confirmLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Log Out", style: "destructive", onPress: handleLogout },
    ]);
  };

  return (
    <Screen contentClassName="px-md pb-lg">
      <Text className="font-inter-bold text-headline-lg-mobile text-on-surface mt-sm mb-md">
        Profile
      </Text>

      {/* Identity card */}
      <BentoCard tone="primary">
        <View className="flex-row items-center gap-sm">
          <View className="w-16 h-16 rounded-full bg-primary-fixed items-center justify-center">
            <Text className="font-inter-bold text-headline-md text-on-primary-fixed">
              {mockUser.avatarInitials}
            </Text>
          </View>
          <View className="flex-1">
            <Text className="font-inter-bold text-headline-md text-on-primary">{mockUser.name}</Text>
            <Text className="font-inter text-[12px] text-primary-fixed">{mockUser.phone}</Text>
            <Text className="font-inter text-[12px] text-primary-fixed">{mockUser.email}</Text>
          </View>
          <Pressable
            onPress={() => navigation.navigate("EditProfile")}
            accessibilityRole="button"
            accessibilityLabel="Edit profile"
            className="w-11 h-11 rounded-full bg-primary-fixed/20 items-center justify-center"
          >
            <Icon name="edit" size={20} color={colors.primaryFixed} />
          </Pressable>
        </View>
        {/* Profile completion */}
        <View className="mt-md">
          <View className="flex-row justify-between mb-1">
            <Text className="font-inter-medium text-[12px] text-primary-fixed">
              Profile completion
            </Text>
            <Text className="font-inter-bold text-[12px] text-secondary-fixed-dim">
              {mockUser.profileCompletion}%
            </Text>
          </View>
          <View
            className="h-1.5 bg-primary-container rounded-full overflow-hidden"
            accessibilityRole="progressbar"
            accessibilityValue={{ min: 0, max: 100, now: mockUser.profileCompletion }}
          >
            <View
              className="h-full bg-secondary-fixed-dim rounded-full"
              style={{ width: `${mockUser.profileCompletion}%` }}
            />
          </View>
        </View>
      </BentoCard>

      {/* Vitals strip */}
      <View className="flex-row gap-sm mt-sm">
        {[
          { label: "Blood", value: mockUser.bloodGroup ?? "-" },
          { label: "Height", value: `${mockUser.heightCm} cm` },
          { label: "Weight", value: `${mockUser.weightKg} kg` },
        ].map((v) => (
          <BentoCard key={v.label} tone="low" className="flex-1 items-center py-sm">
            <Text className="font-inter-bold text-body-lg text-on-surface">{v.value}</Text>
            <Text className="font-inter text-[11px] text-on-surface-variant">{v.label}</Text>
          </BentoCard>
        ))}
      </View>

      {/* Menu */}
      <View className="mt-md">
        {MENU.map((m) => (
          <Pressable
            key={m.route}
            onPress={() => navigation.navigate(m.route as never)}
            accessibilityRole="button"
            accessibilityLabel={m.label}
            className="flex-row items-center gap-sm bg-surface-container-lowest border border-outline-variant rounded-2xl p-md mb-xs min-h-[64px]"
          >
            <View className="w-11 h-11 rounded-full bg-surface-container items-center justify-center">
              <Icon
                name={m.icon}
                size={22}
                color={m.route === "DeleteAccount" ? colors.error : colors.primaryContainer}
              />
            </View>
            <View className="flex-1">
              <Text
                className={`font-inter-semibold text-body-lg ${m.route === "DeleteAccount" ? "text-error" : "text-on-surface"}`}
              >
                {m.label}
              </Text>
              <Text className="font-inter text-[12px] text-on-surface-variant">{m.sub}</Text>
            </View>
            <Icon name="chevron_right" size={22} color={colors.outline} />
          </Pressable>
        ))}
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Log out"
        disabled={loggingOut}
        className="flex-row items-center justify-center gap-xs mt-md min-h-[48px]"
        onPress={confirmLogout}
      >
        <Icon name="logout" size={18} color={colors.error} />
        <Text className="font-inter-semibold text-body-sm text-error">
          {loggingOut ? "Logging out…" : "Log Out"}
        </Text>
      </Pressable>
      <Text className="font-inter text-[11px] text-outline text-center mt-sm">
        Clinical Clarity v1.0.0
      </Text>
    </Screen>
  );
}
