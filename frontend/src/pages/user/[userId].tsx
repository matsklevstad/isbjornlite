import FallingBeers from "@/components/profile/FallingBeers";
import { User } from "@/models/user";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { beerService } from "@/services/beerService";

export default function Profile() {
  const router = useRouter();
  const { userId } = router.query;

  const [profileData, setProfileData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const { fetchProfile, user } = useAuthStore();

  // Fetch profile data using react-query
  const { data: beers, isLoading: loadingBeers } = useQuery({
    queryKey: ["userBeers", userId],
    queryFn: () => beerService.getBeersByUserId(userId as string),
    enabled: !!userId,
  });

  // Fetch profile data when component mounts or userId changes
  useEffect(() => {
    const loadProfile = async () => {
      try {
        // Fetch profile data using the store function
        const data = await fetchProfile(userId as string);
        if (!data) {
          console.error(`Profile with id: ${userId} not found`);
          router.replace("/404");
          return;
        }
        setProfileData(data);
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setLoading(false);
      }
    };
    // Only fetch when userId is available
    if (userId) {
      loadProfile();
    }
  }, [userId, fetchProfile, router, user]);

  // Loading state - temporary loading screen
  if (loading || loadingBeers) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="text-white text-xl">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Profile information */}
      <div className="absolute top-0 left-0 p-4 bg-gray-800 text-white z-10">
        <h1 className="text-2xl font-bold">
          Username: {profileData?.username}
        </h1>
        {beers && beers.length > 0 ? (
          <div>
            <h2 className="text-xl font-semibold">Beers:</h2>
            <ul>
              {beers.map((beer) => (
                <li key={String(beer._id)} className="text-lg">
                  {beer.name}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No beers found for this user.</p>
        )}
      </div>
      {/* Canvas container */}
      {beers && <FallingBeers beers={beers} />}
    </div>
  );
}
