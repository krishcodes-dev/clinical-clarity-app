import React, { useState } from "react";
import { Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ProfileStackParamList } from "@/app/types";
import { Screen } from "@/ui/Screen";
import { AppHeader } from "@/ui/AppHeader";
import { Icon } from "@/ui/Icon";
import { TextField } from "@/ui/TextField";
import { PrimaryButton } from "@/ui/PrimaryButton";
import { mockUser } from "@/features/auth/mocks";
import { colors } from "@/theme";

type Props = NativeStackScreenProps<ProfileStackParamList, "EditProfile">;

/** Edit Profile - personal details form (mock save). */
export function EditProfileScreen({ navigation }: Props) {
  const [name, setName] = useState(mockUser.name);
  const [email, setEmail] = useState(mockUser.email);
  const [phone, setPhone] = useState(mockUser.phone);
  const [dob, setDob] = useState(mockUser.dob ?? "");

  return (
    <Screen contentClassName="px-md pb-lg">
      <AppHeader title="Edit Profile" />
      <View className="items-center mb-lg">
        <View className="w-20 h-20 rounded-full bg-primary-fixed items-center justify-center">
          <Text className="font-inter-bold text-headline-md text-on-primary-fixed">
            {mockUser.avatarInitials}
          </Text>
        </View>
        <View className="flex-row items-center gap-1 mt-xs">
          <Icon name="photo_camera" size={14} color={colors.secondary} />
          <Text className="font-inter-semibold text-[12px] text-secondary">Change photo</Text>
        </View>
      </View>

      <TextField label="Full name" value={name} onChangeText={setName} />
      <TextField label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <TextField label="Mobile number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
      <TextField label="Date of birth" value={dob} onChangeText={setDob} />

      <View className="flex-row items-start gap-xs bg-surface-container-low rounded-xl p-sm mb-md">
        <Icon name="info" size={16} color={colors.onSurfaceVariant} />
        <Text className="flex-1 font-inter text-[12px] text-on-surface-variant">
          Changing your mobile number requires OTP re-verification for the
          security of your health records.
        </Text>
      </View>

      <PrimaryButton label="Save Changes" icon="check" onPress={() => navigation.goBack()} />
    </Screen>
  );
}
