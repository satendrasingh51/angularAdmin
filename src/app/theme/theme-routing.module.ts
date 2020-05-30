import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ThemeComponent } from './theme/theme.component';
import{AuthGuardService} from '../auth/guard/auth.guard';
const routes: Routes = [
  {
    path: "",
    component: ThemeComponent,
    children: [
      {
        canActivateChild:[AuthGuardService],
        path: "modules",
        loadChildren: '../modules/modules.module#ModulesModule'
      },
      {
        path: "",
        redirectTo: "modules",
        pathMatch: "full"
      }
    ]

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ThemeRoutingModule { }
