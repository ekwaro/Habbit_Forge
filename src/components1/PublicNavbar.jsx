import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Group,
  Text,
  Burger,
  Drawer,
  Stack,
  Button,
  Flex,
  Box,
  Image,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import logo from '../assets/logo.png';


const PublicNavbar = () => {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure();
  const location = useLocation();


  const regularLinks = (

    <>
      <Button
        component={Link}
        to="/"

        variant={location.pathname === '/' ? 'light' : 'subtle'}
        color="gray"
        radius="xl"
        size="sm" // Medium size buttons
        onClick={closeDrawer}
        px="md" // Moderate padding
        style={{ minWidth: '80px' }} // Fixed minimum width
      >
        Home
      </Button>
      <Button

        component={Link}
        to="/about"
        variant={location.pathname === '/about' ? 'light' : 'subtle'}
        color="gray"
        radius="xl"
        size="sm"
        onClick={closeDrawer}

        px="md"
        style={{ minWidth: '80px' }}
      >
        About
      </Button>
      <Button

        component={Link}
        to="/contact"
        variant={location.pathname === '/contact' ? 'light' : 'subtle'}
        color="gray"
        radius="xl"
        size="sm"
        onClick={closeDrawer}

        px="md"
        style={{ minWidth: '80px' }}
      >
        Contact
      </Button>

    </>
  );

  return (

    <Box py={4} px="md" style={{ height: '56px', borderBottom: '1px solid #e9ecef' }}> 
      {/* Reduced vertical padding and added subtle border */}
      <Group h="100%" justify="space-between">
        {/* Left Side */}
        <Group gap="xs">
          <Burger 
            opened={drawerOpened} 
            onClick={toggleDrawer} 
            hiddenFrom="sm" 
            size="sm"
          />
          <Image
            src={logo}
            alt="Habit Forge Logo"
            width={48}
            height={48}
            style={{ borderRadius: '50%', boxShadow: '0 1px 6px 0 rgba(34,139,230,0.10)', objectFit: 'cover' }}
          />
        </Group>

        {/* Right Side: Desktop Navigation */}
        <Flex gap={4} align="center" visibleFrom="sm"> 
          {/* Tight gap between buttons */}
          {regularLinks}
          <Button
            component={Link}
            to="/login"
            variant="outline"
            color="blue"
            radius="xl"
            size="sm"
            onClick={closeDrawer}
            px="md"
            style={{ minWidth: '80px' }}
          >
            Login
          </Button>
          <Button
            component={Link}
            to="/signup"
            variant="gradient"
            gradient={{ from: 'blue', to: 'cyan', deg: 45 }}
            radius="xl"
            size="sm"
            onClick={closeDrawer}
            px="md"
            style={{ minWidth: '80px' }}
          >
            Sign Up
          </Button>
        </Flex>

        {/* Mobile Navigation Drawer */}
        <Drawer
          opened={drawerOpened}
          onClose={closeDrawer}
          title="Menu"
          size="sm"
          overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
          hiddenFrom="sm"
          position="left"
        >
          <Stack gap={4}> {/* Tight gap */}
            {regularLinks}
            <Button
              component={Link}
              to="/login"
              variant="outline"
              color="blue"
              radius="xl"
              size="sm"
              onClick={closeDrawer}
              fullWidth
            >
              Login
            </Button>
            <Button
              component={Link}
              to="/signup"
              variant="gradient"
              gradient={{ from: 'blue', to: 'cyan', deg: 45 }}
              radius="xl"
              size="sm"
              onClick={closeDrawer}
              fullWidth
            >
              Sign Up
            </Button>
          </Stack>
        </Drawer>
      </Group>
    </Box>

  );
};

export default PublicNavbar;