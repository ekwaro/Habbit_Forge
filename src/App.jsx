import { useState } from 'react'

import { Center, Text } from '@mantine/core'

function App() {
  useEffect(() => {
  if ("Notification" in window && Notification.permission !== "granted") {
    Notification.requestPermission();
  }
}, []);

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
export default App