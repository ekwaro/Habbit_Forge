import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import {
  Container,
  Title,
  Text,
  Paper,
  Image,
  Button,
  Group,
  Divider,
  Stack,
  Avatar,
  Box,
  Card,
  Badge,
  Grid,
  ActionIcon,
} from '@mantine/core';
import {
  IconUser,
  IconMail,
  IconCheck,
  IconX,
  IconSettings,
  IconTrash,
  IconEdit,
} from '@tabler/icons-react';
import {
  getUserFromStorage,
  saveToStorage,
  getFromStorage,
  clearStorage,
} from '../../utils/localStorage';

const Profiles = () => {
  const { user, isAuthenticated } = useAuth0();
  const [storedUser, setStoredUser] = useState(null);
  const [userPreferences, setUserPreferences] = useState({});

  useEffect(() => {
    setStoredUser(JSON.parse(localStorage.getItem('currentUser')));
    const preferences = getFromStorage('userPreferences');
    setUserPreferences(preferences || {});
  }, []);

  const savePreferences = () => {
    const preferences = {
      theme: 'light',
      notifications: true,
      language: 'en',
      savedAt: new Date().toISOString(),
    };
    saveToStorage('userPreferences', preferences);
    setUserPreferences(preferences);
  };

  const clearAllData = () => {
    clearStorage();
    setStoredUser(null);
    setUserPreferences({});
  };

  return (
    <Container size="lg">
      <Paper
        shadow="xl"
        radius="lg"
        p="xl"
        style={{
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(8px)',
          border: '1.5px solid #ffe0b2',
          boxShadow: '0 4px 32px 0 rgba(255,146,43,0.10)',
        }}
      >
        <Group justify="space-between" mb="xl">
          <div>
            <Title
              order={1}
              style={{
                color: '#ff922b',
                fontWeight: 900,
                letterSpacing: '-0.02em',
                marginBottom: '0.5rem'
              }}
            >
              User Profile
            </Title>
            <Text size="lg" color="#222" style={{ fontWeight: 500 }}>
              Manage your account settings and preferences
            </Text>
          </div>
          <Avatar
            src={storedUser?.picture || 'https://i.pravatar.cc/150?img=13'}
            size="xl"
            radius="xl"
            style={{ border: '3px solid #fff', boxShadow: '0 4px 12px rgba(255,146,43,0.2)' }}
          />
        </Group>

        <Grid gutter="lg">
          {/* User Information Card */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card
              shadow="md"
              padding="lg"
              radius="lg"
              withBorder
              style={{
                background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
                border: '1px solid #ffd180',
                height: '100%'
              }}
            >
              <Group mb="md">
                <IconUser size={24} color="#ff922b" />
                <Title order={3} style={{ color: '#ff922b', fontWeight: 700 }}>
                  Personal Information
                </Title>
              </Group>
              
              {storedUser ? (
                <Stack spacing="md">
                  <Group>
                    <IconUser size={16} color="#666" />
                    <div>
                      <Text size="sm" color="#666" fw={500}>Name</Text>
                      <Text size="md" fw={600} style={{ color: '#222' }}>
                        {storedUser.name || 'Not provided'}
                      </Text>
                    </div>
                  </Group>
                  
                  <Group>
                    <IconMail size={16} color="#666" />
                    <div>
                      <Text size="sm" color="#666" fw={500}>Email</Text>
                      <Text size="md" fw={600} style={{ color: '#222' }}>
                        {storedUser.email || 'Not provided'}
                      </Text>
                    </div>
                  </Group>
                  
                  <Group>
                    {storedUser.email_verified ? (
                      <IconCheck size={16} color="#4caf50" />
                    ) : (
                      <IconX size={16} color="#f44336" />
                    )}
                    <div>
                      <Text size="sm" color="#666" fw={500}>Email Verification</Text>
                      <Badge
                        color={storedUser.email_verified ? 'green' : 'red'}
                        variant="light"
                        size="sm"
                      >
                        {storedUser.email_verified ? 'Verified' : 'Not Verified'}
                      </Badge>
                    </div>
                  </Group>
                </Stack>
              ) : (
                <Box
                  style={{
                    textAlign: 'center',
                    padding: '2rem',
                    background: 'rgba(255,255,255,0.5)',
                    borderRadius: 12,
                    border: '2px dashed #ffd180'
                  }}
                >
                  <Text size="lg" style={{ color: '#ff922b', fontWeight: 600, marginBottom: '0.5rem' }}>
                    No User Data
                  </Text>
                  <Text size="sm" color="#666">
                    User information not found in storage
                  </Text>
                </Box>
              )}
            </Card>
          </Grid.Col>

          {/* Preferences Card */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card
              shadow="md"
              padding="lg"
              radius="lg"
              withBorder
              style={{
                background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
                border: '1px solid #ffd180',
                height: '100%'
              }}
            >
              <Group mb="md">
                <IconSettings size={24} color="#ff922b" />
                <Title order={3} style={{ color: '#ff922b', fontWeight: 700 }}>
                  Preferences
                </Title>
              </Group>
              
              {Object.keys(userPreferences).length > 0 ? (
                <Stack spacing="md">
                  <Group>
                    <IconSettings size={16} color="#666" />
                    <div>
                      <Text size="sm" color="#666" fw={500}>Theme</Text>
                      <Badge color="orange" variant="light" size="sm">
                        {userPreferences.theme}
                      </Badge>
                    </div>
                  </Group>
                  
                  <Group>
                    <IconSettings size={16} color="#666" />
                    <div>
                      <Text size="sm" color="#666" fw={500}>Notifications</Text>
                      <Badge
                        color={userPreferences.notifications ? 'green' : 'red'}
                        variant="light"
                        size="sm"
                      >
                        {userPreferences.notifications ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </div>
                  </Group>
                  
                  <Group>
                    <IconSettings size={16} color="#666" />
                    <div>
                      <Text size="sm" color="#666" fw={500}>Language</Text>
                      <Badge color="blue" variant="light" size="sm">
                        {userPreferences.language}
                      </Badge>
                    </div>
                  </Group>
                  
                  <Group>
                    <IconSettings size={16} color="#666" />
                    <div>
                      <Text size="sm" color="#666" fw={500}>Last Updated</Text>
                      <Text size="sm" style={{ color: '#222' }}>
                        {new Date(userPreferences.savedAt).toLocaleDateString()}
                      </Text>
                    </div>
                  </Group>
                </Stack>
              ) : (
                <Box
                  style={{
                    textAlign: 'center',
                    padding: '2rem',
                    background: 'rgba(255,255,255,0.5)',
                    borderRadius: 12,
                    border: '2px dashed #ffd180'
                  }}
                >
                  <Text size="lg" style={{ color: '#ff922b', fontWeight: 600, marginBottom: '0.5rem' }}>
                    No Preferences
                  </Text>
                  <Text size="sm" color="#666">
                    No preferences saved yet
                  </Text>
                </Box>
              )}
            </Card>
          </Grid.Col>
        </Grid>

        <Divider my="xl" color="#ffd180" />

        {/* Action Buttons */}
        <Group justify="center" mt="xl">
          <Button
            variant="gradient"
            gradient={{ from: '#ff922b', to: '#ffa726', deg: 45 }}
            size="md"
            onClick={savePreferences}
            leftSection={<IconSettings size={16} />}
            style={{
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(255,146,43,0.25)'
            }}
          >
            Save Preferences
          </Button>
          
          <Button
            variant="light"
            color="blue"
            size="md"
            onClick={() => {
              console.log('Stored user:', storedUser);
              alert('Check the console for stored user data.');
            }}
            leftSection={<IconEdit size={16} />}
            style={{
              background: '#e3f2fd',
              color: '#1976d2',
              fontWeight: 600
            }}
          >
            Show Data
          </Button>
          
          <Button
            variant="light"
            color="red"
            size="md"
            onClick={clearAllData}
            leftSection={<IconTrash size={16} />}
            style={{
              background: '#ffebee',
              color: '#d32f2f',
              fontWeight: 600
            }}
          >
            Clear Storage
          </Button>
        </Group>
      </Paper>
    </Container>
  );
};

export default Profiles;