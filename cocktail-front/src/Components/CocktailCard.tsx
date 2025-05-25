import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Stack,
  Chip,
  Divider,
  Box,
} from "@mui/material";

type Props = {
  cocktail: {
    name?: string;
    image?: string;
    ingredients?: string[];
    instructions?: string;
  };
};

export default function CocktailCard({ cocktail }: Props) {
  const {
    name = "Nom inconnu",
    image = "/placeholder.jpg",
    ingredients = [],
    instructions = "Instructions non disponibles.",
  } = cocktail;

  return (
    <Card
      sx={{
        borderRadius: 4,
        boxShadow: 8,
        overflow: "hidden",
        bgcolor: "#251a36",
        color: "white",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "scale(1.01)",
          boxShadow: 12,
        },
        width: "100%",
        mx: "auto",
        p: 0,
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={0}
        sx={{ width: "100%", height: "100%" }}
      >
        {/* Partie gauche : texte */}
        <CardContent
          sx={{
            flex: 2,
            p: { xs: 2, sm: 3 },
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
            {name}
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
            {ingredients.length > 0 ? (
              ingredients.map((ing, i) => (
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
              ))
            ) : (
              <Typography variant="body2" color="#e1bee7">
                Aucun ingrédient listé.
              </Typography>
            )}
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
            {instructions}
          </Typography>
        </CardContent>

        {/* Partie droite : image */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "#2a1736",
            minWidth: { xs: "100%", sm: 160 },
            maxWidth: { xs: "100%", sm: 180 },
            p: { xs: 0, sm: 0 },
          }}
        >
          <CardMedia
            component="img"
            image={image}
            alt={name}
            sx={{
              width: { xs: "100%", sm: 160 },
              height: { xs: 160, sm: 220 },
              objectFit: "cover",
              borderTopRightRadius: { xs: 0, sm: 16 },
              borderBottomRightRadius: { xs: 0, sm: 16 },
              borderTopLeftRadius: { xs: 16, sm: 0 },
              borderBottomLeftRadius: { xs: 16, sm: 0 },
              boxShadow: 3,
            }}
          />
        </Box>
      </Stack>
    </Card>
  );
}
