"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  createSignalState,
  edgeKey,
  stepPulses,
  type SignalConfig,
} from "./signal";

// --- scene tuning ---
const BOUNDS = { x: 15, y: 8.5, z: 5 };
const LINK_DISTANCE = 3.2;
const LINK_SQ = LINK_DISTANCE * LINK_DISTANCE;
const MAX_EDGES = 640;
const MAX_PULSES = 36;

// Mirrors --color-accent / --color-accent-hi (kept as constants: reading a CSS
// var into a WebGL color each frame isn't worth it).
const NODE_GREY = new THREE.Color("#9a9a9a");
const GREY = new THREE.Color("#5a5a5a");
const AMBER = new THREE.Color("#f59e0b");
const AMBER_HI = new THREE.Color("#fbbf24"); // in-flight signal / lit edge

const SIGNAL_CFG: SignalConfig = {
  linkDistSq: LINK_SQ,
  maxPulses: MAX_PULSES,
  branchProb: 0.55,
};

// Spring constants for cursor parallax — near-critically damped, so it settles
// smoothly with no visible overshoot (overdrive bans bounce/elastic).
const SPRING_STIFFNESS = 58;
const SPRING_DAMPING = 15;

const REVEAL_DURATION = 1.2; // seconds for the lattice to "wire in" on mount

