import { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  Checkbox,
} from "@mui/material";
import axios from "axios";
import CasinoIcon from '@mui/icons-material/Casino';
import CircularProgress from '@mui/material/CircularProgress';

import WheelSpinner from "../Components/WheelSpinner";
import CocktailCard from "../Components/CocktailCard";
import type { Cocktail } from "../Types/Cocktail";

const alcoholOptions = [
  "Vodka",
  "Gin",
  "Rum",
  "Tequila",
  "Whiskey",
  "Non_Alcoholic",
  "Tous",
];

const realAlcoholOptions = alcoholOptions.filter((a) => a !== "Tous");

export default function SpinPage() {
  const [selectedAlcohols, setSelectedAlcohols] = useState<string[]>(["Vodka"]);
  const [cocktails, setCocktails] = useState<{ option: string; id: string }[]>(
    []
  );
  const [cocktailDetails, setCocktailDetails] = useState<Cocktail | null>(null);
  const [loading, setLoading] = useState(false);

  const isTousSelected = selectedAlcohols.includes("Tous");

  const handleAlcoholChange = (type: string) => {
    if (type === "Tous") {
      if (selectedAlcohols.length === realAlcoholOptions.length) {
        // Si tout était sélectionné, on vide la sélection
        setSelectedAlcohols([]);
      } else {
        // Sinon, on sélectionne tout (hors "Tous")
        setSelectedAlcohols(realAlcoholOptions);
      }
    } else {
      let newSelected = [...selectedAlcohols];
      if (newSelected.includes(type)) {
        newSelected = newSelected.filter((v) => v !== type);
      } else {
        newSelected.push(type);
      }
      // Si tout est sélectionné, on coche aussi "Tous"
      if (newSelected.length === realAlcoholOptions.length) {
        setSelectedAlcohols(realAlcoholOptions);
      } else {
        setSelectedAlcohols(newSelected);
      }
    }
  };

  const handleSpinClick = () => {
    setCocktailDetails(null);
    fetchAllCocktails();
  };

  const fetchAllCocktails = async () => {
    setLoading(true);
    const all: { option: string; id: string }[] = [];

    try {
      const toFetch = isTousSelected
        ? ["Vodka", "Gin", "Rum", "Tequila", "Whiskey", "Non_Alcoholic"]
        : selectedAlcohols;

      await Promise.all(
        toFetch.map(async (type) => {
          const res =
            type === "Non_Alcoholic"
              ? await axios.get(
                  "https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Non_Alcoholic"
                )
              : await axios.get(
                  `https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${type}`
                );

          const data = res.data.drinks || [];

          for (const drink of data) {
            if (!all.find((d) => d.id === drink.idDrink)) {
              all.push({
                option: drink.strDrink,
                id: drink.idDrink,
              });
            }
          }
        })
      );
      setCocktails(all);
      setCocktailDetails(null);
    } catch (err) {
      console.error("Erreur chargement cocktails :", err);
    }
    setLoading(false);
  };

  const isAllSelected = selectedAlcohols.length === realAlcoholOptions.length;

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        py: { xs: 1, md: 4 },
        bgcolor: '#20162a'
      }}
    >
      <Typography variant="h3" gutterBottom fontWeight={900} color="primary" sx={{ mt: 2 }}>
        🎯 Trouve ton cocktail idéal !
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
        Personnalise la roue selon tes envies d'alcool.
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          width: '100%',
          maxWidth: 1100,
          mx: 'auto',
          gap: { xs: 2, md: 4 },
          alignItems: { xs: 'stretch', md: 'flex-start' },
          justifyContent: 'center'
        }}
      >
        {/* Colonne gauche : Liste des alcools + bouton */}
        <Box
          sx={{
            flex: { xs: 'unset', md: 1 },
            minWidth: { xs: '90vw', sm: 220 },
            maxWidth: { xs: '100vw', md: 400 },
            bgcolor: '#311b3f',
            color: 'white',
            borderRadius: 3,
            p: { xs: 2, sm: 3 },
            boxShadow: 3,
            mb: { xs: 2, md: 0 },
            overflow: 'auto',
            maxHeight: { xs: 300, sm: 'none' }
          }}
        >
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
            Types d'alcool
          </Typography>
          <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
            {alcoholOptions.map((type) => (
              <li key={type}>
                <Button
                  fullWidth
                  variant="text"
                  sx={{
                    justifyContent: 'flex-start',
                    color: (type === "Tous" ? isAllSelected : selectedAlcohols.includes(type)) ? 'primary.main' : 'white',
                    fontWeight: type === "Tous" ? 700 : 400,
                    bgcolor: (type === "Tous" && isAllSelected) ? "action.selected" : "transparent",
                    mb: 1,
                    borderRadius: 2,
                    textTransform: 'none',
                    '&:hover': { bgcolor: '#43225b' }
                  }}
                  onClick={() => handleAlcoholChange(type)}
                  startIcon={
                    <Checkbox
                      checked={type === "Tous" ? isAllSelected : selectedAlcohols.includes(type)}
                      tabIndex={-1}
                      disableRipple
                      sx={{ p: 0, mr: 1, color: 'white' }}
                    />
                  }
                >
                  {type === "Non_Alcoholic"
                    ? "Sans alcool"
                    : type === "Tous"
                    ? "Tous"
                    : type}
                </Button>
              </li>
            ))}
          </Box>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleSpinClick}
            disabled={loading || selectedAlcohols.length === 0}
            startIcon={<CasinoIcon />}
            sx={{
              minWidth: 180,
              minHeight: 48,
              fontSize: 18,
              mt: 2,
              width: '100%',
              boxShadow: 2
            }}
          >
            Lancer la roulette
          </Button>
        </Box>

        {/* Colonne droite : Roue ou carte */}
        <Box
          sx={{
            flex: { xs: 'unset', md: 2 },
            position: "relative",
            width: { xs: "100vw", sm: 350, md: "100%" },
            maxWidth: { xs: "100vw", md: "100%" },
            minHeight: { xs: 320, sm: 420 },
            maxHeight: 600,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: { xs: 1, sm: 3 }
          }}
        >
          {loading ? (
            <CircularProgress color="secondary" size={80} />
          ) : cocktailDetails ? (
            <Box
              sx={{
                width: { xs: "100vw", sm: 300, md: 700 },
                minWidth: 0,
                maxWidth: "100vw",
                boxShadow: 8,
                overflow: "hidden",
                p: { xs: 1, sm: 2 },
                animation: "fadeIn 0.5s"
              }}
            >
              <CocktailCard cocktail={cocktailDetails} />
            </Box>
          ) : cocktails.length > 0 ? (
            <WheelSpinner
              cocktails={cocktails}
              onResult={(drink) => setCocktailDetails(drink)}
            />
          ) : (
            <Typography color="text.secondary" sx={{ textAlign: "center" }}>
              Sélectionnez des types d'alcool puis lancez la roulette !
            </Typography>
          )}
        </Box>
      </Box>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translate(-50%, -50%) scale(0.9);}
            to { opacity: 1; transform: translate(-50%, -50%) scale(1);}
          }
        `}
      </style>
    </Container>
  );
}
