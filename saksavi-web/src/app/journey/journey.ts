import { Component, DestroyRef, ElementRef, afterNextRender, inject, signal, viewChild } from '@angular/core';
import { gsap } from 'gsap';
import { frondPath, palm, silhouettePalm } from '../art/palm';
import { STAGES } from '../content';
import { ConsignmentForm } from '../consignment/consignment-form';
import { InkStamp } from '../ink-stamp/ink-stamp';
import { Globe } from '../globe/globe';
import { SmoothScroll, reducedMotion } from '../motion/smooth-scroll.service';

interface Pt {
  x: number;
  y: number;
}

/** World layout, in SVG units. The viewBox is 1600 wide; the world runs to 5600. */
const VIEW_CENTER = 800;
const GROUND = 790;
const PALM_BASE: Pt = { x: 700, y: 772 };
const TRUCK_PARK = 800;
const TRUCK_PORT = 3420;
const BOX: Pt = { x: 3830, y: GROUND - 70 }; // container on the quay, top-left
const DECK_Y = 700;
const SHIP_SLOT = 4640; // where the container lands on deck
const LEAD = 1; // the coconut that grows first

/** Where the camera looks in each beat. Phones see ~600 units, so they frame tighter. */
const FOCUS = {
  desktop: { open: 420, grove: 800, port: 3700, crane: 4400, sail: 4900 },
  phone: { open: 720, grove: 900, port: 3700, crane: 4500, sail: 4950 },
};

@Component({
  selector: 'app-journey',
  imports: [ConsignmentForm, InkStamp, Globe],
  templateUrl: './journey.html',
  styleUrl: './journey.scss',
  host: { '(document:keydown.escape)': 'closeForm()' },
})
export class Journey {
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly scroll = inject(SmoothScroll);
  protected readonly globe = viewChild(Globe);

  protected readonly stages = STAGES;
  protected readonly palm = palm({ baseX: PALM_BASE.x, baseY: PALM_BASE.y, height: 560, lean: 40, frondLength: 290, seed: 41 });
  protected readonly crown = this.palm.crown;

  protected readonly backPalms = [
    [120, 300, 24], [300, 360, -20], [470, 260, 18], [1180, 330, -26], [1360, 290, 22],
    [1700, 300, 20], [1980, 350, -18], [2240, 270, 24], [2600, 320, -22], [2880, 290, 16], [3120, 250, -14],
  ]
    .map(([x, h, l], i) => silhouettePalm(x, GROUND - 40, h, l, 51 + i * 7))
    .join('');
  protected readonly midPalms = [
    [40, 470, 46], [1460, 430, -40], [2050, 450, 36], [2780, 420, -34],
  ]
    .map(([x, h, l], i) => silhouettePalm(x, GROUND - 10, h, l, 97 + i * 5))
    .join('');

  /** Foreground fronds that cross the frame edge, for depth. */
  protected readonly fgFrond = frondPath(760, 0.42, 30, 5);

  /** Seven nuts: where they hang, where they land, where they ride. */
  protected readonly nuts = [
    [-40, 34], [0, 44], [40, 30], [-20, 76], [22, 82], [-58, 66], [56, 68],
  ].map(([dx, dy], i) => ({
    hang: { x: this.crown.x + dx, y: this.crown.y + dy },
    land: { x: 520 + i * 36 + (i % 2) * 6, y: GROUND - 40 - (i === 3 ? 40 : 0) },
    bed: { x: TRUCK_PARK + 34 + i * 30, y: GROUND - 178 - (i % 2) * 14 },
    r: 21 + (i % 3) * 2,
  }));

