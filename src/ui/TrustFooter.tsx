import React from "react";
import { Text, View } from "react-native";
import { Icon } from "./Icon";
import { TRUST } from "@/constants/copy";
import { colors } from "@/theme";

interface TrustFooterProps {
  variant?: "payment" | "data" | "upload" | "vault";
}

/**
 * Single legally-reviewable trust statement component (UX review §7.1).
 * Replaces the prototype's six differently-worded compliance/encryption footers.
 */
export function TrustFooter({ variant = "data" }: TrustFooterProps) {
  const rows =
    variant === "payment"
      ? [
          { icon: "payments", text: TRUST.encryption },
          { icon: "verified_user", text: TRUST.dataProtection },
        ]
      : variant === "upload"
      ? [{ icon: "shield_lock", text: TRUST.uploadPrivacy }]
      : variant === "vault"
      ? [{ icon: "lock", text: TRUST.vault }]
      : [{ icon: "verified_user", text: TRUST.dataProtection }];

  return (
    <View className="mt-lg gap-xs" accessibilityRole="summary">
      {rows.map((r) => (
        <View key={r.icon} className="flex-row items-center gap-xs px-xs">
          <Icon name={r.icon} size={16} color={colors.secondary} />
          <Text className="flex-1 font-inter text-[12px] leading-4 text-on-surface-variant">
            {r.text}
          </Text>
        </View>
      ))}
    </View>
  );
}
