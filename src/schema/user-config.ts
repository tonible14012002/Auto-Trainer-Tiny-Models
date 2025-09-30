export interface UserConfigDetail {
  expertMode: boolean;
  autoLoadModel: boolean;
}

export const DEFAULT_USER_CONFIG: UserConfigDetail = {
  expertMode: false,
  autoLoadModel: false,
};

// Validation function
export function validateUserConfig(data: unknown): UserConfigDetail {
  if (!data || typeof data !== 'object') {
    return DEFAULT_USER_CONFIG;
  }

  const config = data as Record<string, unknown>;

  return {
    expertMode: typeof config.expertMode === 'boolean' ? config.expertMode : DEFAULT_USER_CONFIG.expertMode,
    autoLoadModel: typeof config.autoLoadModel === 'boolean' ? config.autoLoadModel : DEFAULT_USER_CONFIG.autoLoadModel,
  };
}

// Legacy exports for backward compatibility
export type UserConfig = UserConfigDetail;