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
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";

function LoginForm() {
  const { loginWithRedirect, isAuthenticated, isLoading, user } = useAuth0();
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    if (isAuthenticated && user) {
      setIsRedirecting(true);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          name: user.name,
          email: user.email,
        })
      );

      notifications.show({
        title: "Success",
        message: "Welcome back!",
        color: "green",
      });

      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 100);
    }
  }, [isAuthenticated, isLoading, user, navigate]);

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
          navigate("/dashboard", { replace: true });
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

  const handleGoogleLogin = () => {
    try {
      loginWithRedirect({
        authorizationParams: {
          prompt: "login",
        },
      });
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Google sign-in failed. Please try again.",
        color: "red",
      });
      console.error("Google login error:", error);
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

          <Button type="submit" fullWidth size="md" color="blue" mb="md">
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
