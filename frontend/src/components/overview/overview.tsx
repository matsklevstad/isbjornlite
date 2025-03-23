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

export default function Overview() {
  const { user } = useAuthStore();

  const { data: beers } = useQuery({
    queryKey: ["beers"],
    queryFn: beerService.getAllBeers,
  });

  const greeting =
    (() => {
      const hour = new Date().getHours();
      if (hour < 12) return "God morgen, ";
      if (hour < 18) return "God ettermiddag, ";
      return "God kveld, ";
    })() + ` ${user?.username}!`;

  // Group beers by date for the scroll area
  const groupedBeers: Record<string, IBeer[]> =
    beers?.reduce((acc, beer) => {
      const dateKey = new Date(beer.createdAt)
        .toLocaleDateString("nb-NO", {
          weekday: "long",
          day: "2-digit",
          month: "2-digit",
        })
        .toUpperCase();
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(beer);
      return acc;
    }, {} as Record<string, IBeer[]>) || {};

  // Dummy data for ranks 4+ for the table
  const tableData = [
    { rank: "4th", name: "John Doe", beers: 10 },
    { rank: "5th", name: "Jane Roe", beers: 9 },
    { rank: "6th", name: "Sam Smith", beers: 8 },
  ];

  const data = [
    {
      title: "John Doe",
      stats: "10",
    },
    {
      title: "Jane Roe",
      stats: "9",
    },
    {
      title: "Sam Smith",
      stats: "8",
    },
  ];

  return (
    <Container
      fluid
      p="md"
      style={{ background: "#f0f8ff", minHeight: "100vh" }}>
      {user && (
        <Title
          order={1}
          ta="center"
          mt="md"
          mb="xl"
          style={{ color: "#0d47a1" }}>
          {greeting}
        </Title>
      )}
      <ScrollArea style={{ height: "30vh", marginBottom: "2rem" }} type="auto">
        {Object.entries(groupedBeers).map(([date, beers]) => (
          <div key={date}>
            <Title order={3} mt="md" style={{ color: "#0d47a1" }}>
              {date}
            </Title>
            <Stack gap="md" mt="sm">
              {beers &&
                beers.length > 0 &&
                beers.map((beer: IBeer) => {
                  const fillPercentage = Math.min(
                    Math.round((Number(beer.volume) / 0.5) * 100 + 4),
                    100
                  );
                  return (
                    <Card
                      key={beer.id}
                      shadow="sm"
                      p="md"
                      radius="md"
                      withBorder
                      style={{
                        background: `linear-gradient(135deg, rgb(12,179,252) ${fillPercentage}%, white ${fillPercentage}%)`,
                      }}>
                      <Group justify="space-between">
                        <Title order={2} style={{ color: "white" }}>
                          {beer.createdByUsername}
                        </Title>
                        <Badge size="xl" color="white" variant="gradient">
                          {beer.volume} L
                        </Badge>
                      </Group>
                      <Text c="white" fz="lg">
                        {new Date(beer.createdAt).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        })}
                      </Text>
                    </Card>
                  );
                })}
            </Stack>
          </div>
        ))}
      </ScrollArea>
      {/* Podium section */}
      <Title order={2} ta="center" mt="xl" c="#0d47a1">
        Topplisten
      </Title>
      <div className={classes.root}>
        {data.map((stat) => (
          <div key={stat.title} className={classes.stat}>
            <Text className={classes.count}>{stat.stats}</Text>
            <Text className={classes.title}>{stat.title}</Text>
          </div>
        ))}
      </div>
      ;{/* Table for ranks 4+ */}
      <Title order={3} mt="xl" ta="center" c="#0d47a1">
        Resten ... 🥱
      </Title>
      <Table
        highlightOnHover
        striped
        mt="md"
        bg="white"
        stripedColor="rgba(12,179,252, 0.1)"
        p="lg">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>#</Table.Th>
            <Table.Th>Navn</Table.Th>
            <Table.Th>Isbjørner</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {tableData.map((item) => (
            <Table.Tr key={item.rank}>
              <Table.Td>{item.rank}</Table.Td>
              <Table.Td>{item.name}</Table.Td>
              <Table.Td>{item.beers}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Container>
  );
}
