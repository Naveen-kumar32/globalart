import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Float, Sparkles, OrbitControls, QuadraticBezierLine, Html, RoundedBox, Trail } from "@react-three/drei";
import SceneCanvas, { pointer } from "./SceneCanvas.jsx";
import { Clay, Bouncy, Crayon, Star, Heart, Palette, Brush, Blob, GlassOrb, Donut, Pill, Cube, Pin, PaperPlane, Coin, useFollow } from "./Shapes.jsx";
import { COUNTRIES, COURSES } from "../../data/content.js";

const SPARK = ["#7C5CFF", "#FF5CA8", "#0095DA", "#FFC93C"];

/* ================= HOME: floating art studio ================= */
function ArtStudio() {
  const g = useRef();
  useFollow(g, { x: 0.35, y: 0.2, scroll: 0.0015 }, pointer);
  return (
    <group ref={g} scale={0.88}>
      <Float speed={1.6} rotationIntensity={0.5} floatIntensity={1}>
        <Bouncy hoverScale={1.06}><Palette rotation={[0.55, -0.35, 0.15]} scale={1.15} /></Bouncy>
      </Float>
      <Float speed={2.2} rotationIntensity={1} floatIntensity={1.4}>
        <Bouncy position={[-1.7, 1.45, -0.8]}><Blob color="#0095DA" radius={0.7} /></Bouncy>
      </Float>
      <Float speed={1.8} floatIntensity={1.2}>
        <Bouncy position={[2.1, -1.2, 0.9]}><GlassOrb radius={0.72} /></Bouncy>
      </Float>
      <Float speed={2.5} rotationIntensity={2} floatIntensity={1.5}>
        <Bouncy position={[1.9, 1.55, -0.2]}><Crayon color="#FF5CA8" rotation={[0.3, 0, -0.75]} /></Bouncy>
      </Float>
      <Float speed={2} rotationIntensity={2} floatIntensity={1.2}>
        <Bouncy position={[-1.8, -1.45, 0.4]}><Crayon color="#FFC93C" rotation={[0.2, 0, 0.9]} /></Bouncy>
      </Float>
      <Float speed={2.3} rotationIntensity={2.2} floatIntensity={1.2}>
        <Bouncy position={[0.3, -2.0, 1.1]}><Crayon color="#2ED3A4" rotation={[1.2, 0.2, 1.4]} scale={0.8} /></Bouncy>
      </Float>
      <Float speed={3} rotationIntensity={3} floatIntensity={2}>
        <Bouncy position={[-0.6, 2.1, 0.3]}><Star scale={0.48} rotation={[0.2, 0.4, 0.1]} /></Bouncy>
      </Float>
      <Float speed={2.6} rotationIntensity={2} floatIntensity={1.6}>
        <Bouncy position={[2.5, 0.25, -1]}><Heart scale={0.42} rotation={[0, -0.4, 0.2]} /></Bouncy>
      </Float>
      <Float speed={2} rotationIntensity={2.5} floatIntensity={1.3}>
        <Bouncy position={[-2.3, 0.1, -1.6]}><Donut color="#7C5CFF" scale={0.75} rotation={[0.8, 0.2, 0]} /></Bouncy>
      </Float>
      <Float speed={2.4} rotationIntensity={1.5} floatIntensity={1.4}>
        <Bouncy position={[1.1, 0.95, 1.4]}><Brush rotation={[0.4, 0, -0.5]} scale={0.7} /></Bouncy>
      </Float>
      <Sparkles count={50} scale={[8, 6, 4]} size={4} speed={0.5} color={SPARK[0]} />
      <Sparkles count={30} scale={[8, 6, 4]} size={5} speed={0.4} color={SPARK[1]} />
    </group>
  );
}
export function HomeScene() {
  return <SceneCanvas camera={{ position: [0, 0, 8.5], fov: 42 }} shadowY={-3}><ArtStudio /></SceneCanvas>;
}

