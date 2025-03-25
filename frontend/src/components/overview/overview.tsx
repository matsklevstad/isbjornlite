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
  Table,
} from "@mantine/core";

import { IBeer } from "@/models/beer";
import { useQuery } from "@tanstack/react-query";
import { beerService } from "@/services/beerService";
import { useAuthStore } from "@/stores/authStore";

import classes from "./overview.module.css";
import TopList from "../TopList";

export default function Overview() {
  const { user } = useAuthStore();

  /*const { data: beers } = useQuery({
    queryKey: ["beers"],
    queryFn: beerService.getAllBeers,
  });*/

  const greeting =
    (() => {
      const hour = new Date().getHours();
      if (hour < 12) return "God morgen, ";
      if (hour < 18) return "God ettermiddag, ";
      return "God kveld, ";
    })() + ` ${user?.username}`;

  return (
    <Container fluid p="md" h="100%">
      {user && (
        <Title order={1} c="white" ta="center" mt="md" mb="xl">
          {greeting}
        </Title>
      )}
      <TopList />
    </Container>
  );
}
