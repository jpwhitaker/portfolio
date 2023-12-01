"use client";

import { useRef, useEffect } from "react";
import { VSMShadowMap } from "three";
import { Canvas, useThree } from "@react-three/fiber";
import { ScrollControls, Scroll } from "@react-three/drei";
import { useControls, Leva, useCreateStore } from "leva";
import './styles.css';
import Scene from './components/Scene'
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
//todo change cursor to pointer on hover over square
//todo clean up code

export default function CanvasWrapper() {
  gsap.registerPlugin(ScrollTrigger);
  const canvasRef = useRef();
 


  return (
    <div id="canvas-container" className="h-96 text-white bg-blue-300 relative">
      <Canvas ref={canvasRef} shadows camera={{ position: [0, 0, 5], fov: 50 }} shadowmap={{ type: VSMShadowMap } }>
        
        <group>
            <Scene />
      </group>

    </Canvas>
    </div >
  );
};

