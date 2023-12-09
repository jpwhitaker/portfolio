import { useControls } from "leva";
import { useState, useRef } from "react";

export const LightAndHelper =({ position, intensity }) => {
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