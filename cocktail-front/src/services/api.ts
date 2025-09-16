import axios, { type AxiosResponse } from 'axios';
import type { Cocktail } from '../Types/Cocktail';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    throw error;
  }
);

export interface SearchResponse {
  data: { cocktails: Cocktail[], drinks: Cocktail[] }; // Adjusted to match expected response structure
  cocktails: Cocktail[];
  count: number;
  query: string;
}

export interface CocktailsByIngredientsResponse {
  cocktails: Cocktail[];
  count: number;
}

export interface HealthResponse {
  status: string;
  timestamp: string;
  uptime: number;
  version: string;
}

export interface CacheStats {
  size: number;
  entries: string[];
}

class CocktailAPI {
  // Get daily cocktail
  async getDailyCocktail(): Promise<Cocktail> {
    const response: AxiosResponse<Cocktail> = await apiClient.get('/api/daily-cocktail');
    return response.data;
  }

  // Get random cocktail
  async getRandomCocktail(): Promise<Cocktail> {
    const response: AxiosResponse<Cocktail> = await apiClient.get('/api/random-cocktail');
    return response.data;
  }

  // Search cocktails
  async searchCocktails(query: string): Promise<SearchResponse> {
    const response: AxiosResponse<SearchResponse> = await apiClient.get('/api/search', {
      params: { q: query }
    });
    return response.data;
  }

  // Get cocktails by ingredients
  async getCocktailsByIngredients(ingredients: string[]): Promise<CocktailsByIngredientsResponse> {
    const response: AxiosResponse<CocktailsByIngredientsResponse> = await apiClient.get('/api/cocktail/ingredients', {
      params: { ingredients: ingredients.join(',') }
    });
    return response.data;
  }

  // Get cocktail by ID
  async getCocktailById(id: string): Promise<Cocktail> {
    const response: AxiosResponse<Cocktail> = await apiClient.get(`/api/cocktail/${id}`);
    return response.data;
  }

  // Health check
  async getHealth(): Promise<HealthResponse> {
    const response: AxiosResponse<HealthResponse> = await apiClient.get('/health');
    return response.data;
  }

  // Get cache statistics (admin)
  async getCacheStats(): Promise<CacheStats> {
    const response: AxiosResponse<CacheStats> = await apiClient.get('/api/cache/stats');
    return response.data;
  }

  // Clear cache (admin)
  async clearCache(): Promise<{ message: string }> {
    const response = await apiClient.delete('/api/cache');
    return response.data;
  }
}

// Export singleton instance
export const cocktailAPI = new CocktailAPI();
export default cocktailAPI;