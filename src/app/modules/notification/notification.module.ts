import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationRoutingModule } from './notification-routing.module';
import { ManageNotificationComponent } from './manage-notification/manage-notification.component';
import { NotificationComponent } from './notification/notification.component';
import { ReactiveFormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import {NgbPaginationModule,NgbDateParserFormatter, NgbModule, NgbAlertModule} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ManageNotificationComponent, NotificationComponent],
  imports: [
    CommonModule,
    NgbModule,
    NotificationRoutingModule,
    ReactiveFormsModule,
    InfiniteScrollModule,
    FormsModule
  ],
  providers:[
    {provide: NgbDateParserFormatter, useClass: ManageNotificationComponent}
  ]
 
})
export class NotificationModule { }
