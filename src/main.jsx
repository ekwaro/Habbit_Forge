import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@mantine/core/styles.css";
import App from "./App.jsx";
import { MantineProvider } from "@mantine/core";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NotFoundPage from "./components/NotFound.jsx";

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
          <Route path="/" element={<App />} />
          <Route path="*" element={<NotFoundPage />} />

          {/* Redirect from root to /admin if you want admin dashboard as default */}
          {/* <Route path="/" element={<Navigate to="/dashboard" replace />} /> */}

          {/* Admin Dashboard Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            {/* Nested Routes for Sidebar items */}
            <Route index element={<DashboardPage1 />} /> {/* Default content for /admin */}
            <Route path="profile" element={<AdminProfilePage />} />
            <Route path="categories" element={<HabitCategoriesPage />} />
            <Route path="quotes" element={<MotivationalQuotesPage />} />
            <Route path="tips" element={<HabitTipsPage />} />
            <Route path="analytics" element={<AnalyticsSectionPage />} />

            {/* Handle 404 for admin routes (optional) */}
            <Route path="*" element={<div>404 Admin Page Not Found</div>} />
          </Route>

          
          {/*catch-all 404 for any other undefined routes */}
          <Route path="*" element={<div>404 Page Not Found</div>} />
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  </StrictMode>
);