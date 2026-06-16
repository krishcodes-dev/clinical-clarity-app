import React, { useRef } from "react";
import { TextInput, View } from "react-native";
import { colors } from "@/theme";

interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (v: string) => void;
  error?: boolean;
}

/**
 * 6-digit OTP field group. Single hidden value, individual boxes -
 * grouped for assistive tech (UX review §7.2).
 */
export function OTPInput({ length = 6, value, onChange, error }: OTPInputProps) {
  const ref = useRef<TextInput>(null);

  return (
    <View
      accessible
      accessibilityLabel={`One time password, ${length} digits, ${value.length} entered`}
    >
      <View className="flex-row justify-center gap-xs">
        {Array.from({ length }).map((_, i) => (
          <View
            key={i}
            className={`w-12 h-14 rounded-xl border-2 items-center justify-center ${
              error
                ? "border-error bg-error-container/30"
                : i === value.length
                ? "border-primary bg-surface-container-lowest"
                : "border-outline-variant bg-surface-container-lowest"
            }`}
          >
            <TextInput
              editable={false}
              value={value[i] ?? ""}
              className="font-inter-bold text-headline-md text-on-surface text-center"
            />
          </View>
        ))}
      </View>
      <TextInput
        ref={ref}
        autoFocus
        value={value}
        onChangeText={(t) => onChange(t.replace(/\D/g, "").slice(0, length))}
        keyboardType="number-pad"
        maxLength={length}
        caretHidden
        className="absolute opacity-0 w-full h-full"
        accessibilityLabel="Enter OTP digits"
      />
    </View>
  );
}
