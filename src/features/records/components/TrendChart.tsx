import React from "react";
import { Text, View } from "react-native";
import Svg, { Circle, Line, Path, Text as SvgText } from "react-native-svg";
import { Icon } from "@/ui/Icon";
import { colors } from "@/theme";
import { TrendSeries } from "../types";

const W = 320;
const H = 140;
const PAD = { l: 8, r: 8, t: 12, b: 24 };

/**
 * SVG line chart for longitudinal markers. Direction is encoded with an
 * arrow + label, never color alone (UX review §7.2 color-blind safety).
 */
export function TrendChart({ series }: { series: TrendSeries }) {
  const pts = series.points;
  const min = Math.min(...pts.map((p) => p.value));
  const max = Math.max(...pts.map((p) => p.value));
  const span = max - min || 1;

  const x = (i: number) =>
    PAD.l + (i / (pts.length - 1)) * (W - PAD.l - PAD.r);
  const y = (v: number) =>
    PAD.t + (1 - (v - min) / span) * (H - PAD.t - PAD.b);

  const d = pts
    .map((p, i) => `${i === 0 ? "M" : "L"} ${x(i).toFixed(1)} ${y(p.value).toFixed(1)}`)
    .join(" ");

  const dirCfg =
    series.direction === "improving"
      ? { icon: "trending_up", label: "Improving", color: colors.secondary }
      : series.direction === "worsening"
      ? { icon: "trending_down", label: "Needs attention", color: colors.error }
      : { icon: "trending_flat", label: "Stable", color: colors.onSurfaceVariant };

  return (
    <View
      className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-md"
      accessible
      accessibilityLabel={`${series.name} trend: ${dirCfg.label}, ${series.changePct > 0 ? "+" : ""}${series.changePct}%. ${series.latestSummary}`}
    >
      <View className="flex-row items-center justify-between mb-xs">
        <View>
          <Text className="font-inter-medium text-medical-term text-on-surface-variant uppercase">
            {series.name}
          </Text>
          <Text className="font-inter text-[12px] text-on-surface-variant mt-0.5">
            {series.latestSummary}
          </Text>
        </View>
        <View className="flex-row items-center gap-1">
          <Icon name={dirCfg.icon} size={18} color={dirCfg.color} />
          <Text className="font-inter-bold text-body-lg" style={{ color: dirCfg.color }}>
            {series.changePct > 0 ? "+" : ""}
            {series.changePct}%
          </Text>
        </View>
      </View>
      <Svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`}>
        <Line
          x1={PAD.l}
          y1={H - PAD.b}
          x2={W - PAD.r}
          y2={H - PAD.b}
          stroke={colors.outlineVariant}
          strokeWidth={1}
        />
        <Path d={d} stroke={colors.primaryContainer} strokeWidth={2.5} fill="none" />
        {pts.map((p, i) => (
          <Circle
            key={p.label}
            cx={x(i)}
            cy={y(p.value)}
            r={i === pts.length - 1 ? 5 : 3.5}
            fill={i === pts.length - 1 ? colors.secondary : colors.surfaceContainerLowest}
            stroke={colors.primaryContainer}
            strokeWidth={2}
          />
        ))}
        {pts.map((p, i) =>
          i === 0 || i === pts.length - 1 ? (
            <SvgText
              key={`l-${p.label}`}
              x={x(i)}
              y={H - 8}
              fontSize={10}
              fill={colors.onSurfaceVariant}
              textAnchor={i === 0 ? "start" : "end"}
            >
              {p.label}
            </SvgText>
          ) : null
        )}
      </Svg>
    </View>
  );
}
