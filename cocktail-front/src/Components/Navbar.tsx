import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import LocalBarIcon from "@mui/icons-material/LocalBar";
import SearchIcon from "@mui/icons-material/Search";
import CasinoIcon from "@mui/icons-material/Casino";

export default function Navbar() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const menuItems = [
    { path: "/", label: "Cocktail of the Day", icon: <LocalBarIcon /> },
    { path: "/search", label: "Search", icon: <SearchIcon /> },
    { path: "/spin", label: "Magic Roulette", icon: <CasinoIcon /> },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <AppBar position="static" sx={{ boxShadow: 3 }}>
      <Toolbar>
        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            fontWeight: 700,
            background: "linear-gradient(45deg, #fff 30%, #f8bbd0 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          🍸 CocktailApp
        </Typography>

        {isMobile ? (
          <>
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={handleMenu}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              sx={{
                "& .MuiPaper-root": {
                  bgcolor: "#311b3f",
                  color: "white",
                  mt: 1,
                  borderRadius: 2,
                  minWidth: 200,
                },
              }}
            >
              {menuItems.map((item) => (
                <MenuItem
                  key={item.path}
                  onClick={handleClose}
                  component={Link}
                  to={item.path}
                  sx={{
                    color: isActive(item.path) ? "primary.main" : "inherit",
                    fontWeight: isActive(item.path) ? 600 : 400,
                    "&:hover": {
                      bgcolor: "rgba(255, 255, 255, 0.1)",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {item.icon}
                    {item.label}
                  </Box>
                </MenuItem>
              ))}
            </Menu>
          </>
        ) : (
          <Box sx={{ display: "flex", gap: 1 }}>
            {menuItems.map((item) => (
              <Button
                key={item.path}
                color="inherit"
                component={Link}
                to={item.path}
                startIcon={item.icon}
                sx={{
                  color: isActive(item.path) ? "secondary.main" : "inherit",
                  fontWeight: isActive(item.path) ? 600 : 400,
                  textTransform: "none",
                  borderRadius: 2,
                  px: 2,
                  "&:hover": {
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                  },
                  ...(isActive(item.path) && {
                    bgcolor: "rgba(248, 187, 208, 0.1)",
                  }),
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
