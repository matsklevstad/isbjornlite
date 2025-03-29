import React from "react";
import { Card, Text, Center, Stack, Group } from "@mantine/core";
import { useRouter } from "next/router";

interface Props {
  podium: { username: string; totalBeers: number; userId: string }[];
}

const PodiumCards = (props: Props) => {
  const router = useRouter();

  if (props.podium.length < 3) return null;

  // Correct order: 2nd place, 1st place, 3rd place
  const orderedPodium = [props.podium[1], props.podium[0], props.podium[2]];

  const cardConfig = [
    { color: "#a3a3a3", tilt: "-10deg", top: 20 }, // 2nd place
    { color: "white", tilt: "0deg", top: -20 }, // 1st place
    { color: "#ff9800", tilt: "10deg", top: 20 }, // 3rd place
  ];

  const handleUserClick = (userId: string) => {
    router.push(`/user/${userId}`);
  };

  return (
    <Center mb="lg">
      <Group gap="xs" wrap="nowrap">
        {orderedPodium.map((user, index) => (
          <Card
            key={index}
            radius="md"
            w={{ base: "100", sm: "200" }}
            h={{ base: "150", sm: "250" }}
            bg={cardConfig[index].color}
            c={cardConfig[index].color === "white" ? "black" : "white"}
            style={{
              transform: `rotate(${cardConfig[index].tilt})`,
              position: "relative",
              top: cardConfig[index].top,
            }}
            onClick={() => handleUserClick(user.userId)}
          >
            <Stack align="center" justify="space-around" h="100%">
              <Text fz={{ base: "1rem", sm: "2rem" }}>{user.username}</Text>
              <Text fz={{ base: "2rem", sm: "4rem" }} fw={600}>
                {user.totalBeers}
              </Text>
            </Stack>
          </Card>
        ))}
      </Group>
    </Center>
  );
};

export default PodiumCards;
