import ThreeScene from "@/components/threejs/ThreeScene";
import Cube from "@/components/threejs/Cube";
import Beer from "@/components/threejs/Beer";


export default function Home() {
  return (
    <div>
      <ThreeScene>
        {/* <Cube /> */}
        <Beer />
      </ThreeScene>
    </div>
  );
}
