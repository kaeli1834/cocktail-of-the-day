import { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CircularProgress,
  Container,
  Box,
  Chip,
  Paper,
  Stack,
  Divider,
} from "@mui/material";
import type { Cocktail } from "../Types/Cocktail.tsx";

function CocktailDayPage() {
  const [cocktail, setCocktail] = useState<Cocktail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/daily-cocktail`)
      .then((res) => {
        setCocktail(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur API :", err);
        setLoading(false);
      });
  }, []);

  return (
    <Container
      maxWidth="md"
      sx={{
        py: { xs: 2, md: 6 },
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* En-tête principale */}
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
        }}
      >
        <Typography variant="h4" fontWeight={700}>
          🍸 Cocktail du jour
        </Typography>
        <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
          Découvre un nouveau cocktail chaque jour
        </Typography>
      </Paper>

      {/* Contenu principal */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
          <CircularProgress size={60} color="secondary" />
        </Box>
      ) : cocktail ? (
        <Card
          sx={{
            width: { xs: "100%", sm: 500, md: 700 },
            mx: "auto",
            borderRadius: 4,
            boxShadow: 8,
            overflow: "hidden",
            bgcolor: "#251a36",
            color: "white",
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "stretch",
            transition: "transform 0.2s, box-shadow 0.2s",
            "&:hover": {
              transform: "scale(1.01)",
              boxShadow: 12,
            },
          }}
        >
          {/* Image à droite sur desktop, au-dessus sur mobile */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "#2a1736",
              minWidth: { xs: "100%", md: 220 },
              maxWidth: { xs: "100%", md: 300 },
              p: 0,
              order: { xs: 0, md: 2 },
            }}
          >
            <CardMedia
              component="img"
              image={cocktail.image}
              alt={cocktail.name}
              sx={{
                width: { xs: "100%", md: 220 },
                height: { xs: 180, md: 320 },
                objectFit: "cover",
                borderTopRightRadius: { xs: 0, md: 16 },
                borderBottomRightRadius: { xs: 0, md: 16 },
                borderTopLeftRadius: { xs: 16, md: 0 },
                borderBottomLeftRadius: { xs: 16, md: 0 },
                boxShadow: 3,
              }}
            />
          </Box>
          {/* Texte à gauche */}
          <CardContent
            sx={{
              flex: 2,
              p: { xs: 2, md: 4 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              minWidth: 0,
            }}
          >
            <Typography
              variant="h5"
              fontWeight={700}
              sx={{ mb: 2, color: "white" }}
            >
              {cocktail.name}
            </Typography>

            <Divider sx={{ mb: 2, bgcolor: "#6c4e8c" }} />

            <Typography variant="subtitle1" fontWeight={600} sx={{ color: "#f8bbd0" }}>
              Ingrédients
            </Typography>
            <Stack
              direction="row"
              spacing={1}
              flexWrap="wrap"
              sx={{ mt: 1, mb: 3 }}
            >
              {cocktail.ingredients.map((ing, i) => (
                <Chip
                  key={i}
                  label={ing}
                  variant="outlined"
                  color="secondary"
                  sx={{
                    mb: 1,
                    fontSize: "0.85rem",
                    bgcolor: "#3a235a",
                    color: "white",
                    borderColor: "#ba68c8",
                  }}
                />
              ))}
            </Stack>

            <Typography variant="subtitle1" fontWeight={600} sx={{ color: "#f8bbd0" }}>
              Instructions
            </Typography>
            <Typography
              variant="body2"
              sx={{
                mt: 1,
                lineHeight: 1.6,
                whiteSpace: "pre-line",
                color: "#e1bee7",
              }}
            >
              {cocktail.instructions}
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Typography color="error" sx={{ mt: 4 }} align="center">
          Erreur lors de la récupération du cocktail.
        </Typography>
      )}
    </Container>
  );
}

export default CocktailDayPage;
