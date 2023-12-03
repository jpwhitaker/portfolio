import { useRef, useState } from "react";
import { Clouds, Cloud } from "@react-three/drei";
import { useFrame } from '@react-three/fiber';
import { MeshBasicMaterial, MathUtils } from "three";

export const CloudLayer = ({ speed }) => {
  const cloud1Ref = useRef();
  const cloud2Ref = useRef();
  const cloud3Ref = useRef();
  const [windSpeed, setWindSpeed] = useState(speed);

  useFrame((state, delta) => {
    const newWindSpeed = MathUtils.lerp(windSpeed, speed, 0.01);
    setWindSpeed(newWindSpeed);

    [cloud1Ref, cloud2Ref, cloud3Ref].forEach(cloudRef => {
      cloudRef.current.position.x -= newWindSpeed / 200;
      if (cloudRef.current.position.x < -20) {
        cloudRef.current.position.x = 20;
      }
    });
  });

  return (
    <Clouds material={MeshBasicMaterial} castShadow>
      <Cloud ref={cloud3Ref} seed={3} opacity={0.2} segments={20} bounds={[5, 1, 2]} volume={1} color="white" position={[-7, 1, -4]} speed={0.2} />
      <Cloud ref={cloud2Ref} seed={2} opacity={0.2} segments={20} bounds={[5, 1, 2]} volume={1} color="white" position={[4, 1, -5]} speed={0.11} />
      <Cloud ref={cloud1Ref} seed={1} opacity={0.15} segments={20} bounds={[5, 1, 2]} volume={1} color="white" position={[15, 2, 0]} speed={0.11} />
    </Clouds>
  );
};
