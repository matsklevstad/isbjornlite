import React from "react";
import { Center, Container, Loader, Title } from "@mantine/core";
import { useAuthStore } from "@/stores/authStore";
import TopList from "../TopList";
import UserStats from "../UserStats";
import { useIsFetching } from "@tanstack/react-query";
import LatestBeers from "../LatestBeers";

export default function Overview() {
  const { user } = useAuthStore();
  const numQueriesFetching = useIsFetching();

  const greeting =
    (() => {
      const hour = new Date().getHours();
      if (hour < 12) return "God morgen, ";
      if (hour < 18) return "God ettermiddag, ";
      return "Faen as, ";
    })() + ` ${user?.username}`;

  return (
    <Container fluid p="md" h="100%">
      {user && (
        <Title order={1} c="white" ta="center" mt="md" mb="xs">
          {greeting}
        </Title>
      )}
      {numQueriesFetching > 0 && (
        <Center>
          <Loader color="red" size="xl" />
        </Center>
      )}
      <UserStats />
      <LatestBeers />
      <TopList />
    </Container>
  );
}
