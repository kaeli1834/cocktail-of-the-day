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