import { useRef, useEffect, useState, useMemo } from "react";
import { OrbitControls, Box, Sphere, Scroll, ScrollControls, Html, useHelper, ContactShadows, ScreenQuad, Plane, RenderTexture, PerspectiveCamera, Dodecahedron } from "@react-three/drei";
import { extend, useFrame, useLoader } from '@react-three/fiber';
import { useControls } from 'leva';
import { Color, WebGLRenderTarget, Vector2, MeshBasicMaterial } from "three";
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
      u_colorA: { value: new Color("#FFE486") },
      u_colorB: { value: new Color("#FEB3D9") },
      u_resolution: { value: new Vector2(100, 100) }

    }), []
  );

  const shaderMaterial = <shaderMaterial
    fragmentShader={fragmentShader}
    vertexShader={vertexShader}
    uniforms={uniforms}
    wireframe={false}
  />
  const fsQuad = new FullScreenQuad(shaderMaterial)
  const renderTarget = new WebGLRenderTarget(window.innerWidth, window.innerHeight)


  useFrame((state) => {
    const { gl, clock } = state;
    mesh.current.material.uniforms.u_time.value = clock.getElapsedTime();
    gl.setRenderTarget(renderTarget);
    console.log(fsQuad);
    if (fsQuad && fsQuad.render) {
      // debugger
      const renderFunc = () => fsQuad.render(gl);
      renderFunc();
      gl.setRenderTarget(null);
    }
  });

  function TexturedPlane({ renderTarget }) {
    const material = new MeshBasicMaterial({ map: renderTarget.texture });
    
    return (
      <Plane args={[2, 2]} material={material} />
    );
  }
  


  return (
    <>
      <OrbitControls />
      <ScrollControls pages={3}>
        <ambientLight intensity={10} />
        <Scroll>

        <TexturedPlane renderTarget={renderTarget} />
          <Plane position={[3, 0, 0]} ref={mesh}>
            <shaderMaterial
              fragmentShader={fragmentShader}
              vertexShader={vertexShader}
              uniforms={uniforms}
              wireframe={false}
            />
          </Plane>

          <Html transform occlude={true} distanceFactor={1} position={[0, 0, 0.01]} scale={1}>
            <div>hello</div>
          </Html>
        </Scroll>
      </ScrollControls>
    </>
  );
}
