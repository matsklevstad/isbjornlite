import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Modal } from "@sikt/sds-modal"; // Assuming you're using this modal component
import "@sikt/sds-modal/dist/index.css"; // Modal styles
import { app, analytics } from "../firebase"; // adjust path as necessary
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
} from "firebase/firestore";

export default function Log() {
  const [showModal, setShowModal] = useState(false);
  const [values, setValues] = useState([]);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");

  const db = getFirestore(app);

  // Function to add data to Firestore
  async function addData() {
    try {
      const docRef = await addDoc(collection(db, "beers"), {
        name: name,
        location: location,
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
    if (analytics) {
      console.log("Firebase analytics initialized", analytics);
    }


    // Listen for real-time updates from Firestore
    const unsubscribe = onSnapshot(collection(db, "beers"), (snapshot) => {
      const newValues = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setValues(newValues);
    });

    // Cleanup the listener on unmount
    return () => unsubscribe();
  }, [db]);

  // Function to save a new Isbjorn entry
  const saveIsbjorn = () => {
    if (!name || !location) {
      alert("Please fill out all fields");
      return;
    }
    addData();

    const audio = new Audio("/assets/open-beer-sound.mp3");
    audio.play();

    // Reset form and close modal
    setName("");
    setLocation("");
    setShowModal(false);
  };

  return (
    <div>
      {/* Modal Component */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        heading={"Registerer en ny isbjørn!"}
        ariaHideApp={false}
        footer={
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Navn"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="px-4 py-2 mb-2 border rounded w-full md:w-auto"
            />
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="px-4 py-2 mb-2 border rounded w-full md:w-auto"
            />
            <button
              onClick={saveIsbjorn}
              className="px-4 py-2 bg-blue-500 text-white rounded w-full md:w-auto"
            >
              Legg til
            </button>
          </div>
        }
      >
        <p>
          Jeg bekrefter at jeg har på ærlig og redlig vis konsumert en isbjørn.
        </p>
      </Modal>

      {/* Main Content */}
      <div
        data-aos="fade-in"
        data-aos-duration="600"
        className="w-screen h-screen z-10 flex flex-col p-4"
      >
        <div className="flex flex-col gap-4 px-4 mt-72 md:px-72 justify-center fixed bottom-4 left-0 right-0 overflow-y-auto max-h-screen">
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
                <p className="font-semibold">{value.name}</p>
                <p className="text-gray-400">{value.timestamp}</p>
                <p className="text-gray-400">{value.location}</p>
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
