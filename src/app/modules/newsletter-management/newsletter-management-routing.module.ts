import { ViewNewsletterGalleryComponent } from './view-newsletter-gallery/view-newsletter-gallery.component';
import { ManageNewsletterComponent } from './manage-newsletter/manage-newsletter.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewsletterManagementComponent } from './newsletter-management/newsletter-management.component';
import { ViewimageComponent } from './viewimage/viewimage.component';

const routes: Routes = [
  {
    path: "",
    component: NewsletterManagementComponent,
    children: [
      {
        path: "manage-newsletter",
        component: ManageNewsletterComponent
      },
      {
        path: "view-gallery",
        component: ViewNewsletterGalleryComponent
      },
      {
        path:"uploaded-images/:id",
        component:ViewimageComponent
      },
      {
        
        path: "",
        pathMatch: "full",
        redirectTo : "manage-newsletter"
      }
    ]

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewsletterManagementRoutingModule { }
