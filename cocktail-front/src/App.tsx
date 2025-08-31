import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import Navbar from "./Components/Navbar";
import CocktailDayPage from "./Pages/CocktailDayPage";
import SpinPage from "./Pages/SpinPage";
import SearchPage from "./Pages/SearchPage";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#7b1fa2" },
    secondary: { main: "#f48fb1" },
    background: {
      default: "#20162a",
      paper: "#251a36"
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<CocktailDayPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/spin" element={<SpinPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
