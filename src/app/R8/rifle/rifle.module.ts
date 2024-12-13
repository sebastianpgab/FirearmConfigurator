import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RifleComponent } from './rifle.component';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [
    RifleComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
  ]
})
export class RifleModule { }
