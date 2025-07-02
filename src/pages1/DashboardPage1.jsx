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
  Button, //Button for quick action links
} from '@mantine/core';
import {
  IconCategory,
  IconQuote,
  IconLink,
  IconUsers,
  IconRun,
  IconPlus, // Quick Add button
  IconUserCircle, //Admin Profile quick link
} from '@tabler/icons-react';
import { Link } from 'react-router-dom'; // React Router for navigation

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

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group justify="space-between" mb="xs">
        <Text fw={500}>{title}</Text>
        <Icon style={{ width: rem(24), height: rem(24), color: color || 'var(--mantine-color-gray-6)' }} stroke={1.5} />
      </Group>
      {loading ? (
        <Group justify="center">
          <Loader size="sm" />
        </Group>
      ) : (
        <Text size="xl" fw={700}>
          {value}
        </Text>
      )}
    </Card>
  );

  return (
    <Container size="xl" my="lg">
      <Title order={2} mb="lg" fw={700}>Dashboard Overview</Title>
      <Text c="dimmed" mb="xl">Welcome to your Habits Forge Admin Dashboard! Here's a quick summary of your application's content and activity.</Text>

      {/* Grid for statistical overview cards */}
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
        <StatCard
          icon={IconCategory}
          title="Habit Categories"
          value={stats.totalCategories}
          color="var(--mantine-color-indigo-6)"
        />
        <StatCard
          icon={IconQuote}
          title="Motivational Quotes"
          value={stats.totalMotivationalQuotes}
          color="var(--mantine-color-orange-6)"
        />
        <StatCard
          icon={IconLink}
          title="Habit Tips"
          value={stats.totalHabitTips}
          color="var(--mantine-color-yellow-6)"
        />
        <StatCard
          icon={IconLink}
          title="Quote Resources"
          value={stats.totalQuoteResources}
          color="var(--mantine-color-pink-6)"
        />
        <StatCard
          icon={IconLink}
          title="Habit Tip Resources"
          value={stats.totalHabitTipResources}
          color="var(--mantine-color-green-6)"
        />
        <StatCard
          icon={IconUsers}
          title="Total Users"
          value={stats.totalUsers}
          color="var(--mantine-color-blue-6)"
        />
        <StatCard
          icon={IconRun}
          title="Active Habits Today"
          value={stats.activeHabitsToday}
          color="var(--mantine-color-cyan-6)"
        />

        {/* NEW: Quick Actions Card */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="md">
            <Title order={4} mb="xs">Quick Actions</Title>
            <Button
              component={Link} // Use Link component for navigation
              to="categories"
              leftSection={<IconPlus size={16} />}
              fullWidth
              variant="light"
            >
              Add/Manage Categories
            </Button>
            <Button
              component={Link}
              to="quotes"
              leftSection={<IconPlus size={16} />}
              fullWidth
              variant="light"
            >
              Add/Manage Quotes
            </Button>
            <Button
              component={Link}
              to="tips"
              leftSection={<IconPlus size={16} />}
              fullWidth
              variant="light"
            >
              Add/Manage Tips
            </Button>
             <Button
              component={Link}
              to="profile"
              leftSection={<IconUserCircle size={16} />}
              fullWidth
              variant="light"
            >
              View Admin Profile
            </Button>
          </Stack>
        </Card>
      </SimpleGrid>

      <Stack mt="xl" gap="md">
        <Title order={3}>Further Insights:</Title>
        <Text>This dashboard currently focuses on content overview. For deeper user analytics (e.g., habit completion rates, user retention), a dedicated backend and database would be required.</Text>
        <Text>Future enhancements could include visual charts and graphs powered by real-time data.</Text>
      </Stack>
    </Container>
  );
}

export default DashboardPage1;