/* ================= FLOATING SHAPES (generic) ================= */
const SHAPE = { star: Star, heart: Heart, donut: Donut, pill: Pill, cube: Cube, blob: Blob, orb: GlassOrb, crayon: Crayon, brush: Brush, coin: Coin, palette: Palette };
function FloatingInner({ items, scale }) {
  const g = useRef();
  useFollow(g, {}, pointer);
  return (
    <group ref={g} scale={scale}>
      {items.map(([kind, pos, props = {}], i) => {
        const C = SHAPE[kind];
        return (
          <Float key={i} speed={1.6 + (i % 3) * 0.5} rotationIntensity={1.6} floatIntensity={1.4}>
            <Bouncy position={pos}><C {...props} /></Bouncy>
          </Float>
        );
      })}
      <Sparkles count={40} scale={[7, 5, 3]} size={4} speed={0.4} color="#7C5CFF" />
    </group>
  );
}
export function FloatingScene({ items, scale = 1 }) {
  return <SceneCanvas camera={{ position: [0, 0, 8], fov: 40 }} shadowY={-2.6}><FloatingInner items={items} scale={scale} /></SceneCanvas>;
}

/* ================= GLOBE ================= */
function latLon(lat, lon, r) {
  const phi = ((90 - lat) * Math.PI) / 180, th = ((lon + 180) * Math.PI) / 180;
  return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(th), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(th));
}
function Marker({ pos, color, big }) {
  const ring = useRef();
  useFrame(({ clock }) => {
    const t = (clock.elapsedTime * 0.8 + pos.x) % 1;
    if (ring.current) { ring.current.scale.setScalar(1 + t * 2.5); ring.current.material.opacity = 1 - t; }
  });
  const q = useMemo(() => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), pos.clone().normalize()), [pos]);
  return (
    <group position={pos} quaternion={q}>
      <mesh><sphereGeometry args={[big ? 0.075 : 0.05, 16, 16]} /><meshBasicMaterial color={color} toneMapped={false} /></mesh>
      <mesh ref={ring}><ringGeometry args={[0.07, 0.09, 32]} /><meshBasicMaterial color={color} transparent toneMapped={false} side={THREE.DoubleSide} /></mesh>
    </group>
  );
}
function Arc({ from, to, color, i }) {
  const ref = useRef();
  const mid = useMemo(() => from.clone().add(to).multiplyScalar(0.5).normalize().multiplyScalar(2 + from.distanceTo(to) * 0.45), [from, to]);
  useFrame((_, dt) => { if (ref.current) ref.current.material.dashOffset -= dt * (0.6 + (i % 3) * 0.2); });
  return <QuadraticBezierLine ref={ref} start={from} end={to} mid={mid} color={color} lineWidth={1.6} dashed dashScale={6} dashSize={1} gapSize={1.2} transparent opacity={0.85} />;
}
function GlobeModel({ dark }) {
  const R = 2;
  const dots = useMemo(() => {
    const N = 1600, arr = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), th = i * Math.PI * (3 - Math.sqrt(5));
      arr.set([Math.cos(th) * r * R * 1.003, y * R * 1.003, Math.sin(th) * r * R * 1.003], i * 3);
    }
    return arr;
  }, []);
  const pts = useMemo(() => COUNTRIES.map(([n, la, lo]) => ({ n, p: latLon(la, lo, R) })), []);
  const india = pts[0].p;
  const rotY = -Math.atan2(india.x, india.z);
  const cols = ["#FF5CA8", "#FFC93C", "#2ED3A4", "#7C5CFF", "#0095DA"];
  return (
    <group rotation={[0.35, rotY, 0]}>
      <mesh>
        <sphereGeometry args={[R, 64, 64]} />
        <meshPhysicalMaterial color={dark ? "#2A1F7A" : "#5B46E0"} roughness={0.35} clearcoat={1} clearcoatRoughness={0.2} transparent opacity={0.92} />
      </mesh>
      <points>
        <bufferGeometry><bufferAttribute attach="attributes-position" count={dots.length / 3} array={dots} itemSize={3} /></bufferGeometry>
        <pointsMaterial size={0.028} color="#CFE9FF" transparent opacity={0.75} sizeAttenuation />
      </points>
      <mesh scale={1.12}><sphereGeometry args={[R, 48, 48]} /><meshBasicMaterial color="#7C5CFF" transparent opacity={0.08} side={THREE.BackSide} /></mesh>
      {pts.map((c, i) => <Marker key={c.n} pos={c.p} color={i === 0 ? "#FFC93C" : cols[i % cols.length]} big={i === 0} />)}
      {pts.slice(1).map((c, i) => <Arc key={c.n} from={india} to={c.p} color={cols[i % cols.length]} i={i} />)}
    </group>
  );
}
export function GlobeScene({ dark = false }) {
  return (
    <SceneCanvas camera={{ position: [0, 0, 6.4], fov: 42 }} shadows={false}>
      <Float speed={1.2} floatIntensity={0.6} rotationIntensity={0}><GlobeModel dark={dark} /></Float>
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.7} rotateSpeed={0.5} minPolarAngle={Math.PI / 3.2} maxPolarAngle={Math.PI / 1.6} />
      <Sparkles count={60} scale={[9, 7, 6]} size={3} speed={0.3} color="#FFC93C" />
    </SceneCanvas>
  );
}