  /** The truck's own load, in truck-local coordinates, shown once the loose nuts are aboard. */
  protected readonly load = this.nuts.map((n) => ({ x: n.bed.x - TRUCK_PARK, y: n.bed.y - GROUND, r: n.r }));

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const root = this.host.nativeElement as HTMLElement;
      const phoneQuery = window.matchMedia('(max-width: 900px)');
      const syncPhone = () => this.phone.set(phoneQuery.matches);
      syncPhone();
      phoneQuery.addEventListener('change', syncPhone);
      destroyRef.onDestroy(() => phoneQuery.removeEventListener('change', syncPhone));
      if (reducedMotion()) {
        root.classList.add('static');
        return;
      }
      const intro = gsap.context(() => this.intro(), root);
      const mm = gsap.matchMedia(root);
      mm.add({ phone: '(max-width: 900px)', desktop: '(min-width: 901px)' }, (c) => {
        this.build(root, c.conditions!['phone'] ? FOCUS.phone : FOCUS.desktop, !!c.conditions!['phone']);
      });
      destroyRef.onDestroy(() => {
        intro.revert();
        mm.revert();
      });
    });
  }

  /** Phones: the quote form slides up over the scene from the opening statement. */
  protected readonly formOpen = signal(false);
  protected readonly phone = signal(false);

  protected openForm(): void {
    this.formOpen.set(true);
    setTimeout(() => (this.host.nativeElement as HTMLElement).querySelector<HTMLElement>('.form-slot select')?.focus({ preventScroll: true }), 320);
  }

  protected closeForm(): void {
    if (!this.formOpen()) return;
    this.formOpen.set(false);
    (this.host.nativeElement as HTMLElement).querySelector<HTMLElement>('.phone-quote')?.focus({ preventScroll: true });
  }

  protected toConsignment(event: Event): void {
    event.preventDefault();
    this.scroll.to('#consignment');
  }

  /** Page load: the document assembles over the grove. Inner elements only, so the scroll timeline owns the containers. */
  private intro(): void {
    gsap
      .timeline({ defaults: { ease: 'expo.out', duration: 1.4 } })
      .from('.scene', { opacity: 0, duration: 1.2, ease: 'power1.out' })
      .from('.statement .ln', { yPercent: 110, stagger: 0.08 }, 0.2)
      .from('.statement .sub', { opacity: 0, y: 16 }, 0.65)
      .from('.form-slot > *', { y: 40, opacity: 0 }, 0.5)
      .from('.strip ol', { opacity: 0 }, 0.8);
  }

  private build(root: HTMLElement, F: (typeof FOCUS)['desktop'], phone: boolean): void {
    const q = gsap.utils.selector(root);
    const nutEls = q('.nut');
    const stripItems = q('.strip li');
    const camera = (focus: number) => VIEW_CENTER - focus;

    // Frame 0 is the hero: palm right of the statement, young nuts on the crown.
    gsap.set('.world', { x: camera(F.open) });
    gsap.set('.frond-wrap', { rotate: 0, svgOrigin: `${this.crown.x} ${this.crown.y}` });
    nutEls.forEach((el, i) => gsap.set(el, { ...this.nuts[i].hang, scale: 0.62 }));
    gsap.set('.truck', { x: -1100, y: GROUND });
    gsap.set('.truck-load', { opacity: 0 });
    gsap.set('.port-nut', { x: TRUCK_PORT + 120, y: GROUND - 180, opacity: 0 });
    gsap.set('.globe', { scale: 0.7, opacity: 0 });
    this.globe()?.setProgress(0);
    gsap.set('.record .typed-value, .slip-now .typed-value', { text: '' });
    gsap.set('.slip', { autoAlpha: 0, x: -30 });
    gsap.set('.stamp', { scale: 2.6, autoAlpha: 0, rotate: -16 });
    gsap.set('.finale', { autoAlpha: 0, y: 30 });
    gsap.set(stripItems.slice(1), { opacity: 0.38 });

    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: root,
        start: 'top top',
        end: () => `+=${Math.round(window.innerHeight * 7)}`,
        pin: '.stage',
        scrub: 0.9,
        anticipatePin: 1,
        onUpdate: (self) => {
          if (self.progress > 0.03 && this.formOpen()) this.formOpen.set(false);
        },
      },
    });

    const wheels = (dur: number, turns: number, at: number) =>
      tl.to('.wheel', { rotate: `+=${360 * turns}`, transformOrigin: '50% 50%', duration: dur }, at);

    // Each stage types its record line; in the strip the new stage lights and the last one ghosts.
    const stage = (i: number, at: number) => {
      const s = STAGES[i];
      tl.to(q('.record')[i], { opacity: 1, duration: 0.2 }, at)
        .to(q('.record .typed-value')[i], { text: s.record, duration: 0.8 }, at + 0.1)
        .set('.slip-now .field-label', { text: `Stage ${s.no} · ${s.name}` }, at)
        .to('.slip-now .typed-value', { text: s.record, duration: 0.8 }, at + 0.1)
        .to(stripItems[i], { opacity: 1, duration: 0.25 }, at);
      if (i > 0) tl.to(stripItems[i - 1], { opacity: 0.38, duration: 0.25 }, at);
    };

    // Opening: the statement and quote form clear; the record slides in; the camera settles on the palm.
    tl.to('.statement', { autoAlpha: 0, y: -50, duration: 0.6, ease: 'power2.in' }, 0);
    // Desktop: the form clears with the statement. Phones: it is a CSS sheet, closed by scrolling on.
    if (!phone) tl.to('.form-slot', { autoAlpha: 0, y: 50, duration: 0.6, ease: 'power2.in' }, 0);
    tl.to('.world', { x: camera(F.grove), duration: 1.3, ease: 'power2.inOut' }, 0.1)
      .to('.fg', { x: -420, duration: 1.3, ease: 'power2.inOut' }, 0.1)
      .to('.fg', { opacity: 0, duration: 0.5 }, 2.6)
      .to('.far-layer', { x: 120, duration: 1.3, ease: 'power2.inOut' }, 0.1)
      .to('.slip', { autoAlpha: 1, x: 0, duration: 0.5, ease: 'power2.out' }, 0.55);

    // 01 Grown: one coconut swells first, the cluster fills out and ripens.
    stage(0, 0.7);
    tl.to(nutEls[LEAD], { scale: 1.3, duration: 0.8, ease: 'back.out(1.6)' }, 0.9)
      .to(nutEls.filter((_, i) => i !== LEAD), { scale: 1, duration: 0.6, stagger: 0.07, ease: 'back.out(1.8)' }, 1.4)
      .to('.unripe', { opacity: 0, duration: 0.8, stagger: 0.05 }, 1.9)
      .to(nutEls[LEAD], { scale: 1.08, duration: 0.4 }, 2.5);

    // 02 Harvested: ripe nuts drop under gravity and settle in the grass.
    stage(1, 3.0);
    nutEls.forEach((el, i) => {
      const n = this.nuts[i];
      const t = 3.0 + i * 0.16;
      tl.to(el, { x: n.land.x, duration: 0.62, ease: 'sine.out' }, t)
        .to(el, { y: n.land.y, rotate: 160 + i * 25, scale: 1, duration: 0.62, ease: 'power3.in' }, t)
        .to(el, { y: n.land.y - 12, duration: 0.14, ease: 'power1.out' }, t + 0.62)
        .to(el, { y: n.land.y, duration: 0.14, ease: 'power1.in' }, t + 0.76);
    });
    tl.to('.frond-wrap', { rotate: 3, duration: 0.3, yoyo: true, repeat: 3 }, 3.0);

    // 03 Collected: the truck rolls in, nuts are tossed aboard.
    stage(2, 4.6);
    tl.to('.truck', { x: TRUCK_PARK, duration: 1, ease: 'power2.out' }, 4.4);
    wheels(1, 2.6, 4.4);
    nutEls.forEach((el, i) => {
      const n = this.nuts[i];
      tl.to(el, {
        motionPath: { path: [n.land, { x: (n.land.x + n.bed.x) / 2, y: n.bed.y - 150 }, n.bed], curviness: 1.2 },
        rotate: '+=220',
        duration: 0.5,
        ease: 'power1.inOut',
      }, 5.5 + i * 0.1);
    });
    tl.set('.truck-load', { opacity: 1 }, 6.3).set(nutEls, { opacity: 0 }, 6.3);

    // On the road: the camera rides with the truck to the port.
    tl.to('.truck', { x: TRUCK_PORT, duration: 2.1, ease: 'power1.inOut' }, 6.4)
      .to('.world', { x: camera(F.port), duration: 2.1, ease: 'power1.inOut' }, 6.4)
      .to('.far-layer', { x: 1400, duration: 2.1, ease: 'power1.inOut' }, 6.4)
