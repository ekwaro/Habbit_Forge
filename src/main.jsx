import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@mantine/core/styles.css";
import App from "./App.jsx";
import { MantineProvider } from "@mantine/core";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFoundPage from "./components/NotFound.jsx";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage"; // Added import
import DashboardPage from "./pages/DashboardPage"; // Added import

const theme = {
  colorScheme: "light",
  primaryColor: "blue",
  fontFamily: "Arial, sans-serif",
  headings: { fontFamily: "Arial, sans-serif" },
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            {/* Nested routes inside App */}
            <Route index element={<HomePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="signup" element={<SignupPage />} /> 
            <Route path="dashboard" element={<DashboardPage />} /> 
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  </StrictMode>
);