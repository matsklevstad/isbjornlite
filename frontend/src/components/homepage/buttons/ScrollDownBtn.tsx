import { IconCircleArrowDownFilled } from "@tabler/icons-react";
import { motion } from "framer-motion";

interface ScrollDownBtnProps {
  targetId: string;
}

const ScrollDownBtn = ({ targetId }: ScrollDownBtnProps) => {
  const scrollToElement = () => {
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div className="absolute w-full flex justify-center bottom-6 z-10 pointer-events-none">
      <motion.div
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-auto">
        <button
          onClick={scrollToElement}
          className="text-white rounded-full shadow-lg transition duration-300 opacity-80 ">
          <IconCircleArrowDownFilled size={38} />
        </button>
      </motion.div>
    </div>
  );
};

export default ScrollDownBtn;
