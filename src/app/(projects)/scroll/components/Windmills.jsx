import { useState, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Blades } from "./Blades";
import { Tower } from "./Tower"
import { MathUtils } from "three";

export const Windmills = ({ bladeSpeedRef }) => {
  const bladesGroupRef1 = useRef();
  const bladesGroupRef2 = useRef();
  //Delayed speed starts with speed from Leva, gets updated in the useEffect timeout to increase speed n-ms after speed is changed.

  useFrame((state, delta) => {
    //takes the current speed, and the target (delayedSpeed) and starts lerping it to the target
    
    if (bladesGroupRef1.current && bladesGroupRef2.current) {
      //i dont know if this makes it more or less jittery
      bladesGroupRef1.current.rotation.z += parseFloat(((bladeSpeedRef.current * 1) * delta).toFixed(3));
      bladesGroupRef2.current.rotation.z += (bladeSpeedRef.current * 0.8) * delta;
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