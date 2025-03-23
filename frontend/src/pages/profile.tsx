import { Engine, Render, Runner, World } from "matter-js";
import {
  createMatterWorld,
  createWalls,
  createBeer,
  applyRandomForce,
} from "@/utils/matterConfig";
import { useEffect, useRef } from "react";

export default function Profile() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine>();
  const renderRef = useRef<Matter.Render>();

  useEffect(() => {
    if (!sceneRef.current) return;

    // Get container dimensions
    const width = sceneRef.current.clientWidth;
    const height = sceneRef.current.clientHeight;

    // Create engine and renderer
    const { engine, render } = createMatterWorld(
      sceneRef.current,
      width,
      height
    );
    engineRef.current = engine;
    renderRef.current = render;

    // Create walls
    const walls = createWalls(width, height);
    World.add(engine.world, walls);

    // Start the engine and renderer
    const runner = Runner.create();
    Runner.run(runner, engine);
    Render.run(render);

    // Handle window resizing
    const handleResize = () => {
      if (sceneRef.current && renderRef.current) {
        const newWidth = sceneRef.current.clientWidth;

        // Update renderer
        renderRef.current.options.width = newWidth;
        Render.setPixelRatio(renderRef.current, window.devicePixelRatio);

        // Update wall positions
        World.remove(engine.world, walls);
        const newWalls = createWalls(newWidth, height);
        World.add(engine.world, newWalls);
      }
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      Render.stop(render);
      World.clear(engine.world, false);
      Engine.clear(engine);
      render.canvas?.remove();
      render.element && (render.element.innerHTML = "");
    };
  }, []);

  // Function to spawn beer bottles
  const handleClick = () => {
    if (!engineRef.current || !sceneRef.current) return;

    // Get container width for random x position
    const width = sceneRef.current.clientWidth;

    // Create beer object at random x position
    const beer = createBeer(Math.random() * (width - 100) + 50, -40, width);

    // Apply random force and spin
    applyRandomForce(beer);

    // Add to world
    World.add(engineRef.current.world, beer);

    console.log("Beer spawned!");
  };

  // New Effect: Auto-spawning beer bottles
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (true) {
      // Spawn a beer every 1000ms (1 second)
      intervalId = setInterval(() => {
        handleClick();
      }, 1000);
    }

    // Clean up interval on unmount or when autoSpawn changes
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []); // Dependency array includes autoSpawn to restart when toggled

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gray-500">
      {/* Canvas container */}
      <div ref={sceneRef} className="w-full h-full mb-4" />
    </div>
  );
}
