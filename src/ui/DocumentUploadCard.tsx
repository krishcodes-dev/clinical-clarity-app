import React from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { Icon } from "./Icon";
import { colors } from "@/theme";

export type DocumentCardStatus = "missing" | "uploading" | "uploaded" | "rejected";

interface DocumentUploadCardProps {
  icon: string;
  title: string;
  status: DocumentCardStatus;
  fileName?: string;
  rejectionReason?: string;
  onPress: () => void;
  disabled?: boolean;
}

const STATUS_CONFIG: Record<DocumentCardStatus, { label: string; cls: string; iconColor: string }> = {
  missing: { label: "Upload Document", cls: "text-secondary", iconColor: colors.secondary },
  uploading: { label: "Uploading…", cls: "text-on-surface-variant", iconColor: colors.onSurfaceVariant },
  uploaded: { label: "Uploaded", cls: "text-success", iconColor: colors.success },
  rejected: { label: "Rejected - re-upload", cls: "text-error", iconColor: colors.error },
};

export function DocumentUploadCard({
  icon,
  title,
  status,
  fileName,
  rejectionReason,
  onPress,
  disabled,
}: DocumentUploadCardProps) {
  const cfg = STATUS_CONFIG[status];
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || status === "uploading"}
      accessibilityRole="button"
      accessibilityLabel={`${title}, ${cfg.label}`}
      className={`flex-row items-center gap-sm rounded-2xl p-md mb-sm border bg-surface-container-lowest ${
        status === "rejected" ? "border-error" : "border-outline-variant"
      } ${disabled ? "opacity-50" : ""}`}
    >
      <View
        className={`w-11 h-11 rounded-full items-center justify-center ${
          status === "uploaded" ? "bg-secondary-container" : "bg-surface-container"
        }`}
      >
        <Icon name={icon} size={22} color={colors.primaryContainer} />
      </View>
      <View className="flex-1">
        <Text className="font-inter-semibold text-body-lg text-on-surface">{title}</Text>
        {status === "uploaded" && fileName ? (
          <Text className="font-inter text-[12px] text-on-surface-variant" numberOfLines={1}>
            {fileName}
          </Text>
        ) : null}
        {status === "rejected" && rejectionReason ? (
          <Text className="font-inter text-[12px] text-error" numberOfLines={2}>
            {rejectionReason}
          </Text>
        ) : null}
      </View>
      {status === "uploading" ? (
        <ActivityIndicator color={colors.secondary} />
      ) : (
        <View className="flex-row items-center gap-1">
          <Text className={`font-inter-semibold text-[12px] ${cfg.cls}`}>{cfg.label}</Text>
          <Icon
            name={status === "uploaded" ? "check_circle" : "chevron_right"}
            size={18}
            color={cfg.iconColor}
          />
        </View>
      )}
    </Pressable>
  );
}
