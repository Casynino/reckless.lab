"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Icosahedron, Torus } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

/** A morphing dark chrome blob with an acid rim — the "living specimen". */
function Specimen() {
  const mesh = useRef<THREE.Mesh>(null);
  const { pointer } = useThree();

  useFrame((state, delta) => {
    if (!mesh.current) return;
    // Ease rotation toward the pointer for a reactive, alive feel.
    mesh.current.rotation.y += delta * 0.15;
    mesh.current.rotation.x = THREE.MathUtils.lerp(mesh.current.rotation.x, pointer.y * 0.4, 0.05);
    mesh.current.rotation.z = THREE.MathUtils.lerp(mesh.current.rotation.z, pointer.x * -0.3, 0.05);
  });

  return (
    <Float speed={1.4} rotationIntensity={0.5} floatIntensity={1.1}>
      <Icosahedron ref={mesh} args={[1.6, 12]}>
        <MeshDistortMaterial
          color="#111114"
          roughness={0.15}
          metalness={0.9}
          distort={0.42}
          speed={1.6}
          emissive="#c6f24e"
          emissiveIntensity={0.045}
        />
      </Icosahedron>
    </Float>
  );
}

/** A thin acid ring orbiting the specimen. */
function Ring() {
  const ring = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (!ring.current) return;
    ring.current.rotation.x += delta * 0.25;
    ring.current.rotation.y += delta * 0.12;
  });
  return (
    <Torus ref={ring} args={[2.6, 0.006, 16, 120]} rotation={[Math.PI / 3, 0, 0]}>
      <meshBasicMaterial color="#c6f24e" transparent opacity={0.5} />
    </Torus>
  );
}

export default function HeroCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.5], fov: 45 }}
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true }}
      className="!absolute inset-0"
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 5, 5]} intensity={2.2} color="#ffffff" />
      <pointLight position={[-4, -2, 2]} intensity={30} color="#c6f24e" />
      <pointLight position={[3, 3, -3]} intensity={18} color="#8f6bff" />
      <Specimen />
      <Ring />
    </Canvas>
  );
}
