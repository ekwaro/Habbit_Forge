// Create a new file: CallbackPage.js
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader, Center, Text } from "@mantine/core";

export default function CallbackPage() {
  const { handleRedirectCallback, isLoading, error } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        await handleRedirectCallback();
        navigate("/user-dashboard"); // Redirect back to user dashboard to process the authentication
      } catch (error) {
        console.error("Callback error:", error);
        navigate("/login");
      }
    };

    handleCallback();
  }, [handleRedirectCallback, navigate]);

  if (error) {
    return (
      <Center style={{ height: '100vh' }}>
        <Text color="red">Authentication error: {error.message}</Text>
      </Center>
    );
  }

  return (
    <Center style={{ height: '100vh' }}>
      <div style={{ textAlign: 'center' }}>
        <Loader size="lg" color="teal" />
        <Text mt="md" c="dimmed">Processing authentication...</Text>
      </div>
    </Center>
  );
}