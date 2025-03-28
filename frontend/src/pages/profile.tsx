import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuthStore } from "@/stores/authStore";
import FallingBeers from "@/components/profile/FallingBeers";
import { beerService } from "@/services/beerService";
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import { formatDate } from "@/utils/formatDate";
import { GetServerSideProps } from "next";
import { userService } from "@/services/userService";

export default function Profile({ userId: serverUserId }: { userId?: string }) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, checkAuth } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);

  // Use server-provided userId if available, otherwise use from auth store
  const effectiveUserId = serverUserId || user?._id;

  const queryUserId = effectiveUserId || 'me';

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

export const getServerSideProps: GetServerSideProps = async () => {
  // Get user from cookies/session
  try {
    const userProfile = await userService.getProfile();
    const userId = userProfile?._id;

    if (!userId) {
      // User is not authenticated, will handle on client side
      return { props: {} };
    }

    const queryClient = new QueryClient();

    await Promise.all([
      // Prefetch user profile
      queryClient.prefetchQuery({
        queryKey: ["userProfile", userId || 'me'],
        queryFn: () => userService.getUserById(userId),
      }),

      // Prefetch user beers
      queryClient.prefetchQuery({
        queryKey: ["userBeers", userId || 'me'],
        queryFn: () => beerService.getBeersByUserId(userId),
      }),
    ]);

    return {
      props: {
        userId,
        dehydratedState: dehydrate(queryClient),
      },
    };
  } catch (error) {
    console.error("Error in getServerSideProps:", error);
    return { props: {} };
  }
};
