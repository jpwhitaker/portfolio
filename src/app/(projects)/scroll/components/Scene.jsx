import { useRef, useEffect, useState, useMemo } from "react";
import { OrbitControls, Box, Sphere, Scroll, ScrollControls, Html, useHelper, ContactShadows } from "@react-three/drei";
import { extend, useFrame, useLoader } from '@react-three/fiber';
import { useControls } from 'leva';
import { Color, DirectionalLightHelper, CameraHelper, TextureLoader, RepeatWrapping, MathUtils, Vector2 } from "three";





export default function Scene({ speed, bladeSpeedRef }) {


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

  useFrame((state) => {
    const { clock } = state;
    mesh.current.material.uniforms.u_time.value = clock.getElapsedTime();
  });

  const vertexShader = `
  varying vec2 vUv;

  void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

  const fragmentShader = `
  uniform float u_time;
  uniform vec2 u_resolution;
  varying vec2 vUv;


  vec4 mod289(vec4 x)
{
    return x - floor(x / 289.0) * 289.0;
}

vec4 permute(vec4 x)
{
    return mod289((x * 34.0 + 1.0) * x);
}

vec4 snoise(vec3 v)
{
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);

    // First corner
    vec3 i  = floor(v + dot(v, vec3(C.y)));
    vec3 x0 = v   - i + dot(i, vec3(C.x));

    // Other corners
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + C.x;
    vec3 x2 = x0 - i2 + C.y;
    vec3 x3 = x0 - 0.5;

    // Permutations
    vec4 p =
      permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0))
                            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                            + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    // Gradients: 7x7 points over a square, mapped onto an octahedron.
    // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
    vec4 j = p - 49.0 * floor(p / 49.0);  // mod(p,7*7)

    vec4 x_ = floor(j / 7.0);
    vec4 y_ = floor(j - 7.0 * x_); 

    vec4 x = (x_ * 2.0 + 0.5) / 7.0 - 1.0;
    vec4 y = (y_ * 2.0 + 0.5) / 7.0 - 1.0;

    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

    vec3 g0 = vec3(a0.xy, h.x);
    vec3 g1 = vec3(a0.zw, h.y);
    vec3 g2 = vec3(a1.xy, h.z);
    vec3 g3 = vec3(a1.zw, h.w);

    // Compute noise and gradient at P
    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    vec4 m2 = m * m;
    vec4 m3 = m2 * m;
    vec4 m4 = m2 * m2;
    vec3 grad =
      -6.0 * m3.x * x0 * dot(x0, g0) + m4.x * g0 +
      -6.0 * m3.y * x1 * dot(x1, g1) + m4.y * g1 +
      -6.0 * m3.z * x2 * dot(x2, g2) + m4.z * g2 +
      -6.0 * m3.w * x3 * dot(x3, g3) + m4.w * g3;
    vec4 px = vec4(dot(x0, g0), dot(x1, g1), dot(x2, g2), dot(x3, g3));
    return 42.0 * vec4(grad, dot(m4, px));
}

  
  float water_caustics(vec3 pos) {
    // Assuming snoise is a simplex noise function. You will need to define it or include it.
    vec4 n = snoise(pos);

    pos -= 0.07 * n.xyz;
    pos *= 1.62;
    n = snoise(pos);

    pos -= 0.07 * n.xyz;
    n = snoise(pos);

    pos -= 0.07 * n.xyz;
    n = snoise(pos);
    return n.w;
}

void main() {
    vec2 fragCoord = vUv * u_resolution;
    vec2 p = (-u_resolution.xy + 2.0 * fragCoord) / u_resolution.y;
    
    vec2 uv = fragCoord.xy / u_resolution.xy * 12.0;
    uv *= vec2(1.0, u_resolution.y / u_resolution.x);

    float w = mix(water_caustics(vec3(uv, u_time * 0.75)), water_caustics(vec3(uv, u_time * 0.75) + 1.0), 0.5);

    // Noise [-1..+1] -> color
    float intensity = exp(w * 3.0 - 0.5);
    gl_FragColor = vec4(mix(vec3(0.5, 0.5, 0.5), vec3(1.0, 1.0, 1.0), intensity), 1.0);
}  
    `

  return (
    <>
      <OrbitControls />
      <ScrollControls pages={3}>
        <ambientLight intensity={10} />
        <Scroll>
          <Box position={[0, 0, -0.5]} ref={mesh}>
            <shaderMaterial
              fragmentShader={fragmentShader}
              vertexShader={vertexShader}
              uniforms={uniforms}
              wireframe={false}
            />
          </Box>
          <Html transform occlude={true} distanceFactor={1} position={[0, 0, 0.01]} scale={1}>
            <div>sup homie</div>
          </Html>
        </Scroll>
      </ScrollControls>
    </>
  );
}



// const target = (portal?.current || events.connected || gl.domElement.parentNode) as HTMLElement
// const target = (portal?.current || events.connected || gl.domElement.parentNode) as HTMLElement
// const target = (portal?.current || gl.domElement.parentNode)