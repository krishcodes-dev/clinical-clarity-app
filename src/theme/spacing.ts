/**
 * Spacing scale from the prototype (base-4 grid).
 */
export const spacing = {
  base: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  gutter: 16,
  marginMobile: 16,
} as const;

export const radius = {
  sm: 4,
  lg: 8,
  xl: 12,
  "2xl": 16,
  "3xl": 24,
  full: 9999,
} as const;

/** Minimum touch target per the UX review accessibility pass (48dp). */
export const MIN_TOUCH_TARGET = 48;
