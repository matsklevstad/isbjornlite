import { useEffect, useState } from "react";


export function useControls(api: any) {
    const [controls, setControls] = useState<Controls>({
        w: false,
        a: false,
        s: false,
        d: false,
    });

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            setControls((prev) => ({
                ...prev,
                [e.key.toLowerCase()]: true,
            }));
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            setControls((prev) => ({
                ...prev,
                [e.key.toLowerCase()]: false,
            }));
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, []);

    useEffect(() => {
        if(!api) return;

        if(controls.w) {
            api.velocity.set(0 , 0, -10);
        } else if(controls.s) {
            api.velocity.set(0, 0, 10);
        } else if (controls.a) {
            api.velocity.set(-10, 0, 0);
        } else if (controls.d) {
            api.velocity.set(10, 0, 0);
        }
    }, [controls, api]);

    return controls;
}


// This is a type definition for the controls object
type Controls = {
    w: boolean,
    a: boolean,
    s: boolean,
    d: boolean,
};