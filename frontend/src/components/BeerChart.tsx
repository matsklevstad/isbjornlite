import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

interface BeerLogChartProps {
  weekDayStats: number[]; // Array with beer count per weekday, [0,0,0,0,0,1,0] format
}

const BeerLogChart: React.FC<BeerLogChartProps> = ({ weekDayStats }) => {
  if (!weekDayStats || weekDayStats.length !== 7) {
    return null; // Ensure the array has 7 elements (one for each weekday)
  }

  // Define weekday names in the desired order
  const weekdayOrder = ["S", "M", "T", "O", "T", "F", "L"];

  // Convert weekDayStats array into the format required by Recharts
  const chartData = weekDayStats.map((count, index) => ({
    weekday: weekdayOrder[index], // Map index to weekday name
    count, // Beer count for that weekday
  }));

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Når knekkes isbjørnene?</h2>
      <BarChart width={300} height={300} data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="weekday" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="#8884d8" />
      </BarChart>
    </div>
  );
};

export default BeerLogChart;
