import { Engine, Render, Bodies, Body } from "matter-js";

// Add this near the top of your file for image caching
let beerImage: HTMLImageElement | null = null;

// Preload the beer image
if (typeof window !== "undefined") {
  beerImage = new Image();
  beerImage.src = "/assets/isbjorn2.png"; // Update this path to your image
}

/**
 * Creates and configures a Matter.js engine and renderer
 */
export const createMatterWorld = (
  element: HTMLElement,
  width: number,
  height: number
) => {
  // Create engine
  const engine = Engine.create({
    positionIterations: 8,
    velocityIterations: 6,
  });
  engine.gravity.y = 1; // Set gravity

  // Create renderer
  const render = Render.create({
    element,
    engine,
    options: {
      width: width,
      height: height,
      wireframes: false,
      background: "#0a111c",
      pixelRatio: window.devicePixelRatio,
    },
  });

  return { engine, render };
};

/**
 * Creates walls for the physics world
 */
export const createWalls = (width: number, height: number) => {
  return [
    // Ground
    Bodies.rectangle(width / 2, height + 25, width, 50, {
      isStatic: true,
      render: { fillStyle: "#2c2c2c" },
      label: "ground",
    }),
    // Left wall
    Bodies.rectangle(0 - 25, height / 2, 50, height, {
      isStatic: true,
      render: { fillStyle: "#2c2c2c" },
      label: "leftWall",
    }),
    // Right wall
    Bodies.rectangle(width + 25, height / 2, 50, height, {
      isStatic: true,
      render: { fillStyle: "#2c2c2c" },
      label: "rightWall",
    }),
  ];
};

/**
 * Creates a beer bottle physics object
 */
export const createBeer = (x: number, y: number, width: number, label: string) => {
  const scale = getBeerScale(width); // Scale factor for the beer bottle
  const beerSize = { width: 30 * scale, height: 80 * scale }; // Size of the beer bottle

  if (!beerSize) {
    throw new Error("Invalid beer size");
  }

  const spriteScale = 0.1 * scale; // Scale factor for the sprite

  return Bodies.rectangle(x, y, beerSize.width, beerSize.height, {
    restitution: 0.2, // Bounciness
    render: {
      fillStyle: "#fff",
      sprite: beerImage
        ? {
            texture: beerImage.src,
            xScale: spriteScale,
            yScale: spriteScale,
          }
        : undefined,
    },
    friction: 0.08,
    chamfer: { radius: 4 }, // Rounded edges
    label: label,
  });
};

/**
 * Apply random force and spin to an object
 */
export const applyRandomForce = (body: Matter.Body) => {
  // Add some spin
  Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.2);

  // Apply a more reasonable initial velocity
  // CHANGE THIS - reduced upward force
  Body.setVelocity(body, {
    x: (Math.random() - 0.5) * 3, // Smaller horizontal component
    y: 0, // Start with zero vertical velocity to see gravity effect
  });
};

const getBeerScale = (width: number) => {
  if (width <= 800) {
    return 0.8;
  } else {
    return 1;
  }
};
