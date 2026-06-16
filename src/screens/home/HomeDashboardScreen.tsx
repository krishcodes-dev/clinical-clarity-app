import React from "react";
import { Pressable, Text, View } from "react-native";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { HomeStackParamList, MainTabParamList } from "@/app/types";
import { Screen } from "@/ui/Screen";
import { Icon } from "@/ui/Icon";
import { SectionHeader } from "@/ui/SectionHeader";
import { BentoCard } from "@/ui/BentoCard";
import { ReminderCard } from "@/features/reminders/components/ReminderCard";
import { useRemindersStore } from "@/store/useRemindersStore";
import { useNotificationsStore } from "@/store/useNotificationsStore";
import { mockUser } from "@/features/auth/mocks";
import { mockAppointments, mockPrescriptions } from "@/features/consultations/mocks";
import { AI_DISCLAIMER_SHORT } from "@/constants/copy";
import { colors } from "@/theme";

type Props = CompositeScreenProps<
  NativeStackScreenProps<HomeStackParamList, "HomeDashboard">,
  BottomTabScreenProps<MainTabParamList>
>;

const QUICK_ACTIONS = [
  { icon: "biotech", title: "Book a Test", sub: "NABL labs & home collection", tab: "BookTab", screen: "BookLanding", tone: "sky", iconColor: "#0b6e9c" },
  { icon: "medical_services", title: "Consultations", sub: "Video consultation", tab: "CareTab", screen: "CareLanding", tone: "aqua", iconColor: "#006a68" },
  { icon: "clinical_notes", title: "View Records", sub: "Your health vault", tab: "RecordsTab", screen: "EHRDashboard", tone: "indigo", iconColor: "#2d3f8f" },
  { icon: "auto_awesome", title: "AI Insights", sub: "Understand reports", tab: "RecordsTab", screen: "InsightsDashboard", tone: "mint", iconColor: "#0b5226" },
] as const;

/**
 * Home Dashboard - hub of the unified 5-tab shell. Hosts the reminders
 * "Today" strip (UX review §3.1: Reminders is a service layer, not a tab).
 */
