import { Component, DestroyRef, ElementRef, afterNextRender, inject, input } from '@angular/core';
import { gsap } from 'gsap';
import { LAND_DOTS } from '../art/land-dots';
import { reducedMotion } from '../motion/smooth-scroll.service';

type Vec = [number, number, number];

const RAD = Math.PI / 180;
const toVec = (lon: number, lat: number): Vec => [
  Math.cos(lat * RAD) * Math.cos(lon * RAD),
  Math.cos(lat * RAD) * Math.sin(lon * RAD),
  Math.sin(lat * RAD),
];

/** South Indian coast, where the routes start. */
const ORIGIN = toVec(78.1, 8.8);
/** Unlabelled ports in the main coconut-importing regions; illustrative, not a customer list. */
const PORTS = [
  [55.3, 25.3], [4.5, 51.9], [121.5, 31.2], [103.8, 1.3], [39.7, -4.0], [151.2, -33.9], [-74.0, 40.7],
].map(([lon, lat]) => toVec(lon, lat));

let landCache: Float32Array | null = null;
const land = () => {
  if (!landCache) {
    landCache = new Float32Array((LAND_DOTS.length / 2) * 3);
    for (let i = 0, j = 0; i < LAND_DOTS.length; i += 2, j += 3) {
      const v = toVec(LAND_DOTS[i], LAND_DOTS[i + 1]);
      landCache[j] = v[0];
      landCache[j + 1] = v[1];
      landCache[j + 2] = v[2];
    }
  }
  return landCache;
};

const THEMES = {
  dark: {
    oceanIn: '#17442a', oceanOut: '#0b2213', rim: 'rgba(220,231,211,0.55)', glow: 'rgba(78,154,85,0.28)',
    landFront: '#9fd08f', landBack: '#3f7f4a', arc: '#f2f5ee', ship: '#c4925c', box: '#4e9a55', port: '#dce7d3', origin: '#e0b072',
  },
  light: {
    oceanIn: '#f6faf2', oceanOut: '#dfe9da', rim: 'rgba(23,61,36,0.55)', glow: 'rgba(47,125,63,0.10)',
    landFront: '#2f7d3f', landBack: '#a9c7a3', arc: '#2f7d3f', ship: '#7a4a24', box: '#173d24', port: '#173d24', origin: '#7a4a24',
  },
};

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * A dotted globe drawn on canvas. The parent drives `setProgress(0..1)` from
 * its scroll timeline: the globe turns to bring India forward, then routes
 * lift off the coast one by one and container ships start sailing them.
 */
@Component({
  selector: 'app-globe',
  template: `<canvas aria-hidden="true"></canvas>`,
  styles: `
    :host {
      display: block;
      position: relative;
    }
    canvas {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
    }
  `,
})
export class Globe {
  readonly theme = input<'dark' | 'light'>('dark');

  private readonly host = inject(ElementRef<HTMLElement>);
  private ctx?: CanvasRenderingContext2D;
  private size = 0;
  private dpr = 1;
  private progress = 0;
  private visible = false;
  private time = 0;
  private readonly tick = (t: number) => {
    this.time = t;
    this.draw();
  };

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const el = this.host.nativeElement as HTMLElement;
      const canvas = el.querySelector('canvas')!;
      this.ctx = canvas.getContext('2d')!;
      const resize = () => {
        this.dpr = Math.min(2, window.devicePixelRatio || 1);
        this.size = Math.min(el.clientWidth, el.clientHeight);
        canvas.width = Math.round(el.clientWidth * this.dpr);
        canvas.height = Math.round(el.clientHeight * this.dpr);
        this.draw();
      };
      const ro = new ResizeObserver(resize);
      ro.observe(el);
      resize();

