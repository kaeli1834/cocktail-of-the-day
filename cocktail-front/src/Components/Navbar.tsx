import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          DailyCocktail
        </Typography>
        <Box>
          <Button color="inherit" component={Link} to="/">
            Cocktail du jour
          </Button>
          <Button color="inherit" component={Link} to="/spin">
            Roulette Cocktail
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
