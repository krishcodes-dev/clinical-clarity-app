import React from "react";
import { ScrollView, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CareStackParamList } from "@/app/types";
import { Screen } from "@/ui/Screen";
import { Icon } from "@/ui/Icon";
import { SectionHeader } from "@/ui/SectionHeader";
import { SearchBar } from "@/ui/SearchBar";
import { BentoCard } from "@/ui/BentoCard";
import { DoctorCard } from "@/features/consultations/components/DoctorCard";
import { mockAppointments, mockDoctors, mockSpecialties } from "@/features/consultations/mocks";
import { AI_DISCLAIMER_SHORT } from "@/constants/copy";
import { colors } from "@/theme";

type Props = NativeStackScreenProps<CareStackParamList, "CareLanding">;

/** Consultations Landing - AI-insight recommendation wired in. */
export function CareLandingScreen({ navigation }: Props) {
  const upcoming = mockAppointments.filter((a) => a.status === "upcoming");

  return (
    <Screen contentClassName="px-md pb-lg">
      <Text className="font-inter-bold text-headline-lg-mobile text-on-surface mt-sm">
        Consultations
      </Text>
      <Text className="font-inter text-body-sm text-on-surface-variant mt-1">
        Find your specialist, book a video consultation in seconds.
      </Text>
      <View className="mt-sm">
        <SearchBar
          placeholder="Search doctors, specialties…"
          asButton
          onPress={() => navigation.navigate("DoctorListing")}
        />
      </View>

      {/* Upcoming appointment */}
      {upcoming.length > 0 && (
        <>
          <SectionHeader
            title="Upcoming Appointments"
            actionLabel="View all"
            onAction={() => navigation.navigate("MyAppointments")}
          />
          {upcoming.map((a) => (
            <BentoCard key={a.id} tone="lowest">
              <View className="flex-row items-center justify-between">
                <View className="flex-1 pr-sm">
                  <Text className="font-inter-semibold text-body-lg text-on-surface">
                    {a.doctorName}
                  </Text>
                  <Text className="font-inter text-[12px] text-on-surface-variant mt-0.5">
                    {a.specialty} • {a.date}, {a.time}
                  </Text>
                </View>
                <View className="items-end gap-xs">
                  <View className="bg-primary px-sm py-xs rounded-full">
                    <Text
                      className="font-inter-semibold text-[12px] text-on-primary"
                      onPress={() => navigation.navigate("PreCallCheck", { appointmentId: a.id })}
                    >
                      Join Call
                    </Text>
                  </View>
                  <Text
                    className="font-inter-medium text-[12px] text-secondary"
                    onPress={() => navigation.navigate("RescheduleAppointment", { appointmentId: a.id })}
                  >
                    Reschedule
                  </Text>
                </View>
              </View>
            </BentoCard>
          ))}
        </>
      )}

      {/* AI recommendation (deep link from insights, §7.3) */}
      <BentoCard
        tone="primary"
        className="mt-md"
        onPress={() => navigation.navigate("DoctorListing", { specialtyId: "endo" })}
        accessibilityLabel="AI insight: based on your HbA1c, find endocrinologists"
      >
        <View className="flex-row items-center gap-xs mb-1">
          <Icon name="auto_awesome" size={16} color={colors.secondaryFixedDim} />
          <Text className="font-inter-semibold text-[12px] text-secondary-fixed-dim uppercase">
            AI Insight*
          </Text>
        </View>
        <Text className="font-inter text-body-sm text-primary-fixed">
          Based on your HbA1c of 7.4%, manage your blood sugar with top
          Endocrinologists.
        </Text>
        <Text className="font-inter-semibold text-body-sm text-secondary-fixed-dim mt-xs">
          Find Specialists →
        </Text>
        <Text className="font-inter text-[10px] text-primary-fixed opacity-70 mt-xs">
          {AI_DISCLAIMER_SHORT}
        </Text>
      </BentoCard>

      {/* Specialties */}
      <SectionHeader
        title="Popular Specialties"
        actionLabel="All"
        onAction={() => navigation.navigate("SpecialtySelection")}
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row gap-sm">
          {mockSpecialties.slice(0, 6).map((s, i) => (
            <BentoCard
              key={s.id}
              tone={(["aqua", "sky", "indigo", "mint", "ice", "aqua"] as const)[i]}
              className="w-24 items-center py-sm"
              onPress={() => navigation.navigate("DoctorListing", { specialtyId: s.id })}
              accessibilityLabel={s.name}
            >
              <Icon name={s.icon} size={24} color={colors.primaryContainer} />
              <Text className="font-inter-medium text-[11px] text-on-surface mt-xs text-center">
                {s.name}
              </Text>
            </BentoCard>
          ))}
        </View>
      </ScrollView>

      {/* Recommended doctors */}
      <SectionHeader title="Recommended Specialists" />
      {mockDoctors.slice(0, 3).map((d) => (
        <DoctorCard
          key={d.id}
          doctor={d}
          onPress={() => navigation.navigate("DoctorProfile", { doctorId: d.id })}
        />
      ))}
    </Screen>
  );
}
