const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Route cocktail du jour
app.get("/api/daily-cocktail", async (req, res) => {
  try {
    // Étape 1 : récupérer tous les cocktails
    const listRes = await axios.get("https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Alcoholic");
    const cocktails = listRes.data.drinks;

    // Étape 2 : générer un index basé sur la date
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const seed = parseInt(today.replaceAll("-", ""), 10);
    const index = seed % cocktails.length;
    const cocktailId = cocktails[index].idDrink;

    // Étape 3 : récupérer les détails
    const detailRes = await axios.get(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${cocktailId}`);
    const drink = detailRes.data.drinks[0];

    res.json({
      name: drink.strDrink,
      image: drink.strDrinkThumb,
      instructions: drink.strInstructions,
      ingredients: getIngredients(drink),
    });
  } catch (error) {
    console.error("Erreur API :", error.message);
    res.status(500).json({ error: "Impossible de récupérer le cocktail du jour" });
  }
});

// Fonction utilitaire
function getIngredients(drink) {
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

app.listen(PORT, () => {
  console.log(`✅ Serveur prêt`);
});
