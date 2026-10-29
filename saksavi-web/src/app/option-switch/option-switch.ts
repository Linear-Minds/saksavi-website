import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

/** A small fixed tab for presenting both landing-page options side by side. */
@Component({
  selector: 'app-option-switch',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav aria-label="Design options">
      <a routerLink="/" routerLinkActive="on" [routerLinkActiveOptions]="{ exact: true }" title="Option A: dark document">A</a>
      <a routerLink="/white" routerLinkActive="on" title="Option B: white sections">B</a>
    </nav>
  `,
  styles: `
    :host {
      position: fixed;
      z-index: 60;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
    }
    nav {
      display: flex;
      flex-direction: column;
      border: 1.5px solid #173d24;
      border-right: 0;
      background: #f2f5ee;
    }
    a {
      display: grid;
      place-items: center;
      width: 34px;
      height: 34px;
      font-family: var(--font-display);
      font-weight: 900;
      font-size: 13px;
      color: #173d24;
      text-decoration: none;
    }
    a + a {
      border-top: 1.5px solid #173d24;
    }
    a.on {
      background: #173d24;
      color: #f2f5ee;
    }
    a:focus-visible {
      outline: 2px solid #5a3f8f;
      outline-offset: -4px;
    }
  `,
})
export class OptionSwitch {}
