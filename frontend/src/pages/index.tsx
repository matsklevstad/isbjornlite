import dynamic from "next/dynamic";
import Overview from "@/components/overview/overview";

const TitleScene = dynamic(
  () => import("../components/homepage/threejs/scenes/TitleScene"),
  {
    ssr: false,
  }
);

export default function Index() {
  return (
    <div className="overflow-x-hidden">
      <TitleScene />
      <Overview />
    </div>
  );
}