      if (reducedMotion()) {
        this.progress = 1;
        this.draw();
        destroyRef.onDestroy(() => ro.disconnect());
        return;
      }
      // Ships and pulses run on the shared GSAP clock, only while on screen.
      const io = new IntersectionObserver(([e]) => {
        if (e.isIntersecting && !this.visible) gsap.ticker.add(this.tick);
        if (!e.isIntersecting && this.visible) gsap.ticker.remove(this.tick);
        this.visible = e.isIntersecting;
      });
      io.observe(el);
      destroyRef.onDestroy(() => {
        ro.disconnect();
        io.disconnect();
        gsap.ticker.remove(this.tick);
      });
    });
  }

  setProgress(p: number): void {
    this.progress = p;
    if (!this.visible) this.draw();
  }

  private draw(): void {
    const ctx = this.ctx;
    if (!ctx || !this.size) return;
    const c = THEMES[this.theme()];
    const dpr = this.dpr;
    const W = ctx.canvas.width;
    const H = ctx.canvas.height;
    const cx = W / 2;
    const cy = H / 2;
    const R = this.size * 0.4 * dpr;
    const p = this.progress;
    const t = this.time;

    // View: turn from the Atlantic to the Indian Ocean, then breathe gently.
    const lon0 = (-30 + 108 * easeOut(clamp(p / 0.5)) + Math.sin(t * 0.3) * 4 * clamp((p - 0.5) / 0.2)) * RAD;
    const lat0 = (22 - 10 * easeOut(clamp(p / 0.5))) * RAD;
    const cl = Math.cos(lon0), sl = Math.sin(lon0), cp = Math.cos(lat0), sp = Math.sin(lat0);
    const project = (X: number, Y: number, Z: number) => {
      const x1 = X * cl + Y * sl;
      const y1 = -X * sl + Y * cl;
      return { x: y1, y: Z * cp - x1 * sp, z: x1 * cp + Z * sp };
    };

    ctx.clearRect(0, 0, W, H);

    // Atmosphere and ocean.
    const glow = ctx.createRadialGradient(cx, cy, R * 0.95, cx, cy, R * 1.22);
    glow.addColorStop(0, c.glow);
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);

    const ocean = ctx.createRadialGradient(cx - R * 0.35, cy - R * 0.4, R * 0.1, cx, cy, R);
    ocean.addColorStop(0, c.oceanIn);
    ocean.addColorStop(1, c.oceanOut);
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fillStyle = ocean;
    ctx.fill();

    // Land dots, three depth bands so the limb falls away softly.
    const L = land();
    const dot = Math.max(1, R * 0.0075);
    const bands: Path2D[] = [new Path2D(), new Path2D(), new Path2D()];
    for (let i = 0; i < L.length; i += 3) {
      const q = project(L[i], L[i + 1], L[i + 2]);
      if (q.z <= 0.02) continue;
      const b = q.z > 0.6 ? 2 : q.z > 0.3 ? 1 : 0;
      const x = cx + q.x * R;
      const y = cy - q.y * R;
      bands[b].moveTo(x + dot, y);
      bands[b].arc(x, y, dot * (0.75 + q.z * 0.35), 0, Math.PI * 2);
    }
    ctx.fillStyle = c.landBack;
    ctx.globalAlpha = 0.55;
    ctx.fill(bands[0]);
    ctx.globalAlpha = 0.8;
    ctx.fill(bands[1]);
    ctx.fillStyle = c.landFront;
    ctx.globalAlpha = 1;
    ctx.fill(bands[2]);

    // Rim.
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.strokeStyle = c.rim;
    ctx.lineWidth = 1.2 * dpr;
    ctx.stroke();

    // Origin port, pulsing.
    const o = project(...ORIGIN);
    const ox = cx + o.x * R;
    const oy = cy - o.y * R;
    if (o.z > 0) {
      const pulse = (t * 0.6) % 1;
      ctx.beginPath();
      ctx.arc(ox, oy, R * (0.03 + pulse * 0.07), 0, Math.PI * 2);
      ctx.strokeStyle = c.origin;
      ctx.globalAlpha = 1 - pulse;
      ctx.lineWidth = 2 * dpr;
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    // Routes: great-circle arcs lifted off the surface, drawn out in turn.
    PORTS.forEach((dest, i) => {
      const reveal = clamp((p - 0.42 - i * 0.05) / 0.26);
      if (reveal <= 0) return;
      const omega = Math.acos(Math.min(1, ORIGIN[0] * dest[0] + ORIGIN[1] * dest[1] + ORIGIN[2] * dest[2]));
      const lift = 0.08 + omega * 0.12;
      const at = (s: number) => {
        const a = Math.sin((1 - s) * omega) / Math.sin(omega);
        const b = Math.sin(s * omega) / Math.sin(omega);
        const h = 1 + Math.sin(Math.PI * s) * lift;
        const q = project(
          (a * ORIGIN[0] + b * dest[0]) * h,
          (a * ORIGIN[1] + b * dest[1]) * h,
          (a * ORIGIN[2] + b * dest[2]) * h,
        );
        const shown = q.z > 0 || q.x * q.x + q.y * q.y > 1;
        return { x: cx + q.x * R, y: cy - q.y * R, shown };
      };

      ctx.beginPath();
      let pen = false;
      const steps = 48;
      for (let k = 0; k <= steps * reveal; k++) {
        const pt = at(k / steps);
        if (!pt.shown) {
          pen = false;
          continue;
        }
        if (pen) ctx.lineTo(pt.x, pt.y);
        else ctx.moveTo(pt.x, pt.y);
        pen = true;
      }
      ctx.strokeStyle = c.arc;
      ctx.lineWidth = 1.8 * dpr;
      ctx.lineCap = 'round';
      ctx.globalAlpha = 0.9;
      ctx.stroke();
      ctx.globalAlpha = 1;

      if (reveal < 1) return;
      // Port: a dot and a slow pulse.
      const d = at(1);
      if (d.shown) {
        ctx.beginPath();
        ctx.arc(d.x, d.y, 3.4 * dpr, 0, Math.PI * 2);
        ctx.fillStyle = c.port;
        ctx.fill();
        const pp = (t * 0.45 + i * 0.3) % 1;
        ctx.beginPath();
        ctx.arc(d.x, d.y, (4 + pp * 12) * dpr, 0, Math.PI * 2);
        ctx.strokeStyle = c.port;
        ctx.globalAlpha = (1 - pp) * 0.6;
        ctx.lineWidth = 1.2 * dpr;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
      // A container ship sailing the route, oriented along it.
      const s = (t * 0.07 + i * 0.19) % 1;
      const a = at(s);
      const b = at(Math.min(1, s + 0.01));
      if (!a.shown) return;
      const ang = Math.atan2(b.y - a.y, b.x - a.x);
      ctx.save();
      ctx.translate(a.x, a.y);
      ctx.rotate(ang);
      const u = 3 * dpr;
      ctx.fillStyle = c.ship;
      ctx.beginPath();
      ctx.moveTo(-3.2 * u, -0.9 * u);
      ctx.lineTo(3.2 * u, -0.9 * u);
      ctx.lineTo(2.2 * u, 1 * u);
      ctx.lineTo(-2.6 * u, 1 * u);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = c.box;
      ctx.fillRect(-2 * u, -2.2 * u, 1.7 * u, 1.3 * u);
      ctx.fillRect(0, -2.2 * u, 1.7 * u, 1.3 * u);
      ctx.restore();
    });

    // Origin dot on top of everything.
    if (o.z > 0) {
      ctx.beginPath();
      ctx.arc(ox, oy, 5 * dpr, 0, Math.PI * 2);
      ctx.fillStyle = c.origin;
      ctx.fill();
    }
  }
}
