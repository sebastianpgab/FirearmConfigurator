import { Component, OnInit } from '@angular/core';
import { Rifle } from './model';
import { ConfiguratorService } from 'src/app/core/services/configurator.service';
import { Option } from "../../option/model";
import { BarrelService } from '../barrel/barrel.service';
import { RifleService } from './rifle.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-rifle',
  templateUrl: './rifle.component.html',
  styles: [
  ]
})
export class RifleComponent implements OnInit {


  private subscription!: Subscription;
  selectedRifle: Rifle | null = null;
  rifles: Rifle[] = [];
  features: any;
  contours: Option[] = [];
  state: any;
  

  private optionHierarchy =
    [
    "rifle",
    "contour",
    "caliber",
    "profile",
    "length",
    "openSight",
    "muzzleBrakeOrSuppressor",
    "buttstockType",
    "woodCategory",
    "lengthOfPull",
    "individualButtstockMeasure",
    "buttstockMeasuresType",
    "pistolGripCap",
    "kickstop",
    "stockMagazine",
    "forearmOption"
  ];
 
  constructor(private configuratorService: ConfiguratorService, private barrelService: BarrelService, private rifleService: RifleService) { }

  ngOnInit(): void {

    this.subscription = this.configuratorService.state$.subscribe((state) => {
      this.state = state; 
    });

    const savedRifle = JSON.parse(sessionStorage.getItem("selectedRifle") || "null");
    this.configuratorService.getData().subscribe(
    (data) => {
      this.features = data.features;
      this.rifles = data.rifles;

      this.selectedRifle = savedRifle.id != null ? this.rifles.find((c) => c.id === savedRifle.id) || null : null;
      sessionStorage.setItem("selectedRifle", JSON.stringify(this.selectedRifle));

      if (this.selectedRifle) {
        this.configuratorService.updateState({ selectedRifle: this.selectedRifle });
      }

      this.rifleService.updateContoursForSelectedRifle(this.selectedRifle, this.features);
      }
    )
  }

  onSelectRifle(rifle: Rifle): void {
    this.selectedRifle = rifle;
    sessionStorage.setItem("selectedRifle", JSON.stringify(rifle));
    this.configuratorService.resetOptionsAfter("rifle", this.optionHierarchy)
    this.configuratorService.updateState({ selectedRifle: rifle });
    this.rifleService.updateContoursForSelectedRifle(this.selectedRifle, this.features);
}
}
