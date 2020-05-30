import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {
    path:"",
    component:AuthComponent,
    children:[
      {
        path: "login",
        component: LoginComponent
      },
     
      {
        path:"forgot-password",
        component:ForgotPasswordComponent
      },
      {
        path:"reset-password",
        component:ResetPasswordComponent
      },
      {
        path:'',
        pathMatch:"full",
        redirectTo:"login"
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
