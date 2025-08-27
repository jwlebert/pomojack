import { Routes } from '@angular/router';
import { Pomo } from './pomo/pomo';

export const routes: Routes = [
    {
        path: '', // temporary, later will be 'pomo' when have homepage and such
        component: Pomo,
    }
];
