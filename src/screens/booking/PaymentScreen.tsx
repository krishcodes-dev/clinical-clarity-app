import React, { useState } from "react";
import { Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BookStackParamList } from "@/app/types";
import { Screen } from "@/ui/Screen";
import { AppHeader } from "@/ui/AppHeader";
import { FunnelStepper } from "@/ui/FunnelStepper";
import { RadioCard } from "@/ui/RadioCard";
import { BillSummary } from "@/features/booking/components/BillSummary";
import { TrustFooter } from "@/ui/TrustFooter";
import { PrimaryButton } from "@/ui/PrimaryButton";
import { useBookingStore } from "@/store/useBookingStore";

type Props = NativeStackScreenProps<BookStackParamList, "Payment">;

const METHODS = [
  { id: "upi", icon: "qr_code_2", title: "UPI", sub: "GPay / PhonePe / Paytm · arjun@okhdfc" },
  { id: "card", icon: "credit_card", title: "Credit / Debit Card", sub: "HDFC Visa •••• 4242" },
  
  { id: "insurance", icon: "health_and_safety", title: "Insurance", sub: "Check coverage eligibility" },
];

/**
 * Payment (canonical "Usability Refined"). Mock processing - succeeds by
 * default; "insurance" path demonstrates the failure state.
 */
export function PaymentScreen({ navigation }: Props) {
  const draft = useBookingStore((s) => s.bookingDraft);
  const [method, setMethod] = useState("upi");
  const [processing, setProcessing] = useState(false);
  const test = draft.test;
  if (!test) return null;
  const homeFee = draft.method === "home" ? test.homeCollectionFee : 0;

  const pay = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      if (method === "insurance") navigation.navigate("PaymentFailed");
      else navigation.navigate("BookingConfirmed");
    }, 1500);
  };

  return (
    <Screen contentClassName="px-md pb-lg">
      <AppHeader title="Secure Payment" />
      <FunnelStepper current={3} />
      <Text className="font-inter-semibold text-body-lg text-on-surface mt-xs mb-sm">
        Payment Method
      </Text>
      {METHODS.map((m) => (
        <RadioCard
          key={m.id}
          icon={m.icon}
          title={m.title}
          subtitle={m.sub}
          selected={method === m.id}
          onPress={() => setMethod(m.id)}
        />
      ))}

      <BillSummary
        lines={[
          { label: test.name, amount: test.price },
          ...(homeFee ? [{ label: "Home Collection Fee", amount: homeFee }] : []),
          { label: "Taxes", amount: 0 },
        ]}
        savings={test.mrp - test.price}
      />

      <PrimaryButton
        label={processing ? "Processing…" : "Pay Securely"}
        icon="lock"
        loading={processing}
        onPress={pay}
        className="mt-md"
      />
      <TrustFooter variant="payment" />
    </Screen>
  );
}
