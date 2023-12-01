import { useRef, useEffect } from "react";
import { OrbitControls, Box } from "@react-three/drei";
import { extend, useFrame } from '@react-three/fiber';
import { useControls } from 'leva';
import { Blades } from "./Blades";
import { Tower } from "./Tower";

export default function Scene() {
  const bladesGroupRef = useRef();  // Reference for the group containing the blades
  const { speed } = useControls({ speed: { value: 1, min: 1, max: 10, step: 1 } });

  useFrame(() => {
    if (bladesGroupRef.current) {
      bladesGroupRef.current.rotation.z += speed / 100;  // Rotate the group based on the speed value
    }
  });

  return (
    <>
      <OrbitControls />
      <ambientLight intensity={1}/>
      <Box position={[0, 0, -0]}>
        <meshBasicMaterial color={"pink"} />
      </Box>
      <group position={[2,0, 0]} scale={0.05}>
        {/* Group to apply rotation */}
        <group position={[0,113,5]} ref={bladesGroupRef}>
          <Blades/>
        </group>
        <Tower />
      </group>
    </>
  );
}
