import { Component, OnInit } from '@angular/core';
import { Rifle } from './model';
import { ConfiguratorService } from 'src/app/core/services/configurator.service';
import { BarrelComponent } from '../barrel/barrel.component';

@Component({
  selector: 'app-rifle',
  templateUrl: './rifle.component.html',
  styles: [
  ]
})
export class RifleComponent implements OnInit {

  selectedRifle: Rifle | null = null;
  rifles: Rifle[] = [];
  
  constructor(private configuratorService: ConfiguratorService, private barrelComponent: BarrelComponent) { }

  ngOnInit(): void {
    const savedRifle = JSON.parse(sessionStorage.getItem("selectedRifle") || "null");
    this.configuratorService.getData().subscribe(
      (data) => {this.rifles = data.rifles;}
    )
  }

  onSelectRifle(rifle: Rifle): void {
    this.selectedRifle = rifle;
    sessionStorage.setItem("selectedRifle", JSON.stringify(rifle));

    this.barrelComponent.updateOptionsBasedOnRifle("rifle");
    this.barrelComponent.updateOptionStates();
  }
}
