/**
 * Signal-propagation model for the hero network.
 *
 * A pulse is a packet of "signal" travelling along one logical edge of the node
 * graph, addressed by node *indices* (`from` -> `to`) rather than by a drawn
 * edge. The render layer rebuilds its edge buffer every frame by proximity, so
 * binding a pulse to an edge would strand it the instant two nodes drift apart;
 * binding to indices lets a pulse interpolate between the two nodes' live
 * positions regardless of what the proximity pass decides to draw.
 *
 * On arrival a pulse flares its target node and may branch onward to that node's
 * current near-neighbours, so a signal spreads through the mesh. Fresh pulses are
 * seeded from the amber hub nodes on a timer. Everything is bounded by a hard
 * pulse cap so the cost per frame stays flat.
 *
 * This module is pure and framework-free: it mutates plain typed arrays / arrays
 * in place (hot per-frame path, same idiom as the WebGL buffer updates it feeds).
 */

export interface Pulse {
  /** Source node index. */
  from: number;
  /** Destination node index. */
  to: number;
  /** Progress along the edge, 0 -> 1. */
  t: number;
  /** Progress per second. */
  speed: number;
}

export interface SignalState {
  pulses: Pulse[];
  /** Per-node flare intensity (0..1), decays each frame; 1 right after arrival. */
  flare: Float32Array;
  /** Seconds remaining until the next hub seed. */
  seedTimer: number;
  /** Scratch neighbour buffer, reused across calls to avoid per-frame allocation. */
  scratch: number[];
}

export interface SignalConfig {
  /** Squared link distance — a pair within this range counts as a neighbour. */
  linkDistSq: number;
  /** Hard cap on concurrent pulses. */
  maxPulses: number;
  /** Probability each candidate branch actually fires (0..1). */
  branchProb: number;
}

const SPEED_MIN = 0.85;
const SPEED_MAX = 1.45;
const BRANCH_MAX = 2;
const FLARE_DECAY = 2.6; // per second
const SEED_INTERVAL = 0.5; // seconds between hub seeds

export function createSignalState(count: number): SignalState {
  return {
    pulses: [],
    flare: new Float32Array(count),
    seedTimer: 0,
    scratch: [],
  };
}

function randSpeed(): number {
  return SPEED_MIN + Math.random() * (SPEED_MAX - SPEED_MIN);
}

/** Collect node indices within `linkDistSq` of `node`, excluding `node` and `exclude`. */
function findNeighbours(
  positions: Float32Array,
  count: number,
  node: number,
  linkDistSq: number,
  exclude: number,
  out: number[],
): number[] {
  out.length = 0;
  const ax = positions[node * 3];
  const ay = positions[node * 3 + 1];
  const az = positions[node * 3 + 2];
  for (let j = 0; j < count; j++) {
    if (j === node || j === exclude) continue;
    const dx = ax - positions[j * 3];
    const dy = ay - positions[j * 3 + 1];
    const dz = az - positions[j * 3 + 2];
    if (dx * dx + dy * dy + dz * dz < linkDistSq) out.push(j);
  }
  return out;
}

/**
 * Advance the signal simulation by `dt` seconds, mutating `state` in place.
 * Caller is responsible for only invoking this while the scene is animating
 * (reduced-motion / off-screen frames must skip it so the lattice stays static).
 */
export function stepPulses(
  state: SignalState,
  positions: Float32Array,
  count: number,
  amberIndices: readonly number[],
  dt: number,
  cfg: SignalConfig,
): void {
  const { pulses, flare, scratch } = state;
  const { linkDistSq, maxPulses, branchProb } = cfg;

  // Decay every node's flare toward 0.
  for (let i = 0; i < count; i++) {
    const next = flare[i] - FLARE_DECAY * dt;
    flare[i] = next > 0 ? next : 0;
  }

  // Advance pulses; arrivals flare their target and queue branches.
  const spawned: Pulse[] = [];
  for (let p = pulses.length - 1; p >= 0; p--) {
    const pulse = pulses[p];
    pulse.t += pulse.speed * dt;
    if (pulse.t < 1) continue;

    const node = pulse.to;
    flare[node] = 1;

    if (pulses.length + spawned.length < maxPulses) {
      const nb = findNeighbours(positions, count, node, linkDistSq, pulse.from, scratch);
      const room = maxPulses - pulses.length - spawned.length;
      const branches = Math.min(BRANCH_MAX, nb.length, room);
      for (let b = 0; b < branches; b++) {
        if (Math.random() > branchProb) continue;
        const pick = nb[Math.floor(Math.random() * nb.length)];
        spawned.push({ from: node, to: pick, t: 0, speed: randSpeed() });
      }
    }

    // Swap-remove the arrived pulse.
    pulses[p] = pulses[pulses.length - 1];
    pulses.pop();
  }

  for (let i = 0; i < spawned.length; i++) {
    if (pulses.length >= maxPulses) break;
    pulses.push(spawned[i]);
  }

  // Seed a fresh signal from a random hub on the interval.
  state.seedTimer -= dt;
  if (state.seedTimer <= 0 && pulses.length < maxPulses && amberIndices.length > 0) {
    state.seedTimer = SEED_INTERVAL;
    const hub = amberIndices[Math.floor(Math.random() * amberIndices.length)];
    const nb = findNeighbours(positions, count, hub, linkDistSq, -1, scratch);
    if (nb.length > 0) {
      const pick = nb[Math.floor(Math.random() * nb.length)];
      pulses.push({ from: hub, to: pick, t: 0, speed: randSpeed() });
    }
  }
}

/** Normalised undirected key for an edge between nodes a and b. */
export function edgeKey(a: number, b: number, count: number): number {
  return a < b ? a * count + b : b * count + a;
}
