import { Injectable } from '@angular/core';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { TextPlugin } from 'gsap/TextPlugin';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, TextPlugin, DrawSVGPlugin, MotionPathPlugin);

export const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * One Lenis instance, driven by GSAP's ticker so ScrollTrigger scrubs and the
 * smooth scroll share a single frame loop (no double rAF, no drift).
 */
@Injectable({ providedIn: 'root' })
export class SmoothScroll {
  private lenis?: Lenis;
  private tick = (time: number) => this.lenis?.raf(time * 1000);

  start(): void {
    if (this.lenis || reducedMotion()) return;
    this.lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9, touchMultiplier: 1.4 });
    this.lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(this.tick);
    gsap.ticker.lagSmoothing(0);
  }

  /** Scroll to an anchor, smoothly when motion is allowed. */
  to(target: string | HTMLElement, offset = 0): void {
    const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
    if (!el) return;
    if (this.lenis) {
      this.lenis.scrollTo(el, { offset, duration: 1.6 });
    } else {
      el.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth' });
    }
    // Hand focus to the destination so keyboard users land where they jumped.
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll: true });
  }

  /** True when Lenis is driving the page (motion allowed). */
  get active(): boolean {
    return !!this.lenis;
  }

  /** Subscribe to smooth-scroll frames; returns an unsubscribe function. */
  onScroll(cb: (y: number, direction: number) => void): () => void {
    const lenis = this.lenis;
    if (!lenis) return () => {};
    const handler = (l: Lenis) => cb(l.scroll, l.direction);
    const off = lenis.on('scroll', handler);
    return typeof off === 'function' ? off : () => lenis.off?.('scroll', handler);
  }

  /**
   * Glide to an absolute position; user input cannot interrupt it. Sine
   * in-out keeps the peak speed low, so long beats read as one even move.
   */
  glide(y: number, duration: number, onComplete?: () => void): void {
    this.lenis?.scrollTo(y, {
      duration,
      lock: true,
      easing: (t) => -(Math.cos(Math.PI * t) - 1) / 2,
      onComplete,
    });
  }

  /** Jump to the top without animation (route changes). */
  reset(): void {
    if (this.lenis) this.lenis.scrollTo(0, { immediate: true, force: true });
    else window.scrollTo(0, 0);
  }

  stop(): void {
    gsap.ticker.remove(this.tick);
    this.lenis?.destroy();
    this.lenis = undefined;
  }
}
