import { Container, Title, Text, Paper, Box, Blockquote, Divider, Group, Card, rem, SimpleGrid } from '@mantine/core';
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
        background: 'linear-gradient(120deg, #fffaf3 0%, #fff3e0 50%, #ffe5c0 100%)', // softened orange gradient
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
            background: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(8px)',
            border: '1.5px solid #ffe0b2',
            boxShadow: '0 4px 32px 0 rgba(255,146,43,0.10)',
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
                color: '#ff922b', // orange title
                lineHeight: 1.1,
              }}
            >
              Analytics & Insights
            </Title>
            <Text size="lg" color="#222" mb="sm" style={{ fontWeight: 500 }}>
              View user statistics, habit completion rates, and other key metrics.
            </Text>
            <Blockquote
              color="#ff922b"
              cite="Peter Drucker"
              style={{
                fontSize: '1.1rem',
                margin: '0 auto',
                maxWidth: 500,
                background: 'rgba(255,146,43,0.07)',
                borderRadius: 8,
                padding: '16px 24px',
              }}
              icon={<IconSparkles size={32} color="#ff922b" />}
            >
              <strong>"What gets measured gets managed."</strong>
            </Blockquote>
          </div>

          <Divider my="xl" label="Analytics Overview" labelPosition="center" color="#ff922b" />

          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing={24} mb="lg">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              style={{ height: '100%' }}
            >
              <Card shadow="md" padding="lg" radius="lg" withBorder style={{ background: 'rgba(255,255,255,0.92)', minHeight: rem(140), height: '100%' }}>
                <Group gap="md">
                  <IconChartBar size={36} color="#ff922b" />
                  <div>
                    <Text fw={700} size="lg">Habit Completion Rate</Text>
                    <Text c="#222" size="sm">Coming soon: Visualize how users are completing their habits over time.</Text>
                  </div>
                </Group>
              </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{ height: '100%' }}
            >
              <Card shadow="md" padding="lg" radius="lg" withBorder style={{ background: 'rgba(255,255,255,0.92)', minHeight: rem(140), height: '100%' }}>
                <Group gap="md">
                  <IconUsers size={36} color="#ff922b" />
                  <div>
                    <Text fw={700} size="lg">User Growth</Text>
                    <Text c="#222" size="sm">Coming soon: Track the growth of your user base and engagement.</Text>
                  </div>
                </Group>
              </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              style={{ height: '100%' }}
            >
              <Card shadow="md" padding="lg" radius="lg" withBorder style={{ background: 'rgba(255,255,255,0.92)', minHeight: rem(140), height: '100%' }}>
                <Group gap="md">
                  <IconTrendingUp size={36} color="#ff922b" />
                  <div>
                    <Text fw={700} size="lg">Trends & Insights</Text>
                    <Text c="#222" size="sm">Coming soon: Discover trends and actionable insights from your data.</Text>
                  </div>
                </Group>
              </Card>
            </motion.div>
          </SimpleGrid>
        </Paper>
      </Container>
    </Box>
  );
}
export default AnalyticsSectionPage;