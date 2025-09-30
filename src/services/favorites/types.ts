export interface FavoritesService {
  getFavorites(): Promise<string[]>;
  addFavorite(modelId: string): Promise<void>;
  removeFavorite(modelId: string): Promise<void>;
  isFavorite(modelId: string): Promise<boolean>;
  subscribe(callback: (favorites: string[]) => void): () => void;
}