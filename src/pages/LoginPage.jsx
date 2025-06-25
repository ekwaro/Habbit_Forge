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
import { useState, useEffect } from "react";
import { IconBrandGoogle, IconLogin } from "@tabler/icons-react";
import { motion } from "framer-motion";
import { keyframes } from "@emotion/react";

// Define keyframes for animated background
const animatedBackground = keyframes`
  0% { background-position: 0% 0%; }
  100% { background-position: 100% 100%; }
`;

function LoginForm() {
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Initialize Google Sign-In
  useEffect(() => {
    console.log("LoginForm mounted");
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: 'YOUR_GOOGLE_CLIENT_ID',
          callback: handleGoogleCallback,
        });
      }
    };

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const handleGoogleCallback = (response) => {
    console.log("Google callback triggered");
    try {
      const userInfo = JSON.parse(atob(response.credential.split('.')[1]));
      console.log("Google user info:", userInfo);
      
      setIsRedirecting(true);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          name: userInfo.name,
          email: userInfo.email,
          picture: userInfo.picture,
          authMethod: "google",
          admin: false 
        })
      );

      notifications.show({
        title: "Success",
        message: `Welcome ${userInfo.name}!`,
        color: "green",
      });

      setTimeout(() => {
        console.log("Navigating to user dashboard");
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
      email: (value) => {
        console.log("Validating login email:", value);
        return /^\S+@\S+$/.test(value) ? null : "Invalid email";
      },
      password: (value) => {
        console.log("Validating login password length:", value.length);
        return value.length > 0 ? null : "Password is required";
      },
    },
  });

  const handleSubmit = (values) => {
    console.log("=== LOGIN FORM SUBMITTED ===");
    console.log("Login form values:", values);
    
    try {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      console.log("All users in localStorage:", users);
      
      const user = users.find(
        (u) => u.email === values.email && u.password === values.password
      );
      console.log("Found user:", user);

      if (user) {
        console.log("User authentication successful");
        console.log("User admin status:", user.admin);
        
        setIsRedirecting(true);
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("currentUser", JSON.stringify(user));
        console.log("Saved current user to localStorage:", user);

        notifications.show({
          title: "Success",
          message: `Welcome back ${user.name}!`,
          color: "green",
        });

        // Determine redirect path based on admin status
        const redirectPath = user.admin ? "/admin" : "/user-dashboard";
        console.log("Determined redirect path:", redirectPath);
        console.log("User is admin:", user.admin);

        // Redirect based on admin status
        setTimeout(() => {
          console.log("Executing navigation to:", redirectPath);
          navigate(redirectPath, { replace: true });
        }, 1000);
      } else {
        console.log("User authentication failed - no matching user found");
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

  const handleGoogleLogin = () => {
    console.log("Google login button clicked");
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

  // Debug button click
  const handleButtonClick = (e) => {
    console.log("Login button clicked!");
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
          <Title
            order={2}
            align="center"
            mb="md"
            style={{ color: "black", fontWeight: 700 }}
          >
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
                leftIcon={<IconLogin size={18} />}
                loading={isRedirecting}
                onClick={handleButtonClick}
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