import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


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

import { MiniCalendarComponent } from './mini-calendar/mini-calendar.component'; // Import your AuthService
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { CalendarComponent } from './home/calendar/calendar.component';


import { FullCalendarModule } from '@fullcalendar/angular';

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

    MiniCalendarComponent,

    CalendarComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,

    FormsModule, // Include FormsModule in the imports array
    BsDatepickerModule.forRoot(), // Come back to this again
    NgbModule,

    FormsModule,
    FullCalendarModule,

  ],
  providers: [AuthService, provideAnimationsAsync()],
  bootstrap: [AppComponent, MiniCalendarComponent],
})
export class AppModule {}
