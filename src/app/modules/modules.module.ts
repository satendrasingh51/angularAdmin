import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModulesRoutingModule } from './modules-routing.module';
import { ModuleOutletComponent } from './module-outlet/module-outlet.component';
import { ReportManagementComponent } from './report-management/report-management.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [  ModuleOutletComponent, ReportManagementComponent, ],
  imports: [
    CommonModule,
    ModulesRoutingModule,
    NgbModule,
    ChartsModule
     // SettingsModule,
  ]
})
export class ModulesModule { }
