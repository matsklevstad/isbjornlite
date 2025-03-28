import {
  Engine,
  Render,
  Runner,
  World,
  Body,
  Mouse,
  MouseConstraint,
  Events,
} from "matter-js";
import {
  createMatterWorld,
  createWalls,
  spawnBigBeer,
  spawnSmallBeer,
  applyRandomForce,
} from "@/utils/physics";
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
  const beerBodiesMap = useRef<Map<string, Beer>>(new Map());

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

    if (render.canvas) {
      // Create mouse controller
      const mouse = Mouse.create(render.canvas);

      // Fix for high DPI displays
      mouse.pixelRatio = window.devicePixelRatio;

      const mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
          stiffness: 0.2,
          length: 0.1,
          render: {
            visible: false, // Set to true if you want to see the constraint
          },
        },
      });

      // Add throwing behavior when drag ends
      Events.on(mouseConstraint, "enddrag", (event: any) => {
        const body = event.body;

        if (body && body.label.startsWith("beer-")) {
          const beerId = body.label.replace("beer-", "");
          console.log(`Throwing beer: ${beerId}`);

          // Apply additional velocity for throwing effect
          Body.setVelocity(body, {
            x: body.velocity.x * 1, // Amplify current velocity
            y: body.velocity.y * 1,
          });

          // Add some spin
          Body.setAngularVelocity(body, body.angularVelocity * 1.2);
        }
      });

      // Add mouse constraint to world
      World.add(engine.world, mouseConstraint);
    }

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
    if (!engineRef.current || !sceneRef.current || !beer._id) return;

    // Skip if we've already spawned this beer
    if (spawnedBeerIdsRef.current.has(beer._id)) {
      return;
    }

    // Get container width for random x position
    const width = sceneRef.current.clientWidth;

    // Choose starting position
    const x = Math.random() * (width - 100) + 50;
    const y = -40;

    // Determine beer size
    const isSmallBeer = beer.volume === "0.33";

    // Spawn beer body
    const beerBody = isSmallBeer
      ? spawnSmallBeer(x, y, width, `beer-${beer._id}`)
      : spawnBigBeer(x, y, width, `beer-${beer._id}`);

    // Apply random force and spin
    applyRandomForce(beerBody);

    // Add to world
    World.add(engineRef.current.world, beerBody);

    spawnedBeerIdsRef.current.add(beer._id);
    beerBodiesMap.current.set(beer._id, beer);
  };

  // Auto-spawn beers at intervals
  useEffect(() => {
    const interval = setInterval(() => {
      if (beers.length > 0) {
        const beer = beers[Math.floor(Math.random() * beers.length)];
        spawnBeer(beer);
      }
    }, autoSpawnInterval);

    return () => clearInterval(interval);
  }, [beers, autoSpawnInterval]);

  return <div ref={sceneRef} className="w-full h-full absolute top-0 z-0" />;
}
