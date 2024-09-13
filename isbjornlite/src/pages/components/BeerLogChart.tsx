import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

interface BeerLog {
  name: string;
  timestamp: string;
}

interface BeerLogChartProps {
  beers: BeerLog[];
}

const BeerLogChart: React.FC<BeerLogChartProps> = ({ beers }) => {
  if (beers === undefined) {
    return null;
  }
  // Helper function to get weekday name from date
  const getWeekdayName = (date: Date) => {
    const days = ["S", "M", "T", "O", "T", "F", "L"];
    return days[date.getDay()];
  };

  // Map the beers to weekday data
  const beersPerWeekday = beers.reduce((acc: Record<string, number>, beer) => {
    const weekdayName = getWeekdayName(new Date(beer.timestamp));
    acc[weekdayName] = (acc[weekdayName] || 0) + 1;
    return acc;
  }, {});

  // Convert weekday data to array format for Recharts
  const chartData = Object.keys(beersPerWeekday).map((weekday) => ({
    weekday,
    count: beersPerWeekday[weekday],
  }));

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Når knekkes isbjørnene?</h2>
      <BarChart width={300} height={200} data={chartData}>
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
