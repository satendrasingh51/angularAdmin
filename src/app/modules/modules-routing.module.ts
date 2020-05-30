import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModuleOutletComponent } from './module-outlet/module-outlet.component';
import { ReportManagementComponent } from './report-management/report-management.component';
// import { ContactUsComponent } from './modules/content-management/contact-us/contact-us.component';
// import { FaqComponent } from './modules/content-management/faq/faq.component';
// import { TermsConditionComponent } from './modules/content-management/terms-condition/terms-condition.component';

const routes: Routes = [
  {
    path:"",
    component: ModuleOutletComponent,
    children:[
      {
        path:'dashboard',
        loadChildren: "./dashboard/dashboard.module#DashboardModule"
      },
      {
        path:'settings',
        loadChildren: "./settings/settings.module#SettingsModule"
      },
      {
        path:'settings',
        loadChildren: "./settings/settings.module#SettingsModule"
      },
      {
        path:'blog-management',
        loadChildren: "./blog-management/blog-management.module#BlogManagementModule"
      },
       {
        path:'user-management',
        loadChildren: "./user-management/user-management.module#UserManagementModule"
      },

      {
        path:'notification',
        loadChildren: "./notification/notification.module#NotificationModule"
      },
      {
        path:'contactus',
        loadChildren: "./manage-contact/manage-contact.module#ManageContactModule"
      },
        {
          path:'product-management',
        loadChildren: "./product-management/product-management.module#ProductManagementModule"
      },
      {
        path:'newsletter-management',
        loadChildren: "./newsletter-management/newsletter-management.module#NewsletterManagementModule"
      },
      {
        path:'brand-advertisement',
        loadChildren: "./brand-advertisement/brand-advertisement.module#BrandAdvertisementModule"
      },
      {
        path:'subscription',
        loadChildren: "./manage-subscription/manage-subscription.module#ManageSubscriptionModule"
      },
      {
        path:'report',
        component: ReportManagementComponent,
      },
      {
        path:"",
        pathMatch:"full",
        redirectTo:"dashboard"
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModulesRoutingModule { }
