// src/components/PublicFooter.jsx
import React from 'react'
import { Group, Text, Anchor, Box } from '@mantine/core';
import { Link } from 'react-router-dom';


const PublicFooter = () => {
  return (
    <Box
      component="footer"
      style={{
       // position: 'fixed',
        width: '100%',
        backgroundColor: '#222',
        color: '#f0f0f0',
        padding: '2rem 0', // Increased padding
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 -4px 10px rgba(0, 0, 0, 0.15)', // Stronger shadow
        marginTop: 'auto', // Pushes footer to bottom in flex layouts
        minHeight: '100px', // Minimum height guarantee
      }}
    >
      <Box
        maw="1200px"
        mx="auto"
        px="md"
      >
        <Group
          justify="space-between"
          align="center"
          style={{ height: '100%' }}
        >
          {/* Right side: Site Logo and Name */}
          <Group gap="xs">
            <Text fw={700} size="md">Habits Forge</Text> {/* Increased size */}
            <Text size="sm" c="dimmed">© {new Date().getFullYear()}</Text> {/* Increased size */}
          </Group>
          
          {/* Left side: Navigation Links */}
          <Group gap="xl"> {/* Increased gap between links */}
            <Anchor component={Link} to="/terms-of-service" size="sm">
              Terms of Service
            </Anchor>
            <Anchor component={Link} to="/contact" size="sm">
              Contact Us
            </Anchor>
            <Anchor component={Link} to="/about" size="sm">
              About Us
            </Anchor>
          </Group>
        </Group>
      </Box>

    </Box>
  );
};

export default PublicFooter;