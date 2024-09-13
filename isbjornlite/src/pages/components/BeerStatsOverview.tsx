import React from "react";
import BeerLogChart from "./BeerChart";
import BeerLogPie from "./BeerPie";

interface BeerLog {
  name: string;
  timestamp: string;
}

interface BeerLogStatsProps {
  beers: BeerLog[];
}

const BeerLogStats: React.FC<BeerLogStatsProps> = ({ beers }) => {
  if (beers === undefined) {
    return null;
  }

  return (
    <div className="flex flex-col justify-center items-center  gap-8 md:w-1/3">
      <BeerLogChart beers={beers} />
      <BeerLogPie beers={beers} />
    </div>
  );
};

export default BeerLogStats;
