import dynamic from "next/dynamic";
import Overview from "@/components/overview/overview";
import { Container } from "@mantine/core";

const TitleScene = dynamic(
  () => import("../components/homepage/threejs/scenes/TitleScene"),
  {
    ssr: false,
  }
);

export default function Index() {
  return (
    <div className="overflow-x-hidden min-h-screen">
      <TitleScene />
      <Container bg="#071B2C">
        <Overview />
      </Container>
    </div>
  );
}
