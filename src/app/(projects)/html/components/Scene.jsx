import { useRef, useEffect, useState } from "react";
import { OrbitControls, Box, Sphere, useHelper, Clouds, Cloud } from "@react-three/drei";
import { extend, useFrame, useLoader } from '@react-three/fiber';
import { useControls } from 'leva';
import { Blades } from "./Blades";
import { Tower } from "./Tower";
import { DirectionalLightHelper, CameraHelper, MeshBasicMaterial, TextureLoader, RepeatWrapping } from "three";
import { useSpring, animated } from 'react-spring';



export default function Scene() {
  const bladesGroupRef1 = useRef();
  const bladesGroupRef2 = useRef();
  const cloud1Ref = useRef();
  const cloud2Ref = useRef();
  const cloud3Ref = useRef();
  const directionalLightRef = useRef()
  // useHelper(directionalLightRef, DirectionalLightHelper, 1, "red")


  const { speed } = useControls({ speed: { label: "Wind", value: 1, min: 1, max: 10, step: 1 } });
  const reducedSpeed = 1 + ((speed - 1) * (5 - 1)) / (10 - 1);
  //I dunno, shit looks kinda choppy.
  //also i think the wind should start up and then the blades should speed up.
  const animatedProps = useSpring({ to: { reducedSpeed }, config: { mass: 1, tension: 280, friction: 180 } });



  useFrame((state, delta) => {
    const springSpeed = animatedProps.reducedSpeed.get();
    console.log(springSpeed)
    if (bladesGroupRef1.current && bladesGroupRef2.current) {
      // Adjust rotation based on the delta time
      bladesGroupRef1.current.rotation.z += (springSpeed * 1) * delta;
      bladesGroupRef2.current.rotation.z += (springSpeed * 0.8) * delta;
    }

    [cloud1Ref, cloud3Ref].forEach(cloudRef => {
      cloudRef.current.position.x -= springSpeed / 200; // Adjust the speed if needed
      if (cloudRef.current.position.x < -20) {
        cloudRef.current.position.x = 20;
      }
    });
  });

  return (
    <>
      <OrbitControls />
      <ambientLight intensity={1} />
      {/* <Box position={[0, 0, -0]}>
        <meshBasicMaterial color={"pink"} />
      </Box> */}
      <group position={[4, -1.6, -3]} rotation={[0, -60 * Math.PI / 180, 0]} scale={0.02} >
        {/* Group to apply rotation */}
        <group position={[0, 113, 5]} ref={bladesGroupRef1}>
          <Blades />
        </group>
        <Tower />
      </group>

      <group position={[8, -1.05, -4]} scale={0.019} rotation={[0, -60 * Math.PI / 180, 0]} >
        {/* Group to apply rotation */}
        <group position={[0, 113, 5]} ref={bladesGroupRef2} rotation-z={5}>
          <Blades />
        </group>
        <Tower />
      </group>
      {/* <directionalLight position={[5, 5, 0]} intensity={10} ref={directionalLightRef} castShadow /> */}
      <DirectionalLight position={[5, 5, 0]} intensity={10} />

      <ImageSphere/>
      <Sphere
        args={[2, 32, 32, 0, Math.PI * 0.5]}
        rotation-x={-90 * Math.PI / 180}
        rotation-z={90 * Math.PI / 180}
        scale={10}
        position={[8, -21, -6]}
        receiveShadow
      >
        <meshStandardMaterial attach="material" color="green" />
      </Sphere>

      <Clouds material={MeshBasicMaterial} >
        <Cloud ref={cloud1Ref} opacity={0.2} seed={1} segments={20} bounds={[5, 1, 2]} volume={1} color="white" position={[15, 2, 0]} speed={0.11} />
        {/* <Cloud ref={cloud2Ref} seed={2} opacity={0.5} segments={20} bounds={[5, 1, 2]} volume={1} color="white" position={[8,1,-5]} speed={0.11} /> */}
        <Cloud ref={cloud3Ref} seed={3} opacity={0.2} segments={20} bounds={[5, 1, 2]} volume={1} color="white" position={[0, 1, -4]} speed={0.11} />
      </Clouds>


    </>
  );
}


// rotation={[0,-60 * Math.PI / 180,0]}

function DirectionalLight({ position }) {
  const { helper } = useControls({
    helper: false,
  });
  const [light, set] = useState();
  const targetGroup = useRef();

  return (
    <>
      <directionalLight
        color={"#dbeafe"}
        ref={set}
        position={position}
        castShadow
        intensity={10}
        shadow-mapSize-height={1000}
        shadow-mapSize-width={1000}
        // shadow-camera-top={40}
        shadow-camera-bottom={-8}
        shadow-camera-far={15}
        target={targetGroup.current}
        shadow-radius={14}
        shadow-blurSamples={6}
        shadow-bias={-0.002}
      />
      {helper && light && <cameraHelper args={[light.shadow.camera]} />}
      <group position={[0, 0, 0]} ref={targetGroup} />
    </>
  );
}


function ImageSphere() {
  const texture = useLoader(TextureLoader, './ground.png')
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(60, 60);
  texture.rotation = 2
  return (




    <Sphere
      args={[2, 32, 32, 0, Math.PI * 0.5]}
      rotation-x={-90 * Math.PI / 180}
      rotation-z={90 * Math.PI / 180}
      scale={10.01}
      position={[8, -21, -6]}
      receiveShadow
    >
      <meshPhysicalMaterial attach="material" map={texture} transparent={true} roughness={0.5} />
    </Sphere>
  )
}
