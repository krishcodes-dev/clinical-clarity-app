import React from "react";
import { Text, View } from "react-native";
import { Icon } from "./Icon";
import { AI_DISCLAIMER, AI_EMERGENCY } from "@/constants/copy";
import { colors } from "@/theme";

interface AIDisclaimerProps {
  /** Adds the emergency escape-hatch line (critical findings, UX review §7.1). */
  emergency?: boolean;
}

/** Persistent "educational, not a diagnosis" footnote for every insight surface. */
export function AIDisclaimer({ emergency }: AIDisclaimerProps) {
  return (
    <View className="mt-lg rounded-xl bg-surface-container-low border border-outline-variant p-sm">
      <View className="flex-row items-start gap-xs">
        <Icon name="info" size={16} color={colors.onSurfaceVariant} />
        <Text className="flex-1 font-inter text-[12px] leading-4 text-on-surface-variant">
          {AI_DISCLAIMER}
        </Text>
      </View>
      {emergency ? (
        <View className="flex-row items-start gap-xs mt-xs">
          <Icon name="emergency" size={16} color={colors.error} />
          <Text className="flex-1 font-inter-medium text-[12px] leading-4 text-on-error-container">
            {AI_EMERGENCY}
          </Text>
        </View>
      ) : null}
    </View>
  );
}
