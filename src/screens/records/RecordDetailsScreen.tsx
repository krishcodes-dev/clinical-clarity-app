import React from "react";
import { Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RecordsStackParamList } from "@/app/types";
import { Screen } from "@/ui/Screen";
import { AppHeader } from "@/ui/AppHeader";
import { SourceBadge } from "@/ui/Badges";
import { MarkerRow } from "@/features/records/components/MarkerRow";
import { AIDisclaimer } from "@/ui/AIDisclaimer";
import { PrimaryButton } from "@/ui/PrimaryButton";
import { SecondaryButton } from "@/ui/SecondaryButton";
import { ToggleRow } from "@/ui/ToggleRow";
import { useSettingsStore } from "@/store/useSettingsStore";
import { mockRecords } from "@/features/records/mocks";

type Props = NativeStackScreenProps<RecordsStackParamList, "RecordDetails">;

/**
 * Record Details (canonical HbA1c). Raw values always visible alongside
 * AI explanations; source report one tap away (UX review §5 P2, §7.1).
 */
export function RecordDetailsScreen({ navigation, route }: Props) {
  const record = mockRecords.find((r) => r.id === route.params.recordId) ?? mockRecords[0];
  const plainLanguage = useSettingsStore((s) => s.plainLanguage);
  const togglePlainLanguage = useSettingsStore((s) => s.togglePlainLanguage);

  return (
    <Screen contentClassName="px-md pb-lg">
      <AppHeader title="Record Details" />
      <Text className="font-inter-bold text-headline-lg-mobile text-on-surface">
        {record.title}
      </Text>
      <View className="flex-row items-center gap-xs mt-1 mb-md">
        <Text className="font-inter text-body-sm text-on-surface-variant">
          {record.date}
          {record.labName ? ` · ${record.labName}` : ""}
        </Text>
        <SourceBadge source={record.source} />
      </View>

      {record.markers?.length ? (
        <>
          <ToggleRow
            icon="translate"
            title="Plain-language explanations"
            subtitle="Tap any marker to expand its simple explanation"
            value={plainLanguage}
            onValueChange={togglePlainLanguage}
          />
          <Text className="font-inter-semibold text-headline-md text-on-surface mt-sm mb-xs">
            Markers
          </Text>
          {record.markers.map((m) => (
            <MarkerRow key={m.name} marker={m} />
          ))}
        </>
      ) : (
        <View className="bg-surface-container-low rounded-2xl p-md">
          <Text className="font-inter text-body-sm text-on-surface-variant">
            No structured markers were extracted from this record. You can view
            the original document below.
          </Text>
        </View>
      )}

      <View className="mt-lg gap-sm">
        <PrimaryButton
          label="View Original Report"
          icon="picture_as_pdf"
          onPress={() => navigation.navigate("SourceReportViewer", { recordId: record.id })}
        />
        <SecondaryButton
          label="View in Trends"
          icon="insights"
          onPress={() => navigation.navigate("Trends")}
        />
        <SecondaryButton
          label="Share This Record"
          icon="share"
          onPress={() => navigation.navigate("ShareRecords")}
        />
      </View>
      <AIDisclaimer />
    </Screen>
  );
}
