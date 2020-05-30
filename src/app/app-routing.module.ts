import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import {AuthGuardService} from './auth/guard/auth.guard';

const routes: Routes = [
  
  {
    path:"auth",
    loadChildren:"./auth/auth.module#AuthModule"
  },
  {
    canLoad: [AuthGuardService],
    path:"theme",
    loadChildren:"./theme/theme.module#ThemeModule"
    
  },
  {
    path:"",
    pathMatch:"full",
    redirectTo:"auth"
  },
  {
    path:"**",
    component:NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
