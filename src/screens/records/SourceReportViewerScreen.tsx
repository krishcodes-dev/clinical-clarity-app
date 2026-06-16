import React from "react";
import { ScrollView, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RecordsStackParamList } from "@/app/types";
import { Screen } from "@/ui/Screen";
import { AppHeader } from "@/ui/AppHeader";
import { Icon } from "@/ui/Icon";
import { SecondaryButton } from "@/ui/SecondaryButton";
import { mockRecords } from "@/features/records/mocks";
import { colors } from "@/theme";

type Props = NativeStackScreenProps<RecordsStackParamList, "SourceReportViewer">;

/**
 * NEW SCREEN (UX review §5, P2): the original document behind every
 * AI-extracted value - users and their doctors must be able to verify.
 * Mock renders a stylized document page (no backend / file system).
 */
export function SourceReportViewerScreen({ navigation, route }: Props) {
  const record = mockRecords.find((r) => r.id === route.params.recordId) ?? mockRecords[0];

  return (
    <Screen scroll={false} contentClassName="px-0">
      <AppHeader
        title={record.fileName ?? "Original Report"}
        actions={[
          { icon: "download", label: "Download report" },
          { icon: "share", label: "Share report" },
        ]}
      />
      <ScrollView className="flex-1 bg-surface-dim px-md" contentContainerClassName="py-md">
        {/* Mock document page */}
        <View className="bg-surface-container-lowest rounded-lg p-lg" style={{ minHeight: 480 }}>
          <View className="flex-row items-center justify-between border-b border-outline-variant pb-sm mb-md">
            <View>
              <Text className="font-inter-bold text-body-lg text-on-surface">
                {record.labName ?? "Uploaded Document"}
              </Text>
              <Text className="font-inter text-[11px] text-on-surface-variant">
                Laboratory Report · {record.date}
              </Text>
            </View>
            <Icon name="biotech" size={28} color={colors.outlineVariant} />
          </View>
          <Text className="font-inter text-[12px] text-on-surface-variant mb-sm">
            Patient: Arjun Mehta · DOB 12 Mar 1988 · Sample: Venous blood
          </Text>
          {(record.markers ?? []).map((m) => (
            <View
              key={m.name}
              className="flex-row justify-between border-b border-outline-variant/60 py-xs"
            >
              <Text className="font-inter text-[12px] text-on-surface flex-1">{m.name}</Text>
              <Text className="font-inter-semibold text-[12px] text-on-surface w-20 text-right">
                {m.value} {m.unit}
              </Text>
              <Text className="font-inter text-[11px] text-on-surface-variant w-24 text-right">
                {m.referenceRange}
              </Text>
            </View>
          ))}
          <Text className="font-inter text-[10px] text-outline mt-lg">
            Electronically verified report. Document ID {record.id.toUpperCase()}-2025.
          </Text>
        </View>
      </ScrollView>
      <View className="px-md pb-md pt-xs">
        <SecondaryButton
          label="Back to AI Summary"
          icon="auto_awesome"
          onPress={() => navigation.goBack()}
        />
      </View>
    </Screen>
  );
}
