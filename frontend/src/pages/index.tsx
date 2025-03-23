import dynamic from "next/dynamic";
import BeerManager from "./beer";

const TitleScene = dynamic(
  () => import("../components/threejs/scenes/TitleScene"),
  {
    ssr: false,
  }
);

export default function Index() {
  return <div className="overflow-x-hidden">{/*<TitleScene />*/}</div>;
}
