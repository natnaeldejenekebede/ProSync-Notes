import React, { useState, useEffect } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { ThemeContext } from "./ThemeContext";
import { darkTheme, lightTheme } from "./index";

export default function ThemeProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const storedPref = localStorage.getItem("collabnote_darkmode");
    if (storedPref === "true") {
      setIsDarkMode(true);
      document.body.style.backgroundColor =
        darkTheme.palette.background.default;
    } else {
      document.body.style.backgroundColor =
        lightTheme.palette.background.default;
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const newVal = !prev;
      localStorage.setItem("collabnote_darkmode", newVal ? "true" : "false");
      if (newVal) {
        document.body.style.backgroundColor =
          darkTheme.palette.background.default;
      } else {
        document.body.style.backgroundColor =
          lightTheme.palette.background.default;
      }
      return newVal;
    });
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}
