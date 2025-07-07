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
    <Box maw="95vw" mx="auto" my="lg" style={{
      minHeight: 'calc(100vh - var(--mantine-header-height, 0px) - var(--mantine-footer-height, 0px))',
      background: 'linear-gradient(120deg, #fffaf3 0%, #fff3e0 50%, #ffe5c0 100%)', // softened orange gradient
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundBlendMode: 'overlay',
      padding: '48px 0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}> 
      <Paper p="xl" shadow="xl" radius="md" style={{
        background: 'rgba(255,255,255,0.92)',
        border: '1.5px solid #ffe0b2',
        boxShadow: '0 4px 32px 0 rgba(255,146,43,0.10)',
        backdropFilter: 'blur(8px)',
        maxWidth: 480,
        margin: '0 auto',
      }}>
        <Title order={2} mb="lg" fw={700} style={{ color: '#ff922b', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Admin Profile</Title>
        <Text c="#222" mb="xl">Edit, Update or Cancel Changes</Text>

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
              <Button leftSection={<IconEdit size={16} />} onClick={() => setIsEditing(true)} color="#ff922b" style={{ fontWeight: 600 }}>
                Edit Profile
              </Button>
            ) : (
              <>
                <Button variant="outline" color="red" leftSection={<IconX size={16} />} onClick={handleCancel}>
                  Cancel
                </Button>
                <Button leftSection={<IconCheck size={16} />} onClick={handleUpdate} color="#ff922b" style={{ fontWeight: 600 }}>
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