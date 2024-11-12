import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BarrelComponent } from './R8/barrel/barrel.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeModule } from './home/home.module';
import { BarrelModule } from './R8/barrel/barrel.module';
import { NavbarComponent } from './core/navbar/navbar.component';
import { CoreModule } from './core/core.module';

@NgModule({
  declarations: [
    AppComponent,
    BarrelComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    BrowserAnimationsModule,
    BarrelModule,
    HomeModule,
    AppRoutingModule,
    CoreModule 
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
