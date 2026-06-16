import React from "react";
import { Text, TextInput, TextInputProps, View } from "react-native";
import { colors } from "@/theme";

interface TextFieldProps extends TextInputProps {
  label: string;
  error?: string;
}

export function TextField({ label, error, ...rest }: TextFieldProps) {
  return (
    <View className="mb-md">
      <Text className="font-inter-medium text-body-sm text-on-surface-variant mb-1">
        {label}
      </Text>
      <TextInput
        placeholderTextColor={colors.outline}
        accessibilityLabel={label}
        className={`bg-surface-container-lowest border rounded-xl px-md min-h-[52px] font-inter text-body-lg text-on-surface ${
          error ? "border-error" : "border-outline-variant"
        }`}
        {...rest}
      />
      {error ? (
        <Text className="font-inter text-[12px] text-error mt-1">{error}</Text>
      ) : null}
    </View>
  );
}
