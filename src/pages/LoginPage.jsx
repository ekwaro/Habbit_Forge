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
  Loader,
} from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { IconBrandGoogle, IconLogin } from "@tabler/icons-react";
import { motion } from "framer-motion";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

const STRAPI_URL = "http://localhost:1337/api";

export default function LoginPage() {
  const navigate = useNavigate();
  const { loginWithRedirect, isLoading: auth0Loading } = useAuth0();
  const [loading, setLoading] = useState(false);
  const [authMethod, setAuthMethod] = useState("strapi");
  const [adminRoles, setAdminRoles] = useState([]);

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
main

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
    <div className="auth-page-container">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Paper radius="md" p="xl" shadow="lg" className="auth-paper">
          <Title order={2} ta="center" mb="md">
            Welcome Back
          </Title>
          <Text ta="center" mb="xl" c="dimmed">
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
          />

          {authMethod === "strapi" ? (
            <form onSubmit={form.onSubmit(handleSubmit)}>
              <TextInput
                label="Email"
                placeholder="your@email.com"
                {...form.getInputProps("email")}
                mb="md"
              />

              <PasswordInput
                label="Password"
                placeholder="Your password"
                {...form.getInputProps("password")}
                mb="xl"
              />

              <Button
                fullWidth

                type="submit"
                leftIcon={<IconLogin size={18} />}
                loading={loading}

                size="md"
                color="teal"
                 leftSection ={<IconLogin size={18} />}
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
            </form>

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
                Continue Journey
              </Button>
            </form>
          ) : (
            <Button
              fullWidth
              leftIcon={<IconBrandGoogle size={18} />}
              onClick={() => loginWithRedirect()}
            >
              Continue with Google
            </Button>
          )}

          <Divider label="OR" labelPosition="center" my="lg" />

          <Text ta="center" mt="md">
            Don't have an account?{" "}
            <Text component={Link} to="/signup" fw={500} td="underline">
              Sign up
            </Text>

          </Text>

        

        </Paper>
      </motion.div>
    </div>
  );
}
