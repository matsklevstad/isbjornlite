import React, { useState, useEffect } from "react";
import { Center, Container, Loader, Title } from "@mantine/core";
import { useAuthStore } from "@/stores/authStore";
import TopList from "../TopList";
import UserStats from "../UserStats";
import { useIsFetching } from "@tanstack/react-query";
import LatestBeers from "../LatestBeers";
import { getGreeting } from "@/utils/getGreeting";

export default function Overview() {
  const { user } = useAuthStore();
  const numQueriesFetching = useIsFetching();
  const [greeting, setGreeting] = useState<string>("");

  // Set the greeting only once when the component mounts or user changes
  useEffect(() => {
    if (user?.username) {
      setGreeting(getGreeting(user.username));
    }
  }, [user?.username]);

  return (
    <Container fluid p="md" h="100%">
      {user && greeting && (
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
