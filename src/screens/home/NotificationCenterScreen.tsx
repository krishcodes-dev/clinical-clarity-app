import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HomeStackParamList } from "@/app/types";
import { Screen } from "@/ui/Screen";
import { AppHeader } from "@/ui/AppHeader";
import { Icon } from "@/ui/Icon";
import { EmptyState } from "@/ui/EmptyState";
import { mockNotifications } from "@/features/home/mocks";
import { useNotificationsStore } from "@/store/useNotificationsStore";
import { colors } from "@/theme";
import { AppNotification } from "@/features/home/types";

type Props = NativeStackScreenProps<HomeStackParamList, "NotificationCenter">;

const KIND_ICON: Record<AppNotification["kind"], string> = {
  reminder: "notifications_active",
  report: "lab_research",
  appointment: "event",
  insight: "auto_awesome",
  system: "info",
};

/**
 * NEW SCREEN (UX review §5, P1): destination for the Home bell icon and
 * landing surface for reminder pushes.
 */
export function NotificationCenterScreen({ navigation }: Props) {
  const markAllRead = useNotificationsStore((s) => s.markAllNotificationsRead);
  useEffect(() => {
    markAllRead();
  }, [markAllRead]);

  return (
    <Screen contentClassName="px-md pb-lg" scroll={mockNotifications.length > 0}>
      <AppHeader title="Notifications" />
      {mockNotifications.length === 0 ? (
        <EmptyState
          icon="notifications_off"
          title="All caught up"
          body="Reports, reminders and appointment updates will appear here."
        />
      ) : (
        mockNotifications.map((n) => (
          <View
            key={n.id}
            className={`flex-row items-start gap-sm rounded-2xl p-sm mb-xs border ${
              n.read
                ? "bg-surface-container-lowest border-outline-variant"
                : "bg-primary-fixed/40 border-primary-fixed-dim"
            }`}
            accessible
            accessibilityLabel={`${n.read ? "" : "Unread. "}${n.title}. ${n.body}. ${n.timeAgo}`}
          >
            <View className="w-10 h-10 rounded-full bg-surface-container items-center justify-center mt-0.5">
              <Icon name={KIND_ICON[n.kind]} size={20} color={colors.primaryContainer} />
            </View>
            <View className="flex-1">
              <Text className="font-inter-semibold text-body-sm text-on-surface">{n.title}</Text>
              <Text className="font-inter text-[12px] text-on-surface-variant mt-0.5">
                {n.body}
              </Text>
              <Text className="font-inter text-[11px] text-outline mt-1">{n.timeAgo}</Text>
            </View>
            {!n.read && <View className="w-2 h-2 rounded-full bg-secondary mt-2" />}
          </View>
        ))
      )}
    </Screen>
  );
}
