// src/components/PublicFooter.jsx
import React from 'react';
import { Group, Text, Anchor, Box } from '@mantine/core'; // Using Anchor for simple links
import { Link } from 'react-router-dom'; // For internal navigation

const PublicFooter = () => {
  return (
    <Box
      component="footer"
      px={{ base: 'md', sm: 'xl' }}
      py={12}
      style={{
        background: 'rgba(24, 28, 40, 0.92)',
        backdropFilter: 'blur(6px)',
        borderRadius: 8,
        margin: '24px 16px 8px 16px',
        boxShadow: '0 2px 24px 0 rgba(34,139,230,0.10)',
        border: '1.5px solid #23293a',
        color: '#f0f0f0',
        maxWidth: 1200,
        marginLeft: 'auto',
        marginRight: 'auto',
      }}
    >
      <Group justify="space-between" align="center" wrap="wrap">
        {/* Left: copyright and name only */}
        <Group gap="xs" align="center">
          <Text fw={700} size="md" style={{ letterSpacing: 1 }}>Habits Forge</Text>
          <Text size="xs" c="dimmed">© {new Date().getFullYear()}</Text>
        </Group>
        {/* Right: Navigation Links */}
        <Group gap={24} wrap="wrap">
          <Anchor
            component={Link}
            to="/terms-of-service"
            size="md"
            style={{ color: '#b3c7e6', fontWeight: 600, transition: 'color 0.18s' }}
            onMouseEnter={e => (e.target.style.color = '#228be6')}
            onMouseLeave={e => (e.target.style.color = '#b3c7e6')}
          >
            Terms of Service
          </Anchor>
          <Anchor
            component={Link}
            to="/contact"
            size="md"
            style={{ color: '#b3c7e6', fontWeight: 600, transition: 'color 0.18s' }}
            onMouseEnter={e => (e.target.style.color = '#228be6')}
            onMouseLeave={e => (e.target.style.color = '#b3c7e6')}
          >
            Contact Us
          </Anchor>
          <Anchor
            component={Link}
            to="/about"
            size="md"
            style={{ color: '#b3c7e6', fontWeight: 600, transition: 'color 0.18s' }}
            onMouseEnter={e => (e.target.style.color = '#228be6')}
            onMouseLeave={e => (e.target.style.color = '#b3c7e6')}
          >
            About Us
          </Anchor>
        </Group>
      </Group>
    </Box>
  );
};

export default PublicFooter;