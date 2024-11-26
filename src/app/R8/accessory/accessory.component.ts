import { Component, OnInit } from "@angular/core";
import { Option } from "../../option/model";
import { AccessoryService } from "./accessory.service";
import { Router } from "@angular/router";
import { Rifle } from "../rifle/model";
import { ConfiguratorService } from "src/app/core/services/configurator.service";

@Component({
  selector: "app-accessory",
  templateUrl: "./accessory.component.html",
  styleUrls: [],
})
export class AccessoryComponent implements OnInit {

  rifles: Rifle[] = [];
  features: any;
  gunCases: Option[] = [];
  softGunCovers: Option[] = [];
  rifleSlings: Option[] = [];

  selectedRifle: Rifle | null = null;
  selectedGunCase: Option | null = null;
  selectedSoftGunCover: Option | null = null;
  selectedRifleSling: Option | null = null;

  constructor(
    private accessoryService: AccessoryService,
    private router: Router,
    private configuratorService: ConfiguratorService
  ) {}

  ngOnInit() {
    const savedRifle = JSON.parse(sessionStorage.getItem('selectedRifle') || 'null');

    this.accessoryService.getData().subscribe(
      (data) => {
        this.features = data.features;
        this.rifles = data.rifles;

        // Ustawienie wybranej strzelby
        this.selectedRifle = savedRifle ? savedRifle : this.rifles[0];

        // Load options
        this.updateOptionsBasedOnRifle();

      },
      (error) => {
        console.error("Error loading accessory data:", error);
      }
    );
  }

  private updateOptionsBasedOnRifle(): void {
    if(!this.selectedRifle){
      this.gunCases = [];
      this.softGunCovers = [];
      this.rifleSlings = [];
      return;
    }
    this.gunCases = this.configuratorService.filterOptions(this.features, 'gunCases', this.selectedRifle.availableGunCases)
    this.softGunCovers = this.configuratorService.filterOptions(this.features, 'softGunCovers', this.selectedRifle.availableSoftGunCovers)
    this.rifleSlings = this.configuratorService.filterOptions(this.features, 'rifleSlings', this.selectedRifle.availableRifleSlings)
  }

  onNext(): void {
    // Save selected options to sessionStorage
    const selectedOptions = {
      gunCase: this.selectedGunCase,
      softGunCover: this.selectedSoftGunCover,
      rifleSling: this.selectedRifleSling,
    };
    sessionStorage.setItem("selectedAccessories", JSON.stringify(selectedOptions));

    // Navigate to the next step
    this.router.navigate(["/next-step"]);
  }

  onBack() {
    this.router.navigate(["/r8/chamberBolt"]);
    }

}
