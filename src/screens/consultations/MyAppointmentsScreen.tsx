import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CareStackParamList } from "@/app/types";
import { Screen } from "@/ui/Screen";
import { AppHeader } from "@/ui/AppHeader";
import { Icon } from "@/ui/Icon";
import { BentoCard } from "@/ui/BentoCard";
import { StatusChip } from "@/ui/Badges";
import { EmptyState } from "@/ui/EmptyState";
import { mockAppointments } from "@/features/consultations/mocks";
import { colors } from "@/theme";

type Props = NativeStackScreenProps<CareStackParamList, "MyAppointments">;

const TABS = ["Upcoming", "Completed", "Cancelled"] as const;

const MODE_ICON = { video: "videocam", audio: "call", chat: "chat" } as const;

/** My Appointments - upcoming / completed / cancelled with visit-loop links. */
export function MyAppointmentsScreen({ navigation }: Props) {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Upcoming");
  const filtered = mockAppointments.filter((a) =>
    tab === "Upcoming"
      ? a.status === "upcoming" || a.status === "in_progress"
      : tab === "Completed"
      ? a.status === "completed"
      : a.status === "cancelled" || a.status === "missed"
  );

  return (
    <Screen scroll={filtered.length > 0} contentClassName="px-md pb-lg">
      <AppHeader title="My Appointments" />
      <View className="flex-row bg-surface-container rounded-full p-0.5 mb-md">
        {TABS.map((t) => (
          <Pressable
            key={t}
            onPress={() => setTab(t)}
            accessibilityRole="tab"
            accessibilityState={{ selected: tab === t }}
            className={`flex-1 py-xs rounded-full items-center min-h-[40px] justify-center ${
              tab === t ? "bg-primary" : ""
            }`}
          >
            <Text
              className={`font-inter-semibold text-[12px] ${
                tab === t ? "text-on-primary" : "text-on-surface-variant"
              }`}
            >
              {t}
            </Text>
          </Pressable>
        ))}
      </View>

      {filtered.length === 0 ? (
        <EmptyState
          icon="event_busy"
          title={`No ${tab.toLowerCase()} appointments`}
          body="Book a consultation with a specialist via video, audio, or chat."
          primaryLabel="Find a Doctor"
          onPrimary={() => navigation.navigate("CareLanding")}
        />
      ) : (
        filtered.map((a) => (
          <BentoCard key={a.id} tone="lowest" className="mb-sm">
            <View className="flex-row items-center justify-between">
              <View className="flex-1 pr-sm">
                <Text className="font-inter-semibold text-body-lg text-on-surface">
                  {a.doctorName}
                </Text>
                <View className="flex-row items-center gap-1 mt-0.5">
                  <Icon name={MODE_ICON[a.mode]} size={14} color={colors.onSurfaceVariant} />
                  <Text className="font-inter text-[12px] text-on-surface-variant">
                    {a.specialty} · {a.date}, {a.time}
                  </Text>
                </View>
              </View>
              <StatusChip
                label={a.status === "upcoming" ? "Upcoming" : a.status === "completed" ? "Completed" : "Cancelled"}
                tone={a.status === "upcoming" ? "info" : a.status === "completed" ? "success" : "error"}
              />
            </View>

            {a.status === "upcoming" && (
              <View className="flex-row gap-xs mt-sm pt-sm border-t border-outline-variant">
                <Pressable
                  onPress={() => navigation.navigate("PreCallCheck", { appointmentId: a.id })}
                  accessibilityRole="button"
                  className="flex-1 bg-primary rounded-full py-xs items-center min-h-[40px] justify-center"
                >
                  <Text className="font-inter-semibold text-[12px] text-on-primary">Join Call</Text>
                </Pressable>
                <Pressable
                  onPress={() => navigation.navigate("RescheduleAppointment", { appointmentId: a.id })}
                  accessibilityRole="button"
                  className="flex-1 border border-outline rounded-full py-xs items-center min-h-[40px] justify-center"
                >
                  <Text className="font-inter-semibold text-[12px] text-primary">Reschedule</Text>
                </Pressable>
              </View>
            )}
            {a.status === "completed" && (
              <View className="flex-row gap-xs mt-sm pt-sm border-t border-outline-variant">
                <Pressable
                  onPress={() => navigation.navigate("PostVisitSummary", { appointmentId: a.id })}
                  accessibilityRole="button"
                  className="flex-1 border border-outline rounded-full py-xs items-center min-h-[40px] justify-center"
                >
                  <Text className="font-inter-semibold text-[12px] text-primary">Visit Summary</Text>
                </Pressable>
                {a.prescriptionId ? (
                  <Pressable
                    onPress={() => navigation.navigate("PrescriptionViewer", { prescriptionId: a.prescriptionId! })}
                    accessibilityRole="button"
                    className="flex-1 bg-secondary-container rounded-full py-xs items-center min-h-[40px] justify-center"
                  >
                    <Text className="font-inter-semibold text-[12px] text-on-secondary-container">
                      e-Prescription
                    </Text>
                  </Pressable>
                ) : null}
              </View>
            )}
          </BentoCard>
        ))
      )}
    </Screen>
  );
}
