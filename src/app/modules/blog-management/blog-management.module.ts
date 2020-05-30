import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NgbPaginationModule,NgbDateParserFormatter, NgbModule, NgbAlertModule} from '@ng-bootstrap/ng-bootstrap';

import { BlogManagementRoutingModule } from './blog-management-routing.module';
import { BlogManagementComponent } from './blog-management/blog-management.component';
import { ManageBlogComponent } from './manage-blog/manage-blog.component';
import { BlogDetailsComponent } from './blog-details/blog-details.component';
import { EditBlogsComponent } from './edit-blogs/edit-blogs.component';
import { AddBlogComponent } from './add-blog/add-blog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

import { FormsModule } from '@angular/forms';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { CKEditorModule } from 'ngx-ckeditor';

@NgModule({
  declarations: [BlogManagementComponent, ManageBlogComponent, BlogDetailsComponent, EditBlogsComponent,AddBlogComponent],
  imports: [
    CommonModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    BlogManagementRoutingModule,
    NgbPaginationModule, NgbModule, NgbAlertModule,
    CKEditorModule,

    FormsModule,NgbDatepickerModule.forRoot(),

 

  ],
    providers: [
        {provide: NgbDateParserFormatter, useClass: ManageBlogComponent}
       ]
})
export class BlogManagementModule { }
