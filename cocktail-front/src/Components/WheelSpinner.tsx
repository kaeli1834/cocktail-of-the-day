import { useState, useEffect } from "react";
import { Wheel } from "react-custom-roulette";
import axios from "axios";
import { Box, Typography } from "@mui/material";
import type { Cocktail } from "../Types/Cocktail";

export default function WheelSpinner({
  cocktails = [],
  onResult,
}: {
  cocktails?: { option: string; id: string }[];
  onResult: (cocktail: Cocktail) => void;
  spinTrigger?: number;
}) {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);

  // On garde la data pour la structure
  const wheelData = (cocktails || []).map(() => ({
    option: " ",
  }));

  useEffect(() => {
    if (cocktails.length > 0) {
      const index = Math.floor(Math.random() * cocktails.length);
      setPrizeNumber(index);
      setMustSpin(true);
    }
  }, [cocktails]);

  const handleStopSpinning = async () => {
    if (!cocktails || !cocktails[prizeNumber]) return;
    
    const id = cocktails[prizeNumber].id;
    try {
      const details = await axios.get(
        `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`
      );
      const drink = details.data.drinks?.[0];
      if (!drink) return;

      const ingredients: string[] = [];
      for (let i = 1; i <= 15; i++) {
        const ing = drink[`strIngredient${i}`];
        const measure = drink[`strMeasure${i}`];
        if (ing)
          ingredients.push(
            `${measure ? measure.trim() : ""} ${ing.trim()}`.trim()
          );
      }

      const formatted: Cocktail = {
        id: drink.idDrink,
        name: drink.strDrink,
        image: drink.strDrinkThumb,
        instructions: drink.strInstructions,
        ingredients,
      };

      onResult(formatted);
    } catch (e) {
      console.error("Erreur récupération détails :", e);
    }
  };


  useEffect(() => {

  }, [cocktails]);

  if (!cocktails || cocktails.length === 0) {
    return (
      <Box sx={{ textAlign: "center", my: 4 }}>
        <Typography variant="body1" color="text.secondary">
          Sélectionnez au moins un type d'alcool pour commencer
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ textAlign: "center", my: 4 }}>
      <Wheel
        mustStartSpinning={mustSpin}
        prizeNumber={prizeNumber}
        data={wheelData}
        onStopSpinning={() => {
          setMustSpin(false);
          handleStopSpinning();
        }}
        backgroundColors={[
          "#f06292", "#ba68c8", "#ce93d8", "#ab47bc",
          "#f8bbd0", "#e1bee7"
        ]}
        textColors={["transparent"]}
        outerBorderColor="#fff"
        outerBorderWidth={6}
        innerRadius={20}
        radiusLineColor="#ffffff55"
        radiusLineWidth={2}
        fontSize={0}
        spinDuration={0.8}
      />
    </Box>
  );
}