/* ================= COURSES: level staircase ================= */
function Staircase() {
  const g = useRef(), ball = useRef();
  useFollow(g, { x: 0.3, y: 0.12, scroll: 0.0006 }, pointer);
  const steps = COURSES.map((c, i) => ({ c, x: -2.6 + i * 1.3, h: 0.5 + i * 0.42 }));
  useFrame(({ clock }) => {
    if (!ball.current) return;
    const t = (clock.elapsedTime * 0.55) % steps.length;
    const i = Math.floor(t), f = t - i;
    const a = steps[i], b = steps[(i + 1) % steps.length];
    const loop = i === steps.length - 1;
    const x = loop ? THREE.MathUtils.lerp(a.x, b.x, f) : THREE.MathUtils.lerp(a.x, b.x, f);
    const y0 = -1.6 + a.h + 0.32, y1 = -1.6 + b.h + 0.32;
    const y = THREE.MathUtils.lerp(y0, y1, f) + Math.sin(f * Math.PI) * (loop ? 1.6 : 0.9);
    ball.current.position.set(x, y, 0);
    const squash = 1 - Math.max(0, 0.25 - Math.min(f, 1 - f)) * 1.2;
    ball.current.scale.set(1 / squash, squash, 1 / squash);
  });
  return (
    <group ref={g} rotation={[0.25, -0.5, 0]}>
      {steps.map(({ c, x, h }) => (
        <Float key={c.id} speed={1.4} floatIntensity={0.25} rotationIntensity={0}>
          <Bouncy position={[x, -1.6 + h / 2, 0]} hoverScale={1.06}>
            <RoundedBox args={[1.15, h, 1.15]} radius={0.18} smoothness={6}><Clay color={c.color} /></RoundedBox>
            <Html position={[0, h / 2 + 0.05, 0.6]} center distanceFactor={9} zIndexRange={[2, 0]}>
              <span className="chip" style={{ whiteSpace: "nowrap" }}>{c.icon} {c.name}</span>
            </Html>
          </Bouncy>
        </Float>
      ))}
      <mesh ref={ball}><sphereGeometry args={[0.3, 48, 48]} /><Clay color="#FF8A5B" /></mesh>
      <Float speed={3} rotationIntensity={2}><Star position={[2.9, 1.6, -0.4]} scale={0.42} /></Float>
      <Float speed={2.4} rotationIntensity={2}><Crayon color="#7C5CFF" position={[-2.8, 1.2, -0.6]} rotation={[0, 0, 0.8]} scale={0.8} /></Float>
      <Sparkles count={40} scale={[8, 5, 3]} size={4} speed={0.4} color="#FFC93C" />
    </group>
  );
}
export function StepsScene() {
  return <SceneCanvas camera={{ position: [0, 0.6, 8.2], fov: 42 }} shadowY={-1.65}><Staircase /></SceneCanvas>;
}

