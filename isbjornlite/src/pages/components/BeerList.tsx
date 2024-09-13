import React, { useRef } from "react";
import BeerLogItem from "./BeerItem";
//import AOS from "aos";
//import "aos/dist/aos.css"; // Import the AOS CSS

interface BeerLog {
  name: string;
  timestamp: string;
}

interface BeerLogListProps {
  beers: BeerLog[];
}

const BeerLogList: React.FC<BeerLogListProps> = ({ beers = [] }) => {
  const logContainerRef = useRef<HTMLDivElement>(null);

  /*useEffect(() => {
    AOS.init({ once: true });
  }, []);*/

  return (
    <div
      ref={logContainerRef}
      /*  data-aos="fade-up"
      data-aos-duration="1000"
      data-aos-delay="200" */
      className="w-full"
    >
      <h2 className="text-xl font-bold mb-2 text-left">isbjornlite.live</h2>

      <div className="flex  flex-col gap-4 md:gap-8  p-4 md:px-16 h-[60vh] overflow-y-auto">
        {beers.length > 0 ? (
          beers.map((value: BeerLog, index: number) => (
            <BeerLogItem key={index} value={value} />
          ))
        ) : (
          <div>Ingen bjønnunger loggført</div>
        )}
      </div>
    </div>
  );
};

export default BeerLogList;
