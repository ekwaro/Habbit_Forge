import { AppShell, Burger, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Outlet } from 'react-router-dom'; // Import Outlet for nested routes
import HeaderContent from './HeaderContent';
import SidebarNav from './SidebarNav';

function AdminLayout() {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true); // Sidebar open by default on desktop

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 250, // sidebar width 
        breakpoint: 'sm',
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          {/* Burger icon for mobile */}
          <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="sm" />
          {/* Burger icon for desktop (to collapse sidebar) */}
          <Burger opened={desktopOpened} onClick={toggleDesktop} visibleFrom="sm" size="sm" />
          <HeaderContent />
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        {/*Sidebar Navigation */}
        <SidebarNav />
      </AppShell.Navbar>

      <AppShell.Main>
        {/* nested routes will render */}
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}

export default AdminLayout;