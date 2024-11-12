// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { BarrelComponent } from './R8/barrel/barrel.component';

const routes: Routes = [
  {path: 'r8/barrel', component: BarrelComponent},
  {path: '', component:HomeComponent},
  {path: '**', component: HomeComponent},
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
