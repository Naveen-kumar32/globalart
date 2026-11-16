import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, MeshDistortMaterial, MeshTransmissionMaterial } from "@react-three/drei";

/* ---------- Materials ---------- */
export function Clay({ color, roughness = 0.3, ...rest }) {
  return <meshPhysicalMaterial color={color} roughness={roughness} metalness={0.05} clearcoat={1} clearcoatRoughness={0.18} sheen={0.4} sheenColor="#ffffff" {...rest} />;
}

/* ---------- Interaction: hover grow + click spin ---------- */
export function Bouncy({ children, hoverScale = 1.15, ...props }) {
  const ref = useRef();
  const [hover, setHover] = useState(false);
  const spin = useRef(0);
  useFrame((_, dt) => {
    if (!ref.current) return;
    const target = hover ? hoverScale : 1;
    const s = THREE.MathUtils.lerp(ref.current.scale.x, target, 1 - Math.pow(0.001, dt));
    ref.current.scale.setScalar(s);
    if (spin.current > 0.001) {
      const step = spin.current * Math.min(1, dt * 4);
      ref.current.rotation.y += step;
      spin.current -= step;
    }
  });
  return (
    <group
      ref={ref}
      {...props}
      onPointerOver={(e) => { e.stopPropagation(); setHover(true); document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { setHover(false); document.body.style.cursor = ""; }}
      onClick={(e) => { e.stopPropagation(); spin.current += Math.PI * 2; }}
    >
      {children}
    </group>
  );
}

/* ---------- Geometry helpers ---------- */
const bevel = { bevelEnabled: true, bevelThickness: 0.12, bevelSize: 0.1, bevelSegments: 8, curveSegments: 32 };

function useCentered(geoFactory, deps = []) {
  return useMemo(() => {
    const g = geoFactory();
    g.center();
    g.computeVertexNormals();
    return g;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/* ---------- Shapes ---------- */
export function Crayon({ color = "#FF5CA8", ...props }) {
  const paper = useMemo(() => new THREE.Color(color).lerp(new THREE.Color("#ffffff"), 0.35).getStyle(), [color]);
  return (
    <group {...props}>
      <mesh><cylinderGeometry args={[0.22, 0.22, 1.5, 40]} /><Clay color={color} /></mesh>
      <mesh><cylinderGeometry args={[0.232, 0.232, 0.95, 40]} /><Clay color={paper} roughness={0.55} clearcoat={0.3} /></mesh>
      <mesh position={[0, 0.25, 0]}><torusGeometry args={[0.232, 0.025, 12, 40]} /><Clay color={color} /></mesh>
      <mesh position={[0, -0.25, 0]}><torusGeometry args={[0.232, 0.025, 12, 40]} /><Clay color={color} /></mesh>
      <mesh position={[0, 0.98, 0]}><cylinderGeometry args={[0.05, 0.22, 0.46, 40]} /><Clay color={color} /></mesh>
    </group>
  );
}

export function Star({ color = "#FFC93C", ...props }) {
  const geo = useCentered(() => {
    const s = new THREE.Shape();
    for (let i = 0; i < 10; i++) {
      const r = i % 2 ? 0.46 : 1;
      const a = (i / 10) * Math.PI * 2 + Math.PI / 2;
      i ? s.lineTo(Math.cos(a) * r, Math.sin(a) * r) : s.moveTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    s.closePath();
    return new THREE.ExtrudeGeometry(s, { depth: 0.3, ...bevel });
  });
  return <mesh geometry={geo} {...props}><Clay color={color} /></mesh>;
}

export function Heart({ color = "#FF5CA8", ...props }) {
  const geo = useCentered(() => {
    const s = new THREE.Shape();
    s.moveTo(0, -0.9);
    s.bezierCurveTo(-0.4, -0.55, -1.1, -0.25, -1.0, 0.3);
    s.bezierCurveTo(-0.92, 0.82, -0.25, 0.92, 0, 0.45);
    s.bezierCurveTo(0.25, 0.92, 0.92, 0.82, 1.0, 0.3);
    s.bezierCurveTo(1.1, -0.25, 0.4, -0.55, 0, -0.9);
    return new THREE.ExtrudeGeometry(s, { depth: 0.35, ...bevel, bevelThickness: 0.18, bevelSize: 0.14 });
  });
  return <mesh geometry={geo} {...props}><Clay color={color} /></mesh>;
}

export function Palette({ ...props }) {
  const geo = useCentered(() => {
    const s = new THREE.Shape();
    s.moveTo(0.2, -1.1);
    s.bezierCurveTo(1.4, -1.1, 1.8, 0.2, 1.3, 0.9);
    s.bezierCurveTo(0.8, 1.5, -0.9, 1.4, -1.4, 0.6);
    s.bezierCurveTo(-1.8, -0.1, -1.3, -0.6, -0.7, -0.5);
    s.bezierCurveTo(-0.2, -0.45, -0.5, -1.1, 0.2, -1.1);
    const hole = new THREE.Path();
    hole.absellipse(-0.75, 0.05, 0.22, 0.2, 0, Math.PI * 2, true);
    s.holes.push(hole);
    return new THREE.ExtrudeGeometry(s, { depth: 0.16, ...bevel, bevelThickness: 0.08, bevelSize: 0.08 });
  });
  const dots = [["#0095DA", 0.95, 0.55], ["#FF5CA8", 0.35, 0.85], ["#FFC93C", -0.35, 0.75], ["#2ED3A4", 1.05, -0.15], ["#7C5CFF", 0.45, -0.55]];
  return (
    <group {...props}>
      <mesh geometry={geo}><Clay color="#F6E7CF" roughness={0.45} /></mesh>
      {dots.map(([c, x, y]) => (
        <mesh key={c} position={[x, y, 0.2]} scale={[1, 1, 0.45]}><sphereGeometry args={[0.24, 32, 32]} /><Clay color={c} roughness={0.12} /></mesh>
      ))}
    </group>
  );
}

export function Brush({ color = "#7C5CFF", tip = "#FF5CA8", ...props }) {
  return (
    <group {...props}>
      <mesh position={[0, -0.6, 0]}><cylinderGeometry args={[0.09, 0.14, 1.6, 32]} /><Clay color={color} /></mesh>
      <mesh position={[0, 0.32, 0]}><cylinderGeometry args={[0.13, 0.11, 0.35, 32]} /><meshPhysicalMaterial color="#d9dbe6" metalness={1} roughness={0.2} /></mesh>
      <mesh position={[0, 0.72, 0]}><coneGeometry args={[0.15, 0.55, 32]} /><Clay color={tip} roughness={0.4} /></mesh>
    </group>
  );
}

export function Blob({ color = "#0095DA", radius = 1, distort = 0.38, speed = 2, ...props }) {
  return (
    <mesh {...props}>
      <sphereGeometry args={[radius, 96, 96]} />
      <MeshDistortMaterial color={color} distort={distort} speed={speed} roughness={0.15} metalness={0.05} clearcoat={1} clearcoatRoughness={0.1} />
    </mesh>
  );
}

const GLASS_BG = new THREE.Color("#ECE7FB");
export function GlassOrb({ radius = 0.8, color = "#ffffff", ...props }) {
  return (
    <mesh {...props}>
      <sphereGeometry args={[radius, 64, 64]} />
      <MeshTransmissionMaterial background={GLASS_BG} samples={4} resolution={256} thickness={0.6} roughness={0.02} chromaticAberration={0.35} anisotropy={0.2} distortion={0.35} distortionScale={0.4} temporalDistortion={0.12} ior={1.35} color={color} backside={false} />
    </mesh>
  );
}

export function Donut({ color = "#7C5CFF", ...props }) {
  return <mesh {...props}><torusGeometry args={[0.55, 0.25, 40, 80]} /><Clay color={color} /></mesh>;
}

export function Pill({ color = "#2ED3A4", ...props }) {
  return <mesh {...props}><capsuleGeometry args={[0.28, 0.75, 12, 32]} /><Clay color={color} /></mesh>;
}

export function Cube({ color = "#FFC93C", size = 0.9, ...props }) {
  return <RoundedBox args={[size, size, size]} radius={size * 0.22} smoothness={6} {...props}><Clay color={color} /></RoundedBox>;
}

export function Pin({ color = "#FF5CA8", ...props }) {
  // Teardrop profile: pointy tip at the bottom, round head on top.
  const geo = useMemo(() => {
    const prof = [];
    for (let i = 0; i <= 24; i++) {
      const t = i / 24;
      prof.push(new THREE.Vector2(Math.max(0.0001, 0.9 * Math.sin((t * Math.PI) / 2) ** 1.2), -1.1 + t * 2.0));
    }
    for (let i = 1; i <= 24; i++) {
      const a = (i / 24) * (Math.PI / 2);
      prof.push(new THREE.Vector2(Math.max(0.0001, 0.9 * Math.cos(a)), 0.9 + 0.9 * Math.sin(a)));
    }
    return new THREE.LatheGeometry(prof, 64);
  }, []);
  return (
    <group {...props}>
      <mesh geometry={geo}><Clay color={color} /></mesh>
      <mesh position={[0, 0.95, 0.62]}><sphereGeometry args={[0.32, 32, 32]} /><Clay color="#ffffff" /></mesh>
    </group>
  );
}

export function PaperPlane({ color = "#ffffff", ...props }) {
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const v = new Float32Array([
      // left wing
      0, 0, 1.4, -1.1, 0.05, -0.9, 0, 0, -0.6,
      // right wing
      0, 0, 1.4, 0, 0, -0.6, 1.1, 0.05, -0.9,
      // keel left
      0, 0, 1.4, 0, 0, -0.6, 0, -0.35, -0.8,
      // keel right
      0, 0, 1.4, 0, -0.35, -0.8, 0, 0, -0.6,
    ]);
    g.setAttribute("position", new THREE.BufferAttribute(v, 3));
    g.computeVertexNormals();
    return g;
  }, []);
  return <mesh geometry={geo} {...props}><meshPhysicalMaterial color={color} roughness={0.5} clearcoat={0.6} side={THREE.DoubleSide} /></mesh>;
}

export function Coin({ ...props }) {
  return (
    <group {...props}>
      <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.42, 0.42, 0.12, 48]} /><meshPhysicalMaterial color="#FFC93C" metalness={0.45} roughness={0.25} clearcoat={1} emissive="#FFB000" emissiveIntensity={0.18} /></mesh>
      <mesh position={[0, 0, 0.065]}><torusGeometry args={[0.3, 0.03, 12, 48]} /><meshPhysicalMaterial color="#FFB000" metalness={0.5} roughness={0.25} emissive="#FF9500" emissiveIntensity={0.2} /></mesh>
    </group>
  );
}

/** Smoothly tilts children toward the global pointer and with page scroll. */
export function useFollow(ref, { x = 0.25, y = 0.18, scroll = 0.0012 } = {}, pointer) {
  useFrame((_, dt) => {
    if (!ref.current) return;
    const k = 1 - Math.pow(0.02, dt);
    const sy = typeof window !== "undefined" ? window.scrollY : 0;
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, pointer.x * x + sy * scroll, k);
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, -pointer.y * y, k);
  });
}
