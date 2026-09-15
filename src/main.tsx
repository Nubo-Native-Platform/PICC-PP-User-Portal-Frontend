// import { StrictMode } from "react";
import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "./contexts/theme.context";
// import { setupAxiosInterceptors } from "./services/interceptor.ts";
import { ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useTheme as useAppTheme } from "./contexts/theme.context";

// setupAxiosInterceptors();

const DynamicMuiTheme: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme } = useAppTheme();
  const muiTheme = React.useMemo(() => createTheme({ palette: { mode: theme } }), [theme]);
  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <DynamicMuiTheme>
      <App />
    </DynamicMuiTheme>
  </ThemeProvider>
);
