/** Deterministic PRNG (mulberry32). Same seed, same layout, on every machine. */
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export type Rng = ReturnType<typeof mulberry32>;

export const pick = <T,>(rng: Rng, arr: readonly T[]): T => arr[Math.floor(rng() * arr.length) % arr.length];
export const range = (rng: Rng, a: number, b: number) => a + rng() * (b - a);
export const chance = (rng: Rng, p: number) => rng() < p;

export function weighted<T>(rng: Rng, items: readonly T[], weight: (t: T) => number): T {
  const ws = items.map((t) => Math.max(0, weight(t)));
  const total = ws.reduce((s, v) => s + v, 0);
  if (total <= 0) return pick(rng, items);
  let r = rng() * total;
  for (let i = 0; i < items.length; i++) {
    r -= ws[i];
    if (r <= 0) return items[i];
  }
  return items[items.length - 1];
}
