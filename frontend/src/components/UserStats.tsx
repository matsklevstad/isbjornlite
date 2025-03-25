import React from "react";
import { useQuery } from "@tanstack/react-query";
import { beerService } from "@/services/beerService";
import { Loader, Alert, Text, Group, Badge, Center } from "@mantine/core";

const UserStats = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["userBeers"],
    queryFn: beerService.getUserBeers,
  });

  const getLatestBeer = () => {
    if (!data?.length) return null;

    const diffMs = Date.now() - new Date(data[0].createdAt).getTime();
    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return hours > 0 ? `${hours}t og ${minutes} min` : `${minutes} min`;
  };

  if (isLoading) return;
  if (error) return <Alert color="red">{(error as Error).message}</Alert>;

  return (
    <Center bg="#071B2C" w="100%">
      {data && data.length > 0 && (
        <Group gap="xs" align="center">
          <Badge color="#006AFF" styles={{ root: { textTransform: "none" } }}>
            {getLatestBeer() ? getLatestBeer() : ""}
          </Badge>
          <Text c="white">siden din forrige isbjørn</Text>
        </Group>
      )}
    </Center>
  );
};

export default UserStats;
