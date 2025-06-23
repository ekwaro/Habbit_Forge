import { Button, Group, Text, Title, Paper, Container, Space } from '@mantine/core';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <Container
      size="lg"
      pt={80}
      style={{
        minHeight: '100vh',
        backgroundColor: '#e6f4ea', // light green background
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Paper
        shadow="lg"
        radius="lg"
        p={40}
        withBorder
        style={{
          backgroundColor: '#c7eed8', // card color
          width: '100%',
          maxWidth: 700, // made it wider
        }}
      >
        <Title order={1} align="center" mb="xl" style={{ fontSize: '2rem' }}>
          Welcome to Habit Forge
        </Title>

        <Text align="center" size="lg" color="dark" mb="sm">
          Your personal path to building better habits.
        </Text>

        <Text align="center" size="md" color="dark" mb="xl">
          Track your goals, stay consistent, and transform your daily routine one habit at a time.
        </Text>

        <Group position="center" spacing="xl">
          <Button component={Link} to="/login" size="md" variant="light" color="green">
            Login
          </Button>
          <Button component={Link} to="/signup" size="md" color="teal">
            Sign Up
          </Button>
        </Group>
      </Paper>
    </Container>
  );
}

export default HomePage;
