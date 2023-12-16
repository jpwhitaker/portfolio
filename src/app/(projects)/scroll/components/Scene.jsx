import { useRef, useMemo } from "react";
import { OrbitControls, Plane } from "@react-three/drei";
import { useFrame } from '@react-three/fiber';
import { WebGLRenderTarget, Vector2, MeshBasicMaterial, ShaderMaterial, SRGBColorSpace} from "three";
import { FullScreenQuad } from "three/examples/jsm/postprocessing/Pass"
import vertexShader from './vertex.glsl'
import fragmentShader from './fragment.glsl'

export default function Scene() {
  const mesh = useRef();
  const uniforms = useMemo(
    () => ({
      u_time: {
        value: 0.0,
      },
      u_resolution: { value: new Vector2(100, 100) }
    }), []
  );

  const shaderMat = new ShaderMaterial({
    fragmentShader: fragmentShader,
    vertexShader: vertexShader,
    uniforms: uniforms,
    wireframe: false,
    toneMapped: false
  });
  const fsQuad = new FullScreenQuad(shaderMat)
  const renderTarget = new WebGLRenderTarget(window.innerWidth, window.innerHeight, {colorSpace:"srgb-linear" })

  useFrame((state) => {
    const { gl, clock } = state;
    mesh.current.material.uniforms.u_time.value = clock.getElapsedTime();
    gl.setRenderTarget(renderTarget);
    if (fsQuad && fsQuad.render) {
      // needs to be in an arrow function for this to work.
      const renderFunc = () => fsQuad.render(gl);
      renderFunc();
      gl.setRenderTarget(null);
    }
  });

  function TexturedPlane({ renderTarget }) {
    const texture = renderTarget.texture
    //tried to see if this would make it less light
    texture.colorSpace = SRGBColorSpace
    const material = new MeshBasicMaterial({ map: texture, toneMapped: false });

    return (
      <Plane args={[1, 1]} material={material} position={[-1,0,0]} />
    );
  }

  return (
    <>
      <OrbitControls />
      <TexturedPlane renderTarget={renderTarget} />
      <Plane position={[1, 0, 0]} ref={mesh} material={shaderMat} />
    </>
  );
}
