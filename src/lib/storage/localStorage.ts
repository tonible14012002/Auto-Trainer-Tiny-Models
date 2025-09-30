export interface LocalStorage {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
}

class BrowserLocalStorage implements LocalStorage {
  async get(key: string): Promise<string | null> {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error(`Failed to get item from localStorage: ${key}`, error);
      return null;
    }
  }

  async set(key: string, value: string): Promise<void> {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error(`Failed to set item in localStorage: ${key}`, error);
      throw error;
    }
  }

  async remove(key: string): Promise<void> {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove item from localStorage: ${key}`, error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    try {
      localStorage.clear();
    } catch (error) {
      console.error("Failed to clear localStorage", error);
      throw error;
    }
  }
}

export const browserLocalStorage = new BrowserLocalStorage();