import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@mantine/core/styles.css";
import App from "./App.jsx";
import { MantineProvider } from "@mantine/core";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import NotFoundPage from "./components/NotFound.jsx";
import UserDashBoard from "./pages/userDahboard/UserDashBoad.jsx";
import HabbitsManagement from "./components/userDashboard/habits/HabbitsManagement.jsx";
import GoalsManagement from "./components/userDashboard/goals/GoalsManagement.jsx";
import MotivationalQuotes from "./components/userDashboard/quotes/MotivationalQuotes.jsx";
import Tips from "./components/userDashboard/tips/Tips.jsx";
//import LoginPage from "./pages/LoginPage.jsx";
import Overview from "./components/userDashboard/Overview.jsx";
import Profiles from "./components/userDashboard/UserProfile.jsx";
import { HabbitsItem } from "./components/userDashboard/habits/HabbitsList.jsx";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";


import AboutUsPage from "./pages1/AboutUsPage";
import ContactUsPage from "./pages1/ContactUsPage";

import AdminLayout from './components1/AdminLayout';
import AdminProfilePage from './pages1/AdminProfilePage';
import HabitCategoriesPage from './pages1/HabitCategoriesPage';
import MotivationalQuotesPage from './pages1/MotivationalQuotesPage';
import HabitTipsPage from './pages1/HabitTipsPage';
import AnalyticsSectionPage from './pages1/AnalyticsSectionPage';
import DashboardPage1 from './pages1/DashboardPage1';
import TermsOfService from "./pages1/TermsOfService"; 
import { useLocalStorage } from "@mantine/hooks";

const theme = {
  colorScheme: "light",
  primaryColor: "blue",
  fontFamily: "Arial, sans-serif",
  headings: { fontFamily: "Arial, sans-serif" },
};

// Auth0 configuration - Replace these with your actual Auth0 values
const auth0Config = {
  domain: "dev-z2vowf3m4m0hawqt.us.auth0.com", 
  clientId: "5Uw4Fnn5EmdsVnSsCpTl3KLsyxF27LxJ",
  authorizationParams: {
    redirect_uri: window.location.origin,
  },
};

function MainApp() {
  const [colorScheme, setColorScheme] = useLocalStorage({
    key: "mantine-color-scheme",
    defaultValue: "light",
  });
  const toggleColorScheme = (value) => {
    setColorScheme(
      value === "light" || value === "dark"
        ? value
        : colorScheme === "dark"
        ? "light"
        : "dark"
    );
  };

  return (
    <MantineProvider theme={{ ...theme, colorScheme }} withGlobalStyles withNormalizeCSS>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App colorScheme={colorScheme} toggleColorScheme={toggleColorScheme} />}>
            <Route index element={<HomePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="signup" element={<SignupPage />} />
            <Route path="about" element={<AboutUsPage />} />
            <Route path="contact" element={<ContactUsPage />} />
            <Route path="terms-of-service" element={<TermsOfService />} />
          </Route>
          <Route path="/user-dashboard" element={<UserDashBoard />}>
            <Route index element={<Profiles />} />
            <Route path="habbits-management" element={<HabbitsManagement />} />
            <Route path="habbits-management/:id" element={<HabbitsItem />} />
            <Route path="goals-management" element={<GoalsManagement />} />
            <Route path="motivational-quotes" element={<MotivationalQuotes />} />
            <Route path="tips" element={<Tips />} />
          </Route>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardPage1 />} />
            <Route path="profile" element={<AdminProfilePage />} />
            <Route path="categories" element={<HabitCategoriesPage />} />
            <Route path="quotes" element={<MotivationalQuotesPage />} />
            <Route path="tips" element={<HabitTipsPage />} />
            <Route path="analytics" element={<AnalyticsSectionPage />} />
            <Route path="*" element={<div>404 Admin Page Not Found</div>} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Auth0Provider
      domain={auth0Config.domain}
      clientId={auth0Config.clientId}
      authorizationParams={auth0Config.authorizationParams}
    >
      <MainApp />
    </Auth0Provider>
  </StrictMode>
);