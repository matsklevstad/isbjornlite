// src/utils/physics/matterAssets.ts

// Image caching
let beerImage: HTMLImageElement | null = null;
let smallBeerImage: HTMLImageElement | null = null;

// Preload images
if (typeof window !== "undefined") {
  beerImage = new Image();
  beerImage.src = "/assets/beerImages/isbjorn_big.png";
  beerImage.onload = () => console.log("Big beer image loaded");
  beerImage.onerror = (e) => console.error("Failed to load big beer image", e);

  smallBeerImage = new Image();
  smallBeerImage.src = "/assets/beerImages/isbjorn_small.png";
  smallBeerImage.onload = () => console.log("Small beer image loaded");
  smallBeerImage.onerror = (e) => console.error("Failed to load small beer image", e);
}

// Scale utility
export const getBeerScale = (width: number) => {
  return width <= 800 ? 0.8 : 1;
};

export { beerImage, smallBeerImage };