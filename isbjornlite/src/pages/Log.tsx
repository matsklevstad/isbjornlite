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

    return () => unsubscribe();
  }, [db]);

  return (
    <div>
      <BeerLogModal showModal={showModal} setShowModal={setShowModal} />

      <div className="w-screen h-screen bg-blue-400 p-4">
        <button
          className="px-4 py-2 bg-white text-2xl md:text-3xl  text-blue-400 rounded"
          onClick={() => setShowModal(!showModal)}
        >
          Registrer ny isbjørn
        </button>

        <BeerLogList values={values} />
      </div>
    </div>
  );
}
