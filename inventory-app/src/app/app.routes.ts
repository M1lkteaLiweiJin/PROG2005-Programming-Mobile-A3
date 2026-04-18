/**
 * Top-level route table. All feature routes live under the Tabs shell.
 * Author: Shihao Yang
 */
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./tabs/tabs.routes').then((m) => m.routes)
  }
];
