import { useAuthStore } from "@/stores/authStore";
import LogInBtn from "@/components/homepage/buttons/LogInBtn";
import UserStats from "../UserStats";
import LatestBeers from "../LatestBeers";
import TopList from "../TopList";
import { Container, Title } from "@mantine/core";
import { getGreeting } from "@/utils/getGreeting";

export default function Overview() {
  const { user, isAuthenticated } = useAuthStore();

  return (
    <Container fluid p="md" h="100%">
      {isAuthenticated ? (
        // User is authenticated - show user content
        <>
          <Title order={1} c="white" ta="center" mt="md" mb="xs">
            {user?.username && getGreeting(user.username)}
          </Title>
          <UserStats />
        </>
      ) : (
        // User is not authenticated - show login button
        <div className="flex flex-col items-center mt-8 mb-6">
          <LogInBtn />
        </div>
      )}

      {/* Always show these components regardless of auth status */}
      <LatestBeers />
      <TopList />
    </Container>
  );
}
