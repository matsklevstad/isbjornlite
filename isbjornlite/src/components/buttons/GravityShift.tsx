import { arraysEqual } from "@/utils/arrayUtils";
import { IconAppleFilled } from "@tabler/icons-react";
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
        className="text-black absolute z-10 left-10 bottom-10 cursor-pointer"
        >
            <Image src="/assets/gravity3.png" width={50} height={50} alt="gravity"/>
        </button>
    )
};

export default GravityShift;