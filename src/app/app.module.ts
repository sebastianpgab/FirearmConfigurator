import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BarrelComponent } from './barrel/barrel.component';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    AppComponent,
    BarrelComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule  
  ],
  providers: [],
  bootstrap: [BarrelComponent]
})
export class AppModule { }
