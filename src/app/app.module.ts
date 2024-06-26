import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; 
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { environment } from '../app/environments/environment';
import { LoginComponent } from '../app/components/login/login.component';
import { GoogleSsoDirective } from './services/google-sso.directive';
import { HomeComponent } from '../app/components/home/home.component';
import { AnalyticsComponent } from './components/analytics/analytics.component';
import { TaskListComponent } from '../app/components/home/task-list/task-list.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthService } from './services/auth.service';
import { ForgotPasswordComponent } from '../app/components/forgot-password/forgot-password.component';
import { MiniCalendarComponent } from '../app/components/home/mini-calendar/mini-calendar.component'; 
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { CalendarComponent } from '../app/components/home/calendar/calendar.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { TaskCardComponent } from '../app/components/home/task-card/task-card.component';
import { TaskDetailsPopupComponent } from './components/home/task-details-popup/task-details-popup.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { AddTaskButtonComponent } from './components/add-task-button/add-task-button.component';
import{TaskCompletedButtonComponent} from './components/task-completed-button/task-completed-button.component'
import { MatTooltipModule } from '@angular/material/tooltip';
import { AIFavouriteTasksComponent } from './components/ai-favourite-tasks/ai-favourite-tasks.component';

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
    TaskCardComponent,
    TaskDetailsPopupComponent,
    AddTaskButtonComponent,
    TaskCompletedButtonComponent,
    AIFavouriteTasksComponent,
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    HttpClientModule,
    FormsModule, 
    BsDatepickerModule.forRoot(), 
    NgbModule,

    FormsModule,
    FullCalendarModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule,
  ],
  providers: [AuthService, provideAnimationsAsync()],
  bootstrap: [AppComponent],
})
export class AppModule {}
