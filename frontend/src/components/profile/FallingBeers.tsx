import { Engine, Render, Runner, World } from "matter-js";
import {
  createMatterWorld,
  createWalls,
  createBeer,
  applyRandomForce,
} from "@/utils/matterConfig";
import { useEffect, useRef } from "react";

interface FallingBeersProps {
  autoSpawnInterval?: number; // ms between auto-spawns
  enabled?: boolean; // whether the animation is enabled
}

export default function FallingBeers({
  autoSpawnInterval = 100,
  enabled = true,
}: FallingBeersProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine>();
  const renderRef = useRef<Matter.Render>();

  useEffect(() => {
    if (!sceneRef.current || !enabled) return;

    // Get container dimensions
    const width = sceneRef.current.clientWidth;
    const height = window.innerHeight;

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
  }, [enabled]);

  // Function to spawn beer bottles
  const spawnBeer = () => {
    if (!engineRef.current || !sceneRef.current) return;

    // Get container width for random x position
    const width = sceneRef.current.clientWidth;

    // Create beer object at random x position
    const beer = createBeer(Math.random() * (width - 100) + 50, -40, width);

    // Apply random force and spin
    applyRandomForce(beer);

    // Add to world
    World.add(engineRef.current.world, beer);
  };

  // Auto-spawning beer bottles
  useEffect(() => {
    if (!enabled) return;

    const intervalId = setInterval(() => {
      spawnBeer();
    }, autoSpawnInterval);

    // Clean up interval on unmount or when props change
    return () => {
      clearInterval(intervalId);
    };
  }, [autoSpawnInterval, enabled]);

  return <div ref={sceneRef} className="w-full h-full absolute top-0 z-0" />;
}
