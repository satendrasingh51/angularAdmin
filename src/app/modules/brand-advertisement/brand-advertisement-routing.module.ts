import { EditAdvertisementComponent } from './edit-advertisement/edit-advertisement.component';
import { ViewAdvertisementComponent } from './view-advertisement/view-advertisement.component';
import { BrandAdvertisementComponent } from './brand-advertisement/brand-advertisement.component';
import { ManageAdvertisementComponent } from './manage-advertisement/manage-advertisement.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path:"",
    component: BrandAdvertisementComponent,
    children: [
      {
      path: "manage-advertisement",
      component: ManageAdvertisementComponent,
    },
    {
      path: "view-advertisement/:id",
      component: ViewAdvertisementComponent,
    },
    {
      path: "edit-advertisement/:id",
      component: EditAdvertisementComponent,
    },
    {
      path: "",
      pathMatch: "full",
      redirectTo: "manage-advertisement"
    }
  ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BrandAdvertisementRoutingModule { }
