import { Group, Text, Avatar, Button, rem, Menu } from '@mantine/core';
import { IconLogout, IconSettings, IconUser } from '@tabler/icons-react';
import { getAdminInfo } from '../data/adminData'; // Import simulated data
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

function HeaderContent() {
  const adminInfo = getAdminInfo(); // Get admin info
   console.log('Admin Info:', adminInfo); 
  console.log('Profile Picture URL:', adminInfo.profilePicture); 
 

  const handleLogout = () => {
    //logout logic
    console.log("Admin logged out!");
    // Redirect to login page 
  };

  return (
    
    <Group h="100%" px="md" justify="space-between" style={{ flexGrow: 1 }}>
      {/* Left side: Dashboard Title */}
      <Text fw={700} size="xl">Admin Dashboard</Text>

      {/* Right side: Admin Info & Logout */}
      
      <Group>
        <Avatar src={adminInfo.profilePicture} alt={adminInfo.name} radius="xl" />
        
        <Text size="sm" fw={500} visibleFrom="sm">Admin Name: {adminInfo.name}</Text>
        
        <Menu shadow="md" width={200}>
          <Menu.Target>
            
            <Button variant="light" size="sm" compact>
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
        
     
        <Button variant="default" onClick={handleLogout} hiddenFrom="xs">
          Logout
        </Button>
      </Group>
    </Group>
  );
}

export default HeaderContent;