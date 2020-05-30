import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageContactComponent } from './manage-contact/manage-contact.component';
import { ContactUsManageComponent } from './contact-us-manage/contact-us-manage.component';
import { ViewRequestComponent } from './view-request/view-request.component';

const routes: Routes = [
  {path:"",
  component: ManageContactComponent,
  children:[
    {
      path:"contact-manage",
      component: ContactUsManageComponent,

    },
    {
      path:"view-request/:id",
      component: ViewRequestComponent,

    },
    {
      path:"",
      pathMatch: "full",
      redirectTo: "contact-manage"
    }
  ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageContactRoutingModule { }
