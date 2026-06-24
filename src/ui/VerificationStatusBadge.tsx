import React from "react";
import { Text, View } from "react-native";
import { Icon } from "./Icon";
import { colors } from "@/theme";
import { DoctorVerificationStatus } from "@/features/doctorOnboarding/types";

const CONFIG: Record<
  DoctorVerificationStatus,
  { label: string; icon: string; cls: string; txt: string }
> = {
  profile_incomplete: {
    label: "Incomplete",
    icon: "edit_note",
    cls: "bg-[#ffefcf]",
    txt: "text-[#8a5a00]",
  },
  under_review: {
    label: "Under Review",
    icon: "hourglass_top",
    cls: "bg-primary-fixed",
    txt: "text-on-primary-fixed",
  },
  verified: {
    label: "Verified Doctor",
    icon: "verified",
    cls: "bg-secondary-container",
    txt: "text-on-secondary-container",
  },
  rejected: {
    label: "Rejected",
    icon: "cancel",
    cls: "bg-error-container",
    txt: "text-on-error-container",
  },
  suspended: {
    label: "Suspended",
    icon: "block",
    cls: "bg-error-container",
    txt: "text-on-error-container",
  },
};

export function VerificationStatusBadge({ status }: { status: DoctorVerificationStatus }) {
  const cfg = CONFIG[status];
  return (
    <View
      className={`flex-row items-center gap-1 self-start px-sm py-1.5 rounded-full ${cfg.cls}`}
      accessibilityLabel={`Verification status: ${cfg.label}`}
    >
      <Icon name={cfg.icon} size={16} color={colors.onSurfaceVariant} />
      <Text className={`font-inter-semibold text-[12px] ${cfg.txt}`}>{cfg.label}</Text>
    </View>
  );
}
