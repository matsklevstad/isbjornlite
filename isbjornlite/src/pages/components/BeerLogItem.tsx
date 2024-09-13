import React from "react";
import Image from "next/image";
import { format } from "date-fns";
import { nb } from "date-fns/locale";

interface BeerLog {
  name: string;
  timestamp: string;
}

interface BeerLogItemProps {
  value: BeerLog;
}

const BeerLogItem: React.FC<BeerLogItemProps> = ({ value }) => {

  if (!value) {
    return null;
  }

  return (
    <div className="flex flex-row items-center p-4 bg-gray-800 border border-gray-700 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105">
      <div>
        <Image
          src="/assets/isbjorn-lite-logo.png"
          alt="Isbjorn"
          width={80}
          height={80}
          className="rounded-full border border-gray-600"
        />
      </div>
      <div className="ml-4 text-white text-center md:text-left">
        <p className="font-semibold text-blue-400 text-2xl">
          {value.name || ""}
        </p>
        <p className="text-white text-xl">
          {format(new Date(value.timestamp), "EEEE, dd. MMMM HH:mm", {
            locale: nb,
          })}
        </p>
      </div>
    </div>
  );
};

export default BeerLogItem;
