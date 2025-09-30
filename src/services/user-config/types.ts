import type { UserConfigDetail } from "@/schema/user-config";

export interface ConfigService {
  getConfig(): Promise<UserConfigDetail>;
  setConfig(config: Partial<UserConfigDetail>): Promise<void>;
  updateConfig(updates: Partial<UserConfigDetail>): Promise<void>;
  resetConfig(): Promise<void>;
  subscribe(callback: (config: UserConfigDetail) => void): () => void;
}