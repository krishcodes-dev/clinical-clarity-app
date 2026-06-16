import React from "react";
import { Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BookStackParamList } from "@/app/types";
import { Screen } from "@/ui/Screen";
import { AppHeader } from "@/ui/AppHeader";
import { Icon } from "@/ui/Icon";
import { BentoCard } from "@/ui/BentoCard";
import { PrimaryButton } from "@/ui/PrimaryButton";
import { TrustFooter } from "@/ui/TrustFooter";
import { useBookingStore } from "@/store/useBookingStore";
import { mockPackages, mockTests } from "@/features/booking/mocks";
import { formatINR } from "@/utils/currency";
import { colors } from "@/theme";

type Props = NativeStackScreenProps<BookStackParamList, "PackageDetails">;

/** Package Details - Comprehensive Health (canonical). */
export function PackageDetailsScreen({ navigation, route }: Props) {
  const pkg = mockPackages.find((p) => p.id === route.params.packageId) ?? mockPackages[0];
  const included = mockTests.filter((t) => pkg.testIds.includes(t.id));
  const updateBookingDraft = useBookingStore((s) => s.updateBookingDraft);
  const savings = pkg.originalPrice - pkg.price;

  return (
    <Screen contentClassName="px-md pb-lg">
      <AppHeader title="Package Details" />
      <BentoCard tone="primary">
        <Text className="font-inter-bold text-headline-md text-on-primary">{pkg.name}</Text>
        <Text className="font-inter text-body-sm text-primary-fixed mt-1">{pkg.description}</Text>
        <View className="flex-row items-center gap-xs mt-sm">
          <View className="bg-secondary-container px-xs py-1 rounded-full">
            <Text className="font-inter-semibold text-[11px] text-on-secondary-container">
              {pkg.testCount} parameters
            </Text>
          </View>
          <View className="bg-primary-fixed px-xs py-1 rounded-full">
            <Text className="font-inter-semibold text-[11px] text-on-primary-fixed">
              {pkg.recommendedFor}
            </Text>
          </View>
        </View>
      </BentoCard>

      <View className="flex-row items-center justify-between mt-md mb-xs">
        <Text className="font-inter-semibold text-headline-md text-on-surface">Included Tests</Text>
        <Text className="font-inter text-[12px] text-on-surface-variant">
          {included.length} panels
        </Text>
      </View>
      {included.map((t) => (
        <View
          key={t.id}
          className="flex-row items-center gap-sm bg-surface-container-lowest border border-outline-variant rounded-xl p-sm mb-xs"
        >
          <Icon name="check_circle" size={20} color={colors.secondary} />
          <View className="flex-1">
            <Text className="font-inter-medium text-body-sm text-on-surface">{t.name}</Text>
            <Text className="font-inter text-[11px] text-on-surface-variant">
              {t.parameters} parameter{t.parameters > 1 ? "s" : ""}
            </Text>
          </View>
        </View>
      ))}

      <View className="flex-row items-center justify-between mt-md">
        <View>
          <Text className="font-inter text-[12px] text-on-surface-variant line-through">
            ${pkg.originalPrice}
          </Text>
          <Text className="font-inter-bold text-price-display text-primary">{formatINR(pkg.price)}</Text>
        </View>
        <View className="bg-secondary-container px-sm py-xs rounded-full">
          <Text className="font-inter-semibold text-[12px] text-on-secondary-container">
            You save {formatINR(savings)}
          </Text>
        </View>
      </View>

      <PrimaryButton
        label="Book This Package"
        icon="event_available"
        className="mt-md"
        onPress={() => {
          updateBookingDraft({ test: included[0], packageId: pkg.id });
          navigation.navigate("CollectionMethod");
        }}
      />
      <TrustFooter variant="data" />
    </Screen>
  );
}
