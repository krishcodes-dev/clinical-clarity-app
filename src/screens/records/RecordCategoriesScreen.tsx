import React from "react";
import { Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RecordsStackParamList } from "@/app/types";
import { Screen } from "@/ui/Screen";
import { AppHeader } from "@/ui/AppHeader";
import { Icon } from "@/ui/Icon";
import { BentoCard } from "@/ui/BentoCard";
import { RecordCard } from "@/features/records/components/RecordCard";
import { mockRecords } from "@/features/records/mocks";
import { colors } from "@/theme";
import { RecordCategoryId } from "@/features/records/types";

type Props = NativeStackScreenProps<RecordsStackParamList, "RecordCategories">;

const CATS: { id: RecordCategoryId; icon: string; label: string; sub: string }[] = [
  { id: "lab", icon: "lab_research", label: "Lab Reports", sub: "Blood, urine, biopsy" },
  { id: "prescription", icon: "prescriptions", label: "Prescriptions", sub: "Medication history" },
  { id: "consultation", icon: "clinical_notes", label: "Consultations", sub: "Physician summaries" },
  { id: "imaging", icon: "image", label: "Imaging", sub: "X-Ray, MRI, scans" },
];

/** Record Categories with per-category counts and recent items. */
export function RecordCategoriesScreen({ navigation }: Props) {
  const [active, setActive] = React.useState<RecordCategoryId | null>(null);
  const filtered = active ? mockRecords.filter((r) => r.category === active) : mockRecords;

  return (
    <Screen contentClassName="px-md pb-lg">
      <AppHeader title="Record Categories" />
      <View className="flex-row flex-wrap justify-between">
        {CATS.map((c) => {
          const count = mockRecords.filter((r) => r.category === c.id).length;
          const on = active === c.id;
          return (
            <BentoCard
              key={c.id}
              tone={on ? "high" : "low"}
              className="w-[48.5%] mb-sm"
              onPress={() => setActive(on ? null : c.id)}
              accessibilityLabel={`${c.label}, ${count} records`}
            >
              <Icon name={c.icon} size={24} color={colors.primaryContainer} />
              <Text className="font-inter-semibold text-body-sm text-on-surface mt-xs">
                {c.label}
              </Text>
              <Text className="font-inter text-[11px] text-on-surface-variant">{c.sub}</Text>
              <Text className="font-inter-bold text-body-lg text-primary mt-1">{count}</Text>
            </BentoCard>
          );
        })}
      </View>

      <Text className="font-inter-semibold text-headline-md text-on-surface mt-md mb-sm">
        {active ? CATS.find((c) => c.id === active)?.label : "All Records"}
      </Text>
      {filtered.map((r) => (
        <RecordCard
          key={r.id}
          record={r}
          onPress={() => navigation.navigate("RecordDetails", { recordId: r.id })}
        />
      ))}
    </Screen>
  );
}
