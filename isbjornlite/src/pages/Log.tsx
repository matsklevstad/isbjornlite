import React, { useState, useEffect, useRef } from "react";
import { Modal } from "@sikt/sds-modal";
import "@sikt/sds-modal/dist/index.css";
import { app } from "../firebase";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
} from "firebase/firestore";
import Image from "next/image";
import { format } from "date-fns";
import { nb } from "date-fns/locale";

interface BeerLog {
  name: string;
  timestamp: string;
}

export default function Log() {
  const [showModal, setShowModal] = useState(false);
  const [values, setValues] = useState<BeerLog[]>([]);
  const [name, setName] = useState("");
  const logContainerRef = useRef<HTMLDivElement>(null); // Reference to log container

  const db = getFirestore(app);

  async function saveIsbjorn() {
    if (!name || name.trim() === "") {
      alert("Fyll ut navn!");
      return;
    }

    if (name.length > 20) {
      alert("Navnet kan ikke være lengre enn 20 tegn!");
      return;
    }
    try {
      const docRef = await addDoc(collection(db, "beers"), {
        name: name
          .toLowerCase()
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
          .trim(),
        timestamp: new Date().toISOString(), // Store timestamp in ISO format
      });
      console.log("Document written with ID: ", docRef.id);
      setName("");
      setShowModal(false);
      const audio = new Audio("/assets/open-beer-sound.mp3");
      audio.play();
      if (logContainerRef.current) {
        logContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (e) {
      alert("Error adding isbjørn :(");
    }
  }

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "beers"), (snapshot) => {
      const newValues: BeerLog[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as BeerLog),
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
      {/* MODAL */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        heading={"Registerer en ny isbjørn!"}
        ariaHideApp={false}
        footer={false}
      >
        <p className="italic">
          Jeg bekrefter at jeg har på ærlig og redlig vis konsumert en
          bjønnunge.
          <br />
          <br />
        </p>
        <div className="flex flex-col md:flex-row gap-4 ">
          <input
            type="text"
            placeholder="Navn"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-4 py-2 border rounded w-full md:w-1/2"
          />
          <button
            onClick={saveIsbjorn}
            className="px-4 py-2 bg-blue-500 text-white rounded w-full md:w-1/4"
          >
            Legg til
          </button>
        </div>
      </Modal>

      {/* MAIN CONTENT */}
      <div className="w-screen h-screen bg-blue-400 p-4">
        <button
          className="z-20 top-4 right-4 px-4 py-2 bg-white text-black rounded"
          onClick={() => setShowModal(!showModal)}
        >
          Registrer ny isbjørn
        </button>

        {/* Container with scrollable log */}
        <div
          ref={logContainerRef}
          className="flex flex-col gap-4 md:gap-8 md:w-[60vw] px-4 md:px-72  overflow-y-auto h-[80vh] pt-16 mt-4"
        >
          {values.map((value, index) => (
            <div
              className="flex flex-row items-center p-4 bg-gray-800 border border-gray-700 rounded-lg shadow-lg"
              key={index}
            >
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
                  {value.name}
                </p>
                <p className="text-white text-xl">
                  {format(new Date(value.timestamp), "EEEE, dd. MMMM HH:mm", {
                    locale: nb,
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