;
    wheels(2.1, 9, 6.4);

    // 04 Shipped: into the container, up the crane, onto the ship.
    stage(3, 8.6);
    q('.port-nut').forEach((el, i) => {
      tl.set(el, { opacity: 1 }, 8.5 + i * 0.08).to(el, {
        motionPath: {
          path: [
            { x: TRUCK_PORT + 90 + i * 30, y: GROUND - 180 },
            { x: BOX.x + 40 + i * 20, y: BOX.y - 120 },
            { x: BOX.x + 50 + i * 20, y: BOX.y + 12 },
          ],
          curviness: 1.1,
        },
        duration: 0.4,
      }, 8.5 + i * 0.08).set(el, { opacity: 0 }, 8.9 + i * 0.08);
    });
    tl.to('.truck-load', { opacity: 0, duration: 0.3 }, 8.6)
      .to('.hoist', { y: -260, duration: 0.5, ease: 'power2.inOut' }, 9.5)
      .to('.cable', { attr: { y2: BOX.y - 260 }, duration: 0.5, ease: 'power2.inOut' }, 9.5)
      .to(['.hoist', '.trolley', '.cable-x'], { x: SHIP_SLOT - BOX.x, duration: 0.7, ease: 'power2.inOut' }, 10.0)
      .to('.world', { x: camera(F.crane), duration: 1.2, ease: 'power1.inOut' }, 9.6)
      .to('.hoist', { y: DECK_Y - 70 - BOX.y, duration: 0.45, ease: 'power2.in' }, 10.7)
      .to('.cable', { attr: { y2: DECK_Y - 70 }, duration: 0.45, ease: 'power2.in' }, 10.7)
      .to('.cable', { opacity: 0, duration: 0.2 }, 11.15)
      .to('.ship', { x: 900, duration: 1.3, ease: 'power1.in' }, 11.3)
      .to('.hoist', { x: SHIP_SLOT - BOX.x + 900, duration: 1.3, ease: 'power1.in' }, 11.3)
      .to('.world', { x: camera(F.sail), duration: 1.3, ease: 'power1.in' }, 11.3);

    // Worldwide: the scene recedes, the globe turns India forward, routes lift off and ships sail them.
    const globe = { p: 0 };
    tl.to('.world-wrap', { opacity: 0, scale: 0.9, svgOrigin: '800 450', duration: 0.6 }, 12.2)
      .to('.j-moon', { opacity: 0, duration: 0.4 }, 12.2)
      .to('.globe', { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out' }, 12.3)
      .to(globe, { p: 1, duration: 2.2, onUpdate: () => this.globe()?.setProgress(globe.p) }, 12.3)
      .to('.stamp', { scale: 1, autoAlpha: 1, rotate: -9, duration: 0.25, ease: 'power4.in' }, 14.2)
      .to('.slip', { x: -3, duration: 0.05, yoyo: true, repeat: 1 }, 14.45);

    if (phone) {
      // One beat per phone screen: the record steps aside before the closing line takes its place.
      tl.to(['.slip', '.stamp'], { autoAlpha: 0, duration: 0.3 }, 14.8)
        .to('.finale', { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power2.out' }, 15.0)
        .fromTo('.finale-stamp', { scale: 1.8, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.25, ease: 'power4.in', immediateRender: false }, 15.3);
    } else {
      tl.to('.finale', { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power2.out' }, 14.5);
    }
    tl.to({}, { duration: 0.6 });

    // Route progress spans the whole story: one line, one marker for now (transform only).
    const total = tl.duration();
    tl.fromTo('.progress', { scaleX: 0 }, { scaleX: 1, duration: total, transformOrigin: '0 50%' }, 0);
    tl.fromTo('.now-track', { xPercent: 0 }, { xPercent: 100, duration: total }, 0);
  }
}
