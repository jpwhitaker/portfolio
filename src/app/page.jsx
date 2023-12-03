'use client';
import { Canvas } from "@react-three/fiber";
import { VSMShadowMap } from "three";
import Scene from "./(projects)/html/components/Scene.jsx"
import { useRef } from "react";
import { EnergyChart } from "./(projects)/html/components/EnerygyChart.jsx"
import { useControls } from "leva";


export default function Home() {
  const canvasRef = useRef();
  const { speed } = useControls({ speed: { label: "Wind", value: 1, min: 1, max: 10, step: 1 } });

  return (
    <main className="h-full bg-white">

      <div className="mx-auto max-w-7xl h-96 bg-blue-300 relative">
        {/* Floating div over the left side */}
        <div className="absolute top-0 left-0 h-full w-1/2 bg-white bg-opacity-50 z-10">
          <EnergyChart />
        </div>

        {/* Existing canvas container */}
        <div className="w-full h-96">
          <Canvas ref={canvasRef} shadows camera={{ position: [0, 0, 5], fov: 30 }} shadowmap={{ type: VSMShadowMap }}>
            <group>
              <Scene speed={speed} />
            </group>
          </Canvas>
        </div>
      </div>



    </main>
  )
}




