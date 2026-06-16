import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BookStackParamList } from "@/app/types";
import { Screen } from "@/ui/Screen";
import { Icon } from "@/ui/Icon";
import { SectionHeader } from "@/ui/SectionHeader";
import { SearchBar } from "@/ui/SearchBar";
import { BentoCard } from "@/ui/BentoCard";
import { TestCard } from "@/features/booking/components/TestCard";
import { useBookingStore } from "@/store/useBookingStore";
import { mockPackages, mockTests, popularSearches } from "@/features/booking/mocks";
import { formatINR } from "@/utils/currency";
import { colors } from "@/theme";
import { TestCategoryKind } from "@/features/booking/types";

type Props = NativeStackScreenProps<BookStackParamList, "BookLanding">;

/** Feature flag: set to true to re-enable the "Explore by Category" section. */
const SHOW_TEST_CATEGORIES = false;

/** IDs of the 3 tests to feature on the landing page. */
const FEATURED_TEST_IDS = ["lipid", "hba1c", "holter"];

/** ID of the single package to show. */
const FEATURED_PACKAGE_ID = "pkg-cardiac";

const EXPLORERS: { kind: TestCategoryKind; icon: string; label: string; tone: "sky" | "aqua" | "mint" | "indigo" | "ice"; iconColor: string }[] = [
  { kind: "organ", icon: "favorite", label: "By Organ", tone: "sky", iconColor: "#0b6e9c" },
  { kind: "symptom", icon: "sick", label: "By Symptom", tone: "aqua", iconColor: "#00696e" },
  { kind: "lifestyle", icon: "self_improvement", label: "Lifestyle", tone: "mint", iconColor: "#0b5226" },
  { kind: "gender", icon: "wc", label: "For You", tone: "indigo", iconColor: "#2d3f8f" },
  { kind: "imaging", icon: "image", label: "Imaging", tone: "ice", iconColor: "#1a365d" },
  { kind: "special", icon: "science", label: "Special", tone: "aqua", iconColor: "#00696e" },
];

/** Book a Test - Landing (canonical "Usability Refined" variant). */
export function BookLandingScreen({ navigation }: Props) {
  const cart = useBookingStore((s) => s.cart);
  const [query, setQuery] = useState("");

  const featuredTests = mockTests.filter((t) => FEATURED_TEST_IDS.includes(t.id));
  const featuredPackage = mockPackages.find((p) => p.id === FEATURED_PACKAGE_ID);

  return (
    <Screen contentClassName="px-md pb-lg">
      <View className="flex-row items-center justify-between mt-sm">
        <Text className="font-inter-bold text-headline-lg-mobile text-on-surface">
          Book a Test
        </Text>
        <Pressable
          onPress={() => navigation.navigate("Cart")}
          accessibilityRole="button"
          accessibilityLabel={`Cart, ${cart.length} items`}
          className="w-12 h-12 items-center justify-center"
        >
          <Icon name="shopping_cart" color={colors.onSurface} />
          {cart.length > 0 && (
            <View className="absolute top-1.5 right-1.5 bg-secondary rounded-full min-w-[16px] h-4 items-center justify-center px-0.5">
              <Text className="text-on-secondary text-[10px] font-inter-bold">{cart.length}</Text>
            </View>
          )}
        </Pressable>
      </View>

      <View className="mt-sm">
        <SearchBar
          placeholder="Search tests, packages, markers…"
          value={query}
          onChangeText={setQuery}
          onSubmit={() => query.trim() && navigation.navigate("SearchResults", { query })}
        />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-xs">
        <View className="flex-row gap-xs">
          {popularSearches.map((p) => (
            <Pressable
              key={p}
              onPress={() => navigation.navigate("SearchResults", { query: p })}
              accessibilityRole="button"
              className="bg-surface-container px-sm py-xs rounded-full min-h-[36px] justify-center"
            >
              <Text className="font-inter-medium text-[12px] text-on-surface-variant">{p}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* Festive promo banner (dopamine layer) */}
      <BentoCard
        tone="accent"
        className="mt-md"
        onPress={() => navigation.navigate("PackageDetails", { packageId: "pkg-comprehensive" })}
        accessibilityLabel="Mega Health Sale: Full Body Checkup at 1499 rupees, 50 percent off"
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-1 pr-sm">
            <View className="bg-tint-ice self-start px-xs py-0.5 rounded-md mb-1">
              <Text className="font-inter-bold text-[10px] text-[#00455e]">MEGA HEALTH SALE</Text>
            </View>
            <Text className="font-inter-bold text-headline-md text-on-accent">
              Full Body Checkup @ ₹1,499
            </Text>
            <Text className="font-inter-medium text-[12px] text-on-accent opacity-90 mt-0.5">
              68 parameters · Free home collection · Reports in 24h
            </Text>
          </View>
          <View className="items-center">
            <Text className="font-inter-extrabold text-headline-lg-mobile text-on-accent">50%</Text>
            <Text className="font-inter-bold text-[11px] text-on-accent">OFF</Text>
          </View>
        </View>
      </BentoCard>

      {/* Category explorers (hidden behind feature flag for future re-enable) */}
      {SHOW_TEST_CATEGORIES && (
        <>
          <SectionHeader title="Explore by Category" />
          <View className="flex-row flex-wrap justify-between">
            {EXPLORERS.map((e) => (
              <BentoCard
                key={e.kind}
                tone={e.tone}
                className="w-[31.5%] mb-sm items-center py-sm"
                onPress={() => navigation.navigate("CategoryExplorer", { kind: e.kind })}
                accessibilityLabel={`Explore tests ${e.label}`}
              >
                <Icon name={e.icon} size={24} color={e.iconColor} />
                <Text className="font-inter-medium text-[12px] text-on-surface mt-xs text-center">
                  {e.label}
                </Text>
              </BentoCard>
            ))}
          </View>
        </>
      )}

      {/* Featured package */}
      {featuredPackage && (
        <>
          <SectionHeader title="Featured Package" />
          <BentoCard
            key={featuredPackage.id}
            tone="primary"
            className="mb-sm"
            onPress={() => navigation.navigate("PackageDetails", { packageId: featuredPackage.id })}
            accessibilityLabel={`${featuredPackage.name}, ${featuredPackage.testCount} tests, ₹${featuredPackage.price}`}
          >
            <Text className="font-inter-semibold text-body-lg text-on-primary">{featuredPackage.name}</Text>
            <Text className="font-inter text-[12px] text-primary-fixed mt-1" numberOfLines={2}>
              {featuredPackage.description}
            </Text>
            <View className="flex-row items-center justify-between mt-sm">
              <View className="bg-secondary-container px-xs py-1 rounded-full">
                <Text className="font-inter-semibold text-[11px] text-on-secondary-container">
                  {featuredPackage.testCount} parameters
                </Text>
              </View>
              <View className="flex-row items-baseline gap-xs">
                <Text className="font-inter text-[12px] text-primary-fixed-dim line-through">
                  ${featuredPackage.originalPrice}
                </Text>
                <Text className="font-inter-bold text-price-display text-on-primary">{formatINR(featuredPackage.price)}</Text>
              </View>
            </View>
          </BentoCard>
        </>
      )}

      {/* Recommended tests */}
      <SectionHeader title="Recommended Tests" />
      {featuredTests.map((t) => (
        <TestCard
          key={t.id}
          test={t}
          onPress={() => navigation.navigate("TestDetails", { testId: t.id })}
        />
      ))}
    </Screen>
  );
}
