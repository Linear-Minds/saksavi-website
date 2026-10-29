/**
 * Procedural coconut-palm geometry. Everything is generated once as SVG path
 * strings so the scenes stay crisp at any size and cheap to animate.
 */

export interface Frond {
  /** Filled leaflets + rachis, drawn along +x with droop toward +y. */
  d: string;
  /** SVG transform placing the frond on the crown. */
  transform: string;
  /** Lighter fronds sit in front. */
  tone: 'dark' | 'mid' | 'light';
}

export interface PalmArt {
  trunk: string;
  rings: string;
  crown: { x: number; y: number };
  fronds: Frond[];
}

const r = (n: number) => Math.round(n * 10) / 10;

/** Deterministic pseudo-random so every render draws the same tree. */
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function frondPath(length: number, droop: number, leaflets = 26, seed = 1): string {
  const rand = rng(seed);
  const pt = (t: number) => ({ x: length * t, y: droop * length * t * t });
  const tan = (t: number) => {
    const dx = length;
    const dy = 2 * droop * length * t;
    const m = Math.hypot(dx, dy);
    return { x: dx / m, y: dy / m };
  };

  let d = '';
  // Rachis as a thin tapered sliver.
  const steps = 14;
  const top: string[] = [];
  const bottom: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const p = pt(t);
    const n = tan(t);
    const w = 3.2 * (1 - t) + 0.4;
    top.push(`${r(p.x - n.y * w)},${r(p.y + n.x * w)}`);
    bottom.unshift(`${r(p.x + n.y * w)},${r(p.y - n.x * w)}`);
  }
  d += `M${top.join('L')}L${bottom.join('L')}Z`;

  // Leaflets: curved blades on both sides, longest mid-frond, drooping.
  for (let i = 1; i <= leaflets; i++) {
    const t = 0.08 + (i / leaflets) * 0.9;
    const p = pt(t);
    const n = tan(t);
    const len = length * (0.17 + 0.2 * Math.sin(Math.PI * Math.min(1, t * 1.15))) * (0.88 + rand() * 0.24);
    for (const side of [-1, 1]) {
      const spread = side * (0.95 + rand() * 0.25);
      // Leaflets sweep forward along the rachis and sag with gravity.
      const dirX = n.x * 0.55 - n.y * spread;
      const dirY = n.y * 0.55 + n.x * spread + 0.55;
      const m = Math.hypot(dirX, dirY);
      const ux = dirX / m;
      const uy = dirY / m;
      const tip = { x: p.x + ux * len, y: p.y + uy * len };
      const base2 = pt(Math.min(1, t + 0.022));
      const bulge = len * 0.13;
      const c1 = { x: p.x + ux * len * 0.5 - uy * bulge, y: p.y + uy * len * 0.5 + ux * bulge };
      const c2 = { x: p.x + ux * len * 0.5 + uy * bulge * 0.4, y: p.y + uy * len * 0.5 - ux * bulge * 0.4 };
      d += `M${r(p.x)},${r(p.y)}Q${r(c1.x)},${r(c1.y)} ${r(tip.x)},${r(tip.y)}Q${r(c2.x)},${r(c2.y)} ${r(base2.x)},${r(base2.y)}Z`;
    }
  }
  return d;
}

export interface PalmOptions {
  baseX: number;
  baseY: number;
  height: number;
  lean: number;
  baseWidth?: number;
  frondLength?: number;
  seed?: number;
}

