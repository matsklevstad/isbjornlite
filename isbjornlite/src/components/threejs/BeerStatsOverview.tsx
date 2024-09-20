import React from "react";

//import BeerLogPie from "../BeerPie";
import BeerLogChart from "../BeerChart";

/*interface BeerLog {
  name: string;
  timestamp: string;
}*/

interface BeerStatsOverviewProps {
  //beers: BeerLog[];
  weekDayStats: any;
}

const BeerStatsOverview: React.FC<BeerStatsOverviewProps> = ({ weekDayStats }) => {
  if (weekDayStats === undefined) {
    return null;
  }

  return (
    <div className="flex flex-col justify-center items-center  gap-8 md:w-1/3">
      <BeerLogChart  weekDayStats={weekDayStats} />
      {/* <BeerLogPie beers={beers} /> */}
    </div>
  );
};

export default BeerStatsOverview;
