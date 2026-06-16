import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  getFocusedRouteNameFromRoute,
  RouteProp,
} from "@react-navigation/native";
import { Icon } from "@/ui/Icon";
import { colors, fonts } from "@/theme";
import { MainTabParamList, TAB_BAR_HIDDEN_ROUTES } from "./types";
import {
  BookStack,
  CareStack,
  HomeStack,
  ProfileStack,
  RecordsStack,
} from "./stacks";

const Tab = createBottomTabNavigator<MainTabParamList>();

const TAB_CONFIG: {
  name: keyof MainTabParamList;
  label: string;
  icon: string;
  component: React.ComponentType;
  initial: string;
}[] = [
  { name: "HomeTab", label: "Home", icon: "home", component: HomeStack, initial: "HomeDashboard" },
  { name: "BookTab", label: "Book", icon: "biotech", component: BookStack, initial: "BookLanding" },
  { name: "RecordsTab", label: "Records", icon: "clinical_notes", component: RecordsStack, initial: "EHRDashboard" },
  { name: "CareTab", label: "Consult", icon: "medical_services", component: CareStack, initial: "CareLanding" },
  { name: "ProfileTab", label: "Profile", icon: "person", component: ProfileStack, initial: "UserProfile" },
];

function tabBarVisibility(route: RouteProp<MainTabParamList>, initial: string) {
  const focused = getFocusedRouteNameFromRoute(route) ?? initial;
  return TAB_BAR_HIDDEN_ROUTES.has(focused) ? "none" : "flex";
}

/**
 * Unified 5-tab shell (UX review §3.1): Home · Book · Records · Care · Profile.
 * Tab bar auto-hides inside funnels, payment, calls and full-screen modals.
 */
export function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.onSurfaceVariant,
        tabBarLabelStyle: { fontFamily: fonts.medium, fontSize: 11 },
        tabBarStyle: {
          backgroundColor: colors.surfaceContainerLow,
          borderTopColor: colors.outlineVariant,
          height: 64,
          paddingBottom: 8,
          paddingTop: 6,
        },
      }}
    >
      {TAB_CONFIG.map((t) => (
        <Tab.Screen
          key={t.name}
          name={t.name}
          component={t.component}
          options={({ route }) => ({
            tabBarLabel: t.label,
            tabBarAccessibilityLabel: `${t.label} tab`,
            tabBarIcon: ({ color, size }) => (
              <Icon name={t.icon} size={size} color={color} />
            ),
            tabBarStyle: {
              display: tabBarVisibility(route, t.initial),
              backgroundColor: colors.surfaceContainerLow,
              borderTopColor: colors.outlineVariant,
              height: 64,
              paddingBottom: 8,
              paddingTop: 6,
            },
          })}
        />
      ))}
    </Tab.Navigator>
  );
}
