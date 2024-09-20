import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  query,
  limit,
  startAfter,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { app } from "../../../firebase";
import BeerLogModal from "@/components/AddBeerModal";
import BeerLogList from "@/components/BeerList";
//import BeerStatsOverview from "../BeerStatsOverview";

interface BeerLog {
  name: string;
  timestamp: string;
}

export default function IsbjornLive() {
  const [showModal, setShowModal] = useState(false);
  const [beers, setBeers] = useState<BeerLog[]>([]);
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
  const itemsPerPage = 5;

  const db = getFirestore(app);

  const fetchBeers = (loadMore = false) => {
    if (loading || isEnd) return; // Prevent duplicate calls if already loading or at the end
    setLoading(true);
    let beersQuery = query(
      collection(db, "beers"),
      orderBy("timestamp", "desc"),
      limit(itemsPerPage)
    );

    if (loadMore && lastVisible) {
      beersQuery = query(beersQuery, startAfter(lastVisible));
    }

    const unsubscribe = onSnapshot(beersQuery, (snapshot) => {
      if (!snapshot.empty) {
        const fetchedBeers: BeerLog[] = snapshot.docs.map((doc) => ({
          ...(doc.data() as BeerLog),
          id: doc.id,
        }));
        const lastDoc = snapshot.docs[snapshot.docs.length - 1];
        setLastVisible(lastDoc);
        setBeers((prevBeers) =>
          loadMore ? [...prevBeers, ...fetchedBeers] : fetchedBeers
        );
      } else {
        setIsEnd(true);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  };

  useEffect(() => {
    fetchBeers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <BeerLogModal showModal={showModal} setShowModal={setShowModal} />
      <div className="w-screen h-screen p-4">
        <div className="flex justify-center">
          <button
            className="px-4 py-2 mb-8 text-white bg-blue-400 text-2xl md:text-3xl rounded"
            onClick={() => setShowModal(!showModal)}
          >
            Registrer ny isbjørn
          </button>
        </div>
        {beers.length > 0 ? (
          <div className="flex flex-col md:px-16 gap-12 md:flex-row justify-center md:space-x-48">
            {/*             <BeerStatsOverview beers={beers} />
             */}{" "}
            <BeerLogList
              beers={beers}
              fetchMoreBeers={() => fetchBeers(true)}
              isEnd={isEnd}
            />
          </div>
        ) : (
          <div>Tomt for isbjorn...</div>
        )}
      </div>
    </div>
  );
}
