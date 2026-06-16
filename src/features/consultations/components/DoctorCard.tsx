import React from "react";
import { Text, View } from "react-native";
import { BentoCard } from "@/ui/BentoCard";
import { Icon } from "@/ui/Icon";
import { colors } from "@/theme";
import { Doctor } from "../types";
import { formatINR } from "@/utils/currency";

interface DoctorCardProps {
  doctor: Doctor;
  onPress: () => void;
}

export function DoctorCard({ doctor, onPress }: DoctorCardProps) {
  return (
    <BentoCard
      onPress={onPress}
      className="mb-sm"
      accessibilityLabel={`${doctor.name}, ${doctor.specialty}, ${doctor.yearsExp} years experience, rated ${doctor.rating}`}
    >
      <View className="flex-row items-center gap-sm">
        <View className="w-14 h-14 rounded-full bg-primary-fixed items-center justify-center">
          <Text className="font-inter-bold text-body-lg text-on-primary-fixed">
            {doctor.name.replace("Dr. ", "").split(" ").map((n) => n[0]).join("")}
          </Text>
        </View>
        <View className="flex-1">
          <Text className="font-inter-semibold text-body-lg text-on-surface">
            {doctor.name}
          </Text>
          <Text className="font-inter text-body-sm text-on-surface-variant">
            {doctor.specialty} • {doctor.yearsExp} yrs exp.
          </Text>
          <View className="flex-row items-center gap-1 mt-0.5">
            <Icon name="star" size={14} color="#eab308" />
            <Text className="font-inter-medium text-[12px] text-on-surface">
              {doctor.rating.toFixed(1)}
            </Text>
            <Text className="font-inter text-[12px] text-on-surface-variant">
              ({doctor.reviews})
            </Text>
          </View>
        </View>
        <View className="items-end">
          <Text className="font-inter-bold text-body-lg text-primary">{formatINR(doctor.fee)}</Text>
          <Text className="font-inter text-[11px] text-on-surface-variant">per visit</Text>
        </View>
      </View>
      <View className="flex-row items-center gap-xs mt-sm pt-sm border-t border-outline-variant">
        <Text className="font-inter text-[12px] text-on-surface-variant">Next available:</Text>
        {doctor.nextSlots.slice(0, 3).map((s) => (
          <View key={s} className="bg-surface-container px-xs py-1 rounded-lg">
            <Text className="font-inter-medium text-[11px] text-on-surface">{s}</Text>
          </View>
        ))}
      </View>
    </BentoCard>
  );
}
