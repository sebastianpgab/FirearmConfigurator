import { Component, OnInit } from "@angular/core";
import { Rifle } from "../rifle/model";
import { BarrelService } from "./barrel.service";
import { Option } from "../../option/model";
import { Router } from "@angular/router";
import { ConfiguratorService } from "src/app/core/services/configurator.service";

@Component({
  selector: "app-barrel",
  templateUrl: "./barrel.component.html",
  styleUrls: [],
})
export class BarrelComponent implements OnInit {
  features: any;
  rifles: Rifle[] = [];
  contours: Option[] = [];
  calibers: Option[] = [];
  profiles: Option[] = [];
  lengths: Option[] = [];
  openSights: Option[] = [];
  muzzleBrakesOrSuppressors: Option[] = [];

  selectedRifle: Rifle | null = null;
  selectedContour: Option | null = null
  selectedCaliber: Option | null = null;
  selectedProfile: Option | null = null;
  selectedLength: Option | null = null;
  selectedOpenSight: Option | null = null;
  selectedMuzzleBrakeOrSuppressor: Option | null = null;

  isDisabledCaliber: boolean = true;
  isDisabledProfile: boolean = true;
  isDisabledLength: boolean = true;
  isDisabledOpenSight: boolean = true;
  isDisabledMuzzleBrakeOrSuppressor: boolean = true;

  constructor(
    private barrelService: BarrelService,
    private router: Router,
    private configuratorService: ConfiguratorService
  ) {}

  ngOnInit(): void {
    const savedRifle = JSON.parse(sessionStorage.getItem("selectedRifle") || "null");

    this.barrelService.getData().subscribe(
      (data) => {
        this.features = data.features;
        this.rifles = data.rifles;

        this.selectedRifle = savedRifle || this.rifles[0];
        this.selectedContour = this.features.barrel[0];

        this.updateOptionsBasedOnRifle();
        this.updateOptionStates();
      },
      (error) => {
        console.error("Błąd przy ładowaniu danych:", error);
      }
    );
  }

  onNext(): void {
    if (this.selectedRifle) {
      sessionStorage.setItem("selectedRifle", JSON.stringify(this.selectedRifle));
    }
    this.router.navigate(["/r8/stock"]);
  }

  onSelectRifle(rifle: Rifle): void {
    this.selectedRifle = rifle;
    sessionStorage.setItem("selectedRifle", JSON.stringify(rifle));

    this.updateOptionsBasedOnRifle();
    this.updateOptionStates();
  }

  onSelectContour(contour: Option): void {
    this.selectedContour = contour;
    this.updateCalibersForSelectedContour();
    this.updateOptionStates();
  }

  onSelectCaliber(caliber: Option): void{
    this.selectedCaliber = caliber;
    this.updateProfilsForSelectedCaliber();
    this.updateOptionStates();
  }

  onSelectProfile(profil: Option): void{
    this.selectedProfile = profil;
    this.updateLengthsForSelectedProfil();
    this.updateOptionStates();
  }

  onSelectLength(openSight: Option): void {
    this.selectedOpenSight = openSight;
    this.updateOpenSightsForSelectedLength();
    this.updateOptionStates();
  }
  onSelectOpenSight(muzzleBrakesOrSuppressor: Option): void {
    this.selectedMuzzleBrakeOrSuppressor = muzzleBrakesOrSuppressor;
    this.updateMuzzleBrakesOrSuppressorsSelectedOpenSight();
    this.updateOptionStates();
  }

  private updateOptionsBasedOnRifle(): void {
    if (!this.selectedRifle) {
        this.resetOptions();
        return;
    }

    this.contours = this.configuratorService.filterOptions(
        this.features,
        "contours",
        this.selectedRifle.availableContours
    );

    this.selectedContour = null;
    this.updateCalibersForSelectedContour();

    this.calibers = this.configuratorService.filterOptions(
      this.features,
      "calibers",
      this.selectedRifle.availableCalibers
    )

    this.selectedCaliber = null;
    this. updateProfilsForSelectedCaliber();

    this.profiles = this.configuratorService.filterOptions(
        this.features,
        "profiles",
        this.selectedRifle.availableProfiles
    );

    this.selectedProfile = null;
    this.updateLengthsForSelectedProfil();

    this.openSights = this.configuratorService.filterOptions(
        this.features,
        "openSights",
        this.selectedRifle.availableOpenSights
    );

    this.muzzleBrakesOrSuppressors = this.configuratorService.filterOptions(
        this.features,
        "muzzleBrakesOrSuppressors",
        this.selectedRifle.availableMuzzleBrakesOrSuppressors
    );
  }

  private updateCalibersForSelectedContour(): void {
    if (this.selectedContour) {
      const caliberIds = this.selectedContour.availableCalibers;
      this.calibers = this.configuratorService.filterOptions(
        this.features,
        "calibers",
        caliberIds
      );
    } else {
      this.calibers = [];
    }
    this.selectedCaliber = null; 
  }

  private updateProfilsForSelectedCaliber(): void {
    if(this.selectedCaliber) {
      const profileIds = this.selectedCaliber?.availableProfiles;
      this.profiles = this.configuratorService.filterOptions(
        this.features,
        "profiles",
        profileIds
      );
    }else{
      this.profiles =[];
    }
    this.selectedProfile = null;
  }

  private updateLengthsForSelectedProfil(): void {
    if(this.selectedProfile) {
      const lengthIds = this.selectedProfile?.availableLengths;
      this.lengths = this.configuratorService.filterOptions(
        this.features,
        "lengths",
        lengthIds
      );
    }else{
      this.lengths =[];
    }
    this.selectedLength = null;
  }

  private updateOpenSightsForSelectedLength(): void {
    if(this.selectedLength) {
      const openSightIds = this.selectedLength?.availableOpenSights;
      this.openSights = this.configuratorService.filterOptions(
        this.features,
        "openSights",
        openSightIds
      );
    }else{
      this.openSights =[];
    }
    this.selectedOpenSight = null;
  }

  private updateMuzzleBrakesOrSuppressorsSelectedOpenSight():void {
    if(this.selectedOpenSight){
      const muzzleBrakesOrSuppressorIds = this.selectedOpenSight?.availableMuzzleBrakesOrSuppressors;
      this.muzzleBrakesOrSuppressors = this.configuratorService.filterOptions(
        this.features,
        "muzzleBrakesOrSuppressors",
        muzzleBrakesOrSuppressorIds
      );
      }else{
        this.muzzleBrakesOrSuppressors = [];
    }
    this.selectedMuzzleBrakeOrSuppressor = null;
  }

  private updateOptionStates(): void {
    this.isDisabledCaliber = !this.selectedContour;
    this.isDisabledProfile = !this.selectedCaliber;
    this.isDisabledLength = !this.selectedProfile;
    this.isDisabledOpenSight = !this.selectedLength;
    this.isDisabledMuzzleBrakeOrSuppressor = !this.selectedOpenSight;
  }

  private resetOptions(): void {
    this.contours = [];
    this.calibers = [];
    this.profiles = [];
    this.lengths = [];
    this.openSights = [];
    this.muzzleBrakesOrSuppressors = [];
    this.selectedContour = null;
    this.selectedCaliber = null;
    this.selectedProfile = null;
    this.selectedLength = null;
    this.selectedOpenSight = null;
    this.selectedMuzzleBrakeOrSuppressor = null;
  }
}
