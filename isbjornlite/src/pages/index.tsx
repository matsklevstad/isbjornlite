import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/cannon";
import Scene from "@/components/threejs/Scene";
import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css"; // Import the AOS CSS
import { Modal } from "@sikt/sds-modal";
import "@sikt/sds-modal/dist/index.css";

export default function Home() {
  const [showModal, setShowModal] = useState(false);

  const [values, setValues] = useState([
    {
      name: "Ola",
      timestamp: "2021-09-01 12:00",
      location: "Tromsø",
    },
    {
      name: "Mats",
      timestamp: "2021-09-01 12:00",
      location: "Tromsø",
    },
    {
      name: "Ola",
      timestamp: "2021-09-01 12:00",
      location: "Tromsø",
    },
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      AOS.init({ duration: 2000 });
    }, 5500); // 5000 milliseconds = 5 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-screen h-screen relative">
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        heading={"Registerer en ny isbjørn!"}
        ariaHideApp={false}
        footer={
          <button
            onClick={() =>
              setValues([
                ...values,
                {
                  name: "Ola",
                  timestamp: "2021-09-01 12:00",
                  location: "Tromsø",
                },
              ])
            }
            className="px-4 mt-4 py-2 bg-blue-500 text-white rounded"
          >
            Legg til
          </button>
        }
      >
        <p>
          Jeg bekrefter at jeg har på ærlig og redlig vis konsumert en isbjørn.
        </p>
      </Modal>
      <Canvas className="bg-black" frameloop="demand">
        <Physics gravity={[0, -13, 0]}>
          <Scene />
        </Physics>
      </Canvas>
      {/* Overlay above the canvas */}
      <button
        className="absolute z-20 top-4 right-4 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => setShowModal(!showModal)}
      >
        Registrer ny isbjørn
      </button>

      <div
        data-aos="fade-in"
        data-aos-duration="600"
        className="absolute w-screen h-screen top-0  w-full h-full z-10 flex flex-col  p-4"
      >
        <h1 className="text-white text-center text-5xl mb-4 font-bold">
          isbjornlite.no
        </h1>

        <div className="flex flex-row gap-4  items-center text-center mb-4">
          {values.map((value, index) => (
            <div
              className=" flex items-center p-4 bg-gray-800 border border-gray-700 rounded-lg shadow-lg mb-4"
              key={index}
            >
              <img
                src="https://www.mack.no/img/_productMedium/isbjorn-lite-fisheye-label.png"
                alt="Isbjorn"
                className="w-20 h-20 rounded-full border border-gray-600"
              />
              <div className="ml-4 text-white">
                <p className="font-semibold">{value.name}</p>
                <p className="text-gray-400">{value.timestamp}</p>
                <p className="text-gray-400">{value.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