export function palm(o: PalmOptions): PalmArt {
  const { baseX, baseY, height, lean } = o;
  const bw = o.baseWidth ?? height * 0.075;
  const tw = bw * 0.55;
  const fl = o.frondLength ?? height * 0.55;
  const seed = o.seed ?? 7;

  // Trunk follows a quadratic curve: base → crown with a gentle lean.
  const crown = { x: baseX + lean, y: baseY - height };
  const ctrl = { x: baseX + lean * 0.15, y: baseY - height * 0.55 };
  const at = (t: number) => ({
    x: (1 - t) * (1 - t) * baseX + 2 * (1 - t) * t * ctrl.x + t * t * crown.x,
    y: (1 - t) * (1 - t) * baseY + 2 * (1 - t) * t * ctrl.y + t * t * crown.y,
  });
  const left: string[] = [];
  const right: string[] = [];
  let rings = '';
  const steps = 24;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const p = at(t);
    // Slight bulge at the foot, like a real palm.
    const w = (tw + (bw - tw) * (1 - t)) / 2 + (t < 0.08 ? (0.08 - t) * bw * 2.2 : 0);
    left.push(`${r(p.x - w)},${r(p.y)}`);
    right.unshift(`${r(p.x + w)},${r(p.y)}`);
  }
  const ringCount = Math.round(height / 16);
  for (let i = 1; i < ringCount; i++) {
    const t = i / ringCount;
    const p = at(t);
    const w = (tw + (bw - tw) * (1 - t)) / 2;
    rings += `M${r(p.x - w * 0.92)},${r(p.y)}Q${r(p.x)},${r(p.y + 3.2)} ${r(p.x + w * 0.92)},${r(p.y - 0.6)}`;
  }

  const rand = rng(seed);
  const fronds: Frond[] = [];
  // Angles in degrees for a frond drawn to the right; left fronds are mirrored.
  const spec: Array<[number, 'L' | 'R', number, Frond['tone']]> = [
    [-8, 'L', 1.0, 'dark'],
    [-8, 'R', 1.0, 'dark'],
    [-34, 'L', 0.95, 'mid'],
    [-30, 'R', 0.98, 'mid'],
    [-62, 'L', 0.82, 'mid'],
    [-58, 'R', 0.84, 'mid'],
    [-84, 'R', 0.62, 'light'],
    [18, 'L', 0.86, 'light'],
    [20, 'R', 0.84, 'light'],
  ];
  spec.forEach(([angle, side, scale, tone], i) => {
    const len = fl * scale * (0.92 + rand() * 0.14);
    const droop = 0.38 + rand() * 0.22 + (angle > 0 ? 0.25 : 0);
    const flip = side === 'L' ? ' scale(-1,1)' : '';
    fronds.push({
      d: frondPath(len, droop, 24, seed + i * 13),
      transform: `translate(${r(crown.x)},${r(crown.y)})${flip} rotate(${angle})`,
      tone,
    });
  });
  // Paint order: dark (back) → light (front).
  const order = { dark: 0, mid: 1, light: 2 };
  fronds.sort((a, b) => order[a.tone] - order[b.tone]);

  return {
    trunk: `M${left.join('L')}L${right.join('L')}Z`,
    rings,
    crown,
    fronds,
  };
}

/** A quick silhouette palm for distant layers: one path, one fill. */
export function silhouettePalm(baseX: number, baseY: number, height: number, lean: number, seed: number): string {
  const p = palm({ baseX, baseY, height, lean, seed, frondLength: height * 0.5 });
  return p.trunk + p.fronds.map((f) => transformPath(f.d, f.transform)).join('');
}

/**
 * Bakes translate/scale/rotate transforms into path coordinates so silhouettes
 * can be merged into a single path element.
 */
function transformPath(d: string, transform: string): string {
  const tr = /translate\(([-\d.]+),([-\d.]+)\)/.exec(transform)!;
  const tx = parseFloat(tr[1]);
  const ty = parseFloat(tr[2]);
  const sx = transform.includes('scale(-1,1)') ? -1 : 1;
  const rot = /rotate\(([-\d.]+)\)/.exec(transform);
  const a = ((rot ? parseFloat(rot[1]) : 0) * Math.PI) / 180;
  const cos = Math.cos(a);
  const sin = Math.sin(a);
  return d.replace(/(-?[\d.]+),(-?[\d.]+)/g, (_, xs, ys) => {
    const x = parseFloat(xs);
    const y = parseFloat(ys);
    const rx = x * cos - y * sin;
    const ry = x * sin + y * cos;
    return `${r(rx * sx + tx)},${r(ry + ty)}`;
  });
}
