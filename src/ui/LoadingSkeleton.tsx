import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

interface SkeletonProps {
  /** Number of card placeholders. */
  count?: number;
  height?: number;
}

/** Pulsing card skeletons for list/dashboard loading states. */
export function LoadingSkeleton({ count = 3, height = 88 }: SkeletonProps) {
  const opacity = useSharedValue(0.45);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 800 }), -1, true);
  }, [opacity]);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <View accessibilityLabel="Loading content" accessible>
      {Array.from({ length: count }).map((_, i) => (
        <Animated.View
          key={i}
          style={[style, { height }]}
          className="bg-surface-container-high rounded-2xl mb-sm"
        />
      ))}
    </View>
  );
}
