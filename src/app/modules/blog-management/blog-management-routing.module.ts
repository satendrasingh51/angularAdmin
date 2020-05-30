import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BlogManagementComponent } from './blog-management/blog-management.component';
import { ManageBlogComponent } from './manage-blog/manage-blog.component';
import { BlogDetailsComponent } from './blog-details/blog-details.component';
import { EditBlogsComponent } from './edit-blogs/edit-blogs.component';
import { AddBlogComponent } from './add-blog/add-blog.component';

const routes: Routes = [
  {
    path:"",
    component: BlogManagementComponent,
    children:[
      // childern of blogmanagement goes here
      {
        path:"blog-manage",
        component: ManageBlogComponent,

      },
      {
        path:"blog-details/:id",
        component: BlogDetailsComponent,

      }, 
      {
        path:"edit-blogs/:id",
        component: EditBlogsComponent,

      },
      {
        path:"add-blogs",
        component: AddBlogComponent,
      },
      
      {
        path:"",
        pathMatch: "full",
        redirectTo: "blog-manage"
      }
       
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogManagementRoutingModule { }
