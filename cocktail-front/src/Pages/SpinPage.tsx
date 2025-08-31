import { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  Checkbox,
  Fab,
  Chip,
  Alert,
  Fade,
  Divider,
  Paper,
} from "@mui/material";
import axios from "axios";
import CasinoIcon from '@mui/icons-material/Casino';
import CircularProgress from '@mui/material/CircularProgress';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import AutorenewIcon from '@mui/icons-material/Autorenew';

import WheelSpinner from "../Components/WheelSpinner";
import CocktailCard from "../Components/CocktailCard";
import { cocktailAPI } from "../services/api";
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
  const [error, setError] = useState<string | null>(null);

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
    setError(null);
    fetchAllCocktails();
  };

  const handleRandomCocktail = async () => {
    setLoading(true);
    setError(null);
    setCocktailDetails(null);
    setCocktails([]);

    try {
      const randomCocktail = await cocktailAPI.getRandomCocktail();
      setCocktailDetails(randomCocktail);
    } catch (err) {
      setError("Erreur lors du chargement du cocktail aléatoire. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
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
      <Paper
        elevation={3}
        sx={{
          px: 3,
          py: 2,
          mb: 4,
          textAlign: 'center',
          bgcolor: '#311b3f',
          color: 'white',
          borderRadius: 3,
          boxShadow: 4,
          maxWidth: 600,
          mx: 'auto'
        }}
      >
        <Typography variant="h3" gutterBottom fontWeight={900} color="white" sx={{ mt: 1 }}>
          🎰 Roulette Magique
        </Typography>
        <Typography variant="subtitle1" sx={{ opacity: 0.9, mb: 1 }}>
          Personnalise selon tes goûts ou laisse le hasard décider !
        </Typography>
      </Paper>

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
          <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleSpinClick}
              disabled={loading || selectedAlcohols.length === 0}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CasinoIcon />}
              sx={{
                minWidth: 180,
                minHeight: 56,
                fontSize: '1.1rem',
                fontWeight: 600,
                width: '100%',
                borderRadius: 3,
                boxShadow: 4,
                textTransform: 'none',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 6,
                },
                transition: 'all 0.2s',
              }}
            >
              {loading ? 'Chargement...' : 'Roulette Personnalisée'}
            </Button>
            
            <Divider sx={{ my: 1, color: 'text.secondary' }}>
              <Chip label="OU" size="small" sx={{ bgcolor: 'background.paper' }} />
            </Divider>
            
            <Button
              variant="outlined"
              color="secondary"
              size="large"
              onClick={handleRandomCocktail}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <ShuffleIcon />}
              sx={{
                minWidth: 180,
                minHeight: 56,
                fontSize: '1.1rem',
                fontWeight: 600,
                width: '100%',
                borderRadius: 3,
                borderWidth: 2,
                textTransform: 'none',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  borderWidth: 2,
                },
                transition: 'all 0.2s',
              }}
            >
              {loading ? 'Chargement...' : 'Surprise Totale'}
            </Button>
          </Box>
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
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            p: { xs: 1, sm: 3 }
          }}
        >
          {/* Error Display */}
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3, 
                borderRadius: 2,
                width: '100%',
                maxWidth: 500,
              }}
              action={
                <Button color="inherit" size="small" onClick={cocktailDetails ? handleRandomCocktail : handleSpinClick}>
                  Réessayer
                </Button>
              }
            >
              {error}
            </Alert>
          )}

          {loading ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 6 }}>
              <CircularProgress color="secondary" size={80} sx={{ mb: 3 }} />
              <Typography variant="h6" color="text.secondary" sx={{ textAlign: "center" }}>
                Préparation de votre cocktail...
              </Typography>
            </Box>
          ) : cocktailDetails && !error ? (
            <Fade in={true} timeout={600}>
              <Box
                sx={{
                  width: { xs: "100vw", sm: 300, md: 700 },
                  minWidth: 0,
                  maxWidth: "100vw",
                  overflow: "hidden",
                  p: { xs: 1, sm: 2 },
                }}
              >
                <CocktailCard cocktail={cocktailDetails} />
              </Box>
            </Fade>
          ) : cocktails.length > 0 && !error ? (
            <WheelSpinner
              cocktails={cocktails}
              onResult={(drink) => setCocktailDetails(drink)}
            />
          ) : !error ? (
            <Box sx={{ textAlign: "center", py: 6, maxWidth: 400 }}>
              <CasinoIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                Prêt pour l'aventure ?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Choisissez vos préférences pour une roulette personnalisée, ou tentez une surprise totale !
              </Typography>
            </Box>
          ) : null}
        </Box>
      </Box>

      {/* Floating Action Button */}
      {cocktailDetails && !loading && (
        <Fab
          color="secondary"
          aria-label="nouveau cocktail"
          onClick={handleRandomCocktail}
          sx={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            zIndex: 1000,
            '&:hover': {
              transform: 'scale(1.1)',
            },
            transition: 'transform 0.2s',
          }}
        >
          <AutorenewIcon />
        </Fab>
      )}

      {/* Tips */}
      {cocktailDetails && !loading && !error && (
        <Box sx={{ mt: 4, textAlign: 'center', maxWidth: 600, mx: 'auto', px: 2 }}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              bgcolor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: 3,
              border: '1px solid rgba(248, 187, 208, 0.2)',
            }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mb: 2 }}>
              💡 <strong>Astuce:</strong> Utilisez le bouton flottant pour un nouveau cocktail surprise,
              ou explorez d'autres options avec les boutons ci-dessus !
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Chip size="small" label="Surprise Totale" color="secondary" variant="outlined" />
              <Chip size="small" label="Roulette Personnalisée" color="primary" variant="outlined" />
            </Box>
          </Paper>
        </Box>
      )}

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.9);}
            to { opacity: 1; transform: scale(1);}
          }
        `}
      </style>
    </Container>
  );
}
