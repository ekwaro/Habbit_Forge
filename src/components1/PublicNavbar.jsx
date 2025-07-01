// src/components/PublicNavbar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Group,
  Text,
  NavLink,
  Burger, // For the mobile menu icon
  Drawer,  // To create the slide-out mobile menu
  Stack,
  Image,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks'; // For managing the drawer's open/close state
import logo from '../assets/logo.png';

const PublicNavbar = () => {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure();
  const location = useLocation();

  // Navigation links: Home, About Us, Contact Us, Sign Up, Login
  const navLinks = (
    <>
      <NavLink
        component={Link}
        to="/"
        label="Home"
        active={location.pathname === '/'}
        onClick={closeDrawer}
        style={{
          whiteSpace: 'nowrap',
          minWidth: 120,
          fontWeight: 700,
          fontSize: '1.08rem',
          borderRadius: 8,
          transition: 'background 0.18s, color 0.18s',
          background: location.pathname === '/' ? 'rgba(34,139,230,0.10)' : 'transparent',
          color: location.pathname === '/' ? '#228be6' : '#222',
        }}
        onMouseEnter={e => {
          e.target.style.background = 'rgba(34,139,230,0.10)';
          e.target.style.color = '#228be6';
        }}
        onMouseLeave={e => {
          e.target.style.background = location.pathname === '/' ? 'rgba(34,139,230,0.10)' : 'transparent';
          e.target.style.color = location.pathname === '/' ? '#228be6' : '#222';
        }}
      />
      <NavLink
        component={Link}
        to="/about"
        label="About Us"
        active={location.pathname === '/about'}
        onClick={closeDrawer}
        style={{
          whiteSpace: 'nowrap',
          minWidth: 120,
          fontWeight: 700,
          fontSize: '1.08rem',
          borderRadius: 8,
          transition: 'background 0.18s, color 0.18s',
          background: location.pathname === '/about' ? 'rgba(34,139,230,0.10)' : 'transparent',
          color: location.pathname === '/about' ? '#228be6' : '#222',
        }}
        onMouseEnter={e => {
          e.target.style.background = 'rgba(34,139,230,0.10)';
          e.target.style.color = '#228be6';
        }}
        onMouseLeave={e => {
          e.target.style.background = location.pathname === '/about' ? 'rgba(34,139,230,0.10)' : 'transparent';
          e.target.style.color = location.pathname === '/about' ? '#228be6' : '#222';
        }}
      />
      <NavLink
        component={Link}
        to="/contact"
        label="Contact Us"
        active={location.pathname === '/contact'}
        onClick={closeDrawer}
        style={{
          whiteSpace: 'nowrap',
          minWidth: 120,
          fontWeight: 700,
          fontSize: '1.08rem',
          borderRadius: 8,
          transition: 'background 0.18s, color 0.18s',
          background: location.pathname === '/contact' ? 'rgba(34,139,230,0.10)' : 'transparent',
          color: location.pathname === '/contact' ? '#228be6' : '#222',
        }}
        onMouseEnter={e => {
          e.target.style.background = 'rgba(34,139,230,0.10)';
          e.target.style.color = '#228be6';
        }}
        onMouseLeave={e => {
          e.target.style.background = location.pathname === '/contact' ? 'rgba(34,139,230,0.10)' : 'transparent';
          e.target.style.color = location.pathname === '/contact' ? '#228be6' : '#222';
        }}
      />
      <NavLink
        component={Link}
        to="/signup"
        label="Sign Up"
        active={location.pathname === '/signup'}
        onClick={closeDrawer}
        style={{
          whiteSpace: 'nowrap',
          minWidth: 120,
          fontWeight: 700,
          fontSize: '1.08rem',
          borderRadius: 8,
          transition: 'background 0.18s, color 0.18s',
          background: location.pathname === '/signup' ? 'rgba(34,139,230,0.10)' : 'transparent',
          color: location.pathname === '/signup' ? '#228be6' : '#222',
        }}
        onMouseEnter={e => {
          e.target.style.background = 'rgba(34,139,230,0.10)';
          e.target.style.color = '#228be6';
        }}
        onMouseLeave={e => {
          e.target.style.background = location.pathname === '/signup' ? 'rgba(34,139,230,0.10)' : 'transparent';
          e.target.style.color = location.pathname === '/signup' ? '#228be6' : '#222';
        }}
      />
      <NavLink
        component={Link}
        to="/login"
        label="Login"
        active={location.pathname === '/login'}
        onClick={closeDrawer}
        style={{
          whiteSpace: 'nowrap',
          minWidth: 120,
          fontWeight: 700,
          fontSize: '1.08rem',
          borderRadius: 8,
          transition: 'background 0.18s, color 0.18s',
          background: location.pathname === '/login' ? 'rgba(34,139,230,0.10)' : 'transparent',
          color: location.pathname === '/login' ? '#228be6' : '#222',
        }}
        onMouseEnter={e => {
          e.target.style.background = 'rgba(34,139,230,0.10)';
          e.target.style.color = '#228be6';
        }}
        onMouseLeave={e => {
          e.target.style.background = location.pathname === '/login' ? 'rgba(34,139,230,0.10)' : 'transparent';
          e.target.style.color = location.pathname === '/login' ? '#228be6' : '#222';
        }}
      />
    </>
  );

  return (
    <Group
      h="100%"
      px="xl"
      py={12}
      justify="space-between"
      style={{
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(12px)',
        borderRadius: 18,
        margin: 16,
        position: 'relative',
        zIndex: 10,
        minHeight: 72,
        border: '1.5px solid #e3e8f0',
        boxShadow: '0 6px 32px 0 rgba(60, 120, 200, 0.10)',
      }}
    >
      {/* Left Side: Logo & Mobile Burger */}
      <Group gap="md" align="center">
        <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="sm" size="md" color="#228be6" />
        <Image src={logo} alt="Habits Forge Logo" width={48} height={48} style={{ borderRadius: 14, background: 'transparent', boxShadow: '0 2px 12px 0 rgba(34,139,230,0.10)' }} />
      </Group>
      {/* Right Side: Desktop Navigation Links */}
      <Group
        gap={8}
        visibleFrom="sm"
        align="center"
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          flexWrap: 'nowrap',
          marginLeft: 'auto',
        }}
      >
        {navLinks.props.children}
      </Group>
      {/* Mobile Navigation Drawer */}
      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        title="Navigation"
        overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
        hiddenFrom="md"
        position="left"
        styles={{
          body: { padding: 0 },
          content: { background: 'rgba(255,255,255,0.98)', borderRadius: 16 },
        }}
      >
        <Stack gap={0} p="md">
          {navLinks.props.children}
        </Stack>
      </Drawer>
    </Group>
  );
};

export default PublicNavbar;