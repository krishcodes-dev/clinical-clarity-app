import React, { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/app/types";
import { Icon } from "@/ui/Icon";
import { colors } from "@/theme";
import { BRAND } from "@/constants/copy";
import { useAuthStore } from "@/store/useAuthStore";

type Props = NativeStackScreenProps<RootStackParamList, "Splash">;

export function SplashScreen({ navigation }: Props) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    const t = setTimeout(() => {
      if (isAuthenticated) {
        navigation.replace("Main", {} as any);
      } else {
        navigation.replace("Auth", { screen: "Login" });
      }
    }, 1800);
    return () => clearTimeout(t);
  }, [navigation, isAuthenticated]);

  return (
    <View className="flex-1 bg-primary items-center justify-center">
      <Animated.View entering={FadeIn.duration(600)} className="items-center">
        <View className="w-20 h-20 rounded-3xl bg-secondary-container items-center justify-center mb-md">
          <Icon name="health_and_safety" size={44} color={colors.onSecondaryContainer} />
        </View>
        <Text className="font-inter-extrabold text-headline-lg text-on-primary">
          {BRAND}
        </Text>
      </Animated.View>
      <Animated.Text
        entering={FadeInUp.delay(400).duration(600)}
        className="font-inter text-body-sm text-primary-fixed-dim absolute bottom-16"
      >
        Your health, clearly explained.
      </Animated.Text>
    </View>
  );
}
