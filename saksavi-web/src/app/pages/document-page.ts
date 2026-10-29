import { Component } from '@angular/core';
import { HeaderBar } from '../header-bar/header-bar';
import { Journey } from '../journey/journey';
import { Goods } from '../goods/goods';
import { Closing } from '../closing/closing';
import { OptionSwitch } from '../option-switch/option-switch';

/** Option A: the dark "Bill of Lading" page with the pinned palm-to-port story. */
@Component({
  selector: 'app-document-page',
  imports: [HeaderBar, Journey, Goods, Closing, OptionSwitch],
  template: `
    <a class="skip" href="#consignment">Skip to the quote form</a>
    <app-header-bar />
    <main>
      <app-journey />
      <app-goods />
      <app-closing />
    </main>
    <app-option-switch />
  `,
})
export class DocumentPage {}
