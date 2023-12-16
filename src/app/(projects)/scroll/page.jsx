"use client";

import { useRef, useEffect } from "react";
import { VSMShadowMap } from "three";
import { Canvas, useThree } from "@react-three/fiber";
import './styles.css';
import Scene from './components/Scene'

//todo change cursor to pointer on hover over square
//todo clean up code

export default function CanvasWrapper() {
  const canvasRef = useRef();



  return (
    <div id="canvas-container" className="h-full text-white bg-blue-300 relative">
      <Canvas ref={canvasRef} shadows camera={{ position: [0, 0, 7], fov: 30 }} shadowmap={{ type: VSMShadowMap }}>
        <group>
          <Scene />
        </group>
      </Canvas>
    </div >
  );
};

