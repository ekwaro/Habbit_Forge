import React from "react";
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
} from "@mantine/core";
import { Outlet, useNavigate } from "react-router-dom";
const UserDashBoard = () => {
  let user = JSON.parse(localStorage.getItem('currentUser'))


  const handleLogout=()=>{
    localStorage.removeItem('currentUser')
    navigate('/login')
  }
  const navigate = useNavigate();
  const [opened, { toggle }] = useDisclosure(false);

  const handleNavigate = (path) => {
    navigate(path);
    toggle();
  };
  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header withBorder style={{backgroundColor:'#f8f9fa',
        paddingLeft:20,
        paddingRight:20
      }}>
        <Group h="100%" px="md" justify='space-between' align='center'>

          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Text fw={700} size='xl' c='teal'>User Dashboard</Text>
          <Group spaciing='sm'>
            <Avatar src='https://i.pravatar.cc/150?img=13'
            
            radius='xl'
            size='md'
            alt={user?.name}
            />
            <Text size='sm' fw={500}>{user?.name}</Text>
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
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main>
        <AppShell.Section grow>
          
          <Outlet />
        </AppShell.Section>
      </AppShell.Main>
      <AppShell.Footer>
        <AppShellSection mx='xl'>
          <Center><Text>Footer content goes here.</Text></Center>
          
        </AppShellSection>
      </AppShell.Footer>
    </AppShell>
  );
};

export default UserDashBoard;
