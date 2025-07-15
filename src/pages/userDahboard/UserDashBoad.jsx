import React, { useEffect, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import {
  AppShell,
  Text,
  Button,
  Group,
  Burger,
  AppShellSection,
  ScrollArea,
  Avatar,
  Center,
  Box,
  Stack,
  Tooltip,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { Outlet, useNavigate } from "react-router-dom";
const UserDashBoard = () => {
  let user = JSON.parse(localStorage.getItem('currentUser'))

  const isMobile = useMediaQuery('(max-width: 768px)');


  const handleLogout=()=>{
    localStorage.removeItem('currentUser')
    navigate('/')
  }
  const navigate = useNavigate();
  const [opened, { toggle }] = useDisclosure(false);
  const [expandedItems, setExpandedItems] = useState(new Set());

  const handleNavigate = (path) => {
    navigate(path);
    // Only close sidebar on mobile devices for better UX
    if (isMobile) {
      toggle();
    }
  };

  const toggleExpanded = (itemPath) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemPath)) {
        newSet.delete(itemPath);
      } else {
        newSet.add(itemPath);
      }
      return newSet;
    });
  };

  const handleItemClick = (item) => {
    if (item.hasSubItems) {
      toggleExpanded(item.path);
    } else {
      handleNavigate(item.path);
    }
  };

  // Keyboard shortcut for toggling sidebar (Ctrl/Cmd + B)
  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'b') {
        event.preventDefault();
        toggle();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [toggle]);

  const navItems = [
    { path: "/user-dashboard", label: "Overview", icon: IconDashboard },
    { path: "/user-dashboard/profile", label: "Profile", icon: IconUser },
    { 
      path: "/user-dashboard/manage-habits", 
      label: "Manage Habits", 
      icon: IconTarget,
      hasSubItems: true,
      subItems: [
        { path: "/user-dashboard/habbits-management", label: "Create Habits", icon: IconTarget },
        { path: "/user-dashboard/interactive-habits", label: "Interactive Habits", icon: IconCheck },
        { path: "/user-dashboard/calendar-view", label: "Calendar View", icon: IconCalendar },
      ]
    },
    { 
      path: "/user-dashboard/manage-goals", 
      label: "Manage Goals", 
      icon: IconTarget,
      hasSubItems: true,
      subItems: [
        { path: "/user-dashboard/goals-management", label: "Create Goals", icon: IconTarget },
        { path: "/user-dashboard/goal-tracking", label: "Track Goals", icon: IconTarget },
      ]
    },
    { path: "/user-dashboard/achievements", label: "Achievements", icon: IconTrophy },
    { 
      path: "/user-dashboard/motivation", 
      label: "Motivation", 
      icon: IconQuote,
      hasSubItems: true,
      subItems: [
        { path: "/user-dashboard/motivational-quotes", label: "View Quotes", icon: IconQuote },
        { path: "/user-dashboard/quote-resource", label: "Quotes Resources", icon: IconQuote },
      ]
    },
    { 
      path: "/user-dashboard/habit-tips", 
      label: "Habit Tips", 
      icon: IconBulb,
      hasSubItems: true,
      subItems: [
        { path: "/user-dashboard/tips", label: "View Tips", icon: IconBulb },
        { path: "/user-dashboard/tip-resources", label: "Tip Resources", icon: IconBulb },
      ]
    },
    { path: "/user-dashboard/insights", label: "Insights", icon: IconBrain },
  ];

  return (
    <AppShell
      header={{ height: 70 }}
      navbar={{ 
        width: 280, 
        breakpoint: "sm", 
        collapsed: { mobile: !opened, desktop: !opened } 
      }}
      padding="sm"
      style={{
        background: 'linear-gradient(120deg, #fffaf3 0%, #fff3e0 50%, #ffe5c0 100%)',
        minHeight: '100vh'
      }}
    >
      <AppShell.Header 
        withBorder 
        style={{
          background: 'linear-gradient(90deg, #fff3e0 0%, #ffe0b2 100%)',
          borderBottom: '2px solid #ffd180',
          boxShadow: '0 2px 8px rgba(255,146,43,0.08)',
          paddingLeft: 20,
          paddingRight: 20
        }}
      >
        <Group h="100%" px="md" justify='space-between' align='center'>

          <Group>
            <Tooltip
              label={`${opened ? 'Close' : 'Open'} sidebar (Ctrl+B)`}
              position="bottom"
              withArrow

            >
              <Button
                variant="light"
                size="sm"
                onClick={toggle}
                style={{
                  background: 'rgba(255,146,43,0.1)',
                  color: '#ff922b',
                  border: '1px solid rgba(255,146,43,0.2)',
                  borderRadius: 8,
                  padding: '8px 12px',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    background: 'rgba(255,146,43,0.15)',
                    transform: 'scale(1.05)'
                  }
                }}
                leftSection={opened ? <IconX size={16} /> : <IconMenu2 size={16} />}
              >
                {opened ? 'Close' : 'Menu'}
              </Button>
            </Tooltip>
            <Text 
              fw={900} 
              size='xl' 
              style={{ 
                color: '#ff922b', 
                letterSpacing: 1.5, 
                textTransform: 'uppercase',
                textShadow: '0 1px 2px rgba(255,146,43,0.1)'
              }}
            >
              User Dashboard
            </Text>
          </Group>
          <Group spacing='sm'>
            <Avatar 
              src='https://i.pravatar.cc/150?img=13'
              radius='xl'
              size='md'
              alt={user?.name}
              style={{ border: '2px solid #fff', boxShadow: '0 2px 4px rgba(255,146,43,0.2)' }}
            />
            <Text size='sm' fw={500}>{user?.username}</Text>
            <Button variant='light' c='red' size='xs' onClick={handleLogout}>Logout</Button>

         

          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar width={{ base: 250 }} hidden={!opened}>
        <AppShell.Section pr={20} mt={20}>
          <ScrollArea style={{ height: "100%" }} mx="auto">
            <Button
              variant="gradient"
              fullWidth
              m="md"
              onClick={() => handleNavigate("/user-dashboard/profile")}
            >
              Profile
            </Button>
            <Button
              fullWidth
              variant="gradient"
              m="md"
              onClick={() =>
                handleNavigate("/user-dashboard/habbits-management")
              }
            >
              Habbits Management
            </Button>
            <Button
              fullWidth
              variant="gradient"
              m="md"
              onClick={() => handleNavigate("/user-dashboard/goals-management")}
            >
              Goals Management
            </Button>
            <Button
              fullWidth
              variant="gradient"
              m="md"
              onClick={() =>
                handleNavigate("/user-dashboard/motivational-quotes")
              }
            >
              Motivational quotes
            </Button>
            <Button
              fullWidth
              variant="gradient"
              m="md"
              onClick={() => handleNavigate("/user-dashboard/tips")}
            >
              Tips
            </Button>
          </ScrollArea>

          {/* Sidebar Footer */}
          <Box mt={32} pt={24} style={{ 
            borderTop: '1px solid rgba(255,146,43,0.15)',
            textAlign: 'center' 
          }}>
            <Text size="xs" color="#666" style={{ marginBottom: 8 }}>
              Quick Stats
            </Text>
            <Group justify="center" gap={16}>
              <div style={{ textAlign: 'center' }}>
                <Text size="lg" fw={700} style={{ color: '#ff922b' }}>
                  {navItems.length - 1}
                </Text>
                <Text size="xs" color="#666">Sections</Text>
              </div>
              <div style={{ textAlign: 'center' }}>
                <Text size="lg" fw={700} style={{ color: '#ff922b' }}>
                  {user?.name ? user.name.split(' ').length : 1}
                </Text>
                <Text size="xs" color="#666">Active</Text>
              </div>
            </Group>
          </Box>
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main>
        <Box
          style={{
            background: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(8px)',
            borderRadius: 16,
            border: '1.5px solid #ffe0b2',
            boxShadow: '0 4px 32px 0 rgba(255,146,43,0.10)',
            padding: '2rem',
            margin: '0.5rem',
            minHeight: 'calc(100vh - 140px)',
            height: 'auto',
            transition: 'all 0.3s ease'
          }}
        >
          <Outlet />
        </Box>
      </AppShell.Main>

      <AppShell.Footer
        style={{
          background: 'linear-gradient(90deg, #fff3e0 0%, #ffe0b2 100%)',
          borderTop: '2px solid #ffd180',
          boxShadow: '0 -2px 8px rgba(255,146,43,0.08)'
        }}
      >
        <AppShellSection mx='xl'>
          <Center>
            <Text style={{ color: '#ff922b', fontWeight: 600 }}>
              © 2024 Habit Forge - Your Personal Habit Building Journey
            </Text>
          </Center>
        </AppShellSection>
      </AppShell.Footer>
    </AppShell>
  );
};

export default UserDashBoard;
