import React from "react";
import { Pressable, View, ViewProps } from "react-native";
import { shadows } from "@/theme";

interface BentoCardProps extends ViewProps {
  onPress?: () => void;
  /** Surface tone matching the prototype's bento layers (+ dopamine tints). */
  tone?:
    | "lowest"
    | "low"
    | "container"
    | "high"
    | "primary"
    | "secondary"
    | "accent"
    | "sky"
    | "aqua"
    | "mint"
    | "indigo"
    | "ice";
  className?: string;
  accessibilityLabel?: string;
  children: React.ReactNode;
}

const TONES = {
  lowest: "bg-surface-container-lowest border border-outline-variant",
  low: "bg-surface-container-low",
  container: "bg-surface-container",
  high: "bg-surface-container-high",
  primary: "bg-primary-container",
  secondary: "bg-secondary-container",
  /* Dopamine layer - brand-logo blues for lively tiles & promo surfaces */
  accent: "bg-accent",
  sky: "bg-tint-sky",
  aqua: "bg-tint-aqua",
  mint: "bg-tint-mint",
  indigo: "bg-tint-indigo",
  ice: "bg-tint-ice",
} as const;

/** Generic bento-style surface card - the prototype's core layout unit. */
export function BentoCard({
  onPress,
  tone = "lowest",
  className = "",
  accessibilityLabel,
  children,
  ...rest
}: BentoCardProps) {
  const base = `rounded-2xl p-md ${TONES[tone]} ${className}`;
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        style={shadows.level1}
        className={`${base} active:opacity-90`}
      >
        {children}
      </Pressable>
    );
  }
  return (
    <View style={shadows.level1} className={base} {...rest}>
      {children}
    </View>
  );
}
