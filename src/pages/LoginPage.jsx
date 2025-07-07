import { useForm } from "@mantine/form";
import React, { useState, useEffect } from "react";
import {
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  Paper,
  Divider,
  SegmentedControl,
} from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { IconBrandGoogle, IconLogin } from "@tabler/icons-react";
import { motion } from "framer-motion";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import "./LoginPage.css";

const STRAPI_URL = "http://localhost:1337/api";

// Add image for left side
const loginImageUrl = 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80'; // Person using laptop (sign up/login theme)

export default function LoginPage() {
  const navigate = useNavigate();
  const { loginWithRedirect, isLoading: auth0Loading } = useAuth0();
  const [loading, setLoading] = useState(false);
  const [authMethod, setAuthMethod] = useState("strapi");
  const [adminRoles, setAdminRoles] = useState([]);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  useEffect(() => {
    const fetchAdminRoles = async () => {
      try {
        const response = await axios.get(
          `${STRAPI_URL}/users-permissions/roles`
        );
        const adminRoles = response.data.roles.filter(
          (role) => role.type === "admin" || role.name === "Administrator"
        );
        setAdminRoles(adminRoles);
      } catch (error) {
        console.error("Failed to fetch admin roles:", error);
        notifications.show({
          title: "Error",
          message: "Failed to load role information",
          color: "red",
        });
      }
    };
    fetchAdminRoles();
  }, []);

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

  const isUserAdmin = (user) => {
    if (!user.role) return false;
    return adminRoles.some(
      (adminRole) => adminRole.id === user.role.id || adminRole.id === user.role
    );
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      await loginWithRedirect();
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Google login failed",
        color: "red",
      });
      setIsGoogleLoading(false);
    }
  };

  const handleStrapiLogin = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post(`${STRAPI_URL}/auth/local`, {
        identifier: values.email,
        password: values.password,
      });

      const { jwt, user } = response.data;

      // Fetch complete user data with role
      const userWithRole = await axios.get(
        `${STRAPI_URL}/users/${user.id}?populate=role`,
        {
          headers: { Authorization: `Bearer ${jwt}` },
        }
      );

      localStorage.setItem("authToken", jwt);
      localStorage.setItem("user", JSON.stringify(userWithRole.data));

      if (user) {
        setIsRedirecting(true);
        const currentUser = { ...user, authMethod: "local" };
        
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("currentUser", JSON.stringify(user));

        notifications.show({
          title: "Success",
          message: `Welcome back, ${user.username}!`,
          color: "green",
        });

        if (isUserAdmin(userWithRole.data)) {
          navigate("/admin");
        } else {
          navigate("/user-dashboard");
        }
      }
    } catch (error) {
      notifications.show({
        title: "Error",
        message: error.response?.data?.error?.message || "Login failed",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (values) => {
    if (authMethod === "auth0") {
      loginWithRedirect();
    } else {
      handleStrapiLogin(values);
    }
  };

  return (
    <div className="auth-page-container login-page-bg">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="login-motion-wrapper"
      >
        <Paper radius="md" p="xl" shadow="lg" className="auth-paper login-paper">
          <Title order={2} ta="center" mb="md" className="login-title">
            Welcome Back
          </Title>
          <Text ta="center" mb="xl" c="dimmed" className="login-subtitle">
            Master your habits. Master your life.
          </Text>
          <SegmentedControl
            fullWidth
            value={authMethod}
            onChange={setAuthMethod}
            data={[
              { label: "Email Login", value: "strapi" },
              { label: "Social Login", value: "auth0" },
            ]}
            mb="xl"
            className="login-segmented"
          />
          {authMethod === "strapi" ? (
            <form onSubmit={form.onSubmit(handleSubmit)} className="login-form">
              <TextInput
                label="Email"
                placeholder="your@email.com"
                {...form.getInputProps("email")}
                mb="md"
                className="login-input"
              />
              <PasswordInput
                label="Password"
                placeholder="Your password"
                {...form.getInputProps("password")}
                mb="md"
                className="login-input"
              />
              <Text ta="right" size="sm" mt="xs" className="login-forgot-text">
                <Text
                  component={Link}
                  to="/forgot-password"
                  fw={500}
                  td="underline"
                  color="blue"
                  className="login-forgot-link"
                >
                  Forgot Password?
                </Text>
              </Text>
              <Button
                fullWidth
                type="submit"
                leftSection={<IconLogin size={18} />}
                loading={loading}
                size="md"
                color="teal"
                disabled={isGoogleLoading}
                className="login-btn"
                style={{
                  fontWeight: 600,
                  letterSpacing: 0.5,
                  marginBottom: "1rem",
                }}
              >
                CONTINUE JOURNEY
              </Button>
              <Divider
                label="OR"
                labelPosition="center"
                my="lg"
                style={{ borderTopColor: "rgba(255,255,255,0.3)" }}
                className="login-divider"
              />
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="login-google-motion">
                <Button
                  onClick={handleGoogleLogin}
                  fullWidth
                  size="md"
                  variant="outline"
                  color="black"
                  leftSection={<IconBrandGoogle size={18} />}
                  loading={isGoogleLoading}
                  disabled={isRedirecting}
                  className="login-google-btn"
                  style={{
                    fontWeight: 600,
                    letterSpacing: 0.5,
                    borderColor: "rgba(20, 19, 19, 0.5)",
                  }}
                >
                  Continue with Google
                </Button>
              </motion.div>
            </form>
          ) : (
            <Button
              fullWidth
              leftSection={<IconBrandGoogle size={18} />}
              onClick={() => loginWithRedirect()}
              loading={auth0Loading}
              className="login-google-btn"
            >
              Continue with Google
            </Button>
          )}
          <Divider label="OR" labelPosition="center" my="lg" className="login-divider" />
          <Text ta="center" mt="md" className="login-signup-text">
            Don't have an account?{" "}
            <Text component={Link} to="/signup" fw={500} td="underline" className="login-signup-link">
              Sign up
            </Text>
          </Text>
        </Paper>
      </motion.div>
    </div>
  );
}