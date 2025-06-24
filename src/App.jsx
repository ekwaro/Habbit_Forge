import { useState, useEffect } from 'react'
import './App.css'
import { Center, Text } from '@mantine/core'

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
export default App