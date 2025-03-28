import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuthStore } from "@/stores/authStore";
import FallingBeers from "@/components/profile/FallingBeers";
import { beerService } from "@/services/beerService";
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import { formatDate } from "@/utils/formatDate";
import { GetServerSideProps } from "next";
import axios from "axios";
import { userService } from "@/services/userService";

export default function Profile({ userId: serverUserId }: { userId?: string }) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, checkAuth } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);

  // Use server-provided userId if available, otherwise use from auth store
  const effectiveUserId = serverUserId || user?._id;

  const queryUserId = effectiveUserId || "me";

  // Fetch user profile using react-query
  const { data: profileData } = useQuery({
    queryKey: ["userProfile", queryUserId],
    queryFn: () => userService.getUserById(effectiveUserId as string),
    enabled: !!effectiveUserId,
  });

  // Fetch beers using react-query - use same function always
  const { data: beers } = useQuery({
    queryKey: ["userBeers", effectiveUserId],
    queryFn: () => beerService.getBeersByUserId(effectiveUserId as string),
    enabled: !!effectiveUserId,
    // Stop it from refetching immediately after hydration
    staleTime: 10000,
  });

  // Check if we're running on client-side
  useEffect(() => {
    setIsMounted(true);
    checkAuth();
  }, [checkAuth]);

  // Handle redirect on client-side only
  useEffect(() => {
    if (isMounted && !isLoading && !isAuthenticated && !serverUserId) {
      // Redirect to login page if not authenticated
      // Redirects back to the current page after login
      router.replace(`/login?redirect=${encodeURIComponent(router.asPath)}`);
    }
  }, [isMounted, isLoading, isAuthenticated, router, serverUserId]);

  // Display profile using either server-fetched data or client-side data
  const displayUser = profileData || user;

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {displayUser && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 p-4 text-white z-10">
          <h1 className="text-2xl font-bold text-center">
            {displayUser?.username}
          </h1>
          <p className="text-center font-bold">
            Medlem siden {formatDate(displayUser?.createdAt || "")}
          </p>
          <p className="text-center font-bold">
            Har drukket {beers?.length || 0} isbjørn
          </p>
        </div>
      )}

      {beers && <FallingBeers beers={beers} />}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    // Create API instance for server-side
    const serverApi = axios.create({
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    // Forward cookies from the request
    const cookies = context.req.headers.cookie;
    if (cookies) {
      serverApi.defaults.headers.Cookie = cookies;
    }

    try {
      // Use relative paths for API calls
      const userResponse = await serverApi.get("/api/user/profile");
      const userId = userResponse.data.data._id;

      const queryClient = new QueryClient();

      await Promise.all([
        queryClient.prefetchQuery({
          queryKey: ["userProfile", userId],
          queryFn: async () => userResponse.data.data,
        }),
        queryClient.prefetchQuery({
          queryKey: ["userBeers", userId], // Keep this specific to user ID
          queryFn: async () => {
            const beersResponse = await serverApi.get("/api/beer/user");
            return beersResponse.data.data;
          },
        }),
      ]);

      return {
        props: {
          userId,
          dehydratedState: dehydrate(queryClient),
        },
      };
    } catch (error) {
      return { props: {} };
    }
  } catch (error) {
    return { props: {} };
  }
};
