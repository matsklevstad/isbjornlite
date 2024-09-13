import React, { useState, useEffect } from "react";
import { getFirestore, collection, onSnapshot } from "firebase/firestore";
import { app } from "../firebase";
import BeerLogModal from "../pages/components/BeerLogModal";
import BeerLogList from "../pages/components/BeerLogList";

interface BeerLog {
  name: string;
  timestamp: string;
}

export default function Log() {
  const [showModal, setShowModal] = useState(false);
  const [values, setValues] = useState<BeerLog[]>([]);

  const db = getFirestore(app);

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      // Load mock data in development
      const newValues: BeerLog[] = [
        { name: "Mats ", timestamp: "2023-10-01T12:00:00Z" },
        { name: "Ola Johannes Elvedahl", timestamp: "2023-10-02T12:00:00Z" },
        { name: "Martin Ødegaard", timestamp: "2023-10-03T12:00:00Z" },
      ];

      setValues(newValues);
    } else {
      // Listen to Firestore changes in production
      const unsubscribe = onSnapshot(collection(db, "beers"), (snapshot) => {
        const newValues: BeerLog[] = snapshot.docs.map((doc) => ({
          ...(doc.data() as BeerLog),
          id: doc.id,
        }));

        newValues.sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );

        setValues(newValues);
      });

      // Cleanup subscription on unmount
      return () => unsubscribe();
    }
  }, [db]);

  return (
    <div>
      <BeerLogModal showModal={showModal} setShowModal={setShowModal} />

      <div className="w-screen h-screen bg-blue-400 p-4">
        <button
          className="px-4 py-2 bg-white text-2xl md:text-3xl text-blue-400 rounded"
          onClick={() => setShowModal(!showModal)}
        >
          Registrer ny isbjørn
        </button>

        <BeerLogList values={values} />
      </div>
    </div>
  );
}
