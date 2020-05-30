import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingsComponent } from './settings/settings.component';
import { ProfileComponent } from './profile/profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';

const routes: Routes = [
  {
    path:"",
    component: SettingsComponent,
    children: [
      {
        path: "profile",
        component: ProfileComponent
      },
      {
        path: "change-password",
        component: ChangePasswordComponent
      },
      {
        path: "edit-profile",
        component: EditProfileComponent
      },
     
      {
        path:"",
        pathMatch: "full",
        redirectTo: "profile"
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
