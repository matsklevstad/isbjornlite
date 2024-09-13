import React, { useEffect, useRef } from "react";
import BeerLogItem from "./BeerLogItem";
import AOS from "aos";
import "aos/dist/aos.css"; // Import the AOS CSS

interface BeerLog {
  name: string;
  timestamp: string;
}

interface BeerLogListProps {
  values: BeerLog[];
}

const BeerLogList: React.FC<BeerLogListProps> = ({ values }) => {
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <div
      ref={logContainerRef}
      data-aos="fade-up"
      data-aos-duration="1000"
      data-aos-delay="200"
      className="flex flex-col gap-4 md:gap-8 px-4 md:px-72 overflow-y-auto h-[80vh] pt-16 mt-4"
    >
      {values.map((value, index) => (
        <BeerLogItem key={index} value={value} />
      ))}
    </div>
  );
};

export default BeerLogList;
