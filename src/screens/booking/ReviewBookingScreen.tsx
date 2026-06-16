import React from "react";
import { Pressable, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BookStackParamList } from "@/app/types";
import { Screen } from "@/ui/Screen";
import { AppHeader } from "@/ui/AppHeader";
import { FunnelStepper } from "@/ui/FunnelStepper";
import { Icon } from "@/ui/Icon";
import { BillSummary } from "@/features/booking/components/BillSummary";
import { TrustFooter } from "@/ui/TrustFooter";
import { PrimaryButton } from "@/ui/PrimaryButton";
import { useBookingStore } from "@/store/useBookingStore";
import { mockDays, mockLabs } from "@/features/booking/mocks";
import { colors } from "@/theme";

type Props = NativeStackScreenProps<BookStackParamList, "ReviewBooking">;

interface RowProps {
  label: string;
  icon: string;
  title: string;
  body?: string;
  onEdit: () => void;
}

function ReviewRow({ label, icon, title, body, onEdit }: RowProps) {
  return (
    <View className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-md mb-sm">
      <View className="flex-row items-center justify-between mb-xs">
        <Text className="font-inter-medium text-medical-term text-on-surface-variant uppercase">
          {label}
        </Text>
        <Pressable
          onPress={onEdit}
          accessibilityRole="button"
          accessibilityLabel={`Edit ${label}`}
          hitSlop={8}
          className="min-h-[36px] justify-center"
        >
          <Text className="font-inter-semibold text-[12px] text-secondary">Edit</Text>
        </Pressable>
      </View>
      <View className="flex-row items-start gap-sm">
        <Icon name={icon} size={20} color={colors.primaryContainer} />
        <View className="flex-1">
          <Text className="font-inter-semibold text-body-lg text-on-surface">{title}</Text>
          {body ? (
            <Text className="font-inter text-body-sm text-on-surface-variant mt-0.5">{body}</Text>
          ) : null}
        </View>
      </View>
    </View>
  );
}

/** Review Booking - canonical "Usability Refined" with edit-in-place rows. */
export function ReviewBookingScreen({ navigation }: Props) {
  const draft = useBookingStore((s) => s.bookingDraft);
  const addresses = useBookingStore((s) => s.addresses);
  const test = draft.test;
  const address = addresses.find((a) => a.id === draft.addressId);
  const lab = mockLabs.find((l) => l.id === draft.labId);
  const day = mockDays.find((d) => d.id === draft.dayId);
  const homeFee = draft.method === "home" ? test?.homeCollectionFee ?? 99 : 0;

  if (!test) return null;

  return (
    <Screen contentClassName="px-md pb-lg">
      <AppHeader title="Review Your Booking" />
      <FunnelStepper current={2} />
      <Text className="font-inter text-body-sm text-on-surface-variant mb-md">
        Please confirm your diagnostic details below before proceeding to payment.
      </Text>

      <ReviewRow
        label="Diagnostic Test"
        icon="biotech"
        title={test.name}
        body={test.description}
        onEdit={() => navigation.navigate("TestDetails", { testId: test.id })}
      />
      <ReviewRow
        label="Collection"
        icon={draft.method === "home" ? "home" : "domain"}
        title={draft.method === "home" ? "Home Collection" : lab?.name ?? "Lab Visit"}
        body={
          draft.method === "home"
            ? "A qualified phlebotomist will visit you."
            : lab?.accreditation
        }
        onEdit={() => navigation.navigate("CollectionMethod")}
      />
      {draft.method === "home" && address ? (
        <ReviewRow
          label="Address"
          icon="location_on"
          title={address.line1}
          body={`${address.line2}${address.instructions ? ` · ${address.instructions}` : ""}`}
          onEdit={() => navigation.navigate("CollectionAddress")}
        />
      ) : null}
      <ReviewRow
        label="Schedule"
        icon="calendar_today"
        title={day ? `${day.dow}, ${day.month} ${day.day}` : "-"}
        body={draft.slot?.time}
        onEdit={() => navigation.navigate("SelectSlot")}
      />
      {test.fastingHours ? (
        <View className="flex-row items-center gap-xs bg-error-container/50 rounded-xl p-sm mb-sm">
          <Icon name="warning" size={18} color={colors.onErrorContainer} />
          <Text className="flex-1 font-inter-medium text-[12px] text-on-error-container">
            {test.fastingHours}h fasting required. Do not consume food or sugary
            drinks before sample collection.
          </Text>
        </View>
      ) : null}

      <BillSummary
        lines={[
          { label: test.name, amount: test.price },
          ...(homeFee ? [{ label: "Home Collection Fee", amount: homeFee }] : []),
          { label: "Taxes", amount: 0 },
        ]}
        savings={test.mrp - test.price}
      />

      <PrimaryButton
        label="Confirm & Pay"
        icon="payments"
        className="mt-md"
        onPress={() => navigation.navigate("Payment")}
      />
      <TrustFooter variant="payment" />
    </Screen>
  );
}
