import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuthStore } from "@/stores/authStore";
import FallingBeers from "@/components/profile/FallingBeers";
import { beerService } from "@/services/beerService";
import { useQuery } from "@tanstack/react-query";

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
      <h1 className="relative z-10 text-white top-4 left-1/2 transform -translate-x-1/2 text-2xl font-bold ">
        Welcome, {user?.username}
      </h1>
      {beers && <FallingBeers beers={beers} />}
    </div>
  );
}
