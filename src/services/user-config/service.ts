import type { UserConfigDetail } from "@/schema/user-config";
import { validateUserConfig, DEFAULT_USER_CONFIG } from "@/schema/user-config";
import type { ConfigService } from "./types";
import type { LocalStorage } from "@/lib/storage";
import { browserLocalStorage } from "@/lib/storage";

const STORAGE_KEY = "tiny-model-user-config";

class UserConfigService implements ConfigService {
  private subscribers: Set<(config: UserConfigDetail) => void> = new Set();
  private storage: LocalStorage;

  constructor(storage: LocalStorage) {
    this.storage = storage;
  }

  async getConfig(): Promise<UserConfigDetail> {
    try {
      const stored = await this.storage.get(STORAGE_KEY);
      if (!stored) {
        return DEFAULT_USER_CONFIG;
      }

      const parsed = JSON.parse(stored);
      const validated = validateUserConfig(parsed);
      return validated;
    } catch (error) {
      console.warn("Failed to parse user config from storage, using defaults:", error);
      return DEFAULT_USER_CONFIG;
    }
  }

  async setConfig(config: Partial<UserConfigDetail>): Promise<void> {
    try {
      const currentConfig = await this.getConfig();
      const newConfig = { ...currentConfig, ...config };
      const validated = validateUserConfig(newConfig);

      await this.storage.set(STORAGE_KEY, JSON.stringify(validated));
      this.notifySubscribers(validated);
    } catch (error) {
      console.error("Failed to save user config to storage:", error);
      throw error;
    }
  }

  async updateConfig(updates: Partial<UserConfigDetail>): Promise<void> {
    return this.setConfig(updates);
  }

  async resetConfig(): Promise<void> {
    try {
      await this.storage.remove(STORAGE_KEY);
      this.notifySubscribers(DEFAULT_USER_CONFIG);
    } catch (error) {
      console.error("Failed to reset user config:", error);
      throw error;
    }
  }

  subscribe(callback: (config: UserConfigDetail) => void): () => void {
    this.subscribers.add(callback);

    // Return unsubscribe function
    return () => {
      this.subscribers.delete(callback);
    };
  }

  private notifySubscribers(config: UserConfigDetail): void {
    this.subscribers.forEach(callback => {
      try {
        callback(config);
      } catch (error) {
        console.error("Error in config subscriber callback:", error);
      }
    });
  }
}

export const userConfigService = new UserConfigService(browserLocalStorage);