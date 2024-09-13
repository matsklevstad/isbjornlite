import React from "react";
import { PieChart, Pie, Tooltip, ResponsiveContainer } from "recharts";

interface BeerLog {
  name: string;
  timestamp: string;
}

interface BeerLogPieProps {
  beers: BeerLog[];
}

const BeerLogPie: React.FC<BeerLogPieProps> = ({ beers }) => {
  if (beers === undefined) {
    return null;
  }

  // Aggregate data by person
  const beersPerPerson = beers.reduce((acc: Record<string, number>, beer) => {
    const personName = beer.name;
    acc[personName] = (acc[personName] || 0) + 1;
    return acc;
  }, {});

  // Convert aggregated data to array format for Recharts
  const pieChartData = Object.keys(beersPerPerson).map((person) => ({
    name: person,
    value: beersPerPerson[person],
  }));

  return (
    <div>
      <h2 className="text-xl font-bold">Hvem knekker mest?</h2>
      <ResponsiveContainer width={250} height={250}>
        <PieChart>
          <Pie
            data={pieChartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            label
          />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BeerLogPie;
