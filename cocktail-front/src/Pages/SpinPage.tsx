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
import CasinoIcon from "@mui/icons-material/Casino";
import CircularProgress from "@mui/material/CircularProgress";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import AutorenewIcon from "@mui/icons-material/Autorenew";

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
  "All",
];

const realAlcoholOptions = alcoholOptions.filter((a) => a !== "All");

export default function SpinPage() {
  const [selectedAlcohols, setSelectedAlcohols] = useState<string[]>(["Vodka"]);
  const [cocktails, setCocktails] = useState<Cocktail[]>([]);
  const [cocktailDetails, setCocktailDetails] = useState<Cocktail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAlcoholChange = (type: string) => {
    if (type === "All") {
      if (selectedAlcohols.length === realAlcoholOptions.length) {
        // If all were selected, clear selection
        setSelectedAlcohols([]);
      } else {
        // Otherwise, select all (except "All")
        setSelectedAlcohols(realAlcoholOptions);
      }
    } else {
      let newSelected = [...selectedAlcohols];
      if (newSelected.includes(type)) {
        newSelected = newSelected.filter((v) => v !== type);
      } else {
        newSelected.push(type);
      }
      // If all are selected, also check "All"
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
    } catch {
      setError("Error loading random cocktail. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllCocktails = async () => {
    setLoading(true);
    const all: {
      id: string;
      name: string;
      image: string;
      instructions: string;
      ingredients: string[];
    }[] = [];

    try {
      const toFetch = isAllSelected
        ? ["Alcoholic", "Non_Alcoholic"]
        : selectedAlcohols;

      await Promise.all(
        toFetch.map(async (type) => {
          const res =
            type === "Non_Alcoholic"
              ? await cocktailAPI.getCocktailsByIngredients(["Non_Alcoholic"])
              : isAllSelected
              ? await cocktailAPI.getCocktailsByIngredients([
                  "Alcoholic",
                  "Non_Alcoholic",
                ])
              : await cocktailAPI.getCocktailsByIngredients(toFetch);

          const data = Array.isArray(res.cocktails) ? res.cocktails : [];

          for (const drink of data) {
            if (drink && drink.id && !all.find((d) => d.id === drink.id)) {
              all.push(drink);
            }
          }
        })
      );
      setCocktails(all);
      setCocktailDetails(null);
    } catch (err) {
      console.error("Error loading cocktails:", err);
      setError("Error loading cocktails. Please try again.");
    }
    setLoading(false);
  };

  const isAllSelected = selectedAlcohols.length === realAlcoholOptions.length;

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        py: { xs: 1, md: 4 },
        bgcolor: "#20162a",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          px: 3,
          py: 2,
          mb: 4,
          textAlign: "center",
          bgcolor: "#311b3f",
          color: "white",
          borderRadius: 3,
          boxShadow: 4,
          maxWidth: 600,
          mx: "auto",
        }}
      >
        <Typography
          variant="h3"
          gutterBottom
          fontWeight={900}
          color="white"
          sx={{ mt: 1 }}
        >
          🎰 Magic Roulette
        </Typography>
        <Typography variant="subtitle1" sx={{ opacity: 0.9, mb: 1 }}>
          Customize to your taste or let chance decide!
        </Typography>
      </Paper>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          width: "100%",
          maxWidth: 1100,
          mx: "auto",
          gap: { xs: 2, md: 4 },
          alignItems: { xs: "stretch", md: "flex-start" },
          justifyContent: "center",
        }}
      >
        {/* Left column: Alcohol list + button */}
        <Box
          sx={{
            flex: { xs: "unset", md: 1 },
            minWidth: { xs: "90vw", sm: 220 },
            maxWidth: { xs: "100vw", md: 400 },
            bgcolor: "#311b3f",
            color: "white",
            borderRadius: 3,
            p: { xs: 2, sm: 3 },
            boxShadow: 3,
            mb: { xs: 2, md: 0 },
            overflow: "auto",
            maxHeight: { xs: 300, sm: "none" },
          }}
        >
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
            Alcohol Types
          </Typography>
          <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
            {alcoholOptions.map((type) => (
              <li key={type}>
                <Button
                  fullWidth
                  variant="text"
                  sx={{
                    justifyContent: "flex-start",
                    color: (
                      type === "All"
                        ? isAllSelected
                        : selectedAlcohols.includes(type)
                    )
                      ? "primary.main"
                      : "white",
                    fontWeight: type === "All" ? 700 : 400,
                    bgcolor:
                      type === "All" && isAllSelected
                        ? "action.selected"
                        : "transparent",
                    mb: 1,
                    borderRadius: 2,
                    textTransform: "none",
                    "&:hover": { bgcolor: "#43225b" },
                  }}
                  onClick={() => handleAlcoholChange(type)}
                  startIcon={
                    <Checkbox
                      checked={
                        type === "All"
                          ? isAllSelected
                          : selectedAlcohols.includes(type)
                      }
                      tabIndex={-1}
                      disableRipple
                      sx={{ p: 0, mr: 1, color: "white" }}
                    />
                  }
                >
                  {type === "Non_Alcoholic"
                    ? "Non Alcoholic"
                    : type === "All"
                    ? "All"
                    : type}
                </Button>
              </li>
            ))}
          </Box>
          <Box sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleSpinClick}
              disabled={loading || selectedAlcohols.length === 0}
              startIcon={
                loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <CasinoIcon />
                )
              }
              sx={{
                minWidth: 180,
                minHeight: 56,
                fontSize: "1.1rem",
                fontWeight: 600,
                width: "100%",
                borderRadius: 3,
                boxShadow: 4,
                textTransform: "none",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: 6,
                },
                transition: "all 0.2s",
              }}
            >
              {loading ? "Loading..." : "Custom Roulette"}
            </Button>

            <Divider sx={{ my: 1, color: "text.secondary" }}>
              <Chip
                label="OR"
                size="small"
                sx={{ bgcolor: "background.paper" }}
              />
            </Divider>

            <Button
              variant="outlined"
              color="secondary"
              size="large"
              onClick={handleRandomCocktail}
              disabled={loading}
              startIcon={
                loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <ShuffleIcon />
                )
              }
              sx={{
                minWidth: 180,
                minHeight: 56,
                fontSize: "1.1rem",
                fontWeight: 600,
                width: "100%",
                borderRadius: 3,
                borderWidth: 2,
                textTransform: "none",
                "&:hover": {
                  transform: "translateY(-2px)",
                  borderWidth: 2,
                },
                transition: "all 0.2s",
              }}
            >
              {loading ? "Loading..." : "Total Surprise"}
            </Button>
          </Box>
        </Box>

        {/* Right column: Wheel or card */}
        <Box
          sx={{
            flex: { xs: "unset", md: 2 },
            position: "relative",
            width: { xs: "100vw", sm: 350, md: "100%" },
            maxWidth: { xs: "100vw", md: "100%" },
            minHeight: { xs: 320, sm: 420 },
            maxHeight: 600,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            p: { xs: 1, sm: 3 },
          }}
        >
          {/* Error Display */}
          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: 2,
                width: "100%",
                maxWidth: 500,
              }}
              action={
                <Button
                  color="inherit"
                  size="small"
                  onClick={
                    cocktailDetails ? handleRandomCocktail : handleSpinClick
                  }
                >
                  Retry
                </Button>
              }
            >
              {error}
            </Alert>
          )}

          {cocktailDetails && !error ? (
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
              onResult={(drink) => {
                setCocktailDetails(drink);
                setLoading(false);
              }}
            />
          ) : !error ? (
            <Box sx={{ textAlign: "center", py: 6, maxWidth: 400 }}>
              <CasinoIcon
                sx={{ fontSize: 80, color: "text.secondary", mb: 2 }}
              />
              <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                Ready for adventure?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Choose your preferences for a custom roulette, or try a total
                surprise!
              </Typography>
            </Box>
          ) : null}
        </Box>
      </Box>

      {/* Floating Action Button */}
      {cocktailDetails && !loading && (
        <Fab
          color="secondary"
          aria-label="new cocktail"
          onClick={handleRandomCocktail}
          sx={{
            position: "fixed",
            bottom: 32,
            right: 32,
            zIndex: 1000,
            "&:hover": {
              transform: "scale(1.1)",
            },
            transition: "transform 0.2s",
          }}
        >
          <AutorenewIcon />
        </Fab>
      )}

      {/* Tips */}
      {cocktailDetails && !loading && !error && (
        <Box
          sx={{ mt: 4, textAlign: "center", maxWidth: 600, mx: "auto", px: 2 }}
        >
          <Paper
            elevation={2}
            sx={{
              p: 3,
              bgcolor: "rgba(255, 255, 255, 0.05)",
              borderRadius: 3,
              border: "1px solid rgba(248, 187, 208, 0.2)",
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontStyle: "italic", mb: 2 }}
            >
              💡 <strong>Tip:</strong> Use the floating button for a new
              surprise cocktail, or explore other options with the buttons
              above!
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 1,
                flexWrap: "wrap",
              }}
            >
              <Chip
                size="small"
                label="Total Surprise"
                color="secondary"
                variant="outlined"
              />
              <Chip
                size="small"
                label="Custom Roulette"
                color="primary"
                variant="outlined"
              />
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
