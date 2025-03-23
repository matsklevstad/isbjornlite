import React, { useEffect, useState } from "react";
import {
  Card,
  TextInput,
  Button,
  Title,
  Alert,
  Loader,
  List,
  Stack,
} from "@mantine/core";

interface Beer {
  _id?: string;
  name: string;
  type: string;
}

const BeerManager = () => {
  const [beers, setBeers] = useState<Beer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // State for new beer form inputs
  const [newBeer, setNewBeer] = useState({ name: "", type: "" });
  const [posting, setPosting] = useState(false);

  // Fetch beers when component mounts
  useEffect(() => {
    fetchBeers();
  }, []);

  const fetchBeers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/beer");
      const data = await res.json();
      if (data.success) {
        setBeers(data.data);
        setError("");
      } else {
        setError(data.message || "Could not fetch beers.");
      }
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError("Error fetching beers.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewBeer((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddBeer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPosting(true);
    setError("");

    try {
      const res = await fetch("/api/beer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBeer),
      });
      const data = await res.json();
      if (data.success) {
        setBeers((prev) => [...prev, data.data]);
        setNewBeer({ name: "", type: "" });
      } else {
        setError(data.message || "Failed to add beer.");
      }
    } catch (err: any) {
      console.error("POST error:", err);
      setError("Error adding beer.");
    } finally {
      setPosting(false);
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Title order={2} mb="md">
        Beer Manager
      </Title>
      {error && (
        <Alert color="red" mb="md">
          {error}
        </Alert>
      )}
      {loading ? (
        <Loader />
      ) : (
        <List spacing="xs" mb="md">
          {beers.map((beer) => (
            <List.Item key={beer._id}>
              {beer.name} - {beer.type}
            </List.Item>
          ))}
        </List>
      )}
      <Title order={4} mb="sm">
        Add a New Beer
      </Title>
      <form onSubmit={handleAddBeer}>
        <Stack>
          <TextInput
            label="Name"
            placeholder="Enter beer name"
            name="name"
            value={newBeer.name}
            onChange={handleInputChange}
            required
          />
          <TextInput
            label="Type"
            placeholder="Enter beer type"
            name="type"
            value={newBeer.type}
            onChange={handleInputChange}
            required
          />
          <Button type="submit" loading={posting}>
            {posting ? "Adding Beer..." : "Add Beer"}
          </Button>
        </Stack>
      </form>
    </Card>
  );
};

export default BeerManager;
