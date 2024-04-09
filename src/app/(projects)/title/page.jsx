
import { Canvas } from "@react-three/fiber";
import { Box, OrbitControls, Text3D } from "@react-three/drei";

export const Title = () => {
  return (
    <div className="mx-auto max-w-7xl h-96 bg-white-300 relative">
    <Canvas className="border-2 border-indigo-500 " >
      <ambientLight/>
      <OrbitControls />
      {/* <Box args={[1.5, 1.5, 1.5]} position={[0, 0, 0]} /> */}
      {/* J */}
      <Text3D font={'./golos.json'}
        curveSegments={32}
        bevelEnabled
        bevelSize={0.04}
        bevelThickness={0.1}
        height={0.01}
        lineHeight={0.5}
        letterSpacing={-0.06}
        size={0.8}
        position={[0, 0, 0]}
      >
        JP
        <meshStandardMaterial />
      </Text3D>

    </Canvas>


  </div>
  )
}


const LightAndHelper =({ position, intensity }) => {
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
        intensity={intensity}
        shadow-mapSize-height={1000}
        shadow-mapSize-width={1000}
        shadow-camera-bottom={-8}
        shadow-camera-far={15}
        target={targetGroup.current}
        shadow-radius={14}
        shadow-blurSamples={6}
        shadow-bias={0}
      />
      <directionalLight
        color={"#dbeafe"}
        position={position}
        intensity={intensity}
      />
      {helper && light && <cameraHelper args={[light.shadow.camera]} />}
      <group position={[0, 0, 0]} ref={targetGroup} />
    </>
  );
}