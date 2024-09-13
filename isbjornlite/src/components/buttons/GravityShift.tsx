import { arraysEqual } from "@/utils/arrayUtils";
import Image from "next/image";

interface GravityShiftProps {
    gravity: [number, number, number];
    setGravity: React.Dispatch<React.SetStateAction<[number, number, number]>>;
    normalGravity: [number, number, number];
    noGravity: [number, number, number];
}

const GravityShift = ({gravity, setGravity, normalGravity, noGravity}: GravityShiftProps) => {

    const handleClick = () => {
        if(arraysEqual(gravity, normalGravity)) {
            setGravity(noGravity);
        } else {
            setGravity(normalGravity);
        }
    };

    return (
        <button 
            onClick={handleClick} 
            className={`absolute z-10 left-10 bottom-10 cursor-pointer 
                        ${arraysEqual(gravity, noGravity) ? 'opacity-100' : 'opacity-100'} 
                        hover:opacity-75 transition-opacity duration-200`}
        >
            {arraysEqual(gravity, normalGravity) ? 
            <Image src="/assets/astronaut2.png" width={45} height={45} alt="gravity"/> :
            <Image src="/assets/astronaut.png" width={45} height={45} alt="gravity"/>
            }
        </button>
    )
};

export default GravityShift;