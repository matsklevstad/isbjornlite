import React from "react";
import { useQuery } from "@tanstack/react-query";
import { beerService } from "@/services/beerService";
import { Alert, Text, Group, Badge, Center } from "@mantine/core";
import { useRouter } from "next/router";
import { getTimeSince } from "@/utils/formatTime";

const UserStats = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["userBeers"],
    queryFn: beerService.getUserBeers,
  });

  const router = useRouter();

  const handleProfileClick = () => {
    router.push("/profile");
  };

  if (isLoading) return;
  if (error) return <Alert color="red">{(error as Error).message}</Alert>;

  // Function to format the time display
  const formatTimeDisplay = (date: Date) => {
    const timeString = getTimeSince(date);
    return timeString === "NÅ" ? "0 min" : timeString;
  };

  return (
    <Center bg="#071B2C" w="100%">
      {data && data.length > 0 && data[0].createdAt && (
        <Group gap="xs" align="center">
          <Badge color="#006AFF" styles={{ root: { textTransform: "none" } }}>
            {formatTimeDisplay(new Date(data[0].createdAt))}
          </Badge>
          <Text c="white">siden din forrige isbjørn</Text>
        </Group>
      )}
    </Center>
  );
};

export default UserStats;
