import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';

//import {CalendarModule} from 'primeng/calendar';
//import {AccordionModule} from 'primeng/accordion';     //accordion and accordion tab
//import {MenuItem} from 'primeng/api';                 //api


import {BrowserAnimationsModule} from '@angular/platform-browser/animations';


import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HttpClientModule,HTTP_INTERCEPTORS} from '@angular/common/http';
import { HttpModule } from '@angular/http';
import {JwtInterceptor} from './helper/jwt';
import { FormsModule,ReactiveFormsModule }   from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RegisterComponent } from '../app/register/register.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { CreatestoryComponent } from './createstory/createstory.component';
import { DetailstoryComponent } from './detailstory/detailstory.component';
//import { UserListComponent } from './user-list/user-list.component';
//import { UserreportComponent } from './userreport/userreport.component';
//import { EventComponent } from './event/event.component';
//import { EventreportComponent } from './eventreport/eventreport.component';
//import { NotificationComponent } from './notification/notification.component';
//import { GameListComponent } from './game-list/game-list.component';
//import { AddgameComponent } from './addgame/addgame.component';
//import { GooglePlacesDirective } from './google-places.directive';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    RegisterComponent,
    ForgotpasswordComponent,
    ResetpasswordComponent,
    CreatestoryComponent,
    DetailstoryComponent,
    //UserListComponent,
    //UserreportComponent,
    //EventComponent,
    //EventreportComponent,
    
    //NotificationComponent,
    
    //GameListComponent,
    
    //AddgameComponent,
    
    //GooglePlacesDirective
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    HttpModule
    // OwlDateTimeModule,
    // OwlNativeDateTimeModule,
    //CalendarModule
  ],

 
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }],
  bootstrap: [AppComponent]
  
})
export class AppModule { }
