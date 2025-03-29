import React from "react";
import { useQuery } from "@tanstack/react-query";
import { beerService } from "@/services/beerService";
import { Alert, Title, Center, Stack, Text, Card, Group } from "@mantine/core";
import PodiumCards from "./PodiumCards";
import { useRouter } from "next/router";

const TopList = () => {
  const {
    data: toplist,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["toplist"],
    queryFn: beerService.getToplist,
  });
  const router = useRouter();

  if (isLoading) return;
  if (error)
    return <Alert color="red">Error: {(error as Error).message}</Alert>;

  const podium = toplist!.slice(0, 3);
  const rest = toplist!.slice(3, 10); // Show top 4-10

  return (
    <Card mt="lg" bg="transparent" w="100%">
      <Text size="md" fw="bold" c="white" mb="lg">
        Topplisten
      </Text>
      <Stack w="100%" justify="center" m="auto">
        {/* Render the podium cards */}
        <PodiumCards podium={podium} />

        {/* Render the rest of the list */}
        {/*<Stack mt="lg" gap="sm">
          {rest.map((user, index) => (
            <Group
              key={index}
              bg="#1a3751"
              justify="space-between"
              p="xs"
              w="100%"
              style={{ borderRadius: "8px" }}
              onClick={() => {
                router.push(`/user/${user.userId}`);
              }}
            >
              <Center
                w={30}
                h={30}
                style={{
                  backgroundColor: "#1E1E1E",
                  borderRadius: "50%",
                }}
              >
                <Text c="white" size="lg">
                  {index + 4}
                </Text>
              </Center>
              <Title order={3} c="white" m="0">
                {user.username}
              </Title>
              <Title order={3} c="white" m="0">
                {user.totalBeers}
              </Title>
            </Group>
          ))}
        </Stack>*/}
      </Stack>
    </Card>
  );
};

export default TopList;
