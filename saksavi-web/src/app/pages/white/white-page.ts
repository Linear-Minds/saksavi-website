import { Component, DestroyRef, ElementRef, afterNextRender, inject, signal, viewChild } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { palm, silhouettePalm } from '../../art/palm';
import { GOODS, PAPERS } from '../../content';
import { ConsignmentForm } from '../../consignment/consignment-form';
import { InkStamp } from '../../ink-stamp/ink-stamp';
import { Globe } from '../../globe/globe';
import { OptionSwitch } from '../../option-switch/option-switch';
import { SmoothScroll, reducedMotion } from '../../motion/smooth-scroll.service';

/** Ground line of the lower scenes, in SVG units (viewBox 1600 x 900). */
const GROUND = 780;
const LEAD = 1;

/**
 * Seconds per beat, indexed by the stop each beat ends on scrolling down:
 * 1 the palm grows, 2 the nuts grow, ripen, fall and land, 3 the truck leaves, 4 the routes go out.
 */
const BEAT_SECONDS = [0, 2.2, 5.4, 3.4, 3.4];

/**
 * Option B: a white page told section by section, top to bottom.
 * One scroll grows the palm; the next grows the nuts and drops them down the
 * page into the truck waiting in the section below; the next drives it away;
 * the last ships the goods worldwide.
 */
@Component({
  selector: 'app-white-page',
  imports: [ConsignmentForm, InkStamp, OptionSwitch, Globe],
  templateUrl: './white-page.html',
  styleUrl: './white-page.scss',
})
export class WhitePage {
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly scroll = inject(SmoothScroll);

  protected readonly goods = GOODS;
  protected readonly papers = PAPERS;
  protected readonly year = new Date().getFullYear();
  protected readonly steps = ['Grown', 'Ripened', 'Collected', 'Shipped'];
  protected readonly active = signal(0);
  protected readonly railOn = signal(false);

  /** Section 1: the palm that grows from a sapling. */
  protected readonly young = palm({ baseX: 1060, baseY: GROUND + 10, height: 600, lean: 50, frondLength: 300, seed: 41 });
  protected readonly grove = [
    [180, 300, 20], [420, 360, -18], [1420, 330, -22], [1560, 280, 18],
  ]
    .map(([x, h, l], i) => silhouettePalm(x, GROUND, h, l, 61 + i * 7))
    .join('');

  /**
   * Sections 2 and 3 share one tall palm: its crown fills section 2 and its
   * trunk continues into section 3 (drawn there shifted up by one screen).
   */
  protected readonly tall = palm({ baseX: 1100, baseY: 900 + GROUND, height: 1480, lean: 70, baseWidth: 74, frondLength: 450, seed: 41 });

  protected readonly nuts = [
    [-70, 62, 38], [0, 82, 42], [70, 56, 38], [-36, 138, 40], [40, 148, 39], [-108, 118, 36], [104, 122, 37],
  ].map(([dx, dy, r]) => ({ x: this.tall.crown.x + dx, y: this.tall.crown.y + dy, r }));

  /** Where each nut lands in the truck bed (truck-local units). */
  protected readonly slots = this.nuts.map((_, i) => ({ x: 30 + i * 29, y: -184 - (i % 2) * 14, r: 17 + (i % 3) }));

  protected readonly globe = viewChild(Globe);
  protected readonly leaves = [0, 1, 2];
  protected readonly cos = (deg: number) => Math.cos((deg * Math.PI) / 180);
  protected readonly sin = (deg: number) => Math.sin((deg * Math.PI) / 180);

