import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import ThemeProviderWrapper from "./theme/ThemeProviderWrapper";
import "./global.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProviderWrapper>
      <App />
    </ThemeProviderWrapper>
  </React.StrictMode>,
);
