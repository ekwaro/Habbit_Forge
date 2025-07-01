import React from 'react';
import { Title, Text, Container, Paper, Group, Badge, Box, Divider, Image } from '@mantine/core';
import { IconTarget, IconFlame, IconSparkles, IconBulb } from '@tabler/icons-react';
// import aboutHero from '../assets/about-hero.jpg';
const aboutHero = 'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=600&q=80';

function AboutUsPage() {
  return (
    <Box
      style={{
        minHeight: 'calc(100vh - var(--mantine-header-height, 0px) - var(--mantine-footer-height, 0px))',
        background: 'linear-gradient(120deg, #e0e7ff 0%, #b2f2bb 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundBlendMode: 'overlay',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 0',
      }}
    >
      <Container size="md" px="md">
        <Paper
          shadow="xl"
          radius="lg"
          p="xl"
          style={{
            background: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(6px)',
            border: '1.5px solid #e3e8f0',
            boxShadow: '0 4px 32px 0 rgba(34,139,230,0.10)',
          }}
        >
          {/* Hero Section with Image */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <Image
              src={aboutHero}
              alt="Person focused on laptop"
              width={240}
              height={240}
              radius={120}
              mx="auto"
              mb={16}
              style={{ objectFit: 'cover', boxShadow: '0 2px 16px 0 rgba(34,139,230,0.10)' }}
            />
            <Title order={1} mb="sm" style={{ fontWeight: 900, fontSize: '2.2rem', color: '#222' }}>
              About Habits Forge
            </Title>
            <Text size="lg" color="dimmed" mb="sm" style={{ fontWeight: 500 }}>
              Helping you build better habits, one step at a time.
            </Text>
          </div>

          <Divider my="lg" />

          {/* Mission & Vision Section */}
          <Group gap={24} mb="xl" align="stretch" wrap="wrap" justify="center">
            <Paper shadow="sm" radius="md" p="md" style={{ flex: 1, minWidth: 220, background: 'rgba(224,247,250,0.5)' }}>
              <Group gap={8} mb={4} align="center">
                <IconTarget size={22} color="#228be6" />
                <Text fw={700} size="lg">Our Mission</Text>
              </Group>
              <Text size="sm" color="dimmed">
                To empower individuals to create lasting positive change by making habit-building simple, motivating, and fun.
              </Text>
            </Paper>
            <Paper shadow="sm" radius="md" p="md" style={{ flex: 1, minWidth: 220, background: 'rgba(255,249,196,0.4)' }}>
              <Group gap={8} mb={4} align="center">
                <IconFlame size={22} color="#fa5252" />
                <Text fw={700} size="lg">Our Vision</Text>
              </Group>
              <Text size="sm" color="dimmed">
                A world where everyone can achieve their goals and live their best life through the power of small, consistent actions.
              </Text>
            </Paper>
          </Group>

          {/* Core Values/Features Section */}
          <Group justify="center" gap={24} mb="lg" wrap="wrap">
            <Badge
              color="blue"
              size="lg"
              variant="light"
              leftSection={<IconSparkles size={16} />}
              style={{ fontWeight: 600, fontSize: '1rem', padding: '8px 16px' }}
            >
              Motivation & Support
            </Badge>
            <Badge
              color="teal"
              size="lg"
              variant="light"
              leftSection={<IconBulb size={16} />}
              style={{ fontWeight: 600, fontSize: '1rem', padding: '8px 16px' }}
            >
              Practical Tips
            </Badge>
            <Badge
              color="yellow"
              size="lg"
              variant="light"
              leftSection={<IconTarget size={16} />}
              style={{ fontWeight: 600, fontSize: '1rem', padding: '8px 16px' }}
            >
              Goal Tracking
            </Badge>
          </Group>

          <Text align="center" size="sm" color="dimmed" mt="xl">
            Join us on your journey to a better you. Every day is a new opportunity to grow!
          </Text>
        </Paper>
      </Container>
    </Box>
  );
}

export default AboutUsPage;