import React from "react";
import {
  Container,
  Title,
  Text,
  Card,
  ScrollArea,
  Group,
  Badge,
  Stack,
} from "@mantine/core";

import { IBeer } from "@/models/beer";
import { useQuery } from "@tanstack/react-query";
import { beerService } from "@/services/beerService";
import { useAuthStore } from "@/stores/authStore";

export default function Overview() {
  const { user } = useAuthStore();

  const { data: beers } = useQuery({
    queryKey: ["beers"],
    queryFn: beerService.getAllBeers,
  });

  const greeting =
    (() => {
      const hour = new Date().getHours();
      if (hour < 12) return "God morgen";
      if (hour < 18) return "God ettermiddag";
      return "God kveld";
    })() + (user?.username ? ` ${user.username}!` : "");

  return (
    <Container fluid mih="100vh" p="md">
      <Title mt="lg" order={1}>
        {greeting}
      </Title>

      <ScrollArea style={{ height: "50vh", marginTop: "1rem" }}>
        {beers && beers.length > 0 && (
          <Stack gap="md">
            {beers.map((beer: IBeer) => (
              <Card
                key={beer.id}
                shadow="sm"
                p="lg"
                radius="md"
                withBorder
                bg="rgb(12,179,252)">
                <Group justify="space-between">
                  <Title order={4} c="white">
                    {beer.createdByUsername}
                  </Title>

                  <Badge color="white" variant="light">
                    {beer.volume} L
                  </Badge>
                </Group>
                <Group>
                  <Text color="white">
                    {new Date(beer.createdAt)
                      .toLocaleString("en-US", {
                        month: "2-digit",
                        day: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })
                      .replace(",", "")}
                  </Text>
                </Group>
              </Card>
            ))}
          </Stack>
        )}
      </ScrollArea>
    </Container>
  );
}
