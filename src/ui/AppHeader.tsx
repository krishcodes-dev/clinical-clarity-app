import React from "react";
import { Pressable, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Icon } from "./Icon";
import { colors } from "@/theme";

interface AppHeaderProps {
  title?: string;
  /** Show back arrow (default true when title given). */
  back?: boolean;
  /** Right-side action icons. */
  actions?: { icon: string; onPress?: () => void; label: string; badge?: number }[];
  /** Center brand wordmark instead of plain title. */
  brand?: boolean;
}

/** Top app bar - matches the prototype's TopAppBar pattern. */
export function AppHeader({ title, back = true, actions = [], brand }: AppHeaderProps) {
  const navigation = useNavigation();
  return (
    <View className="flex-row items-center justify-between px-md py-sm bg-background">
      <View className="flex-row items-center gap-sm flex-1">
        {back && navigation.canGoBack() && (
          <Pressable
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={12}
            className="w-12 h-12 items-center justify-center -ml-2"
          >
            <Icon name="arrow_back" color={colors.onSurface} />
          </Pressable>
        )}
        {brand ? (
          <View className="flex-row items-center gap-xs">
            <Icon name="health_and_safety" size={22} color={colors.secondary} />
            <Text className="font-inter-bold text-body-lg text-primary">
              Clinical Clarity
            </Text>
          </View>
        ) : (
          <Text
            numberOfLines={1}
            className="font-inter-semibold text-headline-md text-on-surface flex-1"
            accessibilityRole="header"
          >
            {title}
          </Text>
        )}
      </View>
      <View className="flex-row items-center">
        {actions.map((a) => (
          <Pressable
            key={a.icon}
            onPress={a.onPress}
            accessibilityRole="button"
            accessibilityLabel={a.label}
            hitSlop={8}
            className="w-12 h-12 items-center justify-center"
          >
            <Icon name={a.icon} color={colors.onSurface} />
            {!!a.badge && (
              <View className="absolute top-1.5 right-1.5 bg-error rounded-full min-w-[16px] h-4 items-center justify-center px-0.5">
                <Text className="text-on-error text-[10px] font-inter-bold">
                  {a.badge}
                </Text>
              </View>
            )}
          </Pressable>
        ))}
      </View>
    </View>
  );
}
