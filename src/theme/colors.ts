/**
 * Material 3 color tokens - extracted verbatim from the Clinical Clarity
 * prototype Tailwind config. Single source of truth for non-className usage
 * (SVG charts, navigation theming, native props). Keep in sync with
 * tailwind.config.js.
 */
export const colors = {
  primary: "#002045",
  onPrimary: "#ffffff",
  primaryContainer: "#1a365d",
  onPrimaryContainer: "#86a0cd",
  primaryFixed: "#d6e3ff",
  primaryFixedDim: "#adc7f7",
  onPrimaryFixed: "#001b3c",
  onPrimaryFixedVariant: "#2d476f",
  inversePrimary: "#adc7f7",

  secondary: "#006a68",
  onSecondary: "#ffffff",
  secondaryContainer: "#91f0ed",
  onSecondaryContainer: "#006e6d",
  secondaryFixed: "#94f2f0",
  secondaryFixedDim: "#77d6d3",
  onSecondaryFixed: "#00201f",
  onSecondaryFixedVariant: "#00504e",

  tertiary: "#1b2127",
  onTertiary: "#ffffff",
  tertiaryContainer: "#30363c",
  onTertiaryContainer: "#989fa6",
  tertiaryFixed: "#dde3eb",
  tertiaryFixedDim: "#c1c7cf",

  error: "#ba1a1a",
  onError: "#ffffff",
  errorContainer: "#ffdad6",
  onErrorContainer: "#93000a",

  background: "#f8f9ff",
  onBackground: "#0d1c2e",
  surface: "#f8f9ff",
  onSurface: "#0d1c2e",
  surfaceVariant: "#d4e4fc",
  onSurfaceVariant: "#43474e",
  surfaceDim: "#ccdbf4",
  surfaceBright: "#f8f9ff",
  surfaceContainerLowest: "#ffffff",
  surfaceContainerLow: "#eff4ff",
  surfaceContainer: "#e5eeff",
  surfaceContainerHigh: "#dce9ff",
  surfaceContainerHighest: "#d4e4fc",
  inverseSurface: "#223144",
  inverseOnSurface: "#eaf1ff",
  surfaceTint: "#455f88",
  outline: "#74777f",
  outlineVariant: "#c4c6cf",

  /** Semantic aliases used by healthcare components (non-M3, derived) */
  success: "#1b873f",
  successContainer: "#dcf5e3",
  onSuccessContainer: "#0b5226",
  warning: "#8a5a00",
  warningContainer: "#ffefcf",

  /** Dopamine accents - brand-logo family (cyan / aqua / indigo blues) */
  accent: "#0b8fc9",
  onAccent: "#ffffff",
  accentBright: "#35c2f0",
  accentContainer: "#d6f1fb",
  onAccentContainer: "#00455e",
  tintSky: "#def1fc",
  tintAqua: "#d8f5f7",
  tintMint: "#def5ec",
  tintIndigo: "#e4e8fb",
  tintIce: "#eaf6ff",
} as const;

export type AppColor = keyof typeof colors;
