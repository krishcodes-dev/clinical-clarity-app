import React from "react";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { colors } from "@/theme";
import { RootStackParamList } from "./types";
import { AuthStack, DoctorStack, OnboardingStack } from "./stacks";
import { MainTabs } from "./MainTabs";
import { SplashScreen } from "@/screens/auth/SplashScreen";
import { OfflineScreen } from "@/screens/system/OfflineScreen";
import { MaintenanceScreen } from "@/screens/system/MaintenanceScreen";
import { SessionExpiredScreen } from "@/screens/system/SessionExpiredScreen";
import { useAuthStore } from "@/store/useAuthStore";

const Root = createNativeStackNavigator<RootStackParamList>();

/**
 * Single role-based switch for authenticated users. Centralized here so
 * login flows (OTP today, Google/Apple/Admin later) never need to know
 * about roles - they all just reset to "Main".
 */
function AuthenticatedShell() {
  const role = useAuthStore((s) => s.user?.role);
  if (role === "doctor") return <DoctorStack />;
  return <MainTabs />;
}

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    primary: colors.primary,
    card: colors.surfaceContainerLow,
    text: colors.onSurface,
    border: colors.outlineVariant,
  },
};

export function RootNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <Root.Navigator screenOptions={{ headerShown: false }}>
        <Root.Screen name="Splash" component={SplashScreen} />
        <Root.Screen name="Auth" component={AuthStack} />
        <Root.Screen name="Onboarding" component={OnboardingStack} />
        <Root.Screen
          name="Main"
          component={AuthenticatedShell}
          options={{ gestureEnabled: false }}
        />
        <Root.Screen name="Offline" component={OfflineScreen} />
        <Root.Screen name="Maintenance" component={MaintenanceScreen} />
        <Root.Screen name="SessionExpired" component={SessionExpiredScreen} />
      </Root.Navigator>
    </NavigationContainer>
  );
}
