import React, { useState } from "react";
import { Modal } from "@sikt/sds-modal";
import "@sikt/sds-modal/dist/index.css";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { app } from "../../firebase";

interface BeerLogModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
}

const BeerLogModal: React.FC<BeerLogModalProps> = ({
  showModal,
  setShowModal,
}) => {
  const [name, setName] = useState("");
  const [isTermsAgreed, setisTermsAgreed] = useState(false);
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
        timestamp: new Date().toISOString(),
      });
      console.log("Document written with ID: ", docRef.id);
      setName("");
      setShowModal(false);
      setisTermsAgreed(false);
      const audio = new Audio("/assets/open-beer-sound.mp3");
      audio.play();
      document
        .querySelector("[data-log-container]")
        ?.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      alert("Error adding isbjørn :(");
    }
  }

  return (
    <Modal
      open={showModal}
      onClose={() => setShowModal(false)}
      heading={"Registerer en ny isbjørn!"}
      ariaHideApp={false}
      closeButtonLabel="Lukk"
      footer={false}
    >
      <div
        onClick={() => setisTermsAgreed(!isTermsAgreed)}
        className="flex items-center gap-4 mb-4"
      >
        <g className="text-xl italic">
          Jeg bekrefter at jeg har på ærlig og redlig vis konsumert en
          bjønnunge.
        </g>
        <input
          type="checkbox"
          className="form-checkbox h-8 w-8 text-blue-600"
          checked={isTermsAgreed}
        />
      </div>
      {isTermsAgreed && (
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Navn"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-4 text-xl py-2 border text-black rounded w-full md:w-1/2"
          />
          <button
            onClick={saveIsbjorn}
            className="px-4 text-xl py-2 bg-blue-400 text-white rounded w-full md:w-1/4"
          >
            Legg til
          </button>
        </div>
      )}
    </Modal>
  );
};

export default BeerLogModal;
