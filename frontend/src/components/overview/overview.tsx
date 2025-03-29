import { useAuthStore } from "@/stores/authStore";
import LogInBtn from "@/components/homepage/buttons/LogInBtn";
import UserStats from "../UserStats";
import LatestBeers from "../LatestBeers";
import TopList from "../TopList";
import { Affix, Container, Title, Transition } from "@mantine/core";
import { getGreeting } from "@/utils/getGreeting";
import AddBeerBtn from "../homepage/buttons/AddBeerBtn";
import { useRef, useState, useEffect } from "react";

export default function Overview() {
  const { user, isAuthenticated } = useAuthStore();
  const overviewRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only run on client-side
    if (typeof window === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Update state when the overview component enters or leaves the viewport
        setIsVisible(entry.isIntersecting);
      },
      {
        root: null, // Use the viewport as the root
        threshold: 0.3, // Trigger when at least 10% of the component is visible
      }
    );

    if (overviewRef.current) {
      observer.observe(overviewRef.current);
    }

    return () => {
      if (overviewRef.current) {
        observer.unobserve(overviewRef.current);
      }
    };
  }, []);

  return (
    <Container p={0} ref={overviewRef}>
      {isAuthenticated ? (
        // User is authenticated - show user content
        <>
          <Title order={1} c="white" ta="center" mt="md" mb="xs">
            {user?.username && getGreeting(user.username)}
          </Title>
          <UserStats />
        </>
      ) : (
        // User is not authenticated - show login button
        <div className="flex flex-col items-center mb-6">
          <LogInBtn />
        </div>
      )}

      {/* Always show these components regardless of auth status */}
      <LatestBeers />
      <TopList />

      {/* Wrap Affix in Transition for smooth fade effect */}
      <Transition
        mounted={isVisible}
        transition="fade"
        duration={400}
        timingFunction="ease"
      >
        {(styles) => (
          <Affix right={"50%"} style={styles}>
            <AddBeerBtn />
          </Affix>
        )}
      </Transition>
    </Container>
  );
}
