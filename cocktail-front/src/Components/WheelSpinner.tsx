import { useState, useEffect } from "react";
import { Wheel } from "react-custom-roulette";
import { Box, Typography } from "@mui/material";
import type { Cocktail } from "../Types/Cocktail";
import cocktailAPI from "../services/api";

export default function WheelSpinner({
  cocktails = [],
  onResult,
}: {
  cocktails?: Cocktail[];
  onResult: (cocktail: Cocktail) => void;
  spinTrigger?: number;
  spinDuration?: number;
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
    console.log("Arrêt de la roulette");
    if (!cocktails || !cocktails[prizeNumber]) return;

    const id = cocktails[prizeNumber].id;
    try {
      const details = await cocktailAPI.getCocktailById(id);
      const drink = details;
      if (!drink) {
        console.error("Détails du cocktail non trouvés");
        return;
      }

      const formatted: Cocktail = {
        id: drink.id,
        name: drink.name,
        image: drink.image,
        instructions: drink.instructions,
        ingredients: drink.ingredients,
      };

      onResult(formatted);
    } catch (e) {
      console.error("Erreur récupération détails :", e);
    }
  };

  if (!cocktails || cocktails.length === 0) {
    return (
      <Box sx={{ textAlign: "center", my: 4 }}>
        <Typography variant="body1" color="text.secondary">
          Select at least one type of alcohol to start
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
          "#f06292",
          "#ba68c8",
          "#ce93d8",
          "#ab47bc",
          "#f8bbd0",
          "#e1bee7",
        ]}
        textColors={["transparent"]}
        outerBorderColor="#fff"
        outerBorderWidth={6}
        innerRadius={20}
        radiusLineColor="#ffffff55"
        radiusLineWidth={2}
        fontSize={0}
        spinDuration={0.45}
      />
    </Box>
  );
}
