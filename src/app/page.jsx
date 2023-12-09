'use client';
import { Canvas } from "@react-three/fiber";
import { VSMShadowMap, MathUtils } from "three";
import Scene from "./(projects)/html/components/Scene.jsx"
import { useRef, useState, useEffect } from "react";
import { EnergyChart } from "./(projects)/html/components/EnerygyChart.jsx"
import { useControls } from "leva";
import { useFrame } from "@react-three/fiber";



export default function Home() {
  const canvasRef = useRef();
  const { speed } = useControls({ speed: { label: "Wind", value: 1, min: 1, max: 10, step: 1 } });
  const [targetSpeed, setTargetSpeed] = useState(speed)
  const bladeSpeedRef = useRef(speed); //using ref to prevent many rerenders


  useEffect(() => {
    const timeoutId = setTimeout(() => {
      console.log('increase blade speed');
      setTargetSpeed(MathUtils.mapLinear(speed, 1, 10, 1, 5));
    }, 2000);
    // Cleanup function to clear the timeout if the effect re-runs or component unmounts
    return () => clearTimeout(timeoutId);
  }, [speed]);

  useEffect(() => {
    let animationFrameId;
    const precision = 0.01; // Define your precision threshold
  
    const animate = () => {
      //how do i know how many fps this is?  0.005 is arbitrary, just chosen to make it a slow ramp up.
      const newBladeSpeed = MathUtils.lerp(bladeSpeedRef.current, targetSpeed, 0.005);
      // console.log({target: targetSpeed, new:newBladeSpeed});
      // setBladeSpeed(newBladeSpeed);
      bladeSpeedRef.current = newBladeSpeed
  
      // Check if the difference is within the precision threshold
      if (Math.abs(newBladeSpeed - targetSpeed) > precision) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };
  
    animate();
  
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [targetSpeed]);


  return (
    <main className="h-full bg-white">

      <div className="mx-auto max-w-7xl h-96 bg-blue-300 relative">
        {/* Floating div over the left side */}
        <div className="absolute top-0 left-0 h-full w-1/2 bg-white bg-opacity-50 z-10">
          <EnergyChart bladeSpeedRef={bladeSpeedRef}/>
        </div>

        {/* Existing canvas container */}
        <div className="w-full h-96">
          <Canvas ref={canvasRef} shadows camera={{ position: [0, 0, 5], fov: 30 }} shadowmap={{ type: VSMShadowMap }}>
            <group>
              <Scene speed={speed} bladeSpeedRef={bladeSpeedRef} />
            </group>
          </Canvas>
        </div>
      </div>



    </main>
  )
}

const CanvasWrapper = () => { }









// useEffect(() => {
//   const timeoutId = setTimeout(() => {
//     console.log('increase blade speed');
//     setDelayedSpeed(MathUtils.mapLinear(speed, 1, 10, 1, 5));
//   }, 2000);
//   // Cleanup function to clear the timeout if the effect re-runs or component unmounts
//   return () => clearTimeout(timeoutId);
// }, [speed]);

// useFrame((state, delta) => {
//   //takes the current speed, and the target (delayedSpeed) and starts lerping it to the target
//   const newBladeSpeed = MathUtils.lerp(bladeSpeed, delayedSpeed, 0.005);
//   setBladeSpeed(newBladeSpeed);
//   if (bladesGroupRef1.current && bladesGroupRef2.current) {
//     //i dont know if this makes it more or less jittery
//     bladesGroupRef1.current.rotation.z += parseFloat(((newBladeSpeed * 1) * delta).toFixed(3));
//     bladesGroupRef2.current.rotation.z += (newBladeSpeed * 0.8) * delta;
//   }
// });