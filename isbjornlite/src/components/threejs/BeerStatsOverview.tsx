import React from "react";

import BeerLogPie from "../BeerPie";
import BeerLogChart from "../BeerChart";

interface BeerLog {
  name: string;
  timestamp: string;
}

interface BeerStatsOverviewProps {
  beers: BeerLog[];
}

const BeerStatsOverview: React.FC<BeerStatsOverviewProps> = ({ beers }) => {
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

export default BeerStatsOverview;
