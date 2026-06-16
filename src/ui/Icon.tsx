import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "@/theme";

/**
 * Maps the prototype's Material Symbols names (snake_case) onto
 * @expo/vector-icons MaterialIcons. Unknown names fall back gracefully.
 */
const REMAP: Record<string, string> = {
  clinical_notes: "description",
  stethoscope: "medical-services",
  dentistry: "medication",
  genetics: "science",
  gastroenterology: "healing",
  skeleton: "accessibility",
  allergies: "coronavirus",
  exercise: "fitness-center",
  battery_low: "battery-alert",
  smoke_free: "smoke-free",
  prescriptions: "receipt-long",
  lab_research: "biotech",
  shield_lock: "verified-user",
  shield_with_heart: "health-and-safety",
  verified_user: "verified-user",
  auto_awesome: "auto-awesome",
  event_available: "event-available",
  home_health: "home",
  self_improvement: "self-improvement",
  vaccines: "vaccines",
  pill: "medication",
  add_location_alt: "add-location-alt",
  radio_button_checked: "radio-button-checked",
  radio_button_unchecked: "radio-button-unchecked",
};

export interface IconProps {
  name: string;
  size?: number;
  color?: string;
  accessibilityLabel?: string;
}

export function Icon({
  name,
  size = 24,
  color = colors.onSurfaceVariant,
  accessibilityLabel,
}: IconProps) {
  const resolved = (REMAP[name] ?? name.replace(/_/g, "-")) as never;
  return (
    <MaterialIcons
      name={resolved}
      size={size}
      color={color}
      accessibilityLabel={accessibilityLabel}
      accessible={!!accessibilityLabel}
    />
  );
}
