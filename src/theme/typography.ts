import { TextStyle } from "react-native";

/**
 * Inter type scale - extracted from the prototype's fontSize tokens.
 * Use via <Text style={typography.headlineMd}> when className is unsuitable.
 * Class-name equivalents live in tailwind.config.js (text-headline-md etc.).
 */
const inter = {
  regular: "Inter_400Regular",
  medium: "Inter_500Medium",
  semibold: "Inter_600SemiBold",
  bold: "Inter_700Bold",
  extrabold: "Inter_800ExtraBold",
} as const;

export const fonts = inter;

export const typography: Record<string, TextStyle> = {
  headlineLg: {
    fontFamily: inter.bold,
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -0.64,
  },
  headlineLgMobile: {
    fontFamily: inter.bold,
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: -0.24,
  },
  headlineMd: {
    fontFamily: inter.semibold,
    fontSize: 20,
    lineHeight: 28,
  },
  bodyLg: {
    fontFamily: inter.regular,
    fontSize: 16,
    lineHeight: 24,
  },
  bodySm: {
    fontFamily: inter.regular,
    fontSize: 14,
    lineHeight: 20,
  },
  labelBold: {
    fontFamily: inter.semibold,
    fontSize: 14,
    lineHeight: 16,
    letterSpacing: 0.14,
  },
  medicalTerm: {
    fontFamily: inter.medium,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  priceDisplay: {
    fontFamily: inter.bold,
    fontSize: 24,
    lineHeight: 24,
  },
};
