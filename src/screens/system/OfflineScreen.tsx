import React, { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/app/types";
import { Screen } from "@/ui/Screen";
import { Icon } from "@/ui/Icon";
import { PrimaryButton } from "@/ui/PrimaryButton";
import { SecondaryButton } from "@/ui/SecondaryButton";
import { colors } from "@/theme";

type Props = NativeStackScreenProps<RootStackParamList, "Offline">;

/** "Connection Lost" - pulsing signal rings per the prototype. */
export function OfflineScreen({ navigation }: Props) {
  const scale = useSharedValue(1);
  useEffect(() => {
    scale.value = withRepeat(withTiming(1.25, { duration: 1200 }), -1, true);
  }, [scale]);
  const ring = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: 2 - scale.value,
  }));

  return (
    <Screen scroll={false} contentClassName="px-md pb-lg justify-center">
      <View className="items-center">
        <View className="items-center justify-center mb-lg">
          <Animated.View
            style={ring}
            className="absolute w-36 h-36 rounded-full border-2 border-primary-fixed-dim"
          />
          <View className="w-28 h-28 rounded-full bg-surface-container items-center justify-center">
            <Icon name="wifi_off" size={52} color={colors.primaryContainer} />
          </View>
        </View>
        <Text className="font-inter-bold text-headline-lg-mobile text-on-surface text-center">
          No Internet Connection
        </Text>
        <Text className="font-inter text-body-sm text-on-surface-variant text-center mt-xs px-md">
          Your saved records remain available on this device. We'll sync new
          data once you're back online.
        </Text>
      </View>
      <View className="mt-xl gap-sm">
        <PrimaryButton label="Retry Connection" icon="refresh" onPress={() => navigation.goBack()} />
        <SecondaryButton label="View Offline Records" icon="folder" onPress={() => navigation.goBack()} />
      </View>
    </Screen>
  );
}
