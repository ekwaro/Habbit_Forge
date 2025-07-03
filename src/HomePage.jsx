import { Button, Group, Text, Title, Paper, Space, Image, Divider, Blockquote, Badge, Overlay, Container, Box } from '@mantine/core';
import { Link } from 'react-router-dom';
import { IconFlame, IconTarget, IconSparkles } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { keyframes } from '@emotion/react';

// Define keyframes separately
const animatedBackground = keyframes`
  0% { background-position: 0% 0%; }
  100% { background-position: 100% 100%; }
`;

function HomePage() {
  return (
    <Box
      style={{
        minHeight: 'calc(100vh - var(--mantine-header-height, 0px) - var(--mantine-footer-height, 0px))',
        background: `linear-gradient(120deg, #e0e7ff 0%, #b2f2bb 100%)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundBlendMode: 'overlay',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 0',
        animation: `${animatedBackground} 20s linear infinite`,
      }}
    >
      <Container size="md" px="md">
        <Paper
          shadow="xl"
          radius="lg"
          p="xl"
          style={{
            background: 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(6px)',
            border: '1.5px solid #e3e8f0',
            boxShadow: '0 4px 32px 0 rgba(34,139,230,0.10)',
          }}
        >
          {/* Hero Section */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <Title
              order={1}
              mb="sm"
              style={{
                fontSize: 'clamp(2.2rem, 6vw, 3.2rem)',
                fontWeight: 900,
                letterSpacing: '-0.02em',
                color: '#222',
                lineHeight: 1.1,
              }}
            >
              Small Steps. Lasting Change.
            </Title>
            <Text size="lg" color="dimmed" mb="sm" style={{ fontWeight: 500 }}>
              Your personal path to building better habits.
            </Text>
            <Text size="md" color="dimmed" mb="md">
              Track your goals, stay consistent, and transform your daily routine.
            </Text>
            <Group justify="center" mt="md">
              <Button
                component={Link}
                to="/signup"
                size="lg"
                radius="xl"
                leftSection={<IconFlame size={20} />}
                style={{ fontWeight: 700 }}
              >
                Get Started
              </Button>
              <Button
                component={Link}
                to="/about"
                size="lg"
                radius="xl"
                variant="outline"
                leftSection={<IconSparkles size={20} />}
                style={{ fontWeight: 700 }}
              >
                Learn More
              </Button>
            </Group>
          </div>

          <Divider my="lg" />

          {/* Features/Benefits Section */}
          <Group justify="center" gap={24} mb="lg" wrap="wrap">
            <Badge
              color="blue"
              size="lg"
              variant="light"
              leftSection={<IconTarget size={16} />}
              style={{ fontWeight: 600, fontSize: '1rem', padding: '8px 16px' }}
            >
              Track Progress
            </Badge>
            <Badge
              color="teal"
              size="lg"
              variant="light"
              leftSection={<IconFlame size={16} />}
              style={{ fontWeight: 600, fontSize: '1rem', padding: '8px 16px' }}
            >
              Build Habits
            </Badge>
            <Badge
              color="yellow"
              size="lg"
              variant="light"
              leftSection={<IconSparkles size={16} />}
              style={{ fontWeight: 600, fontSize: '1rem', padding: '8px 16px' }}
            >
              Stay Motivated
            </Badge>
          </Group>

          <Blockquote
            color="blue"
            cite="James Clear"
            style={{
              fontSize: '1.1rem',
              margin: '0 auto',
              maxWidth: 500,
              background: 'rgba(34,139,230,0.07)',
              borderRadius: 8,
              padding: '16px 24px',
            }}
          >
            <strong>"Every action you take is a vote for the type of person you wish to become."</strong>
          </Blockquote>
        </Paper>
      </Container>
    </Box>
  );
}

export default HomePage;