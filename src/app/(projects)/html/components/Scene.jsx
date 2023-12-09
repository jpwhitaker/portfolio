import { useRef, useEffect, useState } from "react";
import { OrbitControls, Box, Sphere, useHelper, ContactShadows } from "@react-three/drei";
import { extend, useFrame, useLoader } from '@react-three/fiber';
import { useControls } from 'leva';
import { Blades } from "./Blades";
import { Tower } from "./Tower";
import { DirectionalLightHelper, CameraHelper, TextureLoader, RepeatWrapping, MathUtils } from "three";
import {Ground} from './Ground'
import {LightAndHelper} from './LightAndHelper'
import { CloudLayer } from "./CloudLayer";
import {Windmills} from "./Windmills";



export default function Scene({speed, bladeSpeedRef}) {

  
  //OK we have Speed, which comes from Leva, cloud uses this directly

  

  return (
    <>
      <OrbitControls />
      <ambientLight intensity={1} />
      <Windmills bladeSpeedRef={bladeSpeedRef} />
      <LightAndHelper position={[5, 5, 0]} intensity={5} />
      <Ground/>
      <CloudLayer speed={speed} />
    </>
  );
}



