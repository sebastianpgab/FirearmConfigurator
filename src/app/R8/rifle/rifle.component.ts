import { Component, OnInit } from '@angular/core';
import { Rifle } from './model';
import { ConfiguratorService } from 'src/app/core/services/configurator.service';
import { BarrelComponent } from '../barrel/barrel.component';
import { BarrelService } from '../barrel/barrel.service';

@Component({
  selector: 'app-rifle',
  templateUrl: './rifle.component.html',
  styles: [
  ]
})
export class RifleComponent implements OnInit {

  selectedRifle: Rifle | null = null;
  rifles: Rifle[] = [];
  
  constructor(private configuratorService: ConfiguratorService, private barrelService: BarrelService) { }

  ngOnInit(): void {
    const savedRifle = JSON.parse(sessionStorage.getItem("selectedRifle") || "null");
    this.configuratorService.getData().subscribe(
    (data) => {this.rifles = data.rifles;

      // Ustawienie selectedRifle z sessionStorage lub domyślnego
      this.selectedRifle = savedRifle ? this.rifles.find(c => c.id === savedRifle.id) || this.rifles[1] : this.rifles[1] || null;
      if (this.selectedRifle) {
        this.onSelectRifle(this.selectedRifle);
      }     
    }
    )
  }


  onSelectRifle(rifle: Rifle): void {
    this.selectedRifle = rifle;
    sessionStorage.setItem("selectedRifle", JSON.stringify(rifle));

   // this.barrelService.resetOptions();
    //this.barrelService.updateOptionStates();
  }
}
