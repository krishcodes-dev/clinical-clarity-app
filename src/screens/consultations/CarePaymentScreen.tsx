import React, { useState } from "react";
import { Text } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CareStackParamList } from "@/app/types";
import { Screen } from "@/ui/Screen";
import { AppHeader } from "@/ui/AppHeader";
import { RadioCard } from "@/ui/RadioCard";
import { BillSummary } from "@/features/booking/components/BillSummary";
import { TrustFooter } from "@/ui/TrustFooter";
import { PrimaryButton } from "@/ui/PrimaryButton";
import { useCareStore } from "@/store/useCareStore";

type Props = NativeStackScreenProps<CareStackParamList, "CarePayment">;

/** Consultation payment - shares components with the test-booking Payment. */
export function CarePaymentScreen({ navigation }: Props) {
  const consultDraft = useCareStore((s) => s.consultDraft);
  const [method, setMethod] = useState("upi");
  const [processing, setProcessing] = useState(false);
  const fee = consultDraft.doctor?.fee ?? 40;

  const pay = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      navigation.navigate("AppointmentConfirmed");
    }, 1500);
  };

  return (
    <Screen contentClassName="px-md pb-lg">
      <AppHeader title="Secure Payment" />
      <Text className="font-inter-semibold text-body-lg text-on-surface mb-sm">
        Payment Method
      </Text>
      <RadioCard
        icon="qr_code_2"
        title="UPI"
        subtitle="GPay / PhonePe / Paytm · arjun@okhdfc"
        selected={method === "upi"}
        onPress={() => setMethod("upi")}
      />
      <RadioCard
        icon="credit_card"
        title="Credit / Debit Card"
        subtitle="HDFC Visa •••• 4242"
        selected={method === "card"}
        onPress={() => setMethod("card")}
      />

      <BillSummary
        lines={[
          { label: `${consultDraft.doctor?.specialty ?? "General"} consultation`, amount: fee },
          { label: "Platform fee", amount: 49 },
        ]}
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
