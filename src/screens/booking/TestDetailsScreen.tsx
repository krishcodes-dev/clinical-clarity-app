import React from "react";
import { Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BookStackParamList } from "@/app/types";
import { Screen } from "@/ui/Screen";
import { AppHeader } from "@/ui/AppHeader";
import { Icon } from "@/ui/Icon";
import { BentoCard } from "@/ui/BentoCard";
import { FastingBadge } from "@/ui/Badges";
import { PrimaryButton } from "@/ui/PrimaryButton";
import { SecondaryButton } from "@/ui/SecondaryButton";
import { TrustFooter } from "@/ui/TrustFooter";
import { useBookingStore } from "@/store/useBookingStore";
import { mockTests } from "@/features/booking/mocks";
import { formatINR, percentOff } from "@/utils/currency";
import { colors } from "@/theme";

type Props = NativeStackScreenProps<BookStackParamList, "TestDetails">;

/**
 * Test Details (canonical "Usability Refined" HbA1c variant, parameterized).
 * "Book Now" is the primary CTA; cart is secondary (UX review §4.2).
 */
export function TestDetailsScreen({ navigation, route }: Props) {
  const test = mockTests.find((t) => t.id === route.params.testId) ?? mockTests[0];
  const addToCart = useBookingStore((s) => s.addToCart);
  const updateBookingDraft = useBookingStore((s) => s.updateBookingDraft);

  const facts = [
    { icon: "schedule", label: "Report", value: `${test.reportEtaHours} hours` },
    { icon: "science", label: "Parameters", value: String(test.parameters) },
    { icon: "water_drop", label: "Sample", value: "Blood" },
    { icon: "restaurant", label: "Fasting", value: test.fastingHours ? `${test.fastingHours} hours` : "Not required" },
  ];

  return (
    <Screen contentClassName="px-md pb-lg">
      <AppHeader title="Test Details" />
      <Text className="font-inter-bold text-headline-lg-mobile text-on-surface">{test.name}</Text>
      <Text className="font-inter text-body-lg text-on-surface-variant mt-xs">
        {test.description}
      </Text>
      {test.fastingHours ? (
        <View className="mt-sm">
          <FastingBadge hours={test.fastingHours} />
        </View>
      ) : null}

      <View className="flex-row flex-wrap justify-between mt-md">
        {facts.map((f) => (
          <BentoCard key={f.label} tone="low" className="w-[48.5%] mb-sm">
            <View className="flex-row items-center gap-xs">
              <Icon name={f.icon} size={18} color={colors.primaryContainer} />
              <View>
                <Text className="font-inter text-[11px] text-on-surface-variant">{f.label}</Text>
                <Text className="font-inter-semibold text-body-sm text-on-surface">{f.value}</Text>
              </View>
            </View>
          </BentoCard>
        ))}
      </View>

      <BentoCard tone="lowest" className="mt-xs">
        <Text className="font-inter-semibold text-body-sm text-on-surface mb-1">
          Why this test?
        </Text>
        <Text className="font-inter text-body-sm text-on-surface-variant">
          Recommended for tracking long-term blood sugar control, screening for
          diabetes risk, and monitoring treatment effectiveness. Your last
          result was 7.4% (Aug 2025).
        </Text>
      </BentoCard>

      <View className="flex-row items-center justify-between mt-lg mb-sm">
        <View>
          <Text className="font-inter text-[12px] text-on-surface-variant">Price</Text>
          <View className="flex-row items-baseline gap-xs">
            <Text className="font-inter text-body-sm text-outline line-through">{formatINR(test.mrp)}</Text>
            <Text className="font-inter-bold text-price-display text-primary">{formatINR(test.price)}</Text>
            <View className="bg-success-container px-xs py-0.5 rounded-md">
              <Text className="font-inter-bold text-[11px] text-success">{percentOff(test.mrp, test.price)}% OFF</Text>
            </View>
          </View>
        </View>
        <Text className="font-inter text-[12px] text-on-surface-variant">
          + ₹{test.homeCollectionFee} home collection (optional)
        </Text>
      </View>

      <PrimaryButton
        label="Book Now"
        icon="event_available"
        onPress={() => {
          updateBookingDraft({ test });
          navigation.navigate("CollectionMethod");
        }}
      />
      <SecondaryButton
        label="Add to Cart"
        icon="add_shopping_cart"
        className="mt-sm"
        onPress={() => {
          addToCart({
            id: `cart-${test.id}`,
            kind: "test",
            refId: test.id,
            name: test.name,
            price: test.price,
            fastingHours: test.fastingHours,
          });
          navigation.navigate("Cart");
        }}
      />
      <TrustFooter variant="data" />
    </Screen>
  );
}
