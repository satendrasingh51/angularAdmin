import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewsletterManagementRoutingModule } from './newsletter-management-routing.module';
import { ManageNewsletterComponent } from './manage-newsletter/manage-newsletter.component';
import { ViewNewsletterGalleryComponent } from './view-newsletter-gallery/view-newsletter-gallery.component';
import { NewsletterManagementComponent } from './newsletter-management/newsletter-management.component';

import {NgbPaginationModule,NgbModule, NgbAlertModule,NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import {NgxPaginationModule} from 'ngx-pagination'; 
import { ReactiveFormsModule } from '@angular/forms';
import { ViewimageComponent } from './viewimage/viewimage.component';

@NgModule({
  declarations: [ManageNewsletterComponent, ViewNewsletterGalleryComponent, NewsletterManagementComponent, ViewimageComponent],
  imports: [
    CommonModule,
    NgbModule,
    NewsletterManagementRoutingModule,
    NgxPaginationModule,
    ReactiveFormsModule
  ],
 

})
export class NewsletterManagementModule { }
