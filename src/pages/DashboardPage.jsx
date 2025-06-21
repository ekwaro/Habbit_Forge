import { Title, Text, Button } from '@mantine/core';
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function DashboardPage() {
  const { isAuthenticated, user, logout } = useAuth0();
  const navigate = useNavigate();
  const localUser = JSON.parse(localStorage.getItem('currentUser'));

  useEffect(() => {
    if (!isAuthenticated && !localUser) {
      navigate('/login');
    }
  }, [isAuthenticated, localUser, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    logout({ returnTo: window.location.origin });
  };

  return (
    <div style={{ maxWidth: 500, margin: 'auto', paddingTop: 100 }}>
      <Title order={1} mb="xl">Dashboard</Title>
      
      {isAuthenticated ? (
        <>
          <Text mb="md">Welcome, {user.name} (via Google)</Text>
          <Button onClick={handleLogout}>Logout</Button>
        </>
      ) : localUser ? (
        <>
          <Text mb="md">Welcome back, {localUser.name}</Text>
          <Button onClick={handleLogout}>Logout</Button>
        </>
      ) : null}
    </div>
  );
}

export default DashboardPage;