import React, { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Text,
  SimpleGrid,
  Card,
  Group,
  Badge,
  rem,
  Loader,
  Stack,
  Button,
  Divider,
  Paper,
  Blockquote,
  Box,
} from '@mantine/core';
import {
  IconCategory,
  IconQuote,
  IconLink,
  IconUsers,
  IconRun,
  IconPlus,
  IconUserCircle,
  IconSparkles,
  IconFlame,
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { keyframes } from '@emotion/react';

// Helper function to safely get parsed data from local storage
const getLocalStorageCount = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data).length : 0;
  } catch (e) {
    console.error(`Error parsing data from ${key} in localStorage:`, e);
    return 0; // Return 0 if data is corrupted
  }
};

// Animated background keyframes
const animatedBackground = keyframes`
  0% { background-position: 0% 0%; }
  100% { background-position: 100% 100%; }
`;

function DashboardPage1() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCategories: 0,
    totalMotivationalQuotes: 0,
    totalHabitTips: 0,
    totalQuoteResources: 0,
    totalHabitTipResources: 0,
    totalUsers: '500+', // Dummy data
    activeHabitsToday: '120', // Dummy data
  });

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setStats({
        totalCategories: getLocalStorageCount('habitCategories'),
        totalMotivationalQuotes: getLocalStorageCount('motivationalQuotes'),
        totalHabitTips: getLocalStorageCount('habitTips'),
        totalQuoteResources: getLocalStorageCount('quoteResources'),
        totalHabitTipResources: getLocalStorageCount('habitTipResources'),
        totalUsers: '500+',
        activeHabitsToday: '120',
      });
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const StatCard = ({ icon: Icon, title, value, color, delay = 0 }) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
    >
      <Card shadow="md" padding="lg" radius="lg" withBorder style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(6px)' }}>
        <Group justify="space-between" mb="xs">
          <Text fw={600} size="lg">{title}</Text>
          <Icon style={{ width: rem(28), height: rem(28), color: color || 'var(--mantine-color-gray-6)' }} stroke={1.5} />
        </Group>
        {loading ? (
          <Group justify="center">
            <Loader size="sm" />
          </Group>
        ) : (
          <Text size="xl" fw={800} style={{ fontSize: '2rem' }}>
            {value}
          </Text>
        )}
      </Card>
    </motion.div>
  );

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
      <Container size="lg" px="md">
        <Paper
          shadow="xl"
          radius="lg"
          p="xl"
          style={{
            background: 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(8px)',
            border: '1.5px solid #e3e8f0',
            boxShadow: '0 4px 32px 0 rgba(34,139,230,0.10)',
          }}
        >
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
              Admin Dashboard
            </Title>
            <Text size="lg" color="dimmed" mb="sm" style={{ fontWeight: 500 }}>
              Welcome to your Habits Forge Admin Dashboard!
            </Text>
            <Text size="md" color="dimmed" mb="md">
              Get a quick summary of your application's content and activity.
            </Text>
          </div>

          <Divider my="lg" />

          {/* Grid for statistical overview cards */}
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
            <StatCard
              icon={IconCategory}
              title="Habit Categories"
              value={stats.totalCategories}
              color="var(--mantine-color-indigo-6)"
              delay={0.05}
            />
            <StatCard
              icon={IconQuote}
              title="Motivational Quotes"
              value={stats.totalMotivationalQuotes}
              color="var(--mantine-color-orange-6)"
              delay={0.1}
            />
            <StatCard
              icon={IconLink}
              title="Habit Tips"
              value={stats.totalHabitTips}
              color="var(--mantine-color-yellow-6)"
              delay={0.15}
            />
            <StatCard
              icon={IconLink}
              title="Quote Resources"
              value={stats.totalQuoteResources}
              color="var(--mantine-color-pink-6)"
              delay={0.2}
            />
            <StatCard
              icon={IconLink}
              title="Habit Tip Resources"
              value={stats.totalHabitTipResources}
              color="var(--mantine-color-green-6)"
              delay={0.25}
            />
            <StatCard
              icon={IconUsers}
              title="Total Users"
              value={stats.totalUsers}
              color="var(--mantine-color-blue-6)"
              delay={0.3}
            />
            <StatCard
              icon={IconRun}
              title="Active Habits Today"
              value={stats.activeHabitsToday}
              color="var(--mantine-color-cyan-6)"
              delay={0.35}
            />
            {/* Quick Actions Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card shadow="md" padding="lg" radius="lg" withBorder style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(6px)' }}>
                <Stack gap="md">
                  <Title order={4} mb="xs">Quick Actions</Title>
                  <Button
                    component={Link}
                    to="categories"
                    leftSection={<IconPlus size={16} />}
                    fullWidth
                    radius="xl"
                    size="md"
                    style={{ fontWeight: 700 }}
                    variant="light"
                  >
                    Add/Manage Categories
                  </Button>
                  <Button
                    component={Link}
                    to="quotes"
                    leftSection={<IconPlus size={16} />}
                    fullWidth
                    radius="xl"
                    size="md"
                    style={{ fontWeight: 700 }}
                    variant="light"
                  >
                    Add/Manage Quotes
                  </Button>
                  <Button
                    component={Link}
                    to="tips"
                    leftSection={<IconPlus size={16} />}
                    fullWidth
                    radius="xl"
                    size="md"
                    style={{ fontWeight: 700 }}
                    variant="light"
                  >
                    Add/Manage Tips
                  </Button>
                  <Button
                    component={Link}
                    to="profile"
                    leftSection={<IconUserCircle size={16} />}
                    fullWidth
                    radius="xl"
                    size="md"
                    style={{ fontWeight: 700 }}
                    variant="light"
                  >
                    View Admin Profile
                  </Button>
                </Stack>
              </Card>
            </motion.div>
          </SimpleGrid>

          <Divider my="xl" />

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
            icon={<IconSparkles size={32} color="#228be6" />}
          >
            <strong>"Every action you take is a vote for the type of person you wish to become."</strong>
          </Blockquote>

          <Stack mt="xl" gap="md">
            <Title order={3}>Further Insights:</Title>
            <Text>This dashboard currently focuses on content overview. For deeper user analytics (e.g., habit completion rates, user retention), a dedicated backend and database would be required.</Text>
            <Text>Future enhancements could include visual charts and graphs powered by real-time data.</Text>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}

export default DashboardPage1;