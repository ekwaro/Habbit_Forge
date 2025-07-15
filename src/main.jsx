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
import EnhancedOverview from "./components/userDashboard/EnhancedOverview.jsx";
import Profiles from "./components/userDashboard/UserProfile.jsx";
import { HabbitsItem } from "./components/userDashboard/habits/HabbitsList.jsx";
import InteractiveHabits from "./components/userDashboard/InteractiveHabits.jsx";
import CalendarView from "./components/userDashboard/CalendarView.jsx";
import Achievements from "./components/userDashboard/Achievements.jsx";
import GoalTracking from "./components/userDashboard/GoalTracking.jsx";
import Insights from "./components/userDashboard/Insights.jsx";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
// import CallbackPage from './pages/CallbackPage';
import DashboardPage from "./pages/DashboardPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage"; // 

import AboutUsPage from "./pages1/AboutUsPage";
import ContactUsPage from "./pages1/ContactUsPage";
import QuoteResourcesPage from './pages1/QuoteResourcesPage.jsx';
import TipResourcesPage from './pages1/TipResourcesPage.jsx';

import AdminLayout from './components1/AdminLayout';
import AdminProfilePage from './pages1/AdminProfilePage';
import HabitCategoriesPage from './pages1/HabitCategoriesPage';
import MotivationalQuotesPage from './pages1/MotivationalQuotesPage';
import HabitTipsPage from './pages1/HabitTipsPage';
import AnalyticsSectionPage from './pages1/AnalyticsSectionPage';
import DashboardPage1 from './pages1/DashboardPage1';
import TermsOfService from "./pages1/TermsOfService"; 
import { useLocalStorage } from "@mantine/hooks";

// Create a simple callback component to handle Auth0 redirects
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader, Center, Text } from "@mantine/core";

// Callback component to handle Auth0 redirects
function CallbackPage() {
  const { handleRedirectCallback, isLoading, error } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        await handleRedirectCallback();
        navigate("/login"); // Redirect back to login to process the authentication
      } catch (error) {
        console.error("Callback error:", error);
        navigate("/login");
      }
    };

    handleCallback();
  }, [handleRedirectCallback, navigate]);

  if (error) {
    return (
      <Center style={{ height: '100vh' }}>
        <Text color="red">Authentication error: {error.message}</Text>
      </Center>
    );
  }

  return (
    <Center style={{ height: '100vh' }}>
      <div style={{ textAlign: 'center' }}>
        <Loader size="lg" color="teal" />
        <Text mt="md" c="dimmed">Processing authentication...</Text>
      </div>
    </Center>
  );
}

const theme = {
  colorScheme: "light",
  primaryColor: "blue",
  fontFamily: "Arial, sans-serif",
  headings: { fontFamily: "Arial, sans-serif" },
};
const redirect_uri = window.location.origin + "/callback";
console.log("[Auth0 Config] Redirect URI:", redirect_uri);
// Auth0 configuration - Using environment variables
const auth0Config = {
  domain: import.meta.env.VITE_AUTH0_DOMAIN,
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
  authorizationParams: {
    redirect_uri: redirect_uri, // Ensure this matches your Auth0 application settings
    // IMPORTANT: Add /callback
     
    scope: "openid profile email", // Ensure we get user profile data
  },
  cacheLocation: "localstorage", // Cache tokens in localStorage
  useRefreshTokens: true, // Use refresh tokens for better UX
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
             <Route path="/forgot-password" element={<ForgotPasswordPage />} /> 
             {/* <Route path="/callback" element={<CallbackPage />} /> */}
            <Route path="about" element={<AboutUsPage />} />
            <Route path="contact" element={<ContactUsPage />} />
            <Route path="terms-of-service" element={<TermsOfService />} />
          </Route>
          <Route path="/user-dashboard/*" element={<UserDashBoard />}>
            <Route index element={<EnhancedOverview />} />
            <Route path="profile" element={<Profiles />} />
            <Route path="manage-habits" element={<HabbitsManagement />} />
            <Route path="habbits-management" element={<HabbitsManagement />} />
            <Route path="habbits-management/:id" element={<HabbitsItem />} />
            <Route path="interactive-habits" element={<InteractiveHabits />} />
            <Route path="calendar-view" element={<CalendarView />} />
            <Route path="manage-goals" element={<GoalsManagement />} />
            <Route path="goals-management" element={<GoalsManagement />} />
            <Route path="goal-tracking" element={<GoalTracking />} />
            <Route path="achievements" element={<Achievements />} />
            <Route path="motivation" element={<MotivationalQuotes />} />
            <Route path="motivational-quotes" element={<MotivationalQuotes />} />
            <Route path="quote-resource" element={<QuoteResourcesPage />} />
            <Route path="habit-tips" element={<Tips />} />
            <Route path="tips" element={<Tips />} />
            <Route path="tip-resources" element={<TipResourcesPage />} />
            <Route path="insights" element={<Insights />} />
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
      cacheLocation={auth0Config.cacheLocation}
      useRefreshTokens={auth0Config.useRefreshTokens}
    >
      <MainApp />
    </Auth0Provider>
  </StrictMode>
);