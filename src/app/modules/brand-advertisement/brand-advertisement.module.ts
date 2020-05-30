
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxEditorModule } from 'ngx-editor';

import { BrandAdvertisementRoutingModule } from './brand-advertisement-routing.module';
import { BrandAdvertisementComponent } from './brand-advertisement/brand-advertisement.component';
import { ManageAdvertisementComponent } from './manage-advertisement/manage-advertisement.component';
import { ViewAdvertisementComponent } from './view-advertisement/view-advertisement.component';
import { EditAdvertisementComponent } from './edit-advertisement/edit-advertisement.component';
import {NgxPaginationModule} from 'ngx-pagination'; 
import { CKEditorModule } from 'ngx-ckeditor';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [BrandAdvertisementComponent, ManageAdvertisementComponent, ViewAdvertisementComponent, EditAdvertisementComponent],
  imports: [
    CommonModule,
    NgbModule,
    NgxEditorModule,
    NgxPaginationModule,
    BrandAdvertisementRoutingModule,
    CKEditorModule,
    ReactiveFormsModule
  ]
})
export class BrandAdvertisementModule { }
