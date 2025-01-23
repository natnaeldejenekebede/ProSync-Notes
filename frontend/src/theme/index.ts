import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#00695c" },
    secondary: { main: "#9c27b0" },
    background: { default: "#f5f5f5", paper: "#ffffff" },
    text: { primary: "#000000" },
  },
  typography: {
    fontFamily: "Poppins, sans-serif",
    h4: { fontWeight: 600 },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
          transition: "background-color 0.3s ease",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          transition: "background-color 0.3s ease",
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#80cbc4" },
    secondary: { main: "#ce93d8" },
    background: { default: "#1c1c1c", paper: "#242424" },
    text: { primary: "#ffffff" },
  },
  typography: {
    fontFamily: "Poppins, sans-serif",
    h4: { fontWeight: 600 },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#242424",
          transition: "background-color 0.3s ease",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          transition: "background-color 0.3s ease",
        },
      },
    },
  },
});
