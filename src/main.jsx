import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@mantine/core/styles.css";
import App from "./App.jsx";
import { MantineProvider } from "@mantine/core";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFoundPage from "./components/NotFound.jsx";
import UserDashBoard from "./pages/userDahboard/UserDashBoad.jsx";
import HabbitsManagement from "./components/userDashboard/habits/HabbitsManagement.jsx";
import GoalsManagement from "./components/userDashboard/goals/GoalsManagement.jsx";
import MotivationalQuotes from "./components/userDashboard/quotes/MotivationalQuotes.jsx";
import Tips from "./components/userDashboard/Tips.jsx";
import Overview from "./components/userDashboard/Overview.jsx";
import Profile from "./components/userDashboard/Profile.jsx";
import { HabbitsItem } from "./components/userDashboard/habits/HabbitsList.jsx";

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
          <Route path="/user-dashboard" element={<UserDashBoard />}>
            <Route index element={<Overview />} />
            <Route path="overview" element={<Overview />} />
            <Route path="profile" element={<Profile />} />
            <Route path="habbits-management" element={<HabbitsManagement />} />
            <Route path='habbits-management/:id' element={<HabbitsItem />} />          
            <Route path="goals-management" element={<GoalsManagement />} />
            <Route
              path="motivational-quotes"
              element={<MotivationalQuotes />}
            />
            <Route path="tips" element={<Tips />} />
          </Route>
          {/* Add more routes as needed */}
          {/* Catch-all route for 404 Not Found */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  </StrictMode>
);
