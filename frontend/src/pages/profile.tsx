import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuthStore } from "@/stores/authStore";
import FallingBeers from "@/components/profile/FallingBeers";
import { beerService } from "@/services/beerService";
import { useQuery } from "@tanstack/react-query";
import { formatDate } from "@/utils/formatDate";

export default function Profile() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, checkAuth } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);

  // Fetch beers using react-query
  const { data: beers, isLoading: loadingBeers } = useQuery({
    queryKey: ["userBeers", user?._id],
    queryFn: () => beerService.getUserBeers(),
    enabled: !!user?._id,
  });

  // Check if we're running on client-side
  useEffect(() => {
    setIsMounted(true);
    checkAuth();
  }, [checkAuth]);

  // Handle redirect on client-side only
  useEffect(() => {
    if (isMounted && !isLoading && !isAuthenticated) {
      // Redirect to login page if not authenticated
      // Redirects back to the current page after login
      router.replace(`/login?redirect=${encodeURIComponent(router.asPath)}`);
    }
  }, [isMounted, isLoading, isAuthenticated, router]);

  // Show loading state during SSR or while checking auth
  if (!isMounted || isLoading || loadingBeers) {
    return <div>Loading...</div>;
  }

  // Don't render anything while redirecting
  if (!isAuthenticated) {
    return <div>Redirecting to login...</div>;
  }

  // User is authenticated, show profile
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 p-4 text-white z-10">
        <h1 className="text-2xl font-bold text-center">{user?.username}</h1>
        <p className="text-center font-bold">
          Medlem siden {formatDate(user?.createdAt || "")}
        </p>
        <p className="text-center font-bold">
          Har drukket {beers?.length} isbjørn
        </p>
      </div>
      {beers && <FallingBeers beers={beers} />}
    </div>
  );
}
