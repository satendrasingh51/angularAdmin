import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SubscriptionOutletComponent } from './subscription-outlet/subscription-outlet.component';
import { AllSubscriptionComponent } from './all-subscription/all-subscription.component';
import { ViewSubscriptionComponent } from './view-subscription/view-subscription.component';
import { EditSubscriptionComponent } from './edit-subscription/edit-subscription.component';
import { AddSubscriptionComponent } from './add-subscription/add-subscription.component';

const routes: Routes = [
  {
    path: '',
    component: SubscriptionOutletComponent,
    children:[
      {
        path: '',
        component: AllSubscriptionComponent
      },
      {
        path: 'view/:id',
        component: ViewSubscriptionComponent
      },
      {
        path: 'add',
        component: AddSubscriptionComponent
      },
      {
        path: 'edit/:id',
        component: EditSubscriptionComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageSubscriptionRoutingModule { }
