import { Component } from '@angular/core';
import { PAPERS } from '../content';
import { ConsignmentForm } from '../consignment/consignment-form';

@Component({
  selector: 'app-closing',
  imports: [ConsignmentForm],
  templateUrl: './closing.html',
  styleUrl: './closing.scss',
})
export class Closing {
  protected readonly papers = PAPERS;
  protected readonly year = new Date().getFullYear();
}
