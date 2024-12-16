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
import { StockComponent } from './R8/stock/stock.component';
import { ChamberBoltComponent } from './R8/chamber-bolt/chamber-bolt.component';
import { AccessoryComponent } from './R8/accessory/accessory.component';
import { SummaryComponent } from './summary/summary.component';
import { RifleModule } from './R8/rifle/rifle.module';
import { RifleComponent } from './R8/rifle/rifle.component';

@NgModule({
  declarations: [
    AppComponent,
    StockComponent,
    ChamberBoltComponent,
    AccessoryComponent,
    SummaryComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    BrowserAnimationsModule,
    HomeModule,
    AppRoutingModule,
    CoreModule,
    BarrelModule,
    RifleModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
