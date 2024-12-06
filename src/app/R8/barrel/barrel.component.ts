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
    const savedContour = JSON.parse(sessionStorage.getItem("selectedContour") || "null");
  
    this.barrelService.getData().subscribe(
      (data) => {
        this.features = data.features;
        this.rifles = data.rifles;
  
        // Ustawienie selectedRifle z sessionStorage lub domyślnego
        if (!this.selectedRifle) {
          this.selectedRifle = savedRifle || this.rifles[0];
        }
  
        // Zapisz selectedRifle do sessionStorage, jeśli nie był zapisany
        if (!savedRifle && this.selectedRifle) {
          sessionStorage.setItem("selectedRifle", JSON.stringify(this.selectedRifle));
        }
  
        // Aktualizacja opcji na podstawie selectedRifle
        this.updateOptionsBasedOnRifle("rifle");
  
        // Teraz, gdy contours są zaktualizowane, ustaw selectedContour
        if (!this.selectedContour && this.contours.length > 0) {
          this.selectedContour = savedContour || this.contours[0];
        }
  
        // Zapisz selectedContour do sessionStorage, jeśli jest dostępny
        if (this.selectedContour) {
          sessionStorage.setItem("selectedContour", JSON.stringify(this.selectedContour));
          // Wywołaj onSelectContour, aby zaktualizować kolejne opcje
          this.onSelectContour(this.selectedContour);
        }
  
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
    if (this.selectedContour) {
      sessionStorage.setItem("selectedContour", JSON.stringify(this.selectedContour));
    }
    this.router.navigate(["/r8/stock"]);
  }

  onSelectRifle(rifle: Rifle): void {
    this.selectedRifle = rifle;
    sessionStorage.setItem("selectedRifle", JSON.stringify(rifle));

    this.updateOptionsBasedOnRifle("rifle");
    this.updateOptionStates();
  }

  onSelectContour(contour: Option): void {
    this.selectedContour = contour;
    sessionStorage.setItem("selectedContour", JSON.stringify(contour));

    this.updateOptionsBasedOnRifle("contour");
    this.updateOptionStates();
  }
    
  onSelectCaliber(caliber: Option): void {
    this.selectedCaliber = caliber;

    this.updateOptionsBasedOnRifle("caliber");
    this.updateOptionStates();
  }

  onSelectProfile(profil: Option): void {
    this.selectedProfile = profil;

    this.updateOptionsBasedOnRifle("profile");
    this.updateOptionStates();
  } 

  onSelectLength(length: Option): void {
    this.selectedLength = length;

    this.updateOptionsBasedOnRifle("length");
    this.updateOptionStates();
  }
  
  onSelectOpenSight(openSight: Option): void {
    this.selectedOpenSight = openSight;

    this.updateOptionsBasedOnRifle("openSight");
    this.updateOptionStates();
  }

  private updateOptionsBasedOnRifle(changedOption: string): void {
    if (!this.selectedRifle) {
        this.resetOptions();
        return;
    }

    // Jeśli zmieniono karabin, resetujemy wszystko
    if (changedOption === "rifle") {
        this.resetOptions();
        // Aktualizujemy kontury na podstawie wybranego karabinu
        this.contours = this.configuratorService.filterOptions(
            this.features,
            "contours",
            this.selectedRifle.availableContours
        );
        this.selectedContour = null;
        this.updateCalibersForSelectedContour();
    }

    // Jeśli zmieniono kontur
    if (changedOption === "contour") {
        this.selectedCaliber = null;
        this.selectedProfile = null;
        this.selectedLength = null;
        this.selectedOpenSight = null;
        this.selectedMuzzleBrakeOrSuppressor = null;

        this.updateCalibersForSelectedContour();
    }

    // Jeśli zmieniono kaliber
    if (changedOption === "caliber") {
        this.selectedProfile = null;
        this.selectedLength = null;
        this.selectedOpenSight = null;
        this.selectedMuzzleBrakeOrSuppressor = null;

        this.updateProfilsForSelectedCaliber();
    }

    // Jeśli zmieniono profil
    if (changedOption === "profile") {
        this.selectedLength = null;
        this.selectedOpenSight = null;
        this.selectedMuzzleBrakeOrSuppressor = null;

        this.updateLengthsForSelectedProfil();
    }

    // Jeśli zmieniono długość
    if (changedOption === "length") {
        this.selectedOpenSight = null;
        this.selectedMuzzleBrakeOrSuppressor = null;

        this.updateOpenSightsForSelectedLength();
    }

    // Jeśli zmieniono otwarty celownik
    if (changedOption === "openSight") {
        this.selectedMuzzleBrakeOrSuppressor = null;

        this.updateMuzzleBrakesOrSuppressorsSelectedOpenSight();
    }
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
