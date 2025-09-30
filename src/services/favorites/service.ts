import type { FavoritesService } from "./types";
import type { LocalStorage } from "@/lib/storage";
import { browserLocalStorage } from "@/lib/storage";

const STORAGE_KEY = "tiny-model-favorites";

class FavoritesServiceImpl implements FavoritesService {
  private subscribers: Set<(favorites: string[]) => void> = new Set();
  private storage: LocalStorage;

  constructor(storage: LocalStorage) {
    this.storage = storage;
  }

  async getFavorites(): Promise<string[]> {
    try {
      const stored = await this.storage.get(STORAGE_KEY);
      if (!stored) {
        return [];
      }

      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.warn("Failed to parse favorites from storage:", error);
      return [];
    }
  }

  async addFavorite(modelId: string): Promise<void> {
    try {
      const currentFavorites = await this.getFavorites();
      if (!currentFavorites.includes(modelId)) {
        const newFavorites = [...currentFavorites, modelId];
        await this.storage.set(STORAGE_KEY, JSON.stringify(newFavorites));
        this.notifySubscribers(newFavorites);
      }
    } catch (error) {
      console.error("Failed to add favorite to storage:", error);
      throw error;
    }
  }

  async removeFavorite(modelId: string): Promise<void> {
    try {
      const currentFavorites = await this.getFavorites();
      const newFavorites = currentFavorites.filter(id => id !== modelId);
      await this.storage.set(STORAGE_KEY, JSON.stringify(newFavorites));
      this.notifySubscribers(newFavorites);
    } catch (error) {
      console.error("Failed to remove favorite from storage:", error);
      throw error;
    }
  }

  async isFavorite(modelId: string): Promise<boolean> {
    const favorites = await this.getFavorites();
    return favorites.includes(modelId);
  }

  subscribe(callback: (favorites: string[]) => void): () => void {
    this.subscribers.add(callback);

    // Return unsubscribe function
    return () => {
      this.subscribers.delete(callback);
    };
  }

  private notifySubscribers(favorites: string[]): void {
    this.subscribers.forEach(callback => {
      try {
        callback(favorites);
      } catch (error) {
        console.error("Error in favorites subscriber callback:", error);
      }
    });
  }
}

export const favoritesService = new FavoritesServiceImpl(browserLocalStorage);