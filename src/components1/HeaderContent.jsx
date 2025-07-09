import React, { useEffect, useState } from 'react';
import { Group, Text, Avatar, Button, rem, Menu, Badge } from '@mantine/core';
import { IconLogout, IconSettings, IconUser } from '@tabler/icons-react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link from react-router-dom
import { useMediaQuery } from '@mantine/hooks';

function HeaderContent() {
  const [adminInfo, setAdminInfo] = useState(null);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || !currentUser.email) return;
    // Fetch all users and find the one matching the current user's email, with profilePicture populated
    fetch('http://localhost:1337/api/users?populate=profilePicture')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const matched = data.find(user => user.email === currentUser.email);
          if (matched) setAdminInfo(matched);
        }
      });
  }, []);

  if (!adminInfo) return null; // or a loading spinner

  // Get the profile image URL from the media object if available
  let profileImageUrl = undefined;
  if (adminInfo.profilePicture) {
    if (Array.isArray(adminInfo.profilePicture) && adminInfo.profilePicture[0]?.url) {
      profileImageUrl = adminInfo.profilePicture[0].url.startsWith('http')
        ? adminInfo.profilePicture[0].url
        : `http://localhost:1337${adminInfo.profilePicture[0].url}`;
    } else if (adminInfo.profilePicture.url) {
      profileImageUrl = adminInfo.profilePicture.url.startsWith('http')
        ? adminInfo.profilePicture.url
        : `http://localhost:1337${adminInfo.profilePicture.url}`;
    }
  }

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <Group h="100%" px="md" justify="space-between" style={{ flexGrow: 1, background: 'linear-gradient(90deg, #fff3e0 0%, #ffe0b2 100%)', color: '#222', borderRadius: 12, boxShadow: '0 2px 8px rgba(255,146,43,0.08)', padding: '0.5rem 1rem', margin: '0.5rem 0' }}>
      <Text fw={900} size="xl" style={{ color: '#ff922b', letterSpacing: 1.5, textTransform: 'uppercase' }}>Admin Dashboard</Text>
      <Group>
        <Group gap={6} align="center">
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <Avatar src={profileImageUrl || undefined} alt={adminInfo.username} radius="xl" size={40} style={{ border: '2px solid #fff' }} />
          </div>
          {/* Show admin name and email */}
          {!isMobile && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Text size="sm" fw={700} visibleFrom="sm" style={{ color: '#222' }}>Admin Name: {adminInfo.username}</Text>
              <Text size="xs" c="#888">{adminInfo.email}</Text>
            </div>
          )}
        </Group>
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <Button variant="light" size="sm" compact color="orange" style={{ background: '#fff3e0', color: '#ff922b', fontWeight: 700 }}>
              <Text size="sm" fw={500}>Options</Text> 
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>Profile & Logout</Menu.Label>
            <Menu.Item component={Link} to="/admin/profile" leftSection={<IconUser style={{ width: rem(14), height: rem(14) }} />}>
              Profile
            </Menu.Item>
            <Menu.Item leftSection={<IconSettings style={{ width: rem(14), height: rem(14) }} />}>
              Settings
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item color="red" leftSection={<IconLogout style={{ width: rem(14), height: rem(14) }} />} onClick={handleLogout}>
              Logout
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
        {!isMobile && (
          <Button variant="default" onClick={handleLogout} hiddenFrom="xs" color="orange" style={{ background: '#fff3e0', color: '#ff922b', fontWeight: 700 }}>
            Logout
          </Button>
        )}
      </Group>
    </Group>
  );
}

export default HeaderContent;