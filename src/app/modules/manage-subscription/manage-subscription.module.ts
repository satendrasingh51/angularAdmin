import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NgbPaginationModule, NgbModule, NgbAlertModule,NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';

import { ManageSubscriptionRoutingModule } from './manage-subscription-routing.module';
import { SubscriptionOutletComponent } from './subscription-outlet/subscription-outlet.component';
import { AllSubscriptionComponent } from './all-subscription/all-subscription.component';

import { EditSubscriptionComponent } from './edit-subscription/edit-subscription.component';
import { AddSubscriptionComponent } from './add-subscription/add-subscription.component';
import { ViewSubscriptionComponent } from './view-subscription/view-subscription.component';
import { ReactiveFormsModule } from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination'; 

@NgModule({
  declarations: [SubscriptionOutletComponent, AllSubscriptionComponent, EditSubscriptionComponent, AddSubscriptionComponent, ViewSubscriptionComponent],
  imports: [
    CommonModule,
    ManageSubscriptionRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    NgxPaginationModule
  ],
  providers:[
    { provide:NgbDateParserFormatter,useClass:ViewSubscriptionComponent}
  ]
})
export class ManageSubscriptionModule { }
