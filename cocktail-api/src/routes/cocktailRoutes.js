const express = require('express');
const cocktailController = require('../controllers/cocktailController');

const router = express.Router();

// Main routes
router.get('/daily-cocktail', cocktailController.getDailyCocktail);
router.get('/random-cocktail', cocktailController.getRandomCocktail);
router.get('/search', cocktailController.searchCocktails);
router.get('/cocktail/:id', cocktailController.getCocktailById);

// Admin/Debug routes
router.get('/cache/stats', cocktailController.getCacheStats);
router.delete('/cache', cocktailController.clearCache);

module.exports = router;