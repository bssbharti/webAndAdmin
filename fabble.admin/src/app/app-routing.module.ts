import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RegisterComponent } from './register/register.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { CreatestoryComponent } from '../app/createstory/createstory.component';
import { DetailstoryComponent } from '../app/detailstory/detailstory.component';

import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
const routes: Routes = [
    // { path: '*', redirectTo: '/login', pathMatch: 'full' },
    { path: '', component: LoginComponent },
    { path: 'login', component: LoginComponent },
    { path: 'dashboard', component: DashboardComponent },
    //canActivate: [AuthGuard]
    { path: 'createstory', component: CreatestoryComponent },
    { path: 'editStory/:id', component: CreatestoryComponent },
    { path: 'detailstory/:id', component: DetailstoryComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'forgotpassword', component: ForgotpasswordComponent },
    { path: 'resetpassword', component: ResetpasswordComponent },
  
  //children: [
    //{path: 'users', component : UserListComponent},
    //{path: 'addgame', component : AddgameComponent,canActivate: [AuthGuard]},
    //{path: 'gamelist', component : GameListComponent,canActivate: [AuthGuard]},
    //{path: 'event', component : EventComponent},
    //{path: 'eventreport', component: EventreportComponent},
    //{path:'notification', component:NotificationComponent}
  //]
 
 
    { path: '**', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  providers: [AuthService,AuthGuard],
  exports: [ RouterModule ]
})

export class AppRoutingModule { 

  
}
export const routingComponents =[LoginComponent,
                              DashboardComponent,
    RegisterComponent,
    ForgotpasswordComponent,
    ResetpasswordComponent,
    CreatestoryComponent,
    DetailstoryComponent
                              //GameListComponent,
                              //UserListComponent,
                              //UserreportComponent,
                              //EventComponent,
                              //EventreportComponent,
    //NotificationComponent
]
