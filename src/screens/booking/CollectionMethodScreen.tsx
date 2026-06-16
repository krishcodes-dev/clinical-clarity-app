import React, { useState } from "react";
import { Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BookStackParamList } from "@/app/types";
import { Screen } from "@/ui/Screen";
import { AppHeader } from "@/ui/AppHeader";
import { FunnelStepper } from "@/ui/FunnelStepper";
import { RadioCard } from "@/ui/RadioCard";
import { PrimaryButton } from "@/ui/PrimaryButton";
import { useBookingStore } from "@/store/useBookingStore";
import { CollectionMethod } from "@/features/booking/types";

type Props = NativeStackScreenProps<BookStackParamList, "CollectionMethod">;

/** Step 2 (Schedule) - choose home collection vs lab visit. Tab bar hidden. */
export function CollectionMethodScreen({ navigation }: Props) {
  const draft = useBookingStore((s) => s.bookingDraft);
  const updateBookingDraft = useBookingStore((s) => s.updateBookingDraft);
  const [method, setMethod] = useState<CollectionMethod>(draft.method ?? "home");

  return (
    <Screen scroll={false} contentClassName="px-0">
      <AppHeader title="Collection Method" />
      <FunnelStepper current={1} />
      <View className="flex-1 px-md pt-sm">
        <Text className="font-inter text-body-sm text-on-surface-variant mb-md">
          How would you like your {draft.test?.shortName ?? "test"} sample collected?
        </Text>
        <RadioCard
          icon="home"
          title="Home Collection"
          subtitle={`A qualified phlebotomist visits you. +₹${draft.test?.homeCollectionFee ?? 99} fee`}
          selected={method === "home"}
          onPress={() => setMethod("home")}
        />
        <RadioCard
          icon="domain"
          title="Visit a Lab"
          subtitle="Choose a nearby accredited lab. No extra fee"
          selected={method === "lab"}
          onPress={() => setMethod("lab")}
        />
      </View>
      <View className="px-md pb-md">
        <PrimaryButton
          label="Continue"
          onPress={() => {
            updateBookingDraft({ method });
            navigation.navigate(method === "home" ? "CollectionAddress" : "SelectLab");
          }}
        />
      </View>
    </Screen>
  );
}
