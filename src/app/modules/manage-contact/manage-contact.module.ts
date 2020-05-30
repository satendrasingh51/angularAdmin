import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NgbPaginationModule, NgbModule, NgbAlertModule,NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';

import { ManageContactRoutingModule } from './manage-contact-routing.module';
import { ManageContactComponent } from './manage-contact/manage-contact.component';
import { ContactUsManageComponent } from './contact-us-manage/contact-us-manage.component';
import { FormsModule } from '@angular/forms';
import { ViewRequestComponent } from './view-request/view-request.component';
import {NgxPaginationModule} from 'ngx-pagination'; 
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [ManageContactComponent, ContactUsManageComponent, ViewRequestComponent],
  
  imports: [
    CommonModule,
    ManageContactRoutingModule,FormsModule,
    NgbPaginationModule, NgbModule, NgbAlertModule,
    NgxPaginationModule,
    ReactiveFormsModule
  ],
  providers:[
    { provide:NgbDateParserFormatter,useClass:ContactUsManageComponent}
  ]
})
export class ManageContactModule { }
