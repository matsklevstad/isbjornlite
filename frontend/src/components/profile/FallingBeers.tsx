import { Engine, Render, Runner, World } from "matter-js";
import {
  createMatterWorld,
  createWalls,
  createBeer,
  applyRandomForce,
} from "@/utils/matterConfig";
import { useEffect, useRef } from "react";
import { Beer } from "@/models/beer";

interface FallingBeersProps {
  beers: Beer[]; // List of beers to spawn
  autoSpawnInterval?: number; // ms between auto-spawns
}

export default function FallingBeers({
  beers = [],
  autoSpawnInterval = 100,
}: FallingBeersProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine>();
  const renderRef = useRef<Matter.Render>();

  // Set to keep track of spawned beer IDs
  const spawnedBeerIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!sceneRef.current) return;

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
  }, []);

  // Function to spawn beer bottles
  const spawnBeer = (beer: Beer) => {
    console.log("Spawning beer:", beer); // For debugging

    if (!engineRef.current || !sceneRef.current || !beer._id) return;

    // Skip if we've already spawned this beer
    if (spawnedBeerIdsRef.current.has(beer._id)) {
      return;
    }

    // Get container width for random x position
    const width = sceneRef.current.clientWidth;

    const x = Math.random() * (width - 100) + 50;
    const y = -40;

    // Create beer object at random x position
    const beerBody = createBeer(x, y, width);

    // Apply random force and spin
    applyRandomForce(beerBody);

    // Add to world
    World.add(engineRef.current.world, beerBody);

    spawnedBeerIdsRef.current.add(beer._id);

    console.log(`Spawned beer ${beer._id}`); // For debugging
  };

  // Auto-spawn beers at intervals
  useEffect(() => {
    console.log("Auto-spawning beers every", autoSpawnInterval, "ms");

    const interval = setInterval(() => {
      console.log("Auto-spawning beer..."); // For debugging
      if (beers.length > 0) {
        console.log("Available beers:", beers); // For debugging
        const beer = beers[Math.floor(Math.random() * beers.length)];
        spawnBeer(beer);
      }
    }, autoSpawnInterval);

    return () => clearInterval(interval);
  }, [beers, autoSpawnInterval]);

  return <div ref={sceneRef} className="w-full h-full absolute top-0 z-0" />;
}
