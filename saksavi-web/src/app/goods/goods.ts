import { Component, DestroyRef, ElementRef, afterNextRender, inject } from '@angular/core';
import { gsap } from 'gsap';
import { GOODS } from '../content';
import { reducedMotion } from '../motion/smooth-scroll.service';

@Component({
  selector: 'app-goods',
  templateUrl: './goods.html',
  styleUrl: './goods.scss',
})
export class Goods {
  private readonly host = inject(ElementRef<HTMLElement>);
  protected readonly goods = GOODS;

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      if (reducedMotion()) return;
      const root = this.host.nativeElement as HTMLElement;
      const ctx = gsap.context(() => {
        // Each manifest line is ruled in, then typed values settle.
        gsap.utils.toArray<HTMLElement>('.line-item').forEach((row) => {
          gsap
            .timeline({ scrollTrigger: { trigger: row, start: 'top 88%', once: true } })
            .from(row.querySelector('.rule'), { scaleX: 0, transformOrigin: '0 50%', duration: 0.9, ease: 'expo.out' })
            .from(row.querySelectorAll('.cellv'), { y: 18, opacity: 0, duration: 0.7, stagger: 0.06, ease: 'expo.out' }, 0.1);
        });
        gsap.from('.goods-title .ln', {
          yPercent: 110,
          duration: 1.1,
          stagger: 0.08,
          ease: 'expo.out',
          scrollTrigger: { trigger: '.goods-title', start: 'top 85%', once: true },
        });
      }, root);
      destroyRef.onDestroy(() => ctx.revert());
    });
  }
}
