import { Group, Text, Avatar, Button, rem, Menu, Badge } from '@mantine/core';
import { IconLogout, IconSettings, IconUser } from '@tabler/icons-react';
import { getAdminInfo } from '../data/adminData'; // Import simulated data
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { useMediaQuery } from '@mantine/hooks';

function HeaderContent() {
  const adminInfo = getAdminInfo(); // Get admin info
  const isMobile = useMediaQuery('(max-width: 768px)');
   console.log('Admin Info:', adminInfo); 
  console.log('Profile Picture URL:', adminInfo.profilePicture); 
 

  const handleLogout = () => {
    //logout logic
    console.log("Admin logged out!");
    // Redirect to login page 
  };

  return (
    <Group
      h="100%"
      px="md"
      justify="space-between"
      style={{
        flexGrow: 1,
        background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
        color: 'white',
        borderRadius: 12,
        boxShadow: '0 2px 8px rgba(25, 118, 210, 0.08)',
        padding: '0.5rem 1rem',
        margin: '0.5rem 0',
      }}
    >
      {/* Left side: Dashboard Title */}
      <Text fw={700} size="xl" style={{ color: 'white', letterSpacing: 1 }}>Admin Dashboard</Text>

      {/* Right side: Admin Info & Logout */}
      <Group>
        <Group gap={6} align="center">
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <Avatar src={adminInfo.profilePicture} alt={adminInfo.name} radius="xl" size={40} style={{ border: '2px solid #fff' }} />
            {/* Status dot */}
            <span
              style={{
                position: 'absolute',
                bottom: 2,
                right: 2,
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: adminInfo.status === 'online' ? '#43ea7a' : '#ccc',
                border: '2px solid #fff',
                boxSizing: 'border-box',
                zIndex: 1,
                boxShadow: '0 0 4px #43ea7a',
              }}
            />
          </div>
          {/* Hide name/role on mobile */}
          {!isMobile && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Text size="sm" fw={500} visibleFrom="sm" style={{ color: 'white' }}>Admin Name: {adminInfo.name}</Text>
              <Badge color="cyan" size="xs" mt={2} style={{ alignSelf: 'flex-start', background: '#e3f2fd', color: '#1976d2' }}>{adminInfo.role}</Badge>
            </div>
          )}
        </Group>
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <Button variant="light" size="sm" compact color="blue" style={{ background: '#fff', color: '#1976d2' }}>
              <Text size="sm" fw={500}>Options</Text> 
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>Application</Menu.Label>
            <Menu.Item
              component={Link} // Mantine Menu.Item render as a React Router Link
              to="/admin/profile" // The path to navigate to
              leftSection={<IconUser style={{ width: rem(14), height: rem(14) }} />}
            >
              Profile
            </Menu.Item>
            <Menu.Item leftSection={<IconSettings style={{ width: rem(14), height: rem(14) }} />}>
              Settings
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item
              color="red"
              leftSection={<IconLogout style={{ width: rem(14), height: rem(14) }} />}
              onClick={handleLogout}
            >
              Logout
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
        {/* Hide logout button on mobile */}
        {!isMobile && (
          <Button variant="default" onClick={handleLogout} hiddenFrom="xs" color="blue" style={{ background: '#fff', color: '#1976d2' }}>
            Logout
          </Button>
        )}
      </Group>
    </Group>
  );
}

export default HeaderContent;