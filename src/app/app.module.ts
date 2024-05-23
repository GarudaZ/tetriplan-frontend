import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { environment } from './environments/environment';
import { LoginComponent } from './login/login.component';
import { GoogleSsoDirective } from './google-sso.directive';
import { HomeComponent } from './home/home.component';
import { AnalyticsComponent } from './analytics/analytics.component';

import { TaskListComponent } from './home/task-list/task-list.component';

import { RegisterComponent } from './register/register.component';
import { AuthService } from './auth.service';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { CalendarComponent } from './home/calendar/calendar.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    GoogleSsoDirective,
    HomeComponent,
    AnalyticsComponent,
    TaskListComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    CalendarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    FormsModule,
  ],
  providers: [AuthService],
  bootstrap: [AppComponent],
})
export class AppModule {}
