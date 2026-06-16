import React from "react";
import { ScrollView, View, ViewProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ScreenProps extends ViewProps {
  /** Wrap children in a ScrollView (default true). */
  scroll?: boolean;
  /** Edges default: top only - bottom handled by tab bar / sticky CTAs. */
  edges?: ("top" | "bottom" | "left" | "right")[];
  contentClassName?: string;
  children: React.ReactNode;
}

/** Base screen wrapper: clinical background + safe area. */
export function Screen({
  scroll = true,
  edges = ["top"],
  contentClassName = "px-md pb-lg",
  children,
  ...rest
}: ScreenProps) {
  return (
    <SafeAreaView edges={edges} className="flex-1 bg-background" {...rest}>
      {scroll ? (
        <ScrollView
          className="flex-1"
          contentContainerClassName={contentClassName}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      ) : (
        <View className={`flex-1 ${contentClassName}`}>{children}</View>
      )}
    </SafeAreaView>
  );
}
