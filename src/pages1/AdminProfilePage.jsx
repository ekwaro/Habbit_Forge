import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Title, Text, Avatar, Button, Group, TextInput, Stack, Paper, Box } from '@mantine/core';
import { IconEdit, IconCheck, IconX } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

function AdminProfilePage() {
  const navigate = useNavigate();
  const initialAdminInfo = JSON.parse(localStorage.getItem('currentUser')) || {
    name: 'Admin',
    email: 'admin@gmail.com',
    profilePicture: '',
    admin: true
  };

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: initialAdminInfo.name,
    email: initialAdminInfo.email,
    profilePicture: initialAdminInfo.profilePicture || '',
  });

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser?.admin) {
      navigate('/user-dashboard');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdate = () => {
    const updatedUser = {
      ...JSON.parse(localStorage.getItem('currentUser')),
      ...formData
    };
    
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    const users = JSON.parse(localStorage.getItem('users') || []);
    const updatedUsers = users.map(user => 
      user.email === updatedUser.email ? updatedUser : user
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    setIsEditing(false);
    notifications.show({
      title: 'Success',
      message: 'Profile updated successfully',
      color: 'green',
    });
  };

  const handleCancel = () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || initialAdminInfo;
    setFormData({
      name: currentUser.name,
      email: currentUser.email,
      profilePicture: currentUser.profilePicture || '',
    });
    setIsEditing(false);
  };

  return (
    <Box maw="95vw" mx="auto" my="lg"> 
      <Paper p="xl" shadow="xs" radius="md">
        <Title order={2} mb="lg" fw={700}>Admin Profile</Title>
        <Text c="dimmed" mb="xl">Edit, Update or Cancel Changes</Text>

        <Stack gap="lg">
          <Group justify="center">
            <Avatar 
              src={formData.profilePicture} 
              alt={formData.name} 
              size={120} 
              radius="100%"
            />
          </Group>

          <TextInput
            label="Admin Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            readOnly={!isEditing}
            variant={isEditing ? 'filled' : 'unstyled'}
            styles={{ input: { fontWeight: 500 } }}
            size="md" 
          />

          <TextInput
            label="Admin Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            readOnly={!isEditing}
            variant={isEditing ? 'filled' : 'unstyled'}
            styles={{ input: { fontWeight: 500 } }}
            size="md" 
          />

          {isEditing && (
            <TextInput
              label="Profile Picture URL"
              name="profilePicture"
              value={formData.profilePicture}
              onChange={handleChange}
              placeholder="Enter direct image URL"
              variant="filled"
              size="md" 
            />
          )}

          <Group justify="flex-end" mt="md">
            {!isEditing ? (
              <Button leftSection={<IconEdit size={16} />} onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            ) : (
              <>
                <Button variant="outline" color="red" leftSection={<IconX size={16} />} onClick={handleCancel}>
                  Cancel
                </Button>
                <Button leftSection={<IconCheck size={16} />} onClick={handleUpdate}>
                  Update Profile
                </Button>
              </>
            )}
          </Group>
        </Stack>
      </Paper>
    </Box>
  );
}

export default AdminProfilePage;