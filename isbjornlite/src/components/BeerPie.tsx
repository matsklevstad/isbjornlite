import React from "react";
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface BeerLog {
  name: string;
  timestamp: string;
}

interface BeerLogPieProps {
  nameStats: any;
}

const BeerLogPie: React.FC<BeerLogPieProps> = ({ nameStats }) => {
  if (nameStats === undefined) {
    return null;
  }

  // Convert aggregated data to array format for Recharts
  const pieChartData = Object.keys(nameStats)
    .filter((person) => nameStats[person] > 3)
    .map((person) => ({
      name: person,
      value: nameStats[person],
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
      <p>Må ha drukket minst 3</p>
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
