import { NotificationComponent } from './notification/notification.component';
import { ManageNotificationComponent } from './manage-notification/manage-notification.component';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path:"",
    component: NotificationComponent,
    children: [  //<---- child components declared here
    {
        path: "manage-notification",
        component: ManageNotificationComponent
    },  
    {
      path:"",
      pathMatch: "full",
      redirectTo: "manage-notification"
    }
  ]                 
  } 
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificationRoutingModule { }
