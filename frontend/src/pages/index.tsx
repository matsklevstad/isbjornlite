import TitleScene from "@/components/threejs/scenes/TitleScene";

import IsbjornLive from "../components/threejs/scenes/IsbjornLive";

export default function Index() {
  return (
    <div className="overflow-x-hidden">
      <TitleScene />
      <IsbjornLive />
    </div>
  );
}
