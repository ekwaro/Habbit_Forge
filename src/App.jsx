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
  return(
    <>
    <Center>
      <div>
        <Text size="xl" weight={700} mb="md">Welcome to HabbitForge!</Text>
        <Text size="md" c="dimmed">Your journey to better habits starts here.</Text>
      </div>
    </Center>
    </>
  )
}

export default App;