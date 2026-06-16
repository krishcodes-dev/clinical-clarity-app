import { Platform, ViewStyle } from "react-native";

/**
 * M3-ish elevation levels matching the prototype's soft clinical shadows.
 */
const make = (
  elevation: number,
  opacity: number,
  radiusPx: number,
  offsetY: number
): ViewStyle =>
  Platform.select<ViewStyle>({
    android: { elevation },
    default: {
      shadowColor: "#0d1c2e",
      shadowOpacity: opacity,
      shadowRadius: radiusPx,
      shadowOffset: { width: 0, height: offsetY },
    },
  }) as ViewStyle;

export const shadows = {
  level0: {} as ViewStyle,
  level1: make(1, 0.06, 4, 1),
  level2: make(3, 0.08, 8, 2),
  level3: make(6, 0.12, 16, 4),
} as const;
