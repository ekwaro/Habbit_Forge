// src/components/PublicNavbar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Group,
  Text,
  NavLink,
  Burger, // For the mobile menu icon
  rem,
  Drawer,  // To create the slide-out mobile menu
  Stack,
  Flex,   // To arrange links vertically in the drawer
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks'; // For managing the drawer's open/close state
import { IconHome } from '@tabler/icons-react'; // Example icon

const PublicNavbar = () => {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure();
  const location = useLocation();

  // Re-usable set of navigation links for both desktop and mobile
  const navLinks = (
    <>
      <NavLink
        component={Link}
        to="/"
        label="Home"
        // leftSection={<IconHome style={{ width: rem(18), height: rem(18) }} stroke={1.5} />}
        active={location.pathname === '/'}
        // onClick={closeDrawer} // Close drawer on link click (for mobile)
      />
      <NavLink
        component={Link}
        to="/about"
        label="About Us"
        active={location.pathname === '/about'}
        onClick={closeDrawer}
      />
      <NavLink
        component={Link}
        to="/contact"
        label="Contact Us"
        active={location.pathname === '/contact'}
        onClick={closeDrawer}
      />
      <NavLink
        component={Link}
        to="/signup"
        label="Sign Up"
        active={location.pathname === '/signup'}
        onClick={closeDrawer}
      />
      <NavLink
        component={Link}
        to="/login"
        label="Login"
        active={location.pathname === '/login'}
        onClick={closeDrawer}
      />
    </>
  );

  return (
    // This outer Group spans the full header width and justifies content
    <Group h="100%" px="md" justify="space-between">

      {/* Left Side of Header: Logo & Name + Mobile Burger */}
      {/* This group holds elements that stick to the left */}
      <Group gap="xs">
        {/* Burger only visible on small screens */}
        <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="sm" size="sm" />
        {/* Logo and App Name - always visible */}
        {/* You can add your Image component here if you have a logo file */}
        {/* <Image src="/path/to/your/logo.png" alt="Habits Forge Logo" width={30} height={30} /> */}
        <Text fw={500} size="lg">Habits Forge</Text>
      </Group>

      {/* Right Side of Header: Desktop Navigation Links */}
      {/* This group holds desktop links, hidden on small screens */}
      <Group gap="md" visibleFrom="sm"
           style={{
          display: 'flex',       // Ensure it is a flex container
          flexDirection: 'row',  // Force children to lay out horizontally
          alignItems: 'center',
          flexWrap: 'nowrap',   // Vertically align items in the middle
        }}>
        {navLinks} {/* Render the desktop nav links here */}
      </Group>

      {/* Mobile Navigation Drawer - Appears on small screens when burger is clicked */}
      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        title="Navigation"
        overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
        hiddenFrom="md" // Drawer itself is hidden from desktop sizes
        position="left" // Typically mobile drawers slide from left or right
      >
        <Stack>
          {navLinks} {/* Re-use the same nav links for the vertical drawer menu */}
        </Stack>
      </Drawer>
    </Group>
  );
};

export default PublicNavbar;