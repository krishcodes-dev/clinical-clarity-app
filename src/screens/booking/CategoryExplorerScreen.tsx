import React from "react";
import { Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BookStackParamList } from "@/app/types";
import { Screen } from "@/ui/Screen";
import { AppHeader } from "@/ui/AppHeader";
import { Icon } from "@/ui/Icon";
import { BentoCard } from "@/ui/BentoCard";
import { mockCategories } from "@/features/booking/mocks";
import { colors } from "@/theme";
import { TestCategoryKind } from "@/features/booking/types";

type Props = NativeStackScreenProps<BookStackParamList, "CategoryExplorer">;

const TITLES: Record<TestCategoryKind, { title: string; sub: string }> = {
  organ: { title: "Organ Health", sub: "Tests grouped by the system they examine" },
  symptom: { title: "By Symptom", sub: "Start from how you feel" },
  lifestyle: { title: "Lifestyle Panels", sub: "Built around how you live" },
  gender: { title: "For You", sub: "Gender-specific health panels" },
  imaging: { title: "Imaging", sub: "X-Ray, MRI, ultrasound and more" },
  special: { title: "Special Tests", sub: "Allergy, genetic and advanced panels" },
};

/**
 * Parameterized Category Explorer - replaces six near-identical prototype
 * screens (organ / symptom / lifestyle / gender / imaging / special).
 */
export function CategoryExplorerScreen({ navigation, route }: Props) {
  const { kind } = route.params;
  const cats = mockCategories.filter((c) => c.kind === kind);
  const meta = TITLES[kind];

  return (
    <Screen contentClassName="px-md pb-lg">
      <AppHeader title={meta.title} />
      <Text className="font-inter text-body-sm text-on-surface-variant mb-md">{meta.sub}</Text>
      <View className="flex-row flex-wrap justify-between">
        {cats.map((c, i) => (
          <BentoCard
            key={c.id}
            tone={(["sky", "aqua", "indigo", "mint"] as const)[i % 4]}
            className="w-[48.5%] mb-sm"
            onPress={() => navigation.navigate("TestListing", { categoryId: c.id })}
            accessibilityLabel={`${c.name}, ${c.testCount} tests`}
          >
            <View className="w-11 h-11 rounded-full bg-surface-container-lowest items-center justify-center mb-xs">
              <Icon name={c.icon} size={22} color={colors.primaryContainer} />
            </View>
            <Text className="font-inter-semibold text-body-sm text-on-surface">{c.name}</Text>
            <Text className="font-inter text-[11px] text-on-surface-variant mt-0.5">
              {c.testCount} tests
            </Text>
          </BentoCard>
        ))}
      </View>
    </Screen>
  );
}
