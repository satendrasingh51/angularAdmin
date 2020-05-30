import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NgbPaginationModule, NgbModule, NgbAlertModule,NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import { NgxEditorModule } from 'ngx-editor';
import { ProductManagementRoutingModule } from './product-management-routing.module';
import { ProductManagementComponent } from './product-management/product-management.component';
import { ManageProductComponent } from './manage-product/manage-product.component';
import { AddProductComponent } from './add-product/add-product.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { ViewProductComponent } from './view-product/view-product.component';
import { ReactiveFormsModule } from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination'; 
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { FormsModule } from '@angular/forms';
// import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { CKEditorModule } from 'ngx-ckeditor';

@NgModule({
  declarations: [ProductManagementComponent, ManageProductComponent, AddProductComponent, EditProductComponent, ViewProductComponent],
  imports: [
    CommonModule,
    NgbModule,
    NgxEditorModule,
    ProductManagementRoutingModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    NgMultiSelectDropDownModule,
    FormsModule,
    CKEditorModule,
  ],
  providers: [
  
    {provide: NgbDateParserFormatter,useClass: ManageProductComponent}
   ]
})
export class ProductManagementModule { }
