/**
 * Feature flags for the application
 * Flags are controlled via environment variables
 */
export const featureFlags = {
  /**
   * Enable the new multi-screen calculator experience
   * When false, shows the original single-page calculator
   */
  multiScreenCalculator:
    process.env.NEXT_PUBLIC_ENABLE_MULTISCREEN_CALCULATOR === 'true',
} as const;

export type FeatureFlags = typeof featureFlags;
