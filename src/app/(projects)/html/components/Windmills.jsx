import { useState, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Blades } from "./Blades";
import {Tower} from "./Tower"
import { MathUtils } from "three";

export const Windmills = ({ speed }) => {
  const bladesGroupRef1 = useRef();
  const bladesGroupRef2 = useRef();
  //Delayed speed starts with speed from Leva, gets updated in the useEffect timeout to increase speed n-ms after speed is changed.
  const [delayedSpeed, setDelayedSpeed] = useState(speed);
  //this is the actual speed of the rendered blade.  set in useframe.
  const [bladeSpeed, setBladeSpeed] = useState(1);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      console.log('increase blade speed');
      setDelayedSpeed(MathUtils.mapLinear(speed, 1, 10, 1, 5));
    }, 2000);
    // Cleanup function to clear the timeout if the effect re-runs or component unmounts
    return () => clearTimeout(timeoutId);
  }, [speed]);

  useFrame((state, delta) => {
    //takes the current speed, and the target (delayedSpeed) and starts lerping it to the target
    const newBladeSpeed = MathUtils.lerp(bladeSpeed, delayedSpeed, 0.005);
    setBladeSpeed(newBladeSpeed);
    if (bladesGroupRef1.current && bladesGroupRef2.current) {
      //i dont know if this makes it more or less jittery
      bladesGroupRef1.current.rotation.z += parseFloat(((newBladeSpeed * 1) * delta).toFixed(3));
      bladesGroupRef2.current.rotation.z += (newBladeSpeed * 0.8) * delta;
    }
  });

  return (
    <>
      <group position={[4, -1.65, -3]} rotation={[0, -60 * Math.PI / 180, 0]} scale={0.02} >
        {/* Group to apply rotation */}
        <group position={[0, 113, 5]} ref={bladesGroupRef1}>
          <Blades />
        </group>
        <Tower />
      </group>

      <group position={[8, -1.15, -4]} scale={0.019} rotation={[0, -60 * Math.PI / 180, 0]} >
        {/* Group to apply rotation */}
        <group position={[0, 113, 5]} ref={bladesGroupRef2} rotation-z={5}>
          <Blades />
        </group>
        <Tower />
      </group>
    </>
  )
}