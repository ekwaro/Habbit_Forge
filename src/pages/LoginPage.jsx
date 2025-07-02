import { useForm } from "@mantine/form";
import {
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  Paper,
  Overlay,
  Divider,
  Group,
} from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { useState, useEffect } from "react"; // 👈 IMPORTANT: Added useEffect
import { IconBrandGoogle, IconLogin } from "@tabler/icons-react";
import { motion } from "framer-motion";
import { keyframes } from "@emotion/react";
import { useAuth0 } from "@auth0/auth0-react";

const animatedBackground = keyframes`
  0% { background-position: 0% 0%; }
  100% { background-position: 100% 100%; }
`;

const ADMIN_CONFIG = {
  email: "admin@gmail.com",
  password: "admin123",
  name: "System Admin"
};

function LoginForm() {
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false); // 👈 IMPORTANT: Added separate loading state
  const { loginWithRedirect, user, isAuthenticated, isLoading } = useAuth0(); // 👈 IMPORTANT: Added isLoading

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (value) =>
        /^\S+@\S+$/.test(value) ? null : "Invalid email",
      password: (value) =>
        value.length > 0 ? null : "Password is required",
    },
  });

  // 👈 IMPORTANT: Moved Auth0 user handling to useEffect
  useEffect(() => {
    if (isAuthenticated && user && !isRedirecting && !isLoading) {
      handleAuth0User(user);
    }
  }, [isAuthenticated, user, isLoading]);

  const handleAuth0User = (user) => {
    setIsRedirecting(true);
    const loggedInUser = {
      name: user.name || user.nickname || user.email,
      email: user.email,
      picture: user.picture,
      authMethod: "auth0",
      admin: false
    };

    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("currentUser", JSON.stringify(loggedInUser));

    notifications.show({
      title: "Success",
      message: `Welcome ${loggedInUser.name}!`,
      color: "green",
    });

    navigate("/user-dashboard", { replace: true });
  };

  const handleSubmit = (values) => {
    try {
      const isAdminLogin =
        values.email === ADMIN_CONFIG.email && 
        values.password === ADMIN_CONFIG.password;

      if (isAdminLogin) {
        setIsRedirecting(true);
        const adminUser = {
          name: ADMIN_CONFIG.name,
          email: ADMIN_CONFIG.email,
          admin: true
        };
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("currentUser", JSON.stringify(adminUser));

        notifications.show({
          title: "Success",
          message: `Welcome back ${adminUser.name}!`,
          color: "green",
        });

        setTimeout(() => {
          navigate("/admin", { replace: true });
        }, 1000);
        return;
      }

      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const user = users.find(
        (u) => u.email === values.email && 
               u.password === values.password && 
               !u.admin
      );

      if (user) {
        setIsRedirecting(true);
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("currentUser", JSON.stringify(user));

        notifications.show({
          title: "Success",
          message: `Welcome back ${user.name}!`,
          color: "green",
        });

        setTimeout(() => {
          navigate("/user-dashboard", { replace: true });
        }, 1000);
      } else {
        notifications.show({
          title: "Error",
          message: "Invalid email or password",
          color: "red",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      notifications.show({
        title: "Error",
        message: "Login failed. Please try again.",
        color: "red",
      });
    }
  };

  // 👈 IMPORTANT: Improved Google login handler
  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      await loginWithRedirect({
        connection: "google-oauth2", // 👈 IMPORTANT: Verify this matches your Auth0 connection name
        authorizationParams: {
          prompt: "login",
          scope: "openid profile email", // 👈 IMPORTANT: Ensure you get profile data
          redirect_uri:"http://localhost:5174" 
        },
        appState: {
          returnTo: "/user-dashboard" // 👈 IMPORTANT: Where to redirect after login
        }
      });
    } catch (error) {
      notifications.show({
        title: "Google Login Error",
        message: error.message || "Failed to login with Google",
        color: "red",
      });
      setIsGoogleLoading(false);
    }
  };

  return (
    <div
      style={{
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          linear-gradient(135deg, #b2f2bb80 0%, #96f2d780 100%),
          url('https://static.vecteezy.com/system/resources/previews/002/995/838/original/old-new-habits-concept-free-photo.jpg')
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundBlendMode: "overlay",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        animation: `${animatedBackground} 20s linear infinite`,
        overflow: "auto",
        padding: 20,
      }}
    >
      <Overlay color="#e6f4ea" opacity={0.8} zIndex={1} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          maxWidth: 450,
        }}
      >
        <Paper
          shadow="lg"
          radius="lg"
          p="xl"
          style={{
            backgroundColor: "rgba(230, 240, 230, 0.15)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            border: "none",
          }}
        >
          <Title order={2} align="center" mb="md" style={{ color: "black", fontWeight: 700 }}>
            WELCOME BACK
          </Title>

          <Text align="center" mb="xl" style={{ color: "black" }}>
            <strong>Master your habits. Master your life</strong>
          </Text>

          <Divider mb="xl" style={{ borderTopColor: "rgba(255,255,255,0.3)" }} />

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <TextInput
              label="Email"
              placeholder="your@email.com"
              withAsterisk
              {...form.getInputProps("email")}
              mb="md"
              styles={{
                input: { backgroundColor: "rgba(255,255,255,0.9)" },
                label: { color: "black" },
              }}
            />

            <PasswordInput
              label="Password"
              placeholder="Your password"
              withAsterisk
              {...form.getInputProps("password")}
              mb="xl"
              styles={{
                input: { backgroundColor: "rgba(255,255,255,0.9)" },
                innerInput: { backgroundColor: "transparent" },
                label: { color: "black" },
              }}
            />

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                fullWidth
                size="md"
                color="teal"
                leftIcon={<IconLogin size={18} />}
                loading={isRedirecting}
                disabled={isGoogleLoading} // 👈 IMPORTANT: Disable during Google login
                style={{
                  fontWeight: 600,
                  letterSpacing: 0.5,
                  marginBottom: "1rem",
                }}
              >
                CONTINUE JOURNEY
              </Button>
            </motion.div>

            <Divider
              label="OR"
              labelPosition="center"
              my="lg"
              style={{ borderTopColor: "rgba(255,255,255,0.3)" }}
            />

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={handleGoogleLogin}
                fullWidth
                size="md"
                variant="outline"
                color="black"
                leftIcon={<IconBrandGoogle size={18} />}
                loading={isGoogleLoading}
                disabled={isRedirecting} // 👈 IMPORTANT: Disable during redirect
                style={{
                  fontWeight: 600,
                  letterSpacing: 0.5,
                  borderColor: "rgba(20, 19, 19, 0.5)",
                }}
              >
                CONTINUE WITH GOOGLE
              </Button>
            </motion.div>

            <Text align="center" mt="xl" style={{ color: "black" }}>
              New to HabitTracker?{" "}
              <Text
                component={Link}
                to="/signup"
                color="white"
                td="underline"
                fw={600}
                style={{ display: "inline" }}
              >
                Sign up to Start your journey
              </Text>
            </Text>
          </form>
        </Paper>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return <LoginForm />;
}