import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer, ContactShadows, AdaptiveDpr } from "@react-three/drei";

/** Global pointer in normalised viewport coords (-1..1), shared by every scene. */
export const pointer = { x: 0, y: 0 };
if (typeof window !== "undefined") {
  window.addEventListener("pointermove", (e) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
  }, { passive: true });
}

let webglOk = null;
function hasWebGL() {
  if (webglOk !== null) return webglOk;
  try {
    const c = document.createElement("canvas");
    const gl = window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl"));
    webglOk = !!gl;
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch { webglOk = false; }
  return webglOk;
}

/** Shown when WebGL is unavailable: floating clay orbs, pure CSS. */
const ORBS = [["🎨", "#7C5CFF", "18%", "22%", 120], ["✏️", "#FF5CA8", "62%", "12%", 96], ["⭐", "#FFC93C", "70%", "58%", 110], ["🖌️", "#0095DA", "26%", "64%", 92], ["💡", "#2ED3A4", "46%", "38%", 140]];
function ClayFallback() {
  return (
    <div style={{ position: "absolute", inset: 0 }} aria-hidden="true">
      {ORBS.map(([e, c, l, t, s], i) => (
        <span key={i} className="clay-icon" style={{ "--c": c, position: "absolute", left: l, top: t, width: s, height: s, borderRadius: "50%", fontSize: s * 0.42, animation: `drift${(i % 3) + 1} ${9 + i * 2}s ease-in-out infinite` }}>{e}</span>
      ))}
    </div>
  );
}

/** Studio lighting built from light-formers, so no HDR files need downloading. */
export function Studio({ shadows = true, shadowY = -2.4 }) {
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 6, 5]} intensity={1.5} />
      <directionalLight position={[-5, -2, -4]} intensity={0.5} color="#b9a8ff" />
      <Environment resolution={256} frames={1}>
        <group rotation={[-Math.PI / 3, 0, 1]}>
          <Lightformer form="circle" intensity={4} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={2} />
          <Lightformer form="circle" intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={2} />
          <Lightformer form="circle" intensity={2} rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={2} />
          <Lightformer form="circle" intensity={2} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={8} color="#ffd6ec" />
          <Lightformer form="ring" intensity={3} rotation-y={Math.PI / 2} position={[-0.1, -1, -5]} scale={10} color="#b8e6ff" />
        </group>
      </Environment>
      {shadows && <ContactShadows position={[0, shadowY, 0]} opacity={0.28} scale={9} blur={2.8} far={5} color="#4b3aa8" />}
    </>
  );
}

/** Canvas that only renders while on screen, with a graceful fallback when WebGL is missing. */
export default function SceneCanvas({ children, camera = { position: [0, 0, 8], fov: 40 }, className = "", fallback = null, shadows = true, shadowY }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [ok] = useState(() => typeof window !== "undefined" && hasWebGL());

  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "100px" });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`scene ${className}`}>
      {ok ? (
        <Canvas dpr={[1, 1.75]} camera={camera} frameloop={visible ? "always" : "never"} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}>
          <AdaptiveDpr pixelated={false} />
          <Suspense fallback={null}>
            <Studio shadows={shadows} shadowY={shadowY} />
            {children}
          </Suspense>
        </Canvas>
      ) : (
        <div className="scene-fallback">{fallback || <ClayFallback />}</div>
      )}
    </div>
  );
}
