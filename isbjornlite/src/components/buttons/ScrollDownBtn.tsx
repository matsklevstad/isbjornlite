import { IconCircleArrowDownFilled } from "@tabler/icons-react";

const ScrollDownBtn = () => {
  const handleScroll = () => {
    const nextSection = document.getElementById("scrolltarget");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    } else {
      console.error("No next section found");
    }
  };

  return (
      <button onClick={handleScroll} className="absolute right-10 z-10 bottom-10 opacity-75">
        <IconCircleArrowDownFilled size={40} color="#ffffff" />
      </button>
  );
};

export default ScrollDownBtn;
