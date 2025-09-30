import { useCallback, useEffect, useState } from "react";
import { favoritesService } from "@/services/favorites";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load favorites on mount
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const currentFavorites = await favoritesService.getFavorites();
        setFavorites(currentFavorites);
      } catch (error) {
        console.error("Failed to load favorites:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();
  }, []);

  // Subscribe to favorites changes
  useEffect(() => {
    const unsubscribe = favoritesService.subscribe((newFavorites) => {
      setFavorites(newFavorites);
    });

    return unsubscribe;
  }, []);

  const addFavorite = useCallback(async (modelId: string) => {
    try {
      await favoritesService.addFavorite(modelId);
    } catch (error) {
      console.error("Failed to add favorite:", error);
      throw error;
    }
  }, []);

  const removeFavorite = useCallback(async (modelId: string) => {
    try {
      await favoritesService.removeFavorite(modelId);
    } catch (error) {
      console.error("Failed to remove favorite:", error);
      throw error;
    }
  }, []);

  const toggleFavorite = useCallback(async (modelId: string) => {
    const isFav = favorites.includes(modelId);
    if (isFav) {
      await removeFavorite(modelId);
    } else {
      await addFavorite(modelId);
    }
  }, [favorites, addFavorite, removeFavorite]);

  const isFavorite = useCallback((modelId: string) => {
    return favorites.includes(modelId);
  }, [favorites]);

  return {
    favorites,
    isLoading,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
  };
};