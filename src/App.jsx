// src/App.jsx
import { MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css'; // Mantine's global styles
import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { AppShell } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks'; // For managing the mobile nav state


import { useAuth0 } from '@auth0/auth0-react';
import { saveUserToStorage, removeUserFromStorage } from './utils/localStorage';


// Import the content components for header
import PublicNavbar from './components1/PublicNavbar';
import PublicFooter from './components1/PublicFooter'; 

const headerHeight = 100; // Define your header height
  const mainPaddingTop = headerHeight + 2; // Add a bit extra padding for visual separation, e.g., 16px


function App() {
  
  const { user, isAuthenticated, isLoading } = useAuth0(); 
  

  const [opened, { toggle }] = useDisclosure(); // Manage mobile menu state here

  
  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (isAuthenticated && user) {
      saveUserToStorage(user);
    } else {
      removeUserFromStorage();
    }
  }, [isAuthenticated, user, isLoading]);
  console.log(user?.email) 


  return (
    <AppShell
       header={{ height: headerHeight }}//header height
       padding={mainPaddingTop} 
    >
      <AppShell.Header>
        <PublicNavbar /> 
      </AppShell.Header>
      
      <AppShell.Main>
        <Outlet/>
        <PublicFooter/>
      </AppShell.Main>
    </AppShell>
  );
}

export default App;