/* ================= CENTRES: map pin ================= */
function PinWorld() {
  const g = useRef(), pin = useRef(), rings = useRef([]);
  useFollow(g, { x: 0.3, y: 0.1, scroll: 0 }, pointer);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (pin.current) { pin.current.position.y = 0.6 + Math.abs(Math.sin(t * 2)) * 0.5; pin.current.rotation.y = t * 0.8; }
    rings.current.forEach((r, i) => { if (!r) return; const k = (t * 0.5 + i / 3) % 1; r.scale.setScalar(0.5 + k * 3); r.material.opacity = (1 - k) * 0.7; });
  });
  const mini = [[-1.8, -0.9, "#0095DA"], [1.9, -0.4, "#2ED3A4"], [-1.1, 1.3, "#FFC93C"], [1.4, 1.5, "#7C5CFF"], [0.2, -1.8, "#FF8A5B"]];
  return (
    <group ref={g} rotation={[0.5, 0, 0]}>
      <RoundedBox args={[6, 0.25, 4.6]} radius={0.12} smoothness={4} position={[0, -1, 0]}><Clay color="#E9E4FF" roughness={0.5} /></RoundedBox>
      {/* roads */}
      <mesh position={[0, -0.86, 0]} rotation={[-Math.PI / 2, 0, 0.4]}><planeGeometry args={[7, 0.28]} /><meshStandardMaterial color="#ffffff" /></mesh>
      <mesh position={[0, -0.86, 0]} rotation={[-Math.PI / 2, 0, -1.2]}><planeGeometry args={[6, 0.22]} /><meshStandardMaterial color="#ffffff" /></mesh>
      {[0, 1, 2].map((i) => (
        <mesh key={i} ref={(el) => (rings.current[i] = el)} position={[0, -0.84, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.45, 0.55, 64]} /><meshBasicMaterial color="#FF5CA8" transparent />
        </mesh>
      ))}
      <group ref={pin}><Bouncy><Pin color="#FF5CA8" scale={0.75} /></Bouncy></group>
      {mini.map(([x, z, c], i) => (
        <Float key={i} speed={2 + i * 0.3} floatIntensity={0.4} rotationIntensity={0.3}>
          <Pin color={c} scale={0.28} position={[x, -0.5, z]} />
        </Float>
      ))}
      <Sparkles count={30} scale={[6, 4, 5]} size={4} speed={0.4} color="#FF5CA8" />
    </group>
  );
}
export function PinScene() {
  return <SceneCanvas camera={{ position: [0, 1.2, 7.5], fov: 42 }} shadowY={-1.2}><PinWorld /></SceneCanvas>;
}

/* ================= FRANCHISE: growth bars ================= */
function Growth() {
  const g = useRef(), bars = useRef([]), star = useRef();
  useFollow(g, { x: 0.3, y: 0.1 }, pointer);
  const H = [0.9, 1.5, 2.2, 3.1];
  const C = ["#0095DA", "#2ED3A4", "#7C5CFF", "#FF5CA8"];
  useFrame(({ clock }, dt) => {
    const t = clock.elapsedTime;
    bars.current.forEach((b, i) => {
      if (!b) return;
      const target = H[i] * (0.85 + 0.15 * Math.sin(t * 1.2 + i));
      b.scale.y = THREE.MathUtils.lerp(b.scale.y, target, 1 - Math.pow(0.05, dt));
      b.position.y = -1.6 + b.scale.y / 2;
    });
    if (star.current && bars.current[3]) { star.current.position.y = -1.6 + bars.current[3].scale.y + 0.7 + Math.sin(t * 2) * 0.1; star.current.rotation.y = t * 1.5; }
  });
  return (
    <group ref={g} rotation={[0.2, -0.45, 0]}>
      {H.map((_, i) => (
        <Bouncy key={i} position={[-1.8 + i * 1.2, 0, 0]} hoverScale={1.05}>
          <mesh ref={(el) => (bars.current[i] = el)} scale={[1, 0.01, 1]}><boxGeometry args={[0.85, 1, 0.85]} /><Clay color={C[i]} /></mesh>
        </Bouncy>
      ))}
      <group ref={star} position={[1.8, 2, 0]}><Star scale={0.45} /></group>
      {[[-2.6, 1.6, 0.6], [-0.4, 2.3, -0.8], [2.9, 0.3, 0.8], [0.6, -0.4, 1.6]].map((p, i) => (
        <Float key={i} speed={2 + i * 0.4} rotationIntensity={3} floatIntensity={1.4}><Bouncy position={p}><Coin rotation={[0.3, i, 0]} /></Bouncy></Float>
      ))}
      <Sparkles count={40} scale={[7, 5, 3]} size={4} speed={0.5} color="#FFC93C" />
    </group>
  );
}
export function GrowthScene() {
  return <SceneCanvas camera={{ position: [0, 0.4, 8], fov: 42 }} shadowY={-1.62}><Growth /></SceneCanvas>;
}

