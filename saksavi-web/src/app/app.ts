import { Component, DestroyRef, afterNextRender, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SmoothScroll } from './motion/smooth-scroll.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  constructor() {
    const scroll = inject(SmoothScroll);
    const router = inject(Router);
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      scroll.start();
      // Fonts change line boxes; re-measure pins once they land.
      document.fonts?.ready.then(() => ScrollTrigger.refresh());
      const sub = router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => {
        scroll.reset();
        requestAnimationFrame(() => ScrollTrigger.refresh());
      });
      destroyRef.onDestroy(() => sub.unsubscribe());
    });
    destroyRef.onDestroy(() => scroll.stop());
  }
}
