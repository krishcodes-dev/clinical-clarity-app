import React from "react";
import { Text, View } from "react-native";
import { Icon } from "./Icon";
import { colors } from "@/theme";
import { MarkerStatus, RecordSource } from "@/features/records/types";

/** Provenance badge - every data point declares its source (UX review §7.1). */
export function SourceBadge({ source }: { source: RecordSource }) {
  const cfg =
    source === "lab_delivered"
      ? { icon: "verified", label: "Lab Verified", cls: "bg-secondary-container", txt: "text-on-secondary-container" }
      : source === "user_uploaded"
      ? { icon: "upload_file", label: "Self-Uploaded", cls: "bg-surface-container-high", txt: "text-on-surface-variant" }
      : { icon: "auto_awesome", label: "AI-Extracted", cls: "bg-primary-fixed", txt: "text-on-primary-fixed" };
  return (
    <View
      className={`flex-row items-center gap-1 px-xs py-1 rounded-full ${cfg.cls}`}
      accessibilityLabel={`Data source: ${cfg.label}`}
    >
      <Icon name={cfg.icon} size={12} color={colors.onSurfaceVariant} />
      <Text className={`font-inter-medium text-[11px] ${cfg.txt}`}>{cfg.label}</Text>
    </View>
  );
}

/** Marker status chip with direction label - never color-only (a11y §7.2). */
export function MarkerStatusChip({ status }: { status: MarkerStatus }) {
  const cfg =
    status === "normal"
      ? { label: "Within range", cls: "bg-secondary-container", txt: "text-on-secondary-container" }
      : status === "borderline"
      ? { label: "Borderline", cls: "bg-[#ffefcf]", txt: "text-[#8a5a00]" }
      : status === "abnormal"
      ? { label: "Out of range", cls: "bg-error-container", txt: "text-on-error-container" }
      : { label: "Critical, act soon", cls: "bg-error", txt: "text-on-error" };
  return (
    <View className={`px-xs py-1 rounded-full ${cfg.cls}`}>
      <Text className={`font-inter-semibold text-[11px] ${cfg.txt}`}>{cfg.label}</Text>
    </View>
  );
}

/** Fasting requirement badge (booking funnel + reminders). */
export function FastingBadge({ hours }: { hours: number }) {
  return (
    <View
      className="flex-row items-center gap-1 bg-error-container px-xs py-1 rounded-full self-start"
      accessibilityLabel={`${hours} hours fasting required`}
    >
      <Icon name="warning" size={14} color={colors.onErrorContainer} />
      <Text className="font-inter-semibold text-[11px] text-on-error-container">
        {hours}h Fasting Required
      </Text>
    </View>
  );
}

/** Generic status chip used on bookings & appointments. */
export function StatusChip({
  label,
  tone,
}: {
  label: string;
  tone: "info" | "success" | "warning" | "error";
}) {
  const map = {
    info: "bg-primary-fixed text-on-primary-fixed",
    success: "bg-secondary-container text-on-secondary-container",
    warning: "bg-[#ffefcf] text-[#8a5a00]",
    error: "bg-error-container text-on-error-container",
  } as const;
  const [bg, txt] = map[tone].split(" ");
  return (
    <View className={`px-xs py-1 rounded-full self-start ${bg}`}>
      <Text className={`font-inter-semibold text-[11px] ${txt}`}>{label}</Text>
    </View>
  );
}
