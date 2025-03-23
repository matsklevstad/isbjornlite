import { useState } from "react";
import { useRouter } from "next/router";
import {
  Anchor,
  Button,
  Checkbox,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
  Alert,
} from "@mantine/core";
import classes from "./Login.module.css";
import { useAuthStore } from "@/stores/authStore";

export function Login() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempt with:", { username, password });

    // Basic validation
    if (!username || !password) {
      setError("Vennligst fyll inn både brukernavn og passord.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Call the login function from the auth store
      await login(username, password, rememberMe);
      // Redirect to the home page or dashboard
      router.push("/");
    } catch (error: any) {
      // Handle login errors
      const message =
        error.response?.data?.message ||
        "Innlogging mislyktes. Vennligst prøv igjen.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p={30}>
        <Title order={2} className={classes.title} ta="center" mt="md" mb={50}>
          Velkommen til Isbjørn Lite!
        </Title>

        {error && (
          <Alert
            color="red"
            mb="md"
            withCloseButton
            onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleLogin}>
          <TextInput
            label="Brukernavn"
            placeholder="brahabra"
            size="md"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <PasswordInput
            label="Passord"
            placeholder="**********"
            mt="md"
            size="md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Checkbox
            label="Hold meg logget inn"
            mt="xl"
            size="md"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <Button fullWidth mt="xl" size="md" type="submit" loading={loading}>
            {loading ? "Logger inn..." : "Logg inn"}
          </Button>
        </form>

        <Text ta="center" mt="md">
          Har du ikke en bruker?{" "}
          <Anchor<"a"> href="/register" fw={700}>
            Register
          </Anchor>
        </Text>
      </Paper>
    </div>
  );
}
