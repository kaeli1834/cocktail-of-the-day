const cocktailService = require('../services/cocktailService');

class CocktailController {
  async getDailyCocktail(req, res) {
    try {
      const cocktail = await cocktailService.getDailyCocktail();
      res.json(cocktail);
    } catch (error) {
      console.error('Error getting daily cocktail:', error.message);
      res.status(500).json({ 
        error: 'Unable to fetch daily cocktail',
        message: error.message 
      });
    }
  }

  async getRandomCocktail(req, res) {
    try {
      const data = await cocktailService.getRandomCocktail();
      const cocktail = cocktailService.formatCocktail(data.drinks[0]);
      res.json(cocktail);
    } catch (error) {
      console.error('Error getting random cocktail:', error.message);
      res.status(500).json({ 
        error: 'Unable to fetch random cocktail',
        message: error.message 
      });
    }
  }

  async searchCocktails(req, res) {
    try {
      const { q } = req.query;
      
      if (!q || q.trim().length < 2) {
        return res.status(400).json({ 
          error: 'Search query must be at least 2 characters long' 
        });
      }

      const data = await cocktailService.searchCocktails(q);
      
      if (!data.drinks) {
        return res.json({ cocktails: [], count: 0 });
      }

      const cocktails = data.drinks.map(drink => cocktailService.formatCocktail(drink));
      res.json({ 
        cocktails, 
        count: cocktails.length,
        query: q 
      });
    } catch (error) {
      console.error('Error searching cocktails:', error.message);
      res.status(500).json({ 
        error: 'Unable to search cocktails',
        message: error.message 
      });
    }
  }

  async getCocktailById(req, res) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({ error: 'Cocktail ID is required' });
      }

      const data = await cocktailService.getCocktailById(id);
      
      if (!data.drinks) {
        return res.status(404).json({ error: 'Cocktail not found' });
      }

      const cocktail = cocktailService.formatCocktail(data.drinks[0]);
      res.json(cocktail);
    } catch (error) {
      console.error('Error getting cocktail by ID:', error.message);
      res.status(500).json({ 
        error: 'Unable to fetch cocktail',
        message: error.message 
      });
    }
  }

  async getCocktailsByIngredients(req, res) {
    try {
      const { ingredients } = req.query;

      if (!ingredients) {
        return res.status(400).json({ error: 'Ingredients query parameter is required' });
      }

      const ingredientList = ingredients.split(',').map(ing => ing.trim()).filter(ing => ing.length > 0);
      
      if (ingredientList.length === 0) {
        return res.status(400).json({ error: 'At least one valid ingredient is required' });
      }

      let data = [];

      let isPrecised = ingredientList.includes("Alcoholic") || ingredientList.includes("Non_Alcoholic");
      
      // Handle special cases for "Alcoholic" and "Non_Alcoholic"
      if (ingredientList.includes("Alcoholic")) {
        const result = await cocktailService.getAllAlcoholicCocktails(true);
        if (result && result.drinks) {
          data.push(result);
        }
      }

      if (ingredientList.includes("Non_Alcoholic")) {
        const result = await cocktailService.getAllAlcoholicCocktails(false);
        if (result && result.drinks) {
          data.push(result);
        }
      }

      if (isPrecised) {
        // Flatten all drinks arrays from data and format them
        const cocktails = data
          .filter(d => d && d.drinks)
          .flatMap(d => d.drinks)
          .map(drink => cocktailService.formatCocktail(drink));
        data = { drinks: cocktails };
      } else {
        data = await cocktailService.getCocktailsByIngredients(ingredientList);
      }

      if (!data.drinks || data.drinks.length === 0) {
        return res.json({ cocktails: [], count: 0 });
      }

      res.json({ 
        cocktails: data.drinks,
        count: data.drinks.length
      });
    } catch (error) {
      console.error('Error getting cocktails by ingredients:', error.message);
      if (error.response && error.response.status === 429) {
        return res.status(429).json({
          error: 'Rate limit exceeded. Please try again later.',
          message: error.message
        });
      }
      res.status(500).json({ 
        error: 'Unable to fetch cocktails by ingredients',
        message: error.message 
      });
    }
  }

  // Admin/Debug endpoints
  async getCacheStats(req, res) {
    try {
      const stats = cocktailService.getCacheStats();
      res.json(stats);
    } catch (error) {
      console.error('Error getting cache stats:', error.message);
      res.status(500).json({ 
        error: 'Unable to fetch cache stats',
        message: error.message 
      });
    }
  }

  async clearCache(req, res) {
    try {
      cocktailService.clearCache();
      res.json({ message: 'Cache cleared successfully' });
    } catch (error) {
      console.error('Error clearing cache:', error.message);
      res.status(500).json({ 
        error: 'Unable to clear cache',
        message: error.message 
      });
    }
  }
}

module.exports = new CocktailController();