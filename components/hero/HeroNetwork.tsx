"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// --- scene tuning ---
const BOUNDS = { x: 15, y: 8.5, z: 5 };
const LINK_DISTANCE = 3.2;
const MAX_EDGES = 520;

const GREY = new THREE.Color("#5a5a5a");
const ACCENT = new THREE.Color("#3b9dff");

function buildNodes(count: number) {
  const positions = new Float32Array(count * 3);
  const velocities = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() * 2 - 1) * BOUNDS.x;
    positions[i * 3 + 1] = (Math.random() * 2 - 1) * BOUNDS.y;
    positions[i * 3 + 2] = (Math.random() * 2 - 1) * BOUNDS.z;
    velocities[i * 3] = (Math.random() * 2 - 1) * 0.6;
    velocities[i * 3 + 1] = (Math.random() * 2 - 1) * 0.6;
    velocities[i * 3 + 2] = (Math.random() * 2 - 1) * 0.4;
  }
  return { positions, velocities };
}

interface SceneProps {
  count: number;
  animate: boolean;
  interactive: boolean;
  pointerRef: React.RefObject<{ x: number; y: number }>;
}

function NetworkScene({ count, animate, interactive, pointerRef }: SceneProps) {
  const group = useRef<THREE.Group>(null);
  const greyPointsRef = useRef<THREE.Points>(null);
  const amberPointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  const { positions, velocities } = useMemo(() => buildNodes(count), [count]);

  // A small, stable subset of "active" (amber) nodes.
  const activeSet = useMemo(() => {
    const s = new Set<number>();
    const n = Math.max(4, Math.round(count * 0.07));
    while (s.size < n) s.add(Math.floor(Math.random() * count));
    return s;
  }, [count]);

  const amberIndices = useMemo(() => Array.from(activeSet), [activeSet]);

  const amberPositions = useMemo(
    () => new Float32Array(amberIndices.length * 3),
    [amberIndices],
  );
  const linePositions = useMemo(() => new Float32Array(MAX_EDGES * 2 * 3), []);
  const lineColors = useMemo(() => new Float32Array(MAX_EDGES * 2 * 3), []);

  const tmpTime = useRef(0);

  useFrame((_state, delta) => {
    const d = Math.min(delta, 0.05);
    tmpTime.current += d;

    if (animate) {
      for (let i = 0; i < count; i++) {
        const ix = i * 3;
        positions[ix] += velocities[ix] * d;
        positions[ix + 1] += velocities[ix + 1] * d;
        positions[ix + 2] += velocities[ix + 2] * d;
        if (positions[ix] > BOUNDS.x || positions[ix] < -BOUNDS.x) velocities[ix] *= -1;
        if (positions[ix + 1] > BOUNDS.y || positions[ix + 1] < -BOUNDS.y) velocities[ix + 1] *= -1;
        if (positions[ix + 2] > BOUNDS.z || positions[ix + 2] < -BOUNDS.z) velocities[ix + 2] *= -1;
      }
    }

    if (greyPointsRef.current) {
      greyPointsRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Amber node positions + pulse.
    for (let k = 0; k < amberIndices.length; k++) {
      const i = amberIndices[k];
      amberPositions[k * 3] = positions[i * 3];
      amberPositions[k * 3 + 1] = positions[i * 3 + 1];
      amberPositions[k * 3 + 2] = positions[i * 3 + 2];
    }
    if (amberPointsRef.current) {
      amberPointsRef.current.geometry.attributes.position.needsUpdate = true;
      const pulse = 0.55 + 0.45 * Math.abs(Math.sin(tmpTime.current * 1.4));
      (amberPointsRef.current.material as THREE.PointsMaterial).opacity = pulse;
    }

    // Recompute edges by proximity.
    let e = 0;
    const linkSq = LINK_DISTANCE * LINK_DISTANCE;
    for (let i = 0; i < count && e < MAX_EDGES; i++) {
      const ax = positions[i * 3];
      const ay = positions[i * 3 + 1];
      const az = positions[i * 3 + 2];
      const aActive = activeSet.has(i);
      for (let j = i + 1; j < count && e < MAX_EDGES; j++) {
        const dx = ax - positions[j * 3];
        const dy = ay - positions[j * 3 + 1];
        const dz = az - positions[j * 3 + 2];
        const dist2 = dx * dx + dy * dy + dz * dz;
        if (dist2 < linkSq) {
          const t = 1 - dist2 / linkSq; // closer = brighter
          const active = aActive || activeSet.has(j);
          const col = active ? ACCENT : GREY;
          const fade = active ? 0.5 + t * 0.5 : 0.18 + t * 0.42;

          const o = e * 6;
          linePositions[o] = ax;
          linePositions[o + 1] = ay;
          linePositions[o + 2] = az;
          linePositions[o + 3] = positions[j * 3];
          linePositions[o + 4] = positions[j * 3 + 1];
          linePositions[o + 5] = positions[j * 3 + 2];

          for (let v = 0; v < 2; v++) {
            lineColors[o + v * 3] = col.r * fade;
            lineColors[o + v * 3 + 1] = col.g * fade;
            lineColors[o + v * 3 + 2] = col.b * fade;
          }
          e++;
        }
      }
    }
    if (linesRef.current) {
      linesRef.current.geometry.attributes.position.needsUpdate = true;
      linesRef.current.geometry.attributes.color.needsUpdate = true;
      linesRef.current.geometry.setDrawRange(0, e * 2);
    }

    // Cursor parallax (subtle), driven by a window-level pointer ref.
    if (group.current) {
      const px = pointerRef.current?.x ?? 0;
      const py = pointerRef.current?.y ?? 0;
      const targetY = interactive ? px * 0.18 : 0;
      const targetX = interactive ? -py * 0.12 : 0;
      group.current.rotation.y += (targetY - group.current.rotation.y) * 0.04;
      group.current.rotation.x += (targetX - group.current.rotation.x) * 0.04;
      if (animate) group.current.rotation.z = Math.sin(tmpTime.current * 0.05) * 0.04;
    }
  });

  return (
    <group ref={group}>
      <points ref={greyPointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color="#9a9a9a"
          size={0.07}
          sizeAttenuation
          transparent
          opacity={0.85}
          depthWrite={false}
        />
      </points>

      <points ref={amberPointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[amberPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color="#3b9dff"
          size={0.16}
          sizeAttenuation
          transparent
          opacity={0.9}
          depthWrite={false}
        />
      </points>

      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[lineColors, 3]} />
        </bufferGeometry>
        <lineBasicMaterial vertexColors transparent opacity={0.7} depthWrite={false} />
      </lineSegments>
    </group>
  );
}

export function HeroNetwork() {
  const [reduced, setReduced] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [visible, setVisible] = useState(true);
  const wrapRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef({ x: 0, y: 0 });

  // Track pointer at window level so parallax works without capturing clicks.
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointerRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointerRef.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useEffect(() => {
    const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mqMobile = window.matchMedia("(max-width: 768px)");
    const sync = () => {
      setReduced(mqReduce.matches);
      setIsMobile(mqMobile.matches);
    };
    sync();
    mqReduce.addEventListener("change", sync);
    mqMobile.addEventListener("change", sync);
    return () => {
      mqReduce.removeEventListener("change", sync);
      mqMobile.removeEventListener("change", sync);
    };
  }, []);

  // Pause rendering when the hero scrolls out of view (perf budget).
  useEffect(() => {
    const node = wrapRef.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.01 },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  const count = isMobile ? 55 : 95;
  const animate = !reduced && visible;

  return (
    <div ref={wrapRef} className="absolute inset-0" aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        frameloop={animate ? "always" : "demand"}
        camera={{ position: [0, 0, 13], fov: 60 }}
        gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
        style={{ background: "transparent" }}
      >
        <NetworkScene
          count={count}
          animate={animate}
          interactive={!reduced && !isMobile}
          pointerRef={pointerRef}
        />
      </Canvas>
      {/* Contrast guard: darken the left where the headline sits so text stays AA. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.7) 38%, rgba(10,10,10,0.35) 70%, rgba(10,10,10,0.55) 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0) 22%, rgba(10,10,10,0) 78%, rgba(10,10,10,0.95) 100%)",
        }}
      />
    </div>
  );
}
