import { Container, Title, Text, Paper, Box, Blockquote, Divider, Group, Card, rem } from '@mantine/core';
import { IconSparkles, IconChartBar, IconUsers, IconTrendingUp } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { keyframes } from '@emotion/react';

// Animated background keyframes
const animatedBackground = keyframes`
  0% { background-position: 0% 0%; }
  100% { background-position: 100% 100%; }
`;

function AnalyticsSectionPage() {
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
          p="xl"
          shadow="xl"
          radius="lg"
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
              Analytics & Insights
            </Title>
            <Text size="lg" color="dimmed" mb="sm" style={{ fontWeight: 500 }}>
              View user statistics, habit completion rates, and other key metrics.
            </Text>
            <Blockquote
              color="blue"
              cite="Peter Drucker"
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
              <strong>"What gets measured gets managed."</strong>
            </Blockquote>
          </div>

          <Divider my="xl" label="Analytics Overview" labelPosition="center" />

          <Group grow gap={24} mb="lg" align="stretch">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              style={{ flex: 1 }}
            >
              <Card shadow="md" padding="lg" radius="lg" withBorder style={{ background: 'rgba(255,255,255,0.92)', minHeight: rem(140) }}>
                <Group gap="md">
                  <IconChartBar size={36} color="#228be6" />
                  <div>
                    <Text fw={700} size="lg">Habit Completion Rate</Text>
                    <Text c="dimmed" size="sm">Coming soon: Visualize how users are completing their habits over time.</Text>
                  </div>
                </Group>
              </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{ flex: 1 }}
            >
              <Card shadow="md" padding="lg" radius="lg" withBorder style={{ background: 'rgba(255,255,255,0.92)', minHeight: rem(140) }}>
                <Group gap="md">
                  <IconUsers size={36} color="#228be6" />
                  <div>
                    <Text fw={700} size="lg">User Growth</Text>
                    <Text c="dimmed" size="sm">Coming soon: Track the growth of your user base and engagement.</Text>
                  </div>
                </Group>
              </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              style={{ flex: 1 }}
            >
              <Card shadow="md" padding="lg" radius="lg" withBorder style={{ background: 'rgba(255,255,255,0.92)', minHeight: rem(140) }}>
                <Group gap="md">
                  <IconTrendingUp size={36} color="#228be6" />
                  <div>
                    <Text fw={700} size="lg">Trends & Insights</Text>
                    <Text c="dimmed" size="sm">Coming soon: Discover trends and actionable insights from your data.</Text>
                  </div>
                </Group>
              </Card>
            </motion.div>
          </Group>
        </Paper>
      </Container>
    </Box>
  );
}
export default AnalyticsSectionPage;