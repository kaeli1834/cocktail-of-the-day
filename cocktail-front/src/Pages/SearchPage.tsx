import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Box,
  CircularProgress,
  Alert,
  InputAdornment,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Stack,
  Paper,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LocalBarIcon from "@mui/icons-material/LocalBar";
import { cocktailAPI } from "../services/api";
import type { Cocktail } from "../Types/Cocktail";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [cocktails, setCocktails] = useState<Cocktail[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleSearch = async (searchQuery: string) => {
    if (searchQuery.trim().length < 2) {
      setCocktails([]);
      setError(null);
      setSearchPerformed(false);
      return;
    }

    setLoading(true);
    setError(null);
    setSearchPerformed(true);

    try {
      const response = await cocktailAPI.searchCocktails(searchQuery.trim());
      setCocktails(Array.isArray(response.cocktails) ? response.cocktails : []);
    } catch {
      setError("Error during search. Please try again.");
      setCocktails([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(query);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [query]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
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
          🔍 Search for cocktails
        </Typography>
        <Typography variant="subtitle1" sx={{ opacity: 0.9, mt: 1 }}>
          Find your perfect cocktail by name
        </Typography>
      </Paper>

      {/* Search Input */}
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search for a cocktail (e.g. Mojito, Margarita...)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="primary" />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              borderRadius: 2,
              fontSize: "1.1rem",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.08)",
              },
            },
          }}
        />
      </Box>

      {/* Loading */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress size={50} color="secondary" />
        </Box>
      )}

      {/* Error */}
      {error && (
        <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* Results */}
      {!loading && searchPerformed && (
        <>
          {cocktails.length > 0 ? (
            <>
              <Typography variant="h6" sx={{ mb: 3, color: "text.secondary" }}>
                {cocktails.length} result{cocktails.length > 1 ? "s" : ""} found
                for "{query}"
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, 1fr)",
                    md: "repeat(3, 1fr)",
                  },
                  gap: 3,
                }}
              >
                {cocktails.map((cocktail) => (
                  <Card
                    key={cocktail.id}
                    sx={{
                      height: "100%",
                      borderRadius: 3,
                      boxShadow: 4,
                      overflow: "hidden",
                      bgcolor: "#251a36",
                      color: "white",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      "&:hover": {
                        transform: "scale(1.02)",
                        boxShadow: 8,
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={cocktail.image}
                      alt={cocktail.name}
                      sx={{
                        objectFit: "cover",
                      }}
                    />
                    <CardContent sx={{ flex: 1, p: 2 }}>
                      <Typography
                        variant="h6"
                        fontWeight={600}
                        sx={{ mb: 1, color: "white" }}
                      >
                        {cocktail.name}
                      </Typography>

                      {/* Metadata chips */}
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{ mb: 2, flexWrap: "wrap", gap: 1 }}
                      >
                        {cocktail.category && (
                          <Chip
                            size="small"
                            label={cocktail.category}
                            variant="outlined"
                            color="secondary"
                            sx={{ fontSize: "0.75rem" }}
                          />
                        )}
                        {cocktail.alcoholic && (
                          <Chip
                            size="small"
                            icon={<LocalBarIcon />}
                            label={cocktail.alcoholic}
                            variant="outlined"
                            color="primary"
                            sx={{ fontSize: "0.75rem" }}
                          />
                        )}
                      </Stack>

                      {/* Ingredients preview */}
                      <Typography
                        variant="body2"
                        sx={{ color: "#f8bbd0", fontWeight: 500, mb: 1 }}
                      >
                        Ingredients:
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#e1bee7",
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          lineHeight: 1.4,
                        }}
                      >
                        {cocktail.ingredients.slice(0, 4).join(", ")}
                        {cocktail.ingredients.length > 4 && "..."}
                      </Typography>

                      {/* Glass type */}
                      {cocktail.glass && (
                        <Typography
                          variant="caption"
                          sx={{
                            color: "text.secondary",
                            mt: 1,
                            display: "block",
                          }}
                        >
                          Glass: {cocktail.glass}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </>
          ) : query.trim().length >= 2 ? (
            <Box sx={{ textAlign: "center", py: 6 }}>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                No cocktail found for "{query}"
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try another search term
              </Typography>
            </Box>
          ) : null}
        </>
      )}

      {/* Initial state */}
      {!searchPerformed && !loading && (
        <Box sx={{ textAlign: "center", py: 6 }}>
          <SearchIcon sx={{ fontSize: 80, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            Start your search
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Type at least 2 characters to search for cocktails
          </Typography>
        </Box>
      )}
    </Container>
  );
}
