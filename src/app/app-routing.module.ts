import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../app/components/login/login.component';
import { AnalyticsComponent } from './components/analytics/analytics.component';
import { HomeComponent } from '../app/components/home/home.component';
import { authGuard } from './services/auth.guard';
import { RegisterComponent } from './components/register/register.component';
import { ForgotPasswordComponent } from '../app/components/forgot-password/forgot-password.component';

const routes: Routes = [
  { path: '', component: LoginComponent },

  { path: 'login', component: LoginComponent },

  { path: 'register', component: RegisterComponent },

  { path: 'forgot-password', component: ForgotPasswordComponent },

  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuard],
  },
  {
    path: 'analytics',
    component: AnalyticsComponent,
    canActivate: [authGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
