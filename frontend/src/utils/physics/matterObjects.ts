// src/utils/physics/matterObjects.ts
import { Bodies, Body } from "matter-js";
import { beerImage, smallBeerImage, getBeerScale } from "./matterAssets";

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
    Bodies.rectangle(-25, height / 2, 50, height * 2, {
      isStatic: true,
      render: { fillStyle: "#2c2c2c" },
      label: "leftWall",
    }),
    // Right wall
    Bodies.rectangle(width + 25, height / 2, 50, height * 2, {
      isStatic: true,
      render: { fillStyle: "#2c2c2c" },
      label: "rightWall",
    }),
  ];
};

/**
 * Creates a beer bottle physics object
 */
export const spawnBigBeer = (
  x: number,
  y: number,
  width: number,
  label: string
) => {
  const scale = getBeerScale(width);
  const beerSize = { width: 30 * scale, height: 80 * scale };
  const spriteScale = 0.1 * scale;

  return Bodies.rectangle(x, y, beerSize.width, beerSize.height, {
    restitution: 0.2,
    render: {
      fillStyle: "#fff", // Fallback color
      sprite: beerImage
        ? ({
            texture: beerImage.src,
            xScale: spriteScale,
            yScale: spriteScale,
            xOffset: 0.01,
            yOffset: 0.01,
          } as any)
        : undefined,
    },
    friction: 0.08,
    chamfer: { radius: [7, 7, 5, 5] },
    label: label,
  });
};

export const spawnSmallBeer = (
  x: number,
  y: number,
  screenWidth: number,
  label: string
) => {
  const scale = getBeerScale(screenWidth);
  const beerSize = { width: 30 * scale, height: 50 * scale };
  const spriteScale = 0.1 * scale;

  return Bodies.rectangle(x, y, beerSize.width, beerSize.height, {
    restitution: 0.2,
    render: {
      fillStyle: "#fff", // Fallback color
      sprite: smallBeerImage
        ? ({
            texture: smallBeerImage.src,
            xScale: spriteScale,
            yScale: spriteScale,
            xOffset: 0.01,
            yOffset: 0.01,
          } as any)
        : undefined,
    },
    friction: 0.08,
    chamfer: { radius: [7, 7, 5, 5] },
    label: label,
  });
};

/**
 * Apply random force and spin to an object
 */
export const applyRandomForce = (body: Matter.Body) => {
  Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.2);
  Body.setVelocity(body, {
    x: (Math.random() - 0.5) * 3,
    y: 0,
  });
};
