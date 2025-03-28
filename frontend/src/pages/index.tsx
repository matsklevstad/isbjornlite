import dynamic from "next/dynamic";
import Overview from "@/components/overview/overview";
import { Container } from "@mantine/core";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { beerService } from "@/services/beerService";
import { useAuthStore } from "@/stores/authStore";

const TitleScene = dynamic(
  () => import("../components/homepage/threejs/scenes/TitleScene"),
  {
    ssr: false,
  }
);

export default function Index() {
  return (
    <div className="overflow-x-hidden min-h-screen">
      <TitleScene />
      <Container>
        <Overview />
      </Container>
    </div>
  );
}

export const getServerSideProps = async () => {
  const queryClient = new QueryClient();
  const { checkAuth } = useAuthStore.getState();

  // Always prefetch public data
  await queryClient.prefetchQuery({
    queryKey: ["toplist"],
    queryFn: () => beerService.getToplist(),
  });

  try {
    // Check authentication
    await checkAuth();

    // Prefetch user-specific data if authenticated
    await queryClient.prefetchQuery({
      queryKey: ["userBeers"],
      queryFn: () => beerService.getUserBeers(),
    });
  } catch {
    // Handle unauthenticated state
    console.error("User is not authenticated");
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};
