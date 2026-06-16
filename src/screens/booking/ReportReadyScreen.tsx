import React from "react";
import { Text, View } from "react-native";
import Animated, { ZoomIn } from "react-native-reanimated";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { BookStackParamList, MainTabParamList } from "@/app/types";
import { Screen } from "@/ui/Screen";
import { Icon } from "@/ui/Icon";
import { PrimaryButton } from "@/ui/PrimaryButton";
import { SecondaryButton } from "@/ui/SecondaryButton";
import { colors } from "@/theme";

type Props = CompositeScreenProps<
  NativeStackScreenProps<BookStackParamList, "ReportReady">,
  BottomTabScreenProps<MainTabParamList>
>;

/**
 * Report Ready - canonical "Ecosystem Bridge" variant. The connective
 * tissue between features 1 → 2 → 3 (UX review §4.2): hands off into
 * AI Insights in the Records tab.
 */
export function ReportReadyScreen({ navigation }: Props) {
  return (
    <Screen scroll={false} contentClassName="px-md pb-lg justify-center">
      <View className="items-center mb-lg">
        <Animated.View
          entering={ZoomIn.duration(450)}
          className="w-24 h-24 rounded-full bg-secondary-container items-center justify-center mb-md"
        >
          <Icon name="lab_research" size={48} color={colors.onSecondaryContainer} />
        </Animated.View>
        <Text className="font-inter-bold text-headline-lg-mobile text-on-surface text-center">
          Your Report is Ready
        </Text>
        <Text className="font-inter text-body-sm text-on-surface-variant text-center mt-xs px-md">
          Blood Sugar (HbA1c) Test · Aarogya Diagnostics. It's been added to
          your health vault and analyzed by our AI.
        </Text>
      </View>

      <View className="gap-sm">
        <PrimaryButton
          label="View AI Insights"
          icon="auto_awesome"
          onPress={() =>
            navigation.navigate("RecordsTab", {
              screen: "InsightsDashboard",
              params: { state: "critical" },
            })
          }
        />
        <SecondaryButton
          label="Open Report in Records"
          icon="clinical_notes"
          onPress={() =>
            navigation.navigate("RecordsTab", {
              screen: "RecordDetails",
              params: { recordId: "rec1" },
            })
          }
        />
        <SecondaryButton label="Done" onPress={() => navigation.popToTop()} />
      </View>
    </Screen>
  );
}
