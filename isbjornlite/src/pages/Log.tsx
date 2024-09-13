import React, { useState, useEffect } from "react";
import { getFirestore, collection, onSnapshot } from "firebase/firestore";
import { app } from "../firebase";
import BeerLogModal from "../pages/components/BeerLogModal";
import BeerLogList from "../pages/components/BeerLogList";
import BeerLogStats from "../pages/components/BeerLogStats";

interface BeerLog {
  name: string;
  timestamp: string;
}

export default function Log() {
  const [showModal, setShowModal] = useState(false);
  const [beers, setBeers] = useState<BeerLog[]>([]);

  const db = getFirestore(app);

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      // Load mock data in development
      const devBeers: BeerLog[] = [
        { name: "Mats", timestamp: "2023-10-01T12:00:00Z" },
        { name: "Ola Johannes Elvedahl", timestamp: "2023-10-02T12:00:00Z" },
        { name: "Martin Ødegaard", timestamp: "2023-10-03T12:00:00Z" },
        { name: "Kari Nordmann", timestamp: "2023-10-04T12:00:00Z" },
        { name: "Per Hansen", timestamp: "2023-10-05T12:00:00Z" },
        { name: "Lise Lotte", timestamp: "2023-10-06T12:00:00Z" },
        { name: "Nils", timestamp: "2023-10-07T12:00:00Z" },
        { name: "Anne", timestamp: "2023-10-08T12:00:00Z" },
        { name: "Bjørn", timestamp: "2023-10-09T12:00:00Z" },
        { name: "Sofie", timestamp: "2023-10-10T12:00:00Z" },
      ];

      setBeers(devBeers);
    } else {
      // Listen to Firestore changes in production
      const unsubscribe = onSnapshot(collection(db, "beers"), (snapshot) => {
        const updatedBeers: BeerLog[] = snapshot.docs.map((doc) => ({
          ...(doc.data() as BeerLog),
          id: doc.id,
        }));

        updatedBeers.sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );

        setBeers(updatedBeers);
      });

      // Cleanup subscription on unmount
      return () => unsubscribe();
    }
  }, [db]);

  return (
    <div id="scrolltarget">
      <BeerLogModal showModal={showModal} setShowModal={setShowModal} />

      <div className="w-screen h-screen p-4">
        <button
          className="px-4 py-2 mb-8 bg-white text-2xl md:text-3xl text-blue-400 border-2 border-blue-400 rounded"
          onClick={() => setShowModal(!showModal)}
        >
          Registrer ny isbjørn
        </button>
        {beers.length > 0 ? (
          <div className="flex flex-col md:px-16 gap-12 md:flex-row justify-center md:space-x-48">
            <BeerLogStats beers={beers} />
            <BeerLogList beers={beers} />
          </div>
        ) : (
          <div>Tomt for isbjorn...</div>
        )}
      </div>
    </div>
  );
}
