import { Component, inject, signal } from '@angular/core';
import { SmoothScroll } from '../motion/smooth-scroll.service';

@Component({
  selector: 'app-header-bar',
  templateUrl: './header-bar.html',
  styleUrl: './header-bar.scss',
  host: { '(document:keydown.escape)': 'open.set(false)' },
})
export class HeaderBar {
  private readonly scroll = inject(SmoothScroll);
  protected readonly open = signal(false);

  protected readonly links = [
    { no: '(2)', label: 'Goods', value: 'Coconuts', href: '#goods' },
    { no: '(3)', label: 'Journey', value: 'Palm to port', href: '#journey' },
    { no: '(4)', label: 'Registrations', value: 'Papers', href: '#papers' },
  ];

  protected go(event: Event, href: string): void {
    event.preventDefault();
    this.open.set(false);
    this.scroll.to(href);
  }
}
