import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { ContactComponent } from './contact/contact.component';
import { RiflePreviewComponent } from './rifle-preview/rifle-preview.component';



@NgModule({
  declarations: [NavbarComponent, RiflePreviewComponent],
  imports: [CommonModule],
  exports: [NavbarComponent, RiflePreviewComponent]
})
export class CoreModule { }
