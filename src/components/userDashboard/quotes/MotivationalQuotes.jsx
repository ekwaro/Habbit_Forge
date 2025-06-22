import { Container,Card, Text } from '@mantine/core'
import React, { useState, useEffect } from 'react'

const MotivationalQuotes = () => {
  const [quotes, setQuotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  useEffect(() => {
    const fetchQuotes = async () => {
      try {
const res = await fetch("https://goquotes-api.herokuapp.com/api/v1/random?count=1");
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const data = await response.json()
        setQuotes(data.results)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }
    fetchQuotes()
  }, [])
  return (
    <Container size='sm' py='xl'>
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Text size="xl" weight={700} mb="md">Motivational Quotes</Text>
        {loading && <Text>Loading...</Text>}
        {error && <Text color="red">{error}</Text>}
        {!loading && !error && (
          <Stack>
            {quotes.map((quote) => (
              <Card key={quote._id} shadow="sm" padding="lg">
                <Text size="md" italic>"{quote.content}"</Text>
                <Text size="sm" color="dimmed">- {quote.author}</Text>
              </Card>
            ))}
          </Stack>
        )}
      </Card>

    </Container>    
  )
}

export default MotivationalQuotes