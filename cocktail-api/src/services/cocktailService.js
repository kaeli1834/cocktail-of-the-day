const axios = require('axios');

class CocktailService {
  constructor() {
    this.cache = new Map();
    this.cacheExpiry = 24 * 60 * 60 * 1000; // 24 heures en milliseconds
    this.baseUrl = 'https://www.thecocktaildb.com/api/json/v1/1';
  }

  // Cache management
  getCacheKey(endpoint) {
    return endpoint;
  }

  isExpired(timestamp) {
    return Date.now() - timestamp > this.cacheExpiry;
  }

  getFromCache(key) {
    const cached = this.cache.get(key);
    if (cached && !this.isExpired(cached.timestamp)) {
      return cached.data;
    }
    if (cached) {
      this.cache.delete(key);
    }
    return null;
  }

  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  async makeRequest(endpoint) {
    const cacheKey = this.getCacheKey(endpoint);
    const cached = this.getFromCache(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      const response = await axios.get(`${this.baseUrl}${endpoint}`);
      const data = response.data;
      this.setCache(cacheKey, data);
      return data;
    } catch (error) {
      throw new Error(`API request failed: ${error.message}`);
    }
  }

  async getAllAlcoholicCocktails() {
    return this.makeRequest('/filter.php?a=Alcoholic');
  }

  async getCocktailById(id) {
    return this.makeRequest(`/lookup.php?i=${id}`);
  }

  async searchCocktails(query) {
    return this.makeRequest(`/search.php?s=${encodeURIComponent(query)}`);
  }

  async getRandomCocktail() {
    return this.makeRequest('/random.php');
  }

  async getDailyCocktail() {
    try {
      // Get all alcoholic cocktails
      const listData = await this.getAllAlcoholicCocktails();
      const cocktails = listData.drinks;

      if (!cocktails || cocktails.length === 0) {
        throw new Error('No cocktails found');
      }

      // Generate deterministic index based on current date
      const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
      const seed = parseInt(today.replaceAll('-', ''), 10);
      const index = seed % cocktails.length;
      const cocktailId = cocktails[index].idDrink;

      // Get detailed information
      const detailData = await this.getCocktailById(cocktailId);
      const drink = detailData.drinks[0];

      return this.formatCocktail(drink);
    } catch (error) {
      throw new Error(`Failed to get daily cocktail: ${error.message}`);
    }
  }

  formatCocktail(drink) {
    return {
      id: drink.idDrink,
      name: drink.strDrink,
      image: drink.strDrinkThumb,
      instructions: drink.strInstructions,
      ingredients: this.extractIngredients(drink),
      category: drink.strCategory,
      alcoholic: drink.strAlcoholic,
      glass: drink.strGlass
    };
  }

  extractIngredients(drink) {
    const ingredients = [];
    for (let i = 1; i <= 15; i++) {
      const ingredient = drink[`strIngredient${i}`];
      const measure = drink[`strMeasure${i}`];
      if (ingredient) {
        ingredients.push(`${measure ? measure.trim() : ''} ${ingredient.trim()}`.trim());
      }
    }
    return ingredients;
  }

  // Clear cache (useful for testing or manual refresh)
  clearCache() {
    this.cache.clear();
  }

  // Get cache stats
  getCacheStats() {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys())
    };
  }
}

module.exports = new CocktailService();