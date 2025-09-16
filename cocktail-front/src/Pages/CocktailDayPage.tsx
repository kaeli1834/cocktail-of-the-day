import { useEffect, useState } from "react";
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
  Alert,
  Button,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { cocktailAPI } from "../services/api";
import type { Cocktail } from "../Types/Cocktail.tsx";

function CocktailDayPage() {
  const [cocktail, setCocktail] = useState<Cocktail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDailyCocktail = async () => {
    setLoading(true);
    setError(null);

    try {
      const dailyCocktail = await cocktailAPI.getDailyCocktail();
      setCocktail(dailyCocktail);
    } catch (err) {
      console.error("API Error:", err);
      setError("Unable to fetch the cocktail of the day. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDailyCocktail();
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
      {/* Main Header */}
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
          🍸 Cocktail of the Day
        </Typography>
        <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
          Discover a new cocktail every day
        </Typography>
      </Paper>

      {/* Error Display */}
      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 4,
            borderRadius: 2,
          }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={fetchDailyCocktail}
              startIcon={<RefreshIcon />}
            >
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* Main Content */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
          <CircularProgress size={60} color="secondary" />
        </Box>
      ) : cocktail && !error ? (
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
          {/* Image on the right for desktop, above for mobile */}
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
          {/* Text on the left */}
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

            <Typography
              variant="subtitle1"
              fontWeight={600}
              sx={{ color: "#f8bbd0" }}
            >
              Ingredients
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

            <Typography
              variant="subtitle1"
              fontWeight={600}
              sx={{ color: "#f8bbd0" }}
            >
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
          Error while fetching the cocktail.
        </Typography>
      )}
    </Container>
  );
}

export default CocktailDayPage;
