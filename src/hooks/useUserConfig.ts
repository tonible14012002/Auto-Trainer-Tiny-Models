import { useState, useEffect, useCallback } from "react";
import type { UserConfigDetail } from "@/schema/user-config";
import { userConfigService } from "@/services/user-config";

export function useUserConfig() {
  const [config, setConfig] = useState<UserConfigDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load initial config
  useEffect(() => {
    const loadConfig = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const userConfig = await userConfigService.getConfig();
        setConfig(userConfig);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to load config"));
      } finally {
        setIsLoading(false);
      }
    };

    loadConfig();
  }, []);

  // Subscribe to config changes
  useEffect(() => {
    const unsubscribe = userConfigService.subscribe((newConfig) => {
      setConfig(newConfig);
    });

    return unsubscribe;
  }, []);

  const updateConfig = useCallback(async (updates: Partial<UserConfigDetail>) => {
    try {
      setError(null);
      await userConfigService.updateConfig(updates);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to update config"));
      throw err;
    }
  }, []);

  const resetConfig = useCallback(async () => {
    try {
      setError(null);
      await userConfigService.resetConfig();
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to reset config"));
      throw err;
    }
  }, []);

  return {
    config,
    isLoading,
    error,
    updateConfig,
    resetConfig,
  };
}