import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Modal } from "@sikt/sds-modal";
import "@sikt/sds-modal/dist/index.css";
import { app } from "../firebase";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
} from "firebase/firestore";

interface BeerLog {
  name: string;
  timestamp: string;
}

export default function Log() {
  const [showModal, setShowModal] = useState(false);
  const [values, setValues] = useState<BeerLog[]>([]);
  const [name, setName] = useState("");

  const db = getFirestore(app);

  // Function to add data to Firestore
  async function addData() {
    try {
      const docRef = await addDoc(collection(db, "beers"), {
        name: name
          .toLowerCase()
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
          .trim(),
        timestamp: new Date().toLocaleString(),
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  // Listening for Firestore updates and setting values to state
  useEffect(() => {
    AOS.init({ duration: 2000 });

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
      const audio = new Audio("/assets/open-beer-sound.mp3");
      audio.play();
    });

    return () => unsubscribe();
  }, [db]);

  const saveIsbjorn = () => {
    if (!name) {
      alert("Please fill out all fields");
      return;
    }
    addData();

    setName("");
    setShowModal(false);
  };

  return (
    <div id="scrolltarget">
      {/* Modal Component */}
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
        <input
          type="text"
          placeholder="Navn"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="px-4 py-2  mr-4 border rounded w-full md:w-auto"
        />
        <button
          onClick={saveIsbjorn}
          className="px-4 py-2 bg-blue-500 text-white rounded w-full md:w-auto"
        >
          Legg til
        </button>
      </Modal>

      {/* Main Content */}
      <div
        data-aos="fade-in"
        data-aos-duration="600"
        className="relative w-screen h-screen p-4"
      >
        <div className="flex flex-col gap-4 px-4 md:px-72 justify-center absolute top-0 bottom-0 left-0 right-0 overflow-y-auto pt-16">
          {values.map((value, index) => (
            <div
              className="flex flex-col md:flex-row items-center p-4 bg-gray-800 border border-gray-700 rounded-lg shadow-lg"
              key={index}
            >
              <img
                src="https://www.mack.no/img/_productMedium/isbjorn-lite-fisheye-label.png"
                alt="Isbjorn"
                className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-gray-600"
              />
              <div className="ml-4 text-white text-center md:text-left">
                <p className="font-semibold text-blue-400 text-2xl">
                  {value.name}
                </p>
                <p className="text-white  text-xl">{value.timestamp}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Button to Open Modal */}
        <button
          className="absolute z-20 top-4 right-4 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => setShowModal(!showModal)}
        >
          Registrer ny isbjørn
        </button>
      </div>
    </div>
  );
}
