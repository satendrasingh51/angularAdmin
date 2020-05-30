import { UserManagementComponent } from './user-management/user-management.component';
import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { ManageNbmusersComponent } from './manage-nbmusers/manage-nbmusers.component';
import { NbmuserDetailComponent } from './nbmuser-detail/nbmuser-detail.component';



const routes: Routes = [
  {
    path:"",
    component: UserManagementComponent,
    children: [  //<---- child components declared here
    {
        path: "manage-users",
        component: ManageUsersComponent
    },                   
    {
      path: "user-detail/:id",
      component: UserDetailComponent
    },  
    {path:"managenbm-users",
    component:ManageNbmusersComponent
  },
  {path:"nbmuser-detail/:id",
    component:NbmuserDetailComponent
    },

      {
      path:"",
      pathMatch: "full",
      redirectTo: "manage-users"
    }
      
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserManagementRoutingModule { }
