import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'SAKSAVI Agro Exports · Coconut exporter',
    loadComponent: () => import('./pages/document-page').then((m) => m.DocumentPage),
  },
  {
    path: 'white',
    title: 'SAKSAVI Agro Exports · From our palms to your port',
    loadComponent: () => import('./pages/white/white-page').then((m) => m.WhitePage),
  },
  { path: '**', redirectTo: '' },
];
