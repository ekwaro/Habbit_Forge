import { useForm } from "@mantine/form";
import {
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  Paper,
  Container,
  Group,
} from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { useState, useEffect } from "react";

function LoginForm() {
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Initialize Google Sign-In
  useEffect(() => {
    // Load Google Identity Services script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: 'YOUR_GOOGLE_CLIENT_ID', // Replace with your Google Client ID
          callback: handleGoogleCallback,
        });
      }
    };

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  // Handle Google Sign-In callback
  const handleGoogleCallback = (response) => {
    try {
      // Decode the JWT token to get user info
      const userInfo = JSON.parse(atob(response.credential.split('.')[1]));
      
      setIsRedirecting(true);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          name: userInfo.name,
          email: userInfo.email,
          picture: userInfo.picture,
          authMethod: "google",
        })
      );

      notifications.show({
        title: "Success",
        message: `Welcome ${userInfo.name}!`,
        color: "green",
      });

      setTimeout(() => {
        navigate("/user-dashboard", { replace: true });
      }, 1000);
    } catch (error) {
      console.error("Google login error:", error);
      notifications.show({
        title: "Error",
        message: "Google sign-in failed. Please try again.",
        color: "red",
      });
    }
  };

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) => (value.length > 0 ? null : "Password is required"),
    },
  });

  // Keep your existing local login logic
  const handleSubmit = (values) => {
    try {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const user = users.find(
        (u) => u.email === values.email && u.password === values.password
      );

      if (user) {
        setIsRedirecting(true);
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("currentUser", JSON.stringify(user));

        notifications.show({
          title: "Success",
          message: "Welcome back!",
          color: "green",
        });

        setTimeout(() => {
          navigate("/user-dashboard", { replace: true });
        }, 100);
      } else {
        notifications.show({
          title: "Error",
          message: "Invalid email or password",
          color: "red",
        });
      }
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Login failed. Please try again.",
        color: "red",
      });
      console.error("Login error:", error);
    }
  };

  // Simple Google sign-in trigger
  const handleGoogleLogin = () => {
    if (window.google) {
      window.google.accounts.id.prompt();
    } else {
      notifications.show({
        title: "Error",
        message: "Google Sign-In not loaded. Please refresh and try again.",
        color: "red",
      });
    }
  };

  return (
    <Container
      size="lg"
      style={{
        minHeight: "100vh",
        backgroundColor: "#e6f4ea",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper
        shadow="md"
        radius="md"
        p="xl"
        withBorder
        style={{
          backgroundColor: "#c7eed8",
          width: "100%",
          maxWidth: 450,
        }}
      >
        <Title order={2} align="center" mb="md" color="blue">
          Log In
        </Title>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Email"
            placeholder="your@email.com"
            withAsterisk
            {...form.getInputProps("email")}
            mb="sm"
          />

          <PasswordInput
            label="Password"
            placeholder="Your password"
            withAsterisk
            {...form.getInputProps("password")}
            mb="xl"
          />

          <Button
            type="submit"
            fullWidth
            size="md"
            color="blue"
            mb="md"
            loading={isRedirecting}
          >
            Log In
          </Button>

          <Group position="center" mb="md">
            <Button
              variant="outline"
              onClick={handleGoogleLogin}
              fullWidth
              size="md"
              color="blue"
            >
              Sign in with Google
            </Button>
          </Group>

          <Text align="center" mt="sm">
            Don't have an account?{" "}
            <Text
              component={Link}
              to="/signup"
              color="blue"
              td="underline"
              fw={500}
              inherit
            >
              Sign up
            </Text>
          </Text>
        </form>
      </Paper>
    </Container>
  );
}

function LoginPage() {
  return <LoginForm />;
}

export default LoginPage;