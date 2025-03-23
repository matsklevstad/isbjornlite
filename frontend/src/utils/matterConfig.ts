import { Engine, Render, Bodies, Body } from "matter-js";

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
export const createBeer = (x: number, y: number, width: number) => {
  const beerSize = getBeerSize(width);

  if (!beerSize) {
    throw new Error("Invalid beer size");
  }

  return Bodies.rectangle(x, y, beerSize.width, beerSize.height, {
    restitution: 0.2, // Bounciness
    render: {
      fillStyle: "#fff",
    },
    friction: 0.08,
    chamfer: { radius: 4 }, // Rounded edges
    label: "beer",
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

const getBeerSize = (width: number) => {
  const baseWidth = 30; // Base width of the beer bottle
  const baseHeight = 80; // Base height of the beer bottle

  if (width <= 800) {
    return { width: baseWidth * 0.8, height: baseHeight * 0.8 };
  } else {
    return { width: baseWidth, height: baseHeight };
  }
};
