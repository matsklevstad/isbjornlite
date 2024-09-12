import TitleScene from "@/components/threejs/scenes/TitleScene";
import Log from "./Log";

export default function Index() {
  return (
    <div className="overflow-x-hidden">
      <TitleScene />
      <Log />
    </div>
  );
}
