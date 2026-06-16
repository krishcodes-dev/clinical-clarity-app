import React from "react";
import { Text, View } from "react-native";
import { BentoCard } from "@/ui/BentoCard";
import { Icon } from "@/ui/Icon";
import { SourceBadge } from "@/ui/Badges";
import { colors } from "@/theme";
import { HealthRecord } from "../types";

const CATEGORY_ICON: Record<HealthRecord["category"], string> = {
  lab: "lab_research",
  prescription: "prescriptions",
  consultation: "clinical_notes",
  imaging: "image",
};

interface RecordCardProps {
  record: HealthRecord;
  onPress: () => void;
}

export function RecordCard({ record, onPress }: RecordCardProps) {
  return (
    <BentoCard
      onPress={onPress}
      className="mb-sm"
      accessibilityLabel={`${record.title}, ${record.date}`}
    >
      <View className="flex-row items-center gap-sm">
        <View className="w-12 h-12 rounded-xl bg-surface-container items-center justify-center">
          <Icon name={CATEGORY_ICON[record.category]} size={24} color={colors.primaryContainer} />
        </View>
        <View className="flex-1">
          <Text className="font-inter-semibold text-body-lg text-on-surface" numberOfLines={1}>
            {record.title}
          </Text>
          <Text className="font-inter text-[12px] text-on-surface-variant">
            {record.date}
            {record.labName ? ` • ${record.labName}` : ""}
          </Text>
          <View className="mt-1">
            <SourceBadge source={record.source} />
          </View>
        </View>
        <Icon name="chevron_right" size={22} color={colors.outline} />
      </View>
    </BentoCard>
  );
}
