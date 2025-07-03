import { useState, useEffect } from 'react';
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
} from '@mantine/core';
import {
  getUserFromStorage,
  saveToStorage,
  getFromStorage,
  clearStorage,
} from '../utils/localStorage';

function Profile() {
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
      theme: 'dark',
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
    <Container size="sm" py="xl">
      <Title order={2} mb="lg">
        User Profile
      </Title>

      {/* Auth0 user (commented out if not used) */}
      {/* <Paper withBorder p="md" mb="lg">
        <Title order={4} mb="sm">Current User (Auth0)</Title>
        {user ? (
          <Stack>
            <Text><strong>Name:</strong> {user.name}</Text>
            <Text><strong>Email:</strong> {user.email}</Text>
            <Text><strong>Email Verified:</strong> {user.email_verified ? 'Yes' : 'No'}</Text>
            {user.picture && (
              <Image
                src={user.picture}
                alt="Profile"
                width={80}
                height={80}
                radius="xl"
              />
            )}
          </Stack>
        ) : (
          <Text>No Auth0 user data</Text>
        )}
      </Paper> */}

      {/* Stored User */}
      <Paper withBorder p="md" mb="lg" radius="md">
        <Title order={4} mb="sm">Your Profiles</Title>
        {storedUser ? (
          <Stack>
            <Text><strong>Name:</strong> {storedUser.name}</Text>
            <Text><strong>Email:</strong> {storedUser.email}</Text>
            <Text><strong>Email Verified:</strong> {storedUser.email_verified ? 'Yes' : 'No'}</Text>
            {storedUser.picture && (
              <Image
                src={storedUser.picture}
                alt="Stored Profile"
                width={80}
                height={80}
                radius="xl"
              />
            )}
          </Stack>
        ) : (
          <Text c="dimmed">No stored user data found</Text>
        )}
      </Paper>

      {/* Preferences */}
      <Paper withBorder p="md" mb="lg" radius="md">
        <Title order={4} mb="sm">User Preferences</Title>
        {Object.keys(userPreferences).length > 0 ? (
          <Stack>
            <Text><strong>Theme:</strong> {userPreferences.theme}</Text>
            <Text><strong>Notifications:</strong> {userPreferences.notifications ? 'Enabled' : 'Disabled'}</Text>
            <Text><strong>Language:</strong> {userPreferences.language}</Text>
            <Text><strong>Saved At:</strong> {userPreferences.savedAt}</Text>
          </Stack>
        ) : (
          <Text c="dimmed">No preferences saved</Text>
        )}
      </Paper>

      <Divider my="md" />

      {/* Action buttons */}
      <Group position="apart" mt="md" grow>
        <Button color="teal" onClick={savePreferences}>
          Save Preferences
        </Button>
        <Button
          color="blue"
          onClick={() => {
            console.log('Stored user:', storedUser);
            alert('Check the console for stored user data.');
          }}
        >
          Show Stored Data
        </Button>
        <Button color="red" onClick={clearAllData}>
          Clear All Storage
        </Button>
      </Group>
    </Container>
  );
}

export default Profile;