function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

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
  const pulsePointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  const { positions, velocities } = useMemo(() => buildNodes(count), [count]);

  // A small, stable subset of "active" (amber) hub nodes — the signal sources.
  const activeSet = useMemo(() => {
    const s = new Set<number>();
    const n = Math.max(4, Math.round(count * 0.07));
    while (s.size < n) s.add(Math.floor(Math.random() * count));
    return s;
  }, [count]);

  const amberIndices = useMemo(() => Array.from(activeSet), [activeSet]);

  // Per-node vertex colours: base grey, lifted toward amber by signal flare.
  const greyColors = useMemo(() => {
    const c = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      c[i * 3] = NODE_GREY.r;
      c[i * 3 + 1] = NODE_GREY.g;
      c[i * 3 + 2] = NODE_GREY.b;
    }
    return c;
  }, [count]);

  const amberPositions = useMemo(
    () => new Float32Array(amberIndices.length * 3),
    [amberIndices],
  );
  const pulsePositions = useMemo(() => new Float32Array(MAX_PULSES * 3), []);
  const linePositions = useMemo(() => new Float32Array(MAX_EDGES * 2 * 3), []);
  const lineColors = useMemo(() => new Float32Array(MAX_EDGES * 2 * 3), []);

  const signal = useMemo(() => createSignalState(count), [count]);
  const pulseEdges = useMemo(() => new Set<number>(), []);

  const tmpTime = useRef(0);
  const revealT = useRef(0);
  const rotVel = useRef({ x: 0, y: 0 });

  useFrame((_state, delta) => {
    const d = Math.min(delta, 0.05);
    tmpTime.current += d;

    if (animate) {
      revealT.current = Math.min(revealT.current + d / REVEAL_DURATION, 1);
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

    // Advance the signal simulation only while animating; a static lattice is
    // the reduced-motion / off-screen fallback.
    if (animate) {
      stepPulses(signal, positions, count, amberIndices, d, SIGNAL_CFG);
    }

    const flare = signal.flare;
    if (greyPointsRef.current) {
      // Node colour = grey, lifted toward bright amber where a signal arrived.
      for (let i = 0; i < count; i++) {
        const f = flare[i];
        const lift = 1 + f * 0.9;
        greyColors[i * 3] = (NODE_GREY.r + (AMBER.r - NODE_GREY.r) * f) * lift;
        greyColors[i * 3 + 1] = (NODE_GREY.g + (AMBER.g - NODE_GREY.g) * f) * lift;
        greyColors[i * 3 + 2] = (NODE_GREY.b + (AMBER.b - NODE_GREY.b) * f) * lift;
      }
      greyPointsRef.current.geometry.attributes.position.needsUpdate = true;
      greyPointsRef.current.geometry.attributes.color.needsUpdate = true;
    }

    // Amber hub node positions + a slow steady breathe.
    for (let k = 0; k < amberIndices.length; k++) {
      const i = amberIndices[k];
      amberPositions[k * 3] = positions[i * 3];
      amberPositions[k * 3 + 1] = positions[i * 3 + 1];
      amberPositions[k * 3 + 2] = positions[i * 3 + 2];
    }
    if (amberPointsRef.current) {
      amberPointsRef.current.geometry.attributes.position.needsUpdate = true;
      // Hubs are calm anchors so the in-flight pulses stay the brightest amber.
      const breathe = 0.45 + 0.3 * Math.abs(Math.sin(tmpTime.current * 1.1));
      (amberPointsRef.current.material as THREE.PointsMaterial).opacity = animate
        ? breathe
        : 0.7;
    }

    // In-flight signal packets: a bright amber dot easing along each edge.
    const pulses = signal.pulses;
    pulseEdges.clear();
    const pulseCount = Math.min(pulses.length, MAX_PULSES);
    for (let k = 0; k < pulseCount; k++) {
      const pulse = pulses[k];
      const a = pulse.from * 3;
      const b = pulse.to * 3;
      const e = smoothstep(pulse.t < 1 ? pulse.t : 1);
      pulsePositions[k * 3] = positions[a] + (positions[b] - positions[a]) * e;
      pulsePositions[k * 3 + 1] = positions[a + 1] + (positions[b + 1] - positions[a + 1]) * e;
      pulsePositions[k * 3 + 2] = positions[a + 2] + (positions[b + 2] - positions[a + 2]) * e;
      pulseEdges.add(edgeKey(pulse.from, pulse.to, count));
    }
    if (pulsePointsRef.current) {
      pulsePointsRef.current.geometry.setDrawRange(0, pulseCount);
      pulsePointsRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Recompute edges by proximity. Edges carrying a signal light up amber;
    // on first mount the whole lattice fades in, staggered by edge order.
    const reveal = animate ? smoothstep(revealT.current) : 1;
    let e = 0;
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
        if (dist2 < LINK_SQ) {
          const t = 1 - dist2 / LINK_SQ; // closer = brighter
          const hub = aActive || activeSet.has(j);
          const live = pulseEdges.has(edgeKey(i, j, count));

          let col = hub ? AMBER : GREY;
          let fade = hub ? 0.5 + t * 0.5 : 0.18 + t * 0.42;
          if (live) {
            col = AMBER_HI;
            fade = Math.max(fade, 0.95);
          }

          // Per-edge draw-in stagger on mount (no-op once revealT hits 1).
          const edgeReveal = reveal >= 1 ? 1 : smoothstep(Math.max(0, Math.min(1, reveal * 1.6 - e / MAX_EDGES)));
          fade *= edgeReveal;

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

    // Cursor parallax via a near-critically-damped spring (smooth settle).
    if (group.current) {
      const px = pointerRef.current?.x ?? 0;
      const py = pointerRef.current?.y ?? 0;
      const targetY = interactive ? px * 0.18 : 0;
      const targetX = interactive ? -py * 0.12 : 0;

      const rot = group.current.rotation;
      const ay = (targetY - rot.y) * SPRING_STIFFNESS - rotVel.current.y * SPRING_DAMPING;
      const ax = (targetX - rot.x) * SPRING_STIFFNESS - rotVel.current.x * SPRING_DAMPING;
      rotVel.current.y += ay * d;
      rotVel.current.x += ax * d;
      rot.y += rotVel.current.y * d;
      rot.x += rotVel.current.x * d;

      if (animate) rot.z = Math.sin(tmpTime.current * 0.05) * 0.04;
    }
  });

  return (
    <group ref={group}>
      <points ref={greyPointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[greyColors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          vertexColors
          size={0.07}
          sizeAttenuation
          transparent
          opacity={0.9}
          depthWrite={false}
        />
      </points>

      <points ref={amberPointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[amberPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color="#f59e0b"
          size={0.15}
          sizeAttenuation
          transparent
          opacity={0.9}
          depthWrite={false}
        />
      </points>

      <points ref={pulsePointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[pulsePositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color="#fbbf24"
          size={0.19}
          sizeAttenuation
          transparent
          opacity={1}
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

  const count = isMobile ? 55 : 120;
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
      {/* Contrast guard: hold the left/headline band dark for AA headroom, then
          release on the right where the signal field is meant to read. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.8) 50%, rgba(10,10,10,0.42) 70%, rgba(10,10,10,0.5) 100%)",
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
