import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UserManagementRoutingModule } from './user-management-routing.module';
import { UserManagementComponent } from './user-management/user-management.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
//import { NgDatepickerModule } from 'ng2-datepicker';
import {NgbPaginationModule,NgbModule, NgbAlertModule,NgbDateParserFormatter, } from '@ng-bootstrap/ng-bootstrap';
import {NgxPaginationModule} from 'ngx-pagination';
import { ManageNbmusersComponent } from './manage-nbmusers/manage-nbmusers.component';
import { NbmuserDetailComponent } from './nbmuser-detail/nbmuser-detail.component';

@NgModule({
  declarations: [UserManagementComponent, ManageUsersComponent, UserDetailComponent, ManageNbmusersComponent, NbmuserDetailComponent],
  imports: [
    CommonModule,
    NgbModule,
    NgxPaginationModule, 
    UserManagementRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    { provide:NgbDateParserFormatter,useClass:ManageUsersComponent}
   ]
})
export class UserManagementModule { }
