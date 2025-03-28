// src/utils/physics/matterSetup.ts
import { Engine, Render, Events } from "matter-js";

/**
 * Creates and configures a Matter.js engine and renderer
 */
export const createMatterWorld = (
  element: HTMLElement,
  width: number,
  height: number,
  showDebugOutlines = true
) => {
  // Engine creation
  const engine = Engine.create({
    positionIterations: 8,
    velocityIterations: 6,
  });
  engine.gravity.y = 1;

  // Renderer setup
  const render = Render.create({
    element,
    engine,
    options: {
      width,
      height,
      wireframes: false,
      background: "#0a111c",
      pixelRatio: window.devicePixelRatio,
    },
  });

  // Debug outlines
  if (showDebugOutlines) {
    setupDebugOutlines(engine, render);
  }

  return { engine, render };
};

// Helper function for debug outlines
function setupDebugOutlines(engine: Matter.Engine, render: Matter.Render) {
  Events.on(render, "afterRender", function () {
    const context = render.context;
    const bodies = engine.world.bodies;

    context.beginPath();

    for (let i = 0; i < bodies.length; i++) {
      if (bodies[i].label.includes("beer")) {
        const vertices = bodies[i].vertices;
        context.moveTo(vertices[0].x, vertices[0].y);
        for (let j = 1; j < vertices.length; j++) {
          context.lineTo(vertices[j].x, vertices[j].y);
        }
        context.lineTo(vertices[0].x, vertices[0].y);
      }
    }

    context.lineWidth = 0.5;
    context.strokeStyle = "#ff0000";
    context.stroke();
  });
}