import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { OnboardingStackParamList } from "@/app/types";
import { OnboardingShell } from "./OnboardingShell";
import { TextField } from "@/ui/TextField";

type Props = NativeStackScreenProps<OnboardingStackParamList, "BasicProfile">;

const GENDERS = ["Female", "Male", "Other", "Prefer not to say"];

/** Mandatory step - demographics drive reference ranges & recommendations. */
export function BasicProfileScreen({ navigation }: Props) {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState<string | null>(null);

  return (
    <OnboardingShell
      step={3}
      title="A few basics"
      subtitle="Reference ranges and recommendations depend on age and sex."
      ctaLabel="Continue"
      ctaDisabled={!name || !dob || !gender}
      onNext={() => navigation.navigate("HealthInterests")}
    >
      <View className="mt-sm">
        <TextField label="Full name" placeholder="e.g. Arjun Mehta" value={name} onChangeText={setName} />
        <TextField
          label="Date of birth"
          placeholder="DD / MM / YYYY"
          value={dob}
          onChangeText={setDob}
          keyboardType="numbers-and-punctuation"
        />
        <Text className="font-inter-medium text-body-sm text-on-surface-variant mb-1">
          Gender
        </Text>
        <View className="flex-row flex-wrap gap-xs">
          {GENDERS.map((g) => (
            <Pressable
              key={g}
              onPress={() => setGender(g)}
              accessibilityRole="radio"
              accessibilityState={{ selected: gender === g }}
              className={`px-md py-sm rounded-full border min-h-[44px] justify-center ${
                gender === g
                  ? "border-primary bg-primary-fixed"
                  : "border-outline-variant bg-surface-container-lowest"
              }`}
            >
              <Text
                className={`font-inter-medium text-body-sm ${
                  gender === g ? "text-on-primary-fixed" : "text-on-surface"
                }`}
              >
                {g}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </OnboardingShell>
  );
}
