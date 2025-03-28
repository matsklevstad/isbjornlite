import dynamic from "next/dynamic";
import Overview from "@/components/overview/overview";
import Loader from "@/components/Loader";
import { Container } from "@mantine/core";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { beerService } from "@/services/beerService";
import { GetServerSideProps } from "next";
import axios from "axios";
import { useState } from "react";

const TitleScene = dynamic(
  () => import("../components/homepage/threejs/scenes/TitleScene"),
  {
    ssr: false,
  }
);

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgass, setLoadingProgass] = useState(0);

  return (
    <div className="overflow-x-hidden min-h-screen">
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black z-50">
          <Loader loadingProgass={loadingProgass} />
        </div>
      )}
      <TitleScene setIsLoading={setIsLoading} loadingProgass={loadingProgass} setLoadingProgass={setLoadingProgass} />
      <Container>
        <Overview />
      </Container>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const queryClient = new QueryClient();

  // Always prefetch public data
  await queryClient.prefetchQuery({
    queryKey: ["toplist"],
    queryFn: () => beerService.getToplist(),
  });

  try {
    // Create server API instance that can forward cookies
    const serverApi = axios.create({
      headers: { "Content-Type": "application/json" },
    });

    // Forward cookies from incoming request
    const cookies = context.req.headers.cookie;
    if (cookies) {
      serverApi.defaults.headers.Cookie = cookies;
    }

    // Try to authenticate using cookies from request
    const userResponse = await serverApi.get("/api/user/profile");

    if (userResponse.data?.data?._id) {
      // User is authenticated, prefetch user-specific data
      await queryClient.prefetchQuery({
        queryKey: ["userBeers"],
        queryFn: async () => {
          const beersResponse = await serverApi.get("/api/beer/user");
          return beersResponse.data.data;
        },
      });
    }
  } catch (error) {
    // User is not authenticated, continue with public data only
    console.log("Not authenticated or error during SSR");
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};
