import FallingBeers from "@/components/profile/FallingBeers";
import { User } from "@/models/user";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Profile() {
  const router = useRouter();
  const { userId } = router.query;

  const [profileData, setProfileData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const { fetchProfile, user } = useAuthStore();

  // Fetch profile data when component mounts or userId changes
  useEffect(() => {
    const loadProfile = async () => {
      try {
        // Special case: "me" redirects to current user's profile
        if (user && userId === user?._id) {
          router.replace(`/profile/${user._id}`);
          return;
        }

        // Fetch profile data using the store function
        const data = await fetchProfile(userId as string);
        if (!data) {
          console.error("Profile with id: " + { userId } + " not found");
          //router.replace("/404");
          return;
        }
        setProfileData(data);
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setLoading(false);
      }
    };
    // Only fetch when userId is available (after hydration)
    if (userId) {
      loadProfile();
    }
  }, [userId, fetchProfile, router, user]);

  // Loading state - temporary loading screen
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="text-white text-xl">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Profile information */}
      <div className="absolute top-0 left-0 p-4 bg-gray-800 text-white">
        <h1 className="text-2xl font-bold">Username: {profileData?.username}</h1>
        
      </div>
      {/* Canvas container */}
      <FallingBeers />
    </div>
  );
}
