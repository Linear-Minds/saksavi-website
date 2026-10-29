import { Component, computed, input, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ENQUIRY, PRODUCT_OPTIONS } from '../content';
import { InkStamp } from '../ink-stamp/ink-stamp';

type Status = 'idle' | 'invalid' | 'drafted' | 'unconnected';

let uid = 0;

@Component({
  selector: 'app-consignment-form',
  imports: [ReactiveFormsModule, InkStamp],
  templateUrl: './consignment-form.html',
  styleUrl: './consignment-form.scss',
  host: { '[class.full]': "variant() === 'full'" },
})
export class ConsignmentForm {
  readonly variant = input<'compact' | 'full'>('compact');

  protected readonly id = `cf${++uid}`;
  protected readonly products = PRODUCT_OPTIONS;
  protected readonly status = signal<Status>('idle');
  protected readonly isFull = computed(() => this.variant() === 'full');

  protected readonly form = new FormGroup({
    product: new FormControl(PRODUCT_OPTIONS[0], { nonNullable: true, validators: Validators.required }),
    quantity: new FormControl('', { nonNullable: true, validators: Validators.required }),
    port: new FormControl('', { nonNullable: true, validators: Validators.required }),
    company: new FormControl('', { nonNullable: true }),
    contact: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    notes: new FormControl('', { nonNullable: true }),
  });

  protected showError(name: keyof typeof this.form.controls): boolean {
    const c = this.form.controls[name];
    return c.invalid && (c.touched || this.status() === 'invalid');
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.status.set('invalid');
      const first = document.querySelector<HTMLElement>(`#${this.id} .ng-invalid:not(form)`);
      first?.focus();
      return;
    }
    const v = this.form.getRawValue();
    const body = [
      `Product: ${v.product}`,
      `Quantity: ${v.quantity}`,
      `Port of discharge: ${v.port}`,
      v.company && `Company: ${v.company}`,
      `Contact: ${v.contact}`,
      v.notes && `Notes: ${v.notes}`,
    ]
      .filter(Boolean)
      .join('\n');

    if (ENQUIRY.email) {
      const subject = `Quote request: ${v.product} to ${v.port}`;
      window.location.href = `mailto:${ENQUIRY.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      this.status.set('drafted');
    } else if (ENQUIRY.whatsapp) {
      window.open(`https://wa.me/${ENQUIRY.whatsapp}?text=${encodeURIComponent(body)}`, '_blank', 'noopener');
      this.status.set('drafted');
    } else {
      this.status.set('unconnected');
    }
  }
}
