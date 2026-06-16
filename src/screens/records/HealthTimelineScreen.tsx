import React from "react";
import { Pressable, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RecordsStackParamList } from "@/app/types";
import { Screen } from "@/ui/Screen";
import { AppHeader } from "@/ui/AppHeader";
import { Icon } from "@/ui/Icon";
import { mockTimeline } from "@/features/records/mocks";
import { colors } from "@/theme";
import { TimelineEventType } from "@/features/records/types";

type Props = NativeStackScreenProps<RecordsStackParamList, "HealthTimeline">;

const TYPE_META: Record<TimelineEventType, { icon: string; color: string }> = {
  test: { icon: "biotech", color: colors.primaryContainer },
  consultation: { icon: "medical_services", color: colors.secondary },
  upload: { icon: "upload_file", color: colors.surfaceTint },
  reminder: { icon: "notifications", color: colors.onSurfaceVariant },
};

/** Health Timeline - chronological view of all health events. */
export function HealthTimelineScreen({ navigation }: Props) {
  return (
    <Screen contentClassName="px-md pb-lg">
      <AppHeader title="Health Timeline" />
      <Text className="font-inter text-body-sm text-on-surface-variant mb-md">
        Every test, consult and upload in chronological order.
      </Text>
      {mockTimeline.map((e, i) => {
        const meta = TYPE_META[e.type];
        return (
          <View key={e.id} className="flex-row gap-sm">
            <View className="items-center">
              <View
                className="w-9 h-9 rounded-full items-center justify-center bg-surface-container"
              >
                <Icon name={meta.icon} size={18} color={meta.color} />
              </View>
              {i < mockTimeline.length - 1 && (
                <View className="w-0.5 flex-1 min-h-[28px] bg-outline-variant" />
              )}
            </View>
            <Pressable
              disabled={!e.recordId}
              onPress={() =>
                e.recordId && navigation.navigate("RecordDetails", { recordId: e.recordId })
              }
              accessibilityRole={e.recordId ? "button" : "text"}
              accessibilityLabel={`${e.title}, ${e.date}`}
              className="flex-1 bg-surface-container-lowest border border-outline-variant rounded-2xl p-sm mb-sm"
            >
              <Text className="font-inter text-[11px] text-on-surface-variant">{e.date}</Text>
              <Text className="font-inter-semibold text-body-sm text-on-surface mt-0.5">
                {e.title}
              </Text>
              <Text className="font-inter text-[12px] text-on-surface-variant">{e.subtitle}</Text>
            </Pressable>
          </View>
        );
      })}
    </Screen>
  );
}
