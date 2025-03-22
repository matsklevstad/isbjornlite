import React, { useRef, useEffect } from "react";
import BeerLogItem from "./BeerItem";

interface BeerLog {
  name: string;
  timestamp: string;
}

interface BeerLogListProps {
  beers: BeerLog[];
  fetchMoreBeers: () => void;
  isEnd: boolean;
}

const BeerLogList: React.FC<BeerLogListProps> = ({
  beers = [],
  fetchMoreBeers,
  isEnd,
}) => {
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (logContainerRef.current && !isEnd) {
        const { scrollTop, scrollHeight, clientHeight } =
          logContainerRef.current;
        if (scrollTop + clientHeight >= scrollHeight - 10) {
          fetchMoreBeers(); // Fetch more beers when scrolled to the bottom
        }
      }
    };

    const container = logContainerRef.current;
    container?.addEventListener("scroll", handleScroll);

    return () => {
      container?.removeEventListener("scroll", handleScroll);
    };
  }, [logContainerRef, fetchMoreBeers, isEnd]);

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-2 text-center">isbjornlite.live</h2>

      <div
        ref={logContainerRef}
        className="flex flex-col gap-4 md:gap-8 p-4 md:px-16 h-[65vh] overflow-y-auto"
      >
        {beers.length > 0 ? (
          beers.map((value: BeerLog, index: number) => (
            <BeerLogItem key={index} value={value} />
          ))
        ) : (
          <div>Ingen bjønnunger loggført</div>
        )}
        <button
          className="px-4 py-2 mb-8 text-white bg-blue-400 text-2xl md:text-3xl rounded"
          onClick={() => fetchMoreBeers()}
        >
          Hent flere isbjørn!
        </button>
      </div>
    </div>
  );
};

export default BeerLogList;
