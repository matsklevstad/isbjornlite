import { useAuthStore } from "@/stores/authStore";
import {
  Card,
  Paper,
  Title,
  Alert,
  TextInput,
  PasswordInput,
  Text,
  Button,
  Anchor,
} from "@mantine/core";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "@mantine/form";

export function Register() {
  const router = useRouter();
  const { register } = useAuthStore();

  const form = useForm({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validate: {
      username: (value) => (value ? null : "Brukernavn er påkrevd"),
      email: (value) =>
        /^\S+@\S+$/.test(value)
          ? null
          : "Vennligst skriv inn en gyldig e-postadresse",
      password: (value) => (value ? null : "Passord er påkrevd"),
      confirmPassword: (value, values) =>
        value === values.password ? null : "Passordene stemmer ikke overens",
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = form.validate();
    if (validation.hasErrors) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      await register({
        username: form.values.username,
        email: form.values.email,
        password: form.values.password,
        image: "default-profile.png",
      });
      router.push("/login");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Registreringen mislyktes. Vennligst prøv igjen."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card w="30rem" mx="auto" mt={100}>
      <Paper radius={0} p={30}>
        <Title order={2} mt="md" mb={50}>
          Opprett en isbjornlite.no konto
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

        <form onSubmit={handleRegister}>
          <TextInput
            label="Brukernavn"
            placeholder="ditt brukernavn"
            size="md"
            {...form.getInputProps("username")}
            required
          />
          <TextInput
            label="E-postadresse"
            placeholder="din e-postadresse"
            size="md"
            mt="md"
            {...form.getInputProps("email")}
            required
          />
          <PasswordInput
            label="Passord"
            placeholder="**********"
            mt="md"
            size="md"
            {...form.getInputProps("password")}
            required
          />
          <PasswordInput
            label="Bekreft passord"
            placeholder="**********"
            mt="md"
            size="md"
            {...form.getInputProps("confirmPassword")}
            required
          />
          <Text mt="md" size="sm"></Text>
          <Button
            fullWidth
            mt="xl"
            size="md"
            type="submit"
            loading={loading}
            disabled={!form.isValid()}>
            {loading ? "Registrerer..." : "Registrer"}
          </Button>
        </form>

        <Text mt="md">
          Har du allerede en konto?{" "}
          <Anchor href="/login" fw={700}>
            Logg inn
          </Anchor>
        </Text>
      </Paper>
    </Card>
  );
}
