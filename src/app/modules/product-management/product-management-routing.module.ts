import { AddProductComponent } from './add-product/add-product.component';
import { ManageProductComponent } from './manage-product/manage-product.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductManagementComponent } from './product-management/product-management.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { ViewProductComponent } from './view-product/view-product.component';

const routes: Routes = [
  {
    path: "",
    component : ProductManagementComponent,
 
  children:[
    {
      path: "manage-products",
      component : ManageProductComponent
  },
  {
    path: "add-product",
    component : AddProductComponent
},
{
  path: "edit-product/:id",
  component : EditProductComponent
},
{
  path: "view-product/:id",
  component : ViewProductComponent
},
  {
    path:"",
    pathMatch: "full",
    redirectTo: "manage-products"
  }
]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductManagementRoutingModule { }
