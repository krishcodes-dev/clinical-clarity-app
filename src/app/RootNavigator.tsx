import React from "react";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { colors } from "@/theme";
import { RootStackParamList } from "./types";
import { AuthStack, OnboardingStack } from "./stacks";
import { MainTabs } from "./MainTabs";
import { SplashScreen } from "@/screens/auth/SplashScreen";
import { OfflineScreen } from "@/screens/system/OfflineScreen";
import { MaintenanceScreen } from "@/screens/system/MaintenanceScreen";
import { SessionExpiredScreen } from "@/screens/system/SessionExpiredScreen";

const Root = createNativeStackNavigator<RootStackParamList>();

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
          component={MainTabs}
          options={{ gestureEnabled: false }}
        />
        <Root.Screen name="Offline" component={OfflineScreen} />
        <Root.Screen name="Maintenance" component={MaintenanceScreen} />
        <Root.Screen name="SessionExpired" component={SessionExpiredScreen} />
      </Root.Navigator>
    </NavigationContainer>
  );
}
