import { MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css'; //Mantine's global styles
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';


const theme = createTheme({
  primaryColor: 'teal', // Example primary color
});



import { Notifications } from '@mantine/notifications';
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom'; 
import { saveUserToStorage, removeUserFromStorage } from './utils/localStorage';
import DashboardPage from './pages/DashboardPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';

function App() {
  const { user, isAuthenticated } = useAuth0();

  useEffect(() => {
    if (isAuthenticated && user) {
      saveUserToStorage(user);
    } else if (!isAuthenticated) {
      removeUserFromStorage();
    }
  }, [isAuthenticated, user]);

  return (
    <main>
      <Outlet />
      
    </main>
  );
}

export default App;