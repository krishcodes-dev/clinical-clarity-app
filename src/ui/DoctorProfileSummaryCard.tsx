import React from "react";
import { Text, View } from "react-native";
import { BentoCard } from "./BentoCard";
import { DoctorProfile } from "@/features/doctorOnboarding/types";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between py-1.5">
      <Text className="font-inter text-body-sm text-on-surface-variant">{label}</Text>
      <Text className="font-inter-medium text-body-sm text-on-surface flex-1 text-right ml-md">
        {value}
      </Text>
    </View>
  );
}

export function DoctorProfileSummaryCard({ profile }: { profile: DoctorProfile }) {
  return (
    <BentoCard tone="lowest" className="mb-md">
      <Text className="font-inter-semibold text-headline-md text-on-surface mb-sm">
        Profile Summary
      </Text>
      <Row label="Registration Number" value={profile.registrationNumber ?? "—"} />
      <Row label="Qualification" value={profile.qualification ?? "—"} />
      <Row label="Specialization" value={profile.specialization ?? "—"} />
      <Row
        label="Experience"
        value={profile.yearsOfExperience != null ? `${profile.yearsOfExperience} years` : "—"}
      />
      <Row
        label="Consultation Fee"
        value={profile.consultationFee != null ? `₹${profile.consultationFee}` : "—"}
      />
      <Row label="Hospital" value={profile.currentHospital ?? "—"} />
      {profile.bio ? (
        <View className="mt-sm">
          <Text className="font-inter text-body-sm text-on-surface-variant mb-1">Bio</Text>
          <Text className="font-inter text-body-sm text-on-surface">{profile.bio}</Text>
        </View>
      ) : null}
    </BentoCard>
  );
}
