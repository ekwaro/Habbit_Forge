import React, { useEffect, useState } from 'react';
import { Group, Text, Avatar, Button, rem, Menu, Loader } from '@mantine/core';
import { IconLogout, IconSettings, IconUser } from '@tabler/icons-react';
import { Link, useNavigate } from 'react-router-dom';
import { useMediaQuery } from '@mantine/hooks';
import { useAuth0 } from '@auth0/auth0-react';

function HeaderContent() {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [adminInfo, setAdminInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading || !isAuthenticated || !user) {
      setLoading(true);
      return;
    }
    // If Auth0 user has all info, use it directly
    if (user.email && user.name && user.picture) {
      setAdminInfo({
        email: user.email,
        username: user.name,
        profilePicture: user.picture,
      });
      setLoading(false);
    } else {
      // Optionally, fetch more details from backend using user.email
      fetch(`http://localhost:1337/api/users?filters[email][$eq]=${encodeURIComponent(user.email)}&populate=profilePicture`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            const matched = data[0];
            let profileImageUrl = undefined;
            if (matched.profilePicture) {
              if (Array.isArray(matched.profilePicture) && matched.profilePicture[0]?.url) {
                profileImageUrl = matched.profilePicture[0].url.startsWith('http')
                  ? matched.profilePicture[0].url
                  : `http://localhost:1337${matched.profilePicture[0].url}`;
              } else if (matched.profilePicture.url) {
                profileImageUrl = matched.profilePicture.url.startsWith('http')
                  ? matched.profilePicture.url
                  : `http://localhost:1337${matched.profilePicture.url}`;
              }
            }
            setAdminInfo({
              email: matched.email,
              username: matched.username,
              profilePicture: profileImageUrl,
            });
          } else {
            setAdminInfo({
              email: user.email,
              username: user.name,
              profilePicture: user.picture,
            });
          }
          setLoading(false);
        })
        .catch(() => {
          setAdminInfo({
            email: user.email,
            username: user.name,
            profilePicture: user.picture,
          });
          setLoading(false);
        });
    }
  }, [user, isAuthenticated, isLoading]);

  const handleLogout = () => {
    navigate('/');
  };

  if (isLoading || loading || !adminInfo) {
    return <Group h="100%" px="md" justify="center" style={{ flexGrow: 1 }}><Loader size="md" color="orange" /></Group>;
  }

  return (
    <Group h="100%" px="md" justify="space-between" style={{ flexGrow: 1, background: 'linear-gradient(90deg, #fff3e0 0%, #ffe0b2 100%)', color: '#222', borderRadius: 12, boxShadow: '0 2px 8px rgba(255,146,43,0.08)', padding: '0.5rem 1rem', margin: '0.5rem 0' }}>
      <Text fw={900} size="xl" style={{ color: '#ff922b', letterSpacing: 1.5, textTransform: 'uppercase' }}>Admin Dashboard</Text>
      <Group>
        <Group gap={6} align="center">
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <Avatar src={adminInfo.profilePicture || undefined} alt={adminInfo.username} radius="xl" size={40} style={{ border: '2px solid #fff' }} />
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