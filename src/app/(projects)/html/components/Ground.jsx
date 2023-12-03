import { Sphere } from "@react-three/drei";
import { TextureLoader, RepeatWrapping } from "three";
import { useLoader } from '@react-three/fiber';

export const Ground = () => {
  return (
    <>
      <ImageSphere />
      <Sphere
        args={[2, 8, 62, 0, Math.PI * 0.5]}
        rotation-x={-90 * Math.PI / 180}
        rotation-z={90 * Math.PI / 180}
        scale={10}
        position={[8, -21, -6]}
        receiveShadow
      >
        <meshStandardMaterial attach="material" color="green" />
      </Sphere>
    </>
  )
}

function ImageSphere() {
  const texture = useLoader(TextureLoader, './ground.png')
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(60, 60);
  texture.rotation = 2
  return (
    <Sphere
      args={[2, 8, 62, 0, Math.PI * 0.5]}
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
