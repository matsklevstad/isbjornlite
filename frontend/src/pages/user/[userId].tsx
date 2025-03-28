import { useRouter } from "next/router";
import FallingBeers from "@/components/profile/FallingBeers";
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import { beerService } from "@/services/beerService";
import { formatDate } from "@/utils/formatDate";
import { GetServerSideProps } from "next";
import { userService } from "@/services/userService";

export default function Profile({ userId: serverUserId }: { userId: string }) {
  const router = useRouter();
  const { userId = serverUserId } = router.query;

  // Fetch user profile using react-query
  const { data: profileData, isPending: isProfileLoading } = useQuery({
    queryKey: ["userProfile", userId],
    queryFn: () => userService.getUserById(userId as string),
    enabled: !!userId,
  });

  // Fetch beers using react-query
  const { data: beers, isPending: isBeersLoading } = useQuery({
    queryKey: ["userBeers", userId],
    queryFn: () => beerService.getBeersByUserId(userId as string),
    enabled: !!userId,
    staleTime: 5000,
  });

  // Loading state - temporary loading screen
  if ((isProfileLoading || isBeersLoading) && !beers) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-white text-xl"></div>
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Profile information */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 p-4 text-white z-10">
        <h1 className="text-2xl font-bold text-center">
          {profileData?.username}
        </h1>
        <p className="text-center font-bold">
          Medlem siden {formatDate(profileData?.createdAt || "")}
        </p>
        <p className="text-center font-bold">
          Har drukket {beers?.length} isbjørn
        </p>
      </div>
      <FallingBeers beers={beers || []} />
    </div>
  );
}

// In your [userId].tsx
export const getServerSideProps: GetServerSideProps = async (context) => {
  const userId = context.params?.userId as string;
  const queryClient = new QueryClient();

  await Promise.all([
    // Prefetch beers
    queryClient.prefetchQuery({
      queryKey: ["userBeers", userId],
      queryFn: () => beerService.getBeersByUserId(userId),
    }),

    // Prefetch user profile using the new function
    queryClient.prefetchQuery({
      queryKey: ["userProfile", userId],
      queryFn: () => userService.getUserById(userId),
    }),
  ]);

  return {
    props: {
      userId,
      dehydratedState: dehydrate(queryClient),
    },
  };
};
