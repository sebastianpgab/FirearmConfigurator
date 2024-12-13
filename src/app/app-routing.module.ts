// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { BarrelComponent } from './R8/barrel/barrel.component';
import { StockComponent } from './R8/stock/stock.component';
import { ChamberBoltComponent } from './R8/chamber-bolt/chamber-bolt.component';
import { AccessoryComponent } from './R8/accessory/accessory.component';
import { RifleComponent } from './R8/rifle/rifle.component';

const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full' },
  {path: 'r8/model', component: RifleComponent},
  {path: 'r8/barrel', component: BarrelComponent},
  {path: 'r8/stock', component: StockComponent},
  {path: 'r8/chamberBolt', component: ChamberBoltComponent},
  {path: 'r8/accessory', component: AccessoryComponent},
  {path: 'home', component: HomeComponent },  
  {path: '**', redirectTo: '/home' }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
