import { Component, input } from '@angular/core';

let uid = 0;

/**
 * A rubber-stamp impression: double-ruled frame and wide caps, roughened by
 * displacement (broken edges) and a noise mask (uneven ink pressure).
 */
@Component({
  selector: 'app-ink-stamp',
  template: `
    <svg viewBox="0 0 440 128" aria-hidden="true">
      <defs>
        <filter [id]="fid" x="-5%" y="-10%" width="110%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="4" result="grain" />
          <feDisplacementMap in="SourceGraphic" in2="grain" scale="3.4" xChannelSelector="R" yChannelSelector="G" result="rough" />
          <feTurbulence type="fractalNoise" baseFrequency="0.035 0.09" numOctaves="3" seed="11" result="pressure" />
          <feColorMatrix in="pressure" type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.7 1.78" result="patchy" />
          <feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="1" seed="2" result="speck" />
          <feColorMatrix in="speck" type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.2 2.35" result="specks" />
          <feComposite in="rough" in2="patchy" operator="in" result="inked" />
          <feComposite in="inked" in2="specks" operator="in" />
        </filter>
      </defs>
      <g [attr.filter]="'url(#' + fid + ')'" fill="currentColor">
        <path fill-rule="evenodd" d="M6 6H434V122H6ZM12 12V116H428V12Z" />
        <path fill-rule="evenodd" d="M19 19H421V109H19ZM21.5 21.5V106.5H418.5V21.5Z" />
        <text x="220" y="79" text-anchor="middle" textLength="370" lengthAdjust="spacingAndGlyphs">{{ text().toUpperCase() }}</text>
      </g>
    </svg>
  `,
  styles: `
    :host {
      display: block;
      color: var(--stamp);
      mix-blend-mode: multiply;
      pointer-events: none;
    }
    svg {
      width: 100%;
      height: auto;
      overflow: visible;
    }
    text {
      font-family: var(--font-display);
      font-stretch: 118%;
      font-weight: 900;
      font-size: 40px;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }
  `,
})
export class InkStamp {
  readonly text = input.required<string>();
  protected readonly fid = `ink${++uid}`;
}
