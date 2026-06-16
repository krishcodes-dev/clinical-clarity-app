import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Icon } from "@/ui/Icon";
import { MarkerStatusChip } from "@/ui/Badges";
import { Marker } from "../types";
import { colors } from "@/theme";
import { useSettingsStore } from "@/store/useSettingsStore";

/**
 * Lab marker row with expandable plain-language explanation
 * (feature 2: "explain medical terminology in simple language").
 * Raw value always visible alongside status - never hidden behind AI (§7.1).
 */
export function MarkerRow({ marker }: { marker: Marker }) {
  const [open, setOpen] = useState(false);
  const plainLanguage = useSettingsStore((s) => s.plainLanguage);

  return (
    <View className="bg-surface-container-lowest rounded-xl border border-outline-variant p-sm mb-xs">
      <Pressable
        onPress={() => setOpen((v) => !v)}
        accessibilityRole="button"
        accessibilityLabel={`${marker.name}: ${marker.value} ${marker.unit}. Reference ${marker.referenceRange}. Tap for plain-language explanation`}
        className="flex-row items-center justify-between"
      >
        <View className="flex-1 pr-sm">
          <Text className="font-inter-medium text-medical-term text-on-surface-variant uppercase">
            {marker.name}
          </Text>
          <View className="flex-row items-baseline gap-xs mt-1">
            <Text className="font-inter-bold text-headline-md text-on-surface">
              {marker.value}
              <Text className="font-inter text-body-sm text-on-surface-variant">
                {" "}
                {marker.unit}
              </Text>
            </Text>
            <Text className="font-inter text-[12px] text-on-surface-variant">
              ref {marker.referenceRange}
            </Text>
          </View>
        </View>
        <View className="items-end gap-1">
          <MarkerStatusChip status={marker.status} />
          {plainLanguage ? (
            <Icon
              name={open ? "expand_less" : "expand_more"}
              size={20}
              color={colors.onSurfaceVariant}
            />
          ) : null}
        </View>
      </Pressable>
      {open && plainLanguage ? (
        <Animated.View entering={FadeIn.duration(200)} className="mt-xs pt-xs border-t border-outline-variant">
          <Text className="font-inter text-body-sm text-on-surface-variant">
            {marker.plainLanguage}
          </Text>
        </Animated.View>
      ) : null}
    </View>
  );
}
