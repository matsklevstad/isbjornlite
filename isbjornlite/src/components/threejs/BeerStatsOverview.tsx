import React from "react";

import BeerLogPie from "../BeerPie";
import BeerLogChart from "../BeerChart";

/*interface BeerLog {
  name: string;
  timestamp: string;
}*/

interface BeerStatsOverviewProps {
  //beers: BeerLog[];
  weekDayStats: any;
  nameStats: any;
}

const BeerStatsOverview: React.FC<BeerStatsOverviewProps> = ({
  weekDayStats,
  nameStats,
}) => {
  if (weekDayStats === undefined || nameStats === undefined) {
    return null;
  }

  return (
    <div className="flex flex-col justify-center items-center  gap-8 md:w-1/3">
      <BeerLogChart weekDayStats={weekDayStats} />
      <BeerLogPie nameStats={nameStats} />
    </div>
  );
};

export default BeerStatsOverview;
