import React from "react";
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from "recharts";

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

  // List of colors for the pie chart slices
  const colors = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff8042",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#0088FE",
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
  ];

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
            label
          >
            {pieChartData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BeerLogPie;
