// src/components/PublicFooter.jsx
import React from 'react';
import { Group, Text, Anchor, Box, Divider } from '@mantine/core'; // Using Anchor for simple links
import { Link } from 'react-router-dom'; // For internal navigation

const PublicFooter = () => {
  return (
    <Group
      h="100%" // Take full height of the AppShell.Footer slot
      px="md"  // Horizontal padding
      justify="space-between" // Pushes children to far left and far right
      align="center" // Vertically aligns content in the middle
      style={{
        borderTop: '1px solid var(--mantine-color-gray-2)', // A subtle top border
        backgroundColor: 'var(--mantine-color-gray-0)', // Light background for the footer
        paddingBlock: '1rem', // Vertical padding
      }}
    >
      {/* Right side: Site Logo and Name */}
      <Group gap="xs"> {/* Logo and name are grouped */}
        {/* You can add your Image component here if you have a logo file */}
        {/* <Image src="/path/to/your/logo.png" alt="Habits Forge Logo" width={20} height={20} /> */}
        <Text fw={700} size="sm">Habits Forge</Text>
        <Text size="xs" c="dimmed">© {new Date().getFullYear()}</Text> {/* Current year copyright */}
      </Group>
      {/* Left side: Navigation Links */}
      <Group gap="md"> {/* Links are grouped with spacing */}
        <Anchor component={Link} to="/terms-of-service" size="sm" c="dimmed">
          Terms of Service
        </Anchor>
        <Anchor component={Link} to="/contact" size="sm" c="dimmed">
          Contact Us
        </Anchor>
        <Anchor component={Link} to="/about" size="sm" c="dimmed">
          About Us
        </Anchor>
      </Group>
    </Group>
  );
};

export default PublicFooter;