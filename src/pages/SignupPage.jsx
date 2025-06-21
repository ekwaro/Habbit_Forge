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

function SignupPage() {
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
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
    <Container
      size="lg"
      style={{
        minHeight: "100vh",
        backgroundColor: "#e6f4ea", // light blue background
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
          backgroundColor: "#c7eed8", // 💚 mint green card
          width: "100%",
          maxWidth: 500,
        }}
      >
        <Title order={2} align="center" mb="md" color="green">
          Create an Account
        </Title>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Full Name"
            placeholder="Your name"
            withAsterisk
            {...form.getInputProps("name")}
            mb="sm"
          />

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
            mb="sm"
          />

          <PasswordInput
            label="Confirm Password"
            placeholder="Confirm your password"
            withAsterisk
            {...form.getInputProps("confirmPassword")}
            mb="xl"
          />

          <Button type="submit" fullWidth size="md" color="green">
            Create Account
          </Button>

          <Text align="center" mt="md">
            Already have an account?{" "}
            <Text
              component={Link}
              to="/login"
              color="green"
              td="underline"
              fw={500}
              inherit
            >
              Log in
            </Text>
          </Text>
        </form>
      </Paper>
    </Container>
  );
}

export default SignupPage;
