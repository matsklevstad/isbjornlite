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
    if (typeof window === "undefined") return;
    const currentRef = overviewRef.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0.3,
      }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
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
