import React from "react";
import { Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BookStackParamList } from "@/app/types";
import { Screen } from "@/ui/Screen";
import { Icon } from "@/ui/Icon";
import { PrimaryButton } from "@/ui/PrimaryButton";
import { SecondaryButton } from "@/ui/SecondaryButton";
import { colors } from "@/theme";

type Props = NativeStackScreenProps<BookStackParamList, "PaymentFailed">;

/** Payment failure - reassures no money was taken, offers recovery paths. */
export function PaymentFailedScreen({ navigation }: Props) {
  return (
    <Screen scroll={false} contentClassName="px-md pb-lg justify-center">
      <View className="items-center mb-lg">
        <View className="w-28 h-28 rounded-full bg-error-container items-center justify-center mb-lg">
          <Icon name="credit_card_off" size={52} color={colors.onErrorContainer} />
        </View>
        <Text className="font-inter-bold text-headline-lg-mobile text-on-surface text-center">
          Payment Failed
        </Text>
        <Text className="font-inter text-body-sm text-on-surface-variant text-center mt-xs px-md">
          Your payment couldn't be completed.{" "}
          <Text className="font-inter-semibold text-on-surface">
            No amount has been charged.
          </Text>{" "}
          Your booking selection is saved. Please try another method.
        </Text>
      </View>
      <View className="gap-sm">
        <PrimaryButton label="Try Another Payment Method" icon="refresh" onPress={() => navigation.goBack()} />
        <SecondaryButton label="Back to Review" onPress={() => navigation.navigate("ReviewBooking")} />
        <SecondaryButton label="Contact Support" icon="support_agent" onPress={() => {}} />
      </View>
    </Screen>
  );
}
