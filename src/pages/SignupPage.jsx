import { useForm } from "@mantine/form";
import {
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  Paper,
  Container,
  Overlay,
  Divider,
} from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { IconFlame, IconUserPlus } from "@tabler/icons-react";
import { motion } from "framer-motion";
import { keyframes } from "@emotion/react";

// Define keyframes for animated background
const animatedBackground = keyframes`
  0% { background-position: 0% 0%; }
  100% { background-position: 100% 100%; }
`;

function SignupPage() {
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: 'user'
    },
    validate: {
      name: (value) => (value.trim().length > 0 ? null : "Name is required"),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length >= 6 ? null : "Password must be at least 6 characters",
      confirmPassword: (value, values) =>
        value === values.password ? null : "Passwords do not match",
    },
  });

  const handleSubmit = (values) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    if (users.some((user) => user.email === values.email)) {
      notifications.show({
        title: "Error",
        message: "User with this email already exists",
        color: "red",
      });
      return;
    }

    const { confirmPassword, ...userData } = values;
    users.push(userData);
    localStorage.setItem("users", JSON.stringify(users));

    notifications.show({
      title: "Success",
      message: "Account created successfully! Redirecting to login...",
      color: "green",
    });

    setTimeout(() => {
      navigate("/login", { replace: true });
    }, 1500);
  };

  return (
    <div
      style={{
        position: "fixed",
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
          maxWidth: 500,
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
          <Title
            order={2}
            align="center"
            mb="md"
            style={{ color: "black", fontWeight: 700 }}
          >
            CREATE YOUR ACCOUNT
          </Title>

          <Text align="center" mb="xl" style={{ color: "black" }}>
            Start your journey to better habits today
          </Text>

          <Divider mb="xl" style={{ borderTopColor: "rgba(255,255,255,0.3)" }} />

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <TextInput
              label="Full Name"
              placeholder="Your name"
              withAsterisk
              {...form.getInputProps("name")}
              mb="md"
              styles={{
                input: {
                  backgroundColor: "rgba(255,255,255,0.9)",
                },
                label: {
                  color: "black",
                },
              }}
            />

            <TextInput
              label="Email"
              placeholder="your@email.com"
              withAsterisk
              {...form.getInputProps("email")}
              mb="md"
              styles={{
                input: {
                  backgroundColor: "rgba(255,255,255,0.9)",
                },
                label: {
                  color: "black",
                },
              }}
            />

            <PasswordInput
              label="Password"
              placeholder="Your password"
              withAsterisk
              {...form.getInputProps("password")}
              mb="md"
              styles={{
                input: {
                  backgroundColor: "rgba(255,255,255,0.9)",
                },
                innerInput: {
                  backgroundColor: "transparent",
                },
                label: {
                  color: "black",
                },
              }}
            />

            <PasswordInput
              label="Confirm Password"
              placeholder="Confirm your password"
              withAsterisk
              {...form.getInputProps("confirmPassword")}
              mb="xl"
              styles={{
                input: {
                  backgroundColor: "rgba(255,255,255,0.9)",
                },
                innerInput: {
                  backgroundColor: "transparent",
                },
                label: {
                  color: "black",
                },
              }}
            />

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                fullWidth
                size="md"
                color="teal"
                leftIcon={<IconFlame size={18} />}
                style={{
                  fontWeight: 600,
                  letterSpacing: 0.5,
                }}
              >
               SIGN IN TO IGNITE MY JOURNEY
              </Button>
            </motion.div>

            <Text align="center" mt="md" style={{ color: "black" }}>
              Already have an account?{" "}
              <Text
                component={Link}
                to="/login"
                color="blue"
                td="underline"
                fw={600}
                style={{ display: "inline" }}
              >
                Log in
              </Text>
            </Text>
          </form>
        </Paper>
      </motion.div>
    </div>
  );
}

export default SignupPage;