import React from "react";
import { Pressable, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ProfileStackParamList } from "@/app/types";
import { Screen } from "@/ui/Screen";
import { AppHeader } from "@/ui/AppHeader";
import { Icon } from "@/ui/Icon";
import { SearchBar } from "@/ui/SearchBar";
import { BentoCard } from "@/ui/BentoCard";
import { colors } from "@/theme";

type Props = NativeStackScreenProps<ProfileStackParamList, "HelpSupport">;

const OPTIONS = [
  { icon: "quiz", title: "FAQs", sub: "Bookings, reports, refunds and more" },
  { icon: "support_agent", title: "Contact Support", sub: "Mon to Sat, 8 AM to 10 PM" },
  { icon: "confirmation_number", title: "Raise a Ticket", sub: "Track issues to resolution" },
  { icon: "chat", title: "Live Chat", sub: "Average reply under 2 minutes" },
];

const FAQS = [
  "How do I download my lab report?",
  "When is home collection available?",
  "How are refunds processed?",
  "Is my health data shared with anyone?",
];

/** Help & Support - canonical clean-list layout (UX review §6). */
export function HelpSupportScreen(_props: Props) {
  return (
    <Screen contentClassName="px-md pb-lg">
      <AppHeader title="Help & Support" />
      <View className="mb-md">
        <SearchBar placeholder="Search help articles…" asButton onPress={() => {}} />
      </View>

      {OPTIONS.map((o) => (
        <BentoCard key={o.title} className="mb-xs" onPress={() => {}} accessibilityLabel={o.title}>
          <View className="flex-row items-center gap-sm">
            <View className="w-11 h-11 rounded-full bg-surface-container items-center justify-center">
              <Icon name={o.icon} size={22} color={colors.primaryContainer} />
            </View>
            <View className="flex-1">
              <Text className="font-inter-semibold text-body-lg text-on-surface">{o.title}</Text>
              <Text className="font-inter text-[12px] text-on-surface-variant">{o.sub}</Text>
            </View>
            <Icon name="chevron_right" size={22} color={colors.outline} />
          </View>
        </BentoCard>
      ))}

      {/* System status */}
      <View className="flex-row items-center gap-xs bg-secondary-container/60 rounded-xl p-sm mt-sm mb-md">
        <View className="w-2.5 h-2.5 rounded-full bg-secondary" />
        <Text className="flex-1 font-inter-medium text-[12px] text-on-secondary-container">
          All systems operational
        </Text>
      </View>

      <Text className="font-inter-semibold text-headline-md text-on-surface mb-sm">
        Popular Questions
      </Text>
      {FAQS.map((q) => (
        <Pressable
          key={q}
          accessibilityRole="button"
          className="flex-row items-center justify-between bg-surface-container-lowest border border-outline-variant rounded-xl p-sm mb-xs min-h-[52px]"
        >
          <Text className="flex-1 font-inter text-body-sm text-on-surface pr-sm">{q}</Text>
          <Icon name="expand_more" size={20} color={colors.outline} />
        </Pressable>
      ))}
    </Screen>
  );
}