  private pins: ScrollTrigger[] = [];

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const root = this.host.nativeElement as HTMLElement;
      // White ground for overscroll and the scrollbar while this page is mounted.
      document.documentElement.classList.add('theme-white');
      destroyRef.onDestroy(() => document.documentElement.classList.remove('theme-white'));
      if (reducedMotion()) {
        root.classList.add('static');
        return;
      }
      const ctx = gsap.context(() => this.build(root), root);
      const offSnap = this.snapSections();
      destroyRef.onDestroy(() => {
        offSnap();
        ctx.revert();
      });
    });
  }

  protected go(event: Event, target: string): void {
    event.preventDefault();
    this.scroll.to(target);
  }

  /** "Watch it grow": the first section-scroll, on demand. */
  protected next(event: Event): void {
    event.preventDefault();
    const stop = this.stops().find((s) => s > window.scrollY + 4);
    if (stop != null) this.scroll.glide(stop, 2);
  }

  private build(root: HTMLElement): void {
    const q = gsap.utils.selector(root);
    const pin = (sel: string, length: string, tl: gsap.core.Timeline) => {
      const st = ScrollTrigger.create({
        trigger: sel,
        start: 'top top',
        end: `+=${length}`,
        pin: true,
        scrub: 0.8,
        animation: tl,
      });
      this.pins.push(st);
    };

    // Load: the opening statement rises in; the sapling waits for the first scroll.
    gsap
      .timeline({ defaults: { ease: 'expo.out', duration: 1.3 } })
      .from('.s-grow .ln', { yPercent: 110, stagger: 0.08 }, 0.15)
      .from('.s-grow .lede, .s-grow .actions', { opacity: 0, y: 18, stagger: 0.1 }, 0.55);

    // 01 Grown: the sapling becomes a full palm.
    const base = `${this.young.crown.x - 50} ${GROUND + 10}`;
    gsap.set('.young-body', { scale: 0.14, svgOrigin: base });
    gsap.set('.young-frond', { scale: 0.2, svgOrigin: `${this.young.crown.x} ${this.young.crown.y}` });
    gsap.set('.grove', { opacity: 0, y: 30 });
    pin(
      '.s-grow',
      '100%',
      gsap
        .timeline({ defaults: { ease: 'none' } })
        .to('.young-body', { scale: 1, duration: 1, ease: 'power2.out' })
        .to('.young-frond', { scale: 1, duration: 0.6, stagger: 0.04, ease: 'back.out(1.4)' }, 0.35)
        .to('.grove', { opacity: 1, y: 0, duration: 0.6 }, 0.3),
    );

    // 02 Ripened: one nut swells first, the cluster fills and turns brown.
    const nutEls = q('.s-ripen .nut');
    gsap.set(nutEls, { scale: 0, transformOrigin: '50% 50%' });
    pin(
      '.s-ripen',
      '100%',
      gsap
        .timeline({ defaults: { ease: 'none' } })
        .to(nutEls[LEAD], { scale: 1.3, duration: 0.5, ease: 'back.out(1.6)' })
        .to(nutEls.filter((_, i) => i !== LEAD), { scale: 1, duration: 0.4, stagger: 0.06, ease: 'back.out(1.8)' }, 0.3)
        .to('.s-ripen .unripe', { opacity: 0, duration: 0.5, stagger: 0.04 }, 0.6)
        .to(nutEls[LEAD], { scale: 1, duration: 0.3 }, 1.0)
        // Ripe and heavy: the crown sways and the nuts tremble on their stalks before letting go.
        .to('.tall-crown', { rotate: 1.5, svgOrigin: `${this.tall.crown.x} ${this.tall.crown.y}`, duration: 0.2, yoyo: true, repeat: 1 }, 1.1)
        .to(nutEls, { rotate: 9, duration: 0.07, yoyo: true, repeat: 3, stagger: 0.02, ease: 'sine.inOut' }, 1.15),
    );

    // The fall: as section 3 rises, the nuts drop down the page into the arriving truck.
    ScrollTrigger.create({
      trigger: '.s-collect',
      start: 'top bottom',
      end: 'top top',
      onUpdate: (self) => this.fall(root, self.progress),
      onRefresh: (self) => this.fall(root, self.progress),
    });

    // 03 Collected: loaded, the truck pulls away.
    pin(
      '.s-collect',
      '100%',
      gsap
        .timeline({ defaults: { ease: 'none' } })
        .to('.truck-out', { x: 1500, duration: 1, ease: 'power2.in' })
        .to('.spin-out', { rotate: 1080, transformOrigin: '50% 50%', duration: 1, ease: 'power2.in' }, 0)
        .to('.dust', { opacity: 0.5, x: -60, duration: 0.3 }, 0.1)
        .to('.dust', { opacity: 0, duration: 0.3 }, 0.6),
    );

    // 04 Shipped: the globe turns India forward, routes lift off, the ship crosses, the stamp lands.
    const globe = { p: 0 };
    gsap.set('.s-ship .globe', { scale: 0.85, opacity: 0 });
    gsap.set('.s-ship .stamp', { scale: 2.4, autoAlpha: 0, rotate: -16 });
    this.globe()?.setProgress(0);
    pin(
      '.s-ship',
      '150%',
      gsap
        .timeline({ defaults: { ease: 'none' } })
        .to('.s-ship .globe', { scale: 1, opacity: 1, duration: 0.35, ease: 'power2.out' }, 0)
        .to(globe, { p: 1, duration: 1.0, onUpdate: () => this.globe()?.setProgress(globe.p) }, 0.05)
        .fromTo('.ship', { x: -900 }, { x: 220, duration: 1.0, ease: 'power1.out' }, 0.1)
        .to('.s-ship .stamp', { scale: 1, autoAlpha: 1, rotate: -8, duration: 0.15, ease: 'power4.in' }, 1.0),
    );

    // Side rail: shown while the story runs; the lit step follows the section on screen.
    ScrollTrigger.create({
      trigger: '.story',
      start: 'top top',
      end: 'bottom bottom',
      onToggle: (self) => this.railOn.set(self.isActive),
      onUpdate: (self) => {
        const y = self.scroll() + window.innerHeight * 0.5;
        const starts = this.pins.map((p) => p.start);
        this.active.set(Math.max(0, starts.filter((s) => s <= y).length - 1));
      },
    });
  }

  /** Positions the falling nuts between the crown above and the truck bed below. */
  private fall(root: HTMLElement, p: number): void {
    const crownNuts = root.querySelectorAll<SVGGElement>('.s-ripen .nut');
    const slots = root.querySelectorAll<SVGCircleElement>('.bed-slot');
    const fallers = root.querySelectorAll<HTMLElement>('.fall-nut');
    const truckIn = root.querySelector<SVGGElement>('.truck-in');
    const spins = root.querySelectorAll<SVGGElement>('.spin-in');

    // The truck rolls in during the first 60% and is parked before the first nut lands.
    const e = 1 - Math.pow(1 - Math.min(1, p / 0.6), 3);
    truckIn?.setAttribute('transform', `translate(${(-1 + e) * 1250},0)`);
    spins.forEach((s) => s.setAttribute('transform', `rotate(${e * 900})`));

    // Braking under the palm: brake light on, dust kicks up from the tyres.
    const bell = (x: number) => (x > 0 && x < 1 ? Math.sin(Math.PI * x) : 0);
    const brake = bell((p - 0.42) / 0.32);
    root.querySelector('.brake-dust')?.setAttribute('opacity', (brake * 0.9).toFixed(3));
    root.querySelector('.brake-dust')?.setAttribute('transform', `translate(${-brake * 18},${-brake * 6})`);
    root.querySelector('.brake-light')?.setAttribute('fill', brake > 0.15 ? '#e8503c' : '#a3341f');

    // Each landing pushes the body down on its springs, and it settles back.
    let squat = 0;
    for (let i = 0; i < 7; i++) squat += bell((p - (0.82 + i * 0.03)) / 0.07) * 3.2;
    root.querySelector('.suspension')?.setAttribute('transform', `translate(0,${squat.toFixed(2)})`);

    const falling = p > 0 && p < 1;
    root.classList.toggle('nuts-falling', falling);
    root.classList.toggle('nuts-landed', p >= 1);
    if (!falling) return;

    // Loose leaves drift down slower than the nuts, swaying as they go.
    const crown = crownNuts[0]?.getBoundingClientRect();
    const bed = slots[0]?.getBoundingClientRect();
    if (crown && bed) {
      root.querySelectorAll<HTMLElement>('.fall-leaf').forEach((leaf, i) => {
        const t = Math.min(1, Math.max(0, (p - i * 0.12) / 0.95));
        const x = crown.left + (i - 1) * 60 + Math.sin(t * 9 + i * 2) * 46 - t * 120;
        const y = crown.top + (bed.bottom + 40 - crown.top) * t;
        leaf.style.opacity = t > 0 && t < 1 ? String(1 - t * 0.6) : '0';
        leaf.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${Math.sin(t * 9 + i) * 60 + i * 40}deg)`;
      });
    }

    fallers.forEach((el, i) => {
      const a = crownNuts[i]?.getBoundingClientRect();
      const b = slots[i]?.getBoundingClientRect();
      if (!a || !b) return;
      const t = Math.min(1, Math.max(0, (p - 0.12 - i * 0.03) / 0.7));
      const ax = a.left + a.width / 2;
      const ay = a.top + a.height / 2;
      const bx = b.left + b.width / 2;
      const by = b.top + b.height / 2;
      const w = a.width + (b.width - a.width) * t;
      const h = a.height + (b.height - a.height) * t;
      const x = ax + (bx - ax) * t;
      const y = ay + (by - ay) * t * t; // gravity: slow off the crown, fast into the bed
      el.style.width = `${w}px`;
      el.style.height = `${h}px`;
      el.style.transform = `translate3d(${x - w / 2}px, ${y - h / 2}px, 0) rotate(${t * 320 + i * 40}deg)`;
    });
  }

  /**
   * Scroll stops, one gesture per beat: the palm grows; the nuts grow, ripen
   * and fall into the truck; the truck leaves and the ship section arrives;
   * the routes go worldwide.
   */
  private stops(): number[] {
    const [grow, , collect, ship] = this.pins;
    if (!ship) return [];
    return [grow.start, grow.end, collect.start, ship.start, ship.end];
  }

  /** Per-section scrolling: a scroll from a stop glides to the next stop in that direction. */
  private snapSections(): () => void {
    if (!this.scroll.active) return () => {};
    let gliding = false;
    let resting = true; // the page opens on the first stop
    let cooldown = 0;
    let idle: ReturnType<typeof setTimeout> | undefined;
    let dir = 1;

    const nearStop = (y: number) => this.stops().some((s) => Math.abs(s - y) < 3);

    const glideFrom = (y: number) => {
      const stops = this.stops();
      if (!stops.length || y > stops[stops.length - 1] + 2) return; // past the story: free scroll
      const target = dir > 0 ? stops.find((s) => s > y + 2) : [...stops].reverse().find((s) => s < y - 2);
      if (target == null) return;
      gliding = true;
      // Each beat has its own pace; the coconut beat (grow, ripen, fall, catch) is the long one.
      const idx = stops.indexOf(target);
      const paced = BEAT_SECONDS[dir > 0 ? idx : idx + 1];
      const screens = Math.abs(target - y) / window.innerHeight;
      this.scroll.glide(target, paced || Math.min(3, Math.max(1, screens * 1.1)), () => {
        gliding = false;
        resting = true;
        cooldown = performance.now() + 280;
      });
    };

    const off = this.scroll.onScroll((y, d) => {
      if (d) dir = d;
      if (gliding || performance.now() < cooldown) return;
      // Leaving a stop starts the next beat at once.
      if (resting) {
        resting = false;
        glideFrom(y);
        return;
      }
      // Anywhere else (e.g. scrolling back up from the goods), settle after a pause.
      clearTimeout(idle);
      idle = setTimeout(() => {
        if (gliding) return;
        if (nearStop(window.scrollY)) resting = true;
        else glideFrom(window.scrollY);
      }, 140);
    });
    return () => {
      clearTimeout(idle);
      off();
    };
  }
}
