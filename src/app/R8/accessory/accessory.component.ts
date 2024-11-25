import { Component, OnInit } from "@angular/core";
import { Option } from "../../option/model";
import { AccessoryService } from "./accessory.service";
import { Router } from "@angular/router";
import { Rifle } from "../rifle/model";

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

  isDisabledSoftGunCover: boolean = true;
  isDisabledRifleSling: boolean = true;

  constructor(
    private accessoryService: AccessoryService,
    private router: Router
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
        this.gunCases = this.features["gunCases"];
        this.softGunCovers = this.features["softGunCovers"];
        this.rifleSlings = this.features["rifleSlings"];

        // Update option states
        this.updateOptionStates();
      },
      (error) => {
        console.error("Error loading accessory data:", error);
      }
    );
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

  public updateOptionStates(): void {
    this.isDisabledSoftGunCover = !this.selectedGunCase;
    this.isDisabledRifleSling = !this.selectedSoftGunCover;
  }
}
