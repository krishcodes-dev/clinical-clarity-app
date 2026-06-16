import React, { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BookStackParamList } from "@/app/types";
import { Screen } from "@/ui/Screen";
import { AppHeader } from "@/ui/AppHeader";
import { FunnelStepper } from "@/ui/FunnelStepper";
import { Icon } from "@/ui/Icon";
import { RadioCard } from "@/ui/RadioCard";
import { PrimaryButton } from "@/ui/PrimaryButton";
import { SecondaryButton } from "@/ui/SecondaryButton";
import { useBookingStore } from "@/store/useBookingStore";
import { colors } from "@/theme";

type Props = NativeStackScreenProps<BookStackParamList, "CollectionAddress">;

/**
 * Home Collection Address with inline serviceability check.
 * Folds the prototype's "Service Not Available At Address" state in.
 */
export function CollectionAddressScreen({ navigation }: Props) {
  const addresses = useBookingStore((s) => s.addresses);
  const selectAddress = useBookingStore((s) => s.selectAddress);
  const updateBookingDraft = useBookingStore((s) => s.updateBookingDraft);
  const [selectedId, setSelectedId] = useState(useBookingStore.getState().selectedAddressId);

  const selected = useMemo(
    () => addresses.find((a) => a.id === selectedId),
    [addresses, selectedId]
  );
  const serviceable = selected?.serviceable ?? false;

  return (
    <Screen scroll={false} contentClassName="px-0">
      <AppHeader title="Home Collection Address" />
      <FunnelStepper current={1} />
      <View className="flex-1 px-md pt-sm">
        <Text className="font-inter text-body-sm text-on-surface-variant mb-sm">
          Select where you'd like our clinical professional to visit you.
        </Text>

        {/* Serviceability banner */}
        <Animated.View
          key={serviceable ? "ok" : "no"}
          entering={FadeIn.duration(250)}
          className={`flex-row items-center gap-xs rounded-xl p-sm mb-md ${
            serviceable ? "bg-secondary-container" : "bg-error-container"
          }`}
          accessibilityLiveRegion="polite"
        >
          <Icon
            name={serviceable ? "check_circle" : "error"}
            size={18}
            color={serviceable ? colors.onSecondaryContainer : colors.onErrorContainer}
          />
          <Text
            className={`flex-1 font-inter-medium text-[12px] ${
              serviceable ? "text-on-secondary-container" : "text-on-error-container"
            }`}
          >
            {serviceable
              ? "Service available. Phlebotomists cover this area."
              : "Home collection isn't available at this address yet. Choose another address or visit a lab."}
          </Text>
        </Animated.View>

        {addresses.map((a) => (
          <RadioCard
            key={a.id}
            icon={a.label === "Home" ? "home" : a.label === "Work" ? "work" : "location_on"}
            title={a.label}
            subtitle={`${a.line1}, ${a.line2}`}
            selected={selectedId === a.id}
            onPress={() => setSelectedId(a.id)}
          />
        ))}

        <Pressable
          accessibilityRole="button"
          className="flex-row items-center gap-xs min-h-[48px]"
          onPress={() => {}}
        >
          <Icon name="add_location_alt" size={20} color={colors.secondary} />
          <Text className="font-inter-semibold text-body-sm text-secondary">
            Add a New Address
          </Text>
        </Pressable>
      </View>

      <View className="px-md pb-md gap-sm">
        {!serviceable && (
          <SecondaryButton
            label="Visit a Lab Instead"
            icon="domain"
            onPress={() => {
              updateBookingDraft({ method: "lab" });
              navigation.navigate("SelectLab");
            }}
          />
        )}
        <PrimaryButton
          label="Continue to Scheduling"
          disabled={!serviceable}
          onPress={() => {
            selectAddress(selectedId);
            updateBookingDraft({ addressId: selectedId });
            navigation.navigate("SelectSlot");
          }}
        />
      </View>
    </Screen>
  );
}
