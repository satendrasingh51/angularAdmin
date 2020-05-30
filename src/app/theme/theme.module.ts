import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ThemeRoutingModule } from './theme-routing.module';
import { ThemeComponent } from './theme/theme.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SidenavComponent } from './sidenav/sidenav.component';

@NgModule({
  declarations: [ThemeComponent, HeaderComponent, FooterComponent, SidenavComponent],
  imports: [
    CommonModule,
    ThemeRoutingModule,
    NgbModule
  ]
})
export class ThemeModule { }
