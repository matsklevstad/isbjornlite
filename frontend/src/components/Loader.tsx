import { motion, useSpring, useTransform, animate } from "framer-motion";
import Image from "next/image";
import { useEffect } from "react";

export default function Loader({
  loadingProgass = 0,
}: {
  loadingProgass?: number;
}) {
  // Create a spring-based animation value that follows loadingProgass
  const smoothProgress = useSpring(0, {
    stiffness: 30, // Lower value = more gentle movement
    damping: 15, // Higher value = less bouncy
    mass: 1, // The "weight" of the animated value
  });

  // Update the spring value when loadingProgass changes
  useEffect(() => {
    animate(smoothProgress, loadingProgass);
  }, [loadingProgass, smoothProgress]);

  // Transform the spring value to a percentage width string
  const width = useTransform(smoothProgress, (value) => `${value}%`);

  return (
    <div className="flex w-screen flex-col justify-center items-center h-screen bg-[#07090a]">
      <h1 className="text-white font-bold text-xl mb-10">Laster isbjørner...</h1>

      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear",
        }}
        className="mb-12">
        <Image
          src="/assets/beerImages/isbjorn_big.png"
          width={80}
          height={50}
          alt="Loading"
        />
      </motion.div>

      {/* Progress Bar */}
      <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden mt-4">
        <motion.div className="h-full bg-blue-400" style={{ width }} />
      </div>
    </div>
  );
}
