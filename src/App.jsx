// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
// import { Center, Text } from '@mantine/core'

// function App() {
//   return(
//     <>
//     <Center>
//       <div>
//         <Text size="xl" weight={700} mb="md">Welcome to HabbitForge!</Text>
//         <Text size="md" c="dimmed">Your journey to better habits starts here.</Text>
//       </div>
//     </Center>
//     </>
//   )
// }
// export default App


import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom'; // Add this
import { saveUserToStorage, removeUserFromStorage } from './utils/localStorage';

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
    <main className='column'>
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <Notifications />
        <Outlet /> {/* This renders nested routes */}
      </MantineProvider>
    </main>
  );
}

export default App;