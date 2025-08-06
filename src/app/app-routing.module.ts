// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { BarrelComponent } from './R8/barrel/barrel.component';
import { StockComponent } from './R8/stock/stock.component';
import { ChamberBoltComponent } from './R8/chamber-bolt/chamber-bolt.component';
import { AccessoryComponent } from './R8/accessory/accessory.component';
import { RifleComponent } from './R8/rifle/rifle.component';
import { ContactComponent } from './core/contact/contact.component';
import { SummaryComponent } from './summary/summary.component';
import { CategoryGuard } from './core/guards/category-guard';


const routes: Routes = [
  {path: '', redirectTo: 'r8/model', pathMatch: 'full' },
  {path: 'r8/model', component: RifleComponent},
  {path: 'r8/barrel', component: BarrelComponent, canActivate: [CategoryGuard]},
  {path: 'r8/stock', component: StockComponent, canActivate: [CategoryGuard]},
  {path: 'r8/chamberBolt', component: ChamberBoltComponent, canActivate: [CategoryGuard]},
  {path: 'r8/accessory', component: AccessoryComponent, canActivate: [CategoryGuard]},
  {path: 'r8/summary', component: SummaryComponent, canActivate: [CategoryGuard]},
  {path: 'contact', component: ContactComponent, canActivate: [CategoryGuard]},
  //{path: 'home', component: HomeComponent },  
  {path: '**', redirectTo: 'r8/model' }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
