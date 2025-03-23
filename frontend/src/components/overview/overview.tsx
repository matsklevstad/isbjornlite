import React from "react";
import { Container, Title, Text } from "@mantine/core";

export default function Overview() {
  return (
    <Container fluid mih="100vh">
      <Title mt="lg" order={1}>
        Hei, 'bruker'!
      </Title>
      <Text size="lg" mt="md">
        Welcome to the overview page!
      </Text>
    </Container>
  );
}
