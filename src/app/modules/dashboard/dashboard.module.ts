import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import {NgbPaginationModule,NgbDateParserFormatter, NgbModule, NgbAlertModule} from '@ng-bootstrap/ng-bootstrap';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    NgbPaginationModule, NgbModule, NgbAlertModule,
    NgbDatepickerModule,
    ReactiveFormsModule
  ],
  providers:[
    {provide: NgbDateParserFormatter,useClass: DashboardComponent}
  ]
})
export class DashboardModule { }
