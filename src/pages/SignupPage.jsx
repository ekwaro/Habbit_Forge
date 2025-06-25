import React, { useEffect } from 'react';
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

  useEffect(() => {
    console.log("SignupPage mounted");
    // Check if admin user exists, if not create one
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    console.log("Existing users:", users);
    
    const adminExists = users.some(user => user.admin);
    console.log("Admin exists:", adminExists);
    
    if (!adminExists) {
      const adminUser = {
        name: "Admin",
        email: "admin@example.com",
        password: "admin123",
        admin: true
      };
      users.push(adminUser);
      localStorage.setItem("users", JSON.stringify(users));
      console.log("Default admin user created:", adminUser);
    }
  }, []);

  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validate: {
      name: (value) => {
        console.log("Validating name:", value);
        return value.trim().length > 0 ? null : "Name is required";
      },
      email: (value) => {
        console.log("Validating email:", value);
        return /^\S+@\S+$/.test(value) ? null : "Invalid email";
      },
      password: (value) => {
        console.log("Validating password length:", value.length);
        return value.length >= 6 ? null : "Password must be at least 6 characters";
      },
      confirmPassword: (value, values) => {
        console.log("Validating confirm password:", value, "vs", values.password);
        return value === values.password ? null : "Passwords do not match";
      },
    },
  });

  const handleSubmit = (values) => {
    console.log("=== SIGNUP FORM SUBMITTED ===");
    console.log("Form values:", values);
    
    try {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      console.log("Current users before signup:", users);

      // Check if user already exists
      const existingUser = users.find(user => user.email === values.email);
      console.log("Existing user check:", existingUser);

      if (existingUser) {
        console.log("User already exists!");
        notifications.show({
          title: "Error",
          message: "User with this email already exists",
          color: "red",
        });
        return;
      }

      // Create new user object
      const newUser = {
        name: values.name,
        email: values.email,
        password: values.password,
        admin: false
      };
      console.log("Creating new user:", newUser);

      // Add user to array and save
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
      console.log("Users after signup:", JSON.parse(localStorage.getItem("users")));

      console.log("Showing success notification");
      notifications.show({
        title: "Success",
        message: "Account created successfully! Redirecting to login...",
        color: "green",
      });

      console.log("Setting timeout for navigation");
      setTimeout(() => {
        console.log("Navigating to login page");
        navigate("/login", { replace: true });
      }, 1500);

    } catch (error) {
      console.error("Signup error:", error);
      notifications.show({
        title: "Error",
        message: "Failed to create account. Please try again.",
        color: "red",
      });
    }
  };

  // Debug button click
  const handleButtonClick = (e) => {
    console.log("Button clicked!");
    console.log("Form errors:", form.errors);
    console.log("Form values:", form.values);
    console.log("Form validation:", form.validate());
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
                onClick={handleButtonClick}
                style={{
                  fontWeight: 600,
                  letterSpacing: 0.5,
                }}
              >
                SIGN UP TO IGNITE MY JOURNEY
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