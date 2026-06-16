import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CareStackParamList } from "@/app/types";
import { AppHeader } from "@/ui/AppHeader";
import { Icon } from "@/ui/Icon";
import { mockAppointments, mockChat } from "@/features/consultations/mocks";
import { colors } from "@/theme";
import { ChatMessage } from "@/features/consultations/types";

type Props = NativeStackScreenProps<CareStackParamList, "ChatConsult">;

/**
 * NEW SCREEN (UX review §5, P1): chat consultation thread - feature 4
 * promises chat consults; none existed in the prototype.
 */
export function ChatConsultScreen({ navigation, route }: Props) {
  const apt = mockAppointments.find((a) => a.id === route.params.appointmentId) ?? mockAppointments[0];
  const [messages, setMessages] = useState<ChatMessage[]>(mockChat);
  const [draft, setDraft] = useState("");

  const send = () => {
    if (!draft.trim()) return;
    setMessages((m) => [
      ...m,
      { id: `c-${Date.now()}`, from: "user", text: draft.trim(), time: "Now" },
    ]);
    setDraft("");
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          id: `c-${Date.now()}-d`,
          from: "doctor",
          text: "Thanks for sharing, noted. Anything else before I write up your plan?",
          time: "Now",
        },
      ]);
    }, 1200);
  };

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-background">
      <AppHeader
        title={apt.doctorName}
        actions={[
          {
            icon: "task_alt",
            label: "End consultation",
            onPress: () => navigation.replace("PostVisitSummary", { appointmentId: apt.id }),
          },
        ]}
      />
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView className="flex-1 px-md" contentContainerClassName="pb-md">
          {messages.map((m) =>
            m.from === "system" ? (
              <View key={m.id} className="items-center my-sm">
                <View className="flex-row items-center gap-1 bg-surface-container px-sm py-1 rounded-full">
                  <Icon name="lock" size={12} color={colors.secondary} />
                  <Text className="font-inter text-[11px] text-on-surface-variant">{m.text}</Text>
                </View>
              </View>
            ) : (
              <View
                key={m.id}
                className={`max-w-[80%] rounded-2xl p-sm mb-xs ${
                  m.from === "user"
                    ? "self-end bg-primary rounded-br-md"
                    : "self-start bg-surface-container-lowest border border-outline-variant rounded-bl-md"
                }`}
                accessible
                accessibilityLabel={`${m.from === "user" ? "You" : apt.doctorName}: ${m.text}`}
              >
                <Text
                  className={`font-inter text-body-sm ${
                    m.from === "user" ? "text-on-primary" : "text-on-surface"
                  }`}
                >
                  {m.text}
                </Text>
                <Text
                  className={`font-inter text-[10px] mt-1 ${
                    m.from === "user" ? "text-primary-fixed" : "text-outline"
                  }`}
                >
                  {m.time}
                </Text>
              </View>
            )
          )}
        </ScrollView>
        <View className="flex-row items-center gap-xs px-md pb-md pt-xs bg-background">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Attach report"
            className="w-11 h-11 rounded-full bg-surface-container items-center justify-center"
          >
            <Icon name="attach_file" size={20} color={colors.onSurfaceVariant} />
          </Pressable>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Type your message…"
            placeholderTextColor={colors.outline}
            accessibilityLabel="Message input"
            className="flex-1 bg-surface-container-lowest border border-outline-variant rounded-full px-md min-h-[44px] font-inter text-body-sm text-on-surface"
            onSubmitEditing={send}
            returnKeyType="send"
          />
          <Pressable
            onPress={send}
            accessibilityRole="button"
            accessibilityLabel="Send message"
            className="w-11 h-11 rounded-full bg-primary items-center justify-center"
          >
            <Icon name="send" size={18} color={colors.onPrimary} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