export function HomeDashboardScreen({ navigation }: Props) {
  const reminders = useRemindersStore((s) => s.reminders);
  const setReminderStatus = useRemindersStore((s) => s.setReminderStatus);
  const unreadCount = useNotificationsStore((s) => s.unreadCount);
  const today = reminders.filter((r) => r.status !== "done").slice(0, 3);
  const upcoming = mockAppointments.filter((a) => a.status === "upcoming");

  return (
    <Screen contentClassName="px-md pb-lg">
      {/* Greeting header */}
      <View className="flex-row items-center justify-between mt-sm">
        <View className="flex-row items-center gap-xs">
          <Icon name="health_and_safety" size={24} color={colors.secondary} />
          <Text className="font-inter-bold text-body-lg text-primary">Clinical Clarity</Text>
        </View>
        <Pressable
          onPress={() => navigation.navigate("NotificationCenter")}
          accessibilityRole="button"
          accessibilityLabel={`Notifications, ${unreadCount} unread`}
          className="w-12 h-12 items-center justify-center"
        >
          <Icon name="notifications" color={colors.onSurface} />
          {unreadCount > 0 && (
            <View className="absolute top-2 right-2 bg-error rounded-full min-w-[16px] h-4 items-center justify-center px-0.5">
              <Text className="text-on-error text-[10px] font-inter-bold">{unreadCount}</Text>
            </View>
          )}
        </Pressable>
      </View>

      <Text className="font-inter-bold text-headline-lg-mobile text-on-surface mt-md">
        Namaste, {mockUser.firstName}
      </Text>
      <Pressable
        onPress={() => navigation.navigate("ProfileTab", { screen: "HealthProfile" })}
        accessibilityRole="button"
        accessibilityLabel={`Health profile ${mockUser.profileCompletion} percent complete`}
      >
        <Text className="font-inter text-body-sm text-on-surface-variant">
          Your health profile is {mockUser.profileCompletion}% complete ·{" "}
          <Text className="text-secondary font-inter-semibold">Finish setup</Text>
        </Text>
      </Pressable>

      {/* Quick actions bento grid */}
      <View className="flex-row flex-wrap justify-between mt-md">
        {QUICK_ACTIONS.map((a) => (
          <BentoCard
            key={a.title}
            tone={a.tone}
            className="w-[48.5%] mb-sm"
            onPress={() =>
              (navigation as any).navigate(a.tab, { screen: a.screen })
            }
            accessibilityLabel={a.title}
          >
            <View className="w-11 h-11 rounded-full bg-surface-container-lowest items-center justify-center mb-xs">
              <Icon name={a.icon} size={22} color={a.iconColor} />
            </View>
            <Text className="font-inter-semibold text-body-sm text-on-surface">{a.title}</Text>
            <Text className="font-inter text-[11px] text-on-surface-variant">{a.sub}</Text>
          </BentoCard>
        ))}
      </View>

      {/* Health snapshot */}
      <SectionHeader
        title="Health Snapshot"
        actionLabel="Full Report"
        onAction={() => navigation.navigate("RecordsTab", { screen: "Trends" })}
      />
      <View className="flex-row gap-sm">
        <BentoCard tone="lowest" className="flex-1">
          <Text className="font-inter-medium text-medical-term text-on-surface-variant uppercase">
            Blood Pressure
          </Text>
          <Text className="font-inter-bold text-headline-md text-on-surface mt-1">118/76</Text>
          <Text className="font-inter text-[11px] text-on-surface-variant">Last taken: 2 days ago</Text>
        </BentoCard>
        <BentoCard tone="lowest" className="flex-1">
          <Text className="font-inter-medium text-medical-term text-on-surface-variant uppercase">
            Heart Rate
          </Text>
          <Text className="font-inter-bold text-headline-md text-on-surface mt-1">72 bpm</Text>
          <Text className="font-inter text-[11px] text-on-surface-variant">Stable resting</Text>
        </BentoCard>
      </View>

      {/* AI insight teaser */}
      <BentoCard
        tone="primary"
        className="mt-sm"
        onPress={() => navigation.navigate("RecordsTab", { screen: "InsightsDashboard" })}
        accessibilityLabel="Recent analysis: all markers healthy except Vitamin D. View analysis"
      >
        <View className="flex-row items-center gap-xs mb-xs">
          <Icon name="auto_awesome" size={16} color={colors.secondaryFixedDim} />
          <Text className="font-inter-semibold text-[12px] text-secondary-fixed-dim uppercase">
            Recent Analysis*
          </Text>
        </View>
        <Text className="font-inter-semibold text-body-lg text-on-primary">
          Full Body Wellness Scan
        </Text>
        <Text className="font-inter text-body-sm text-primary-fixed mt-1">
          All markers within healthy ranges except Vitamin D. Recommendation: 20
          mins sunlight daily or a prescribed supplement.
        </Text>
        <Text className="font-inter-semibold text-body-sm text-secondary-fixed-dim mt-sm">
          View Analysis →
        </Text>
        <Text className="font-inter text-[10px] text-primary-fixed opacity-70 mt-xs">
          {AI_DISCLAIMER_SHORT}
        </Text>
      </BentoCard>

      {/* My Prescriptions */}
      <SectionHeader
        title="My Prescriptions"
        actionLabel="View all"
        onAction={() => navigation.navigate("CareTab", { screen: "MyPrescriptions" })}
      />
      {mockPrescriptions.length === 0 ? (
        <BentoCard tone="low">
          <Text className="font-inter text-body-sm text-on-surface-variant">
            No prescriptions yet. Prescriptions from your consultations will appear here.
          </Text>
        </BentoCard>
      ) : (
        mockPrescriptions.map((rx) => (
          <BentoCard
            key={rx.id}
            tone="lowest"
            className="mb-sm"
            onPress={() =>
              (navigation as any).navigate("CareTab", {
                screen: "PrescriptionViewer",
                params: { prescriptionId: rx.id },
              })
            }
            accessibilityLabel={`Prescription from ${rx.doctorName}, ${rx.date}`}
          >
            <View className="flex-row items-start justify-between">
              <View className="flex-1 pr-sm">
                <Text className="font-inter-medium text-[10px] text-on-surface-variant uppercase tracking-wider">
                  Prescription
                </Text>
                <Text className="font-inter-semibold text-body-lg text-on-surface mt-0.5">
                  {rx.doctorName}
                </Text>
                <Text className="font-inter text-[12px] text-on-surface-variant mt-0.5">
                  {rx.specialty} · {rx.date}
                </Text>
                <View className="flex-row items-center gap-1 mt-sm">
                  <Icon name="medication" size={14} color={colors.secondary} />
                  <Text className="font-inter-medium text-body-sm text-secondary">
                    {rx.medications.length} Medication{rx.medications.length !== 1 ? "s" : ""}
                  </Text>
                </View>
              </View>
              <View className="flex-row items-center gap-1 mt-sm">
                <Text className="font-inter-semibold text-body-sm text-secondary">View</Text>
                <Icon name="chevron_right" size={16} color={colors.secondary} />
              </View>
            </View>
          </BentoCard>
        ))
      )}

      {/* Today's reminders strip */}
      <SectionHeader
        title="Today's Reminders"
        actionLabel="View all"
        onAction={() => navigation.navigate("RemindersToday")}
      />
      {today.length === 0 ? (
        <BentoCard tone="low">
          <Text className="font-inter text-body-sm text-on-surface-variant">
            Nothing scheduled today. Tap "View all" to create a reminder.
          </Text>
        </BentoCard>
      ) : (
        today.map((r) => (
          <ReminderCard
            key={r.id}
            reminder={r}
            onPress={() => navigation.navigate("ReminderDetails", { reminderId: r.id })}
            onDone={() => setReminderStatus(r.id, "done")}
          />
        ))
      )}

      {/* Upcoming appointments */}
      <SectionHeader
        title="Upcoming"
        actionLabel="My Appointments"
        onAction={() => navigation.navigate("CareTab", { screen: "MyAppointments" })}
      />
      {upcoming.map((a) => (
        <BentoCard
          key={a.id}
          tone="lowest"
          onPress={() =>
            navigation.navigate("CareTab", {
              screen: "PreCallCheck",
              params: { appointmentId: a.id },
            })
          }
          accessibilityLabel={`${a.doctorName}, ${a.date} ${a.time}`}
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="font-inter-semibold text-body-lg text-on-surface">
                {a.doctorName}
              </Text>
              <View className="flex-row items-center gap-xs mt-1">
                <Icon name="calendar_today" size={14} color={colors.onSurfaceVariant} />
                <Text className="font-inter text-[12px] text-on-surface-variant">
                  {a.date}, {a.time} · {a.specialty}
                </Text>
              </View>
            </View>
            <View className="bg-secondary-container px-sm py-xs rounded-full">
              <Text className="font-inter-semibold text-[12px] text-on-secondary-container">
                Join Call
              </Text>
            </View>
          </View>
        </BentoCard>
      ))}

      {/* Daily tip */}
      <BentoCard tone="secondary" className="mt-md">
        <View className="flex-row items-center gap-xs mb-1">
          <Icon name="lightbulb" size={16} color={colors.onSecondaryContainer} />
          <Text className="font-inter-semibold text-[12px] text-on-secondary-container uppercase">
            Daily Health Tip
          </Text>
        </View>
        <Text className="font-inter text-body-sm text-on-secondary-fixed">
          Stay hydrated! Drinking enough water supports kidney function. Aim for
          8 glasses today.
        </Text>
      </BentoCard>
    </Screen>
  );
}