/* ================= STORIES: hearts + speech bubble ================= */
function Talk() {
  const g = useRef(), dots = useRef([]);
  useFollow(g, {}, pointer);
  useFrame(({ clock }) => dots.current.forEach((d, i) => d && (d.position.y = 0.25 + Math.max(0, Math.sin(clock.elapsedTime * 5 - i * 0.7)) * 0.18)));
  return (
    <group ref={g}>
      <Float speed={1.5} floatIntensity={1} rotationIntensity={0.4}>
        <Bouncy hoverScale={1.06}>
          <group rotation={[0.1, -0.3, 0]}>
            <RoundedBox args={[3, 1.9, 0.7]} radius={0.5} smoothness={8}><Clay color="#ffffff" roughness={0.25} /></RoundedBox>
            <mesh position={[-0.8, -1.05, 0]} rotation={[0, 0, 0.5]}><coneGeometry args={[0.3, 0.7, 32]} /><Clay color="#ffffff" /></mesh>
            {[0, 1, 2].map((i) => (
              <mesh key={i} ref={(el) => (dots.current[i] = el)} position={[-0.7 + i * 0.7, 0.25, 0.4]}><sphereGeometry args={[0.2, 32, 32]} /><Clay color={["#0095DA", "#FF5CA8", "#FFC93C"][i]} /></mesh>
            ))}
          </group>
        </Bouncy>
      </Float>
      {[[-2.5, 1.5, -0.5, 0.5, "#FF5CA8"], [2.6, 1.2, 0.4, 0.38, "#7C5CFF"], [2.2, -1.6, 0.8, 0.32, "#FF8A5B"], [-2.2, -1.5, 0.6, 0.3, "#FF5CA8"]].map(([x, y, z, s, c], i) => (
        <Float key={i} speed={2 + i * 0.5} rotationIntensity={2} floatIntensity={1.6}><Bouncy position={[x, y, z]}><Heart color={c} scale={s} /></Bouncy></Float>
      ))}
      <Float speed={2.5} rotationIntensity={2}><Star position={[0.4, 2.1, -0.6]} scale={0.38} /></Float>
      <Sparkles count={40} scale={[7, 5, 3]} size={4} speed={0.4} color="#FF5CA8" />
    </group>
  );
}
export function StoriesScene() {
  return <SceneCanvas camera={{ position: [0, 0, 8], fov: 42 }} shadowY={-2.6}><Talk /></SceneCanvas>;
}

/* ================= CONTACT: paper plane ================= */
function Flight() {
  const plane = useRef();
  useFrame(({ clock }) => {
    const t = clock.elapsedTime * 0.6;
    const x = Math.sin(t) * 2.4, y = Math.sin(t * 2) * 0.8, z = Math.cos(t) * 1.2;
    const nx = Math.sin(t + 0.05) * 2.4, ny = Math.sin((t + 0.05) * 2) * 0.8, nz = Math.cos(t + 0.05) * 1.2;
    if (!plane.current) return;
    plane.current.position.set(x, y, z);
    plane.current.lookAt(nx, ny, nz);
    plane.current.rotateZ(Math.cos(t) * 0.5);
  });
  return (
    <>
      <Trail width={1.4} length={6} color="#7C5CFF" attenuation={(w) => w * w}>
        <group ref={plane}><PaperPlane scale={0.55} /></group>
      </Trail>
      {[[-2.6, 1.6, -1.5], [2.4, 1.9, -2], [0.2, -1.9, -1.2]].map((p, i) => (
        <Float key={i} speed={1 + i * 0.3} floatIntensity={0.8}>
          <group position={p}>
            {[[0, 0, 0, 0.5], [0.5, 0.1, 0, 0.38], [-0.45, -0.05, 0, 0.35], [0.15, 0.32, 0, 0.36]].map(([x, y, z, r], k) => (
              <mesh key={k} position={[x, y, z]}><sphereGeometry args={[r, 32, 32]} /><Clay color="#ffffff" roughness={0.6} clearcoat={0.2} /></mesh>
            ))}
          </group>
        </Float>
      ))}
      <Float speed={2} rotationIntensity={2}><Bouncy position={[2.6, -1.3, 0.4]}><Heart scale={0.35} /></Bouncy></Float>
      <Float speed={2.6} rotationIntensity={2}><Bouncy position={[-2.4, -1.1, 0.8]}><Star scale={0.32} /></Bouncy></Float>
      <Sparkles count={40} scale={[7, 5, 3]} size={4} speed={0.4} color="#0095DA" />
    </>
  );
}
export function PlaneScene() {
  return <SceneCanvas camera={{ position: [0, 0, 7.5], fov: 42 }} shadowY={-2.6}><Flight /></SceneCanvas>;
}
