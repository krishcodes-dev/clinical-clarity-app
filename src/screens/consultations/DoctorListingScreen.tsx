import React from "react";
import { Text } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CareStackParamList } from "@/app/types";
import { Screen } from "@/ui/Screen";
import { AppHeader } from "@/ui/AppHeader";
import { DoctorCard } from "@/features/consultations/components/DoctorCard";
import { EmptyState } from "@/ui/EmptyState";
import { mockDoctors, mockSpecialties } from "@/features/consultations/mocks";

type Props = NativeStackScreenProps<CareStackParamList, "DoctorListing">;

/** Doctor Listing - optionally filtered by specialty (AI deep-link target). */
export function DoctorListingScreen({ navigation, route }: Props) {
  const specialtyId = route.params?.specialtyId;
  const specialty = mockSpecialties.find((s) => s.id === specialtyId);
  const doctors = specialtyId
    ? mockDoctors.filter((d) => d.specialtyId === specialtyId)
    : mockDoctors;

  return (
    <Screen scroll={doctors.length > 0} contentClassName="px-md pb-lg">
      <AppHeader title={specialty ? specialty.name : "All Doctors"} />
      {doctors.length === 0 ? (
        <EmptyState
          icon="person_search"
          title="No doctors available"
          body="No specialists are listed in this category right now. Try a related specialty."
          primaryLabel="Browse Specialties"
          onPrimary={() => navigation.navigate("SpecialtySelection")}
        />
      ) : (
        <>
          <Text className="font-inter text-body-sm text-on-surface-variant mb-md">
            {doctors.length} specialist{doctors.length > 1 ? "s" : ""} available
            for video, audio or chat consults
          </Text>
          {doctors.map((d) => (
            <DoctorCard
              key={d.id}
              doctor={d}
              onPress={() => navigation.navigate("DoctorProfile", { doctorId: d.id })}
            />
          ))}
        </>
      )}
    </Screen>
  );
}
