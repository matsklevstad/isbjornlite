import { beerService } from "@/services/beerService";
import { useQuery } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
import {
  Card,
  Text,
  Title,
  Stack,
  Loader,
  Group,
  Container,
  Image,
  ScrollArea,
} from "@mantine/core";
import { getTimeSince } from "@/utils/formatTime";

const LatestBeers = () => {
  const [timeKey, setTimeKey] = useState(0);

  const {
    data: latestBeers,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["latestBeers"],
    queryFn: beerService.getRecentBeers,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeKey((prev) => prev + 1);
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  if (isLoading) {
    return <Loader size="md" type="dots" mx="auto" my="xl" />;
  }

  if (error) {
    return (
      <Text c="red" ta="center">
        <strong>Error fetching beers:</strong> {error.message}
      </Text>
    );
  }

  return (
    <Container fluid mt="md">
      <Text size="md" fw="bold" c="white" mb="xs">
        Siste nytt
      </Text>

      {latestBeers?.length === 0 ? (
        <Text c="dimmed">No beers found</Text>
      ) : (
        <ScrollArea h={300}>
          <Group gap="xs" w="100%">
            {latestBeers?.map((beer) => (
              <Card
                key={beer.id}
                p="xs"
                bg="rgba(255, 255, 255, 0.1)"
                radius="md"
                w="100%"
              >
                <Group justify="space-between" align="center" gap="xs">
                  <Group gap="5">
                    <Image
                      src={"/assets/beerImages/isbjorn_big.png"}
                      w="100%"
                      h="60"
                      alt="Beer"
                    />
                    <Stack gap={0}>
                      <Title order={5} c="white">
                        {beer.createdByUsername}
                      </Title>
                      <Text size="sm" c="dimmed">
                        {beer.description}
                      </Text>
                    </Stack>
                  </Group>
                  <Text size="xs" c="white" key={`time-${beer.id}-${timeKey}`}>
                    {getTimeSince(new Date(beer.createdAt))}
                  </Text>
                </Group>
              </Card>
            ))}
          </Group>
        </ScrollArea>
      )}
    </Container>
  );
};

export default LatestBeers;
