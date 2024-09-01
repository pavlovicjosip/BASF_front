import { Routes } from '@angular/router';
import { AuthComponent } from './features/auth/auth.component';
import { MainComponent } from './features/main/main.component';
import { AuthGuard } from './services/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: AuthComponent },
  {
    path: 'main',
    component: MainComponent,
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];
