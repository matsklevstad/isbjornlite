import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import Cookies from "js-cookie";

export function AuthSync() {
  const { data: session } = useSession();
  const { setUser } = useAuthStore(); // Use setUser instead of login
  
  useEffect(() => {
    if (session?.user?.id && session?.customJwt) {
      // Use the JWT already created by NextAuth
      Cookies.set("auth-token", session.customJwt, { expires: 30 });
      
      // Update auth store with user data
      setUser({
        _id: session.user.id,
        email: session.user.email || "",
        username: session.user.username || "",
        image: session.user.image || "",
      });
    }
  }, [session, setUser]);
  
  return null;
}