import { Component, OnInit } from "@angular/core";
import { Rifle } from "../rifle/model";
import { BarrelService } from "./barrel.service";
import { Option } from "../../option/model";
import { Router } from "@angular/router";
import { ConfiguratorService } from "src/app/core/services/configurator.service";
import { RifleService } from "../rifle/rifle.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-barrel",
  templateUrl: "./barrel.component.html",
  styleUrls: [],
})
export class BarrelComponent implements OnInit {
  features: any;
  options: any = {};
  rifles: Rifle[] = [];
  state: any; // Przechowuje aktualny stan z serwisu
  private subscription!: Subscription;
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
    private configuratorService: ConfiguratorService,
    private rifleService: RifleService
  ) {}

  ngOnInit(): void {
    const savedRifle = JSON.parse(sessionStorage.getItem("selectedRifle") || "null");
    const savedContour = JSON.parse(sessionStorage.getItem("selectedContour") || "null");
    const savedCaliber = JSON.parse(sessionStorage.getItem("selectedCaliber") || "null");
    const savedProfile = JSON.parse(sessionStorage.getItem("selectedProfile") || "null");
    const savedLenght = JSON.parse(sessionStorage.getItem("selectedLenght") || "null");
    const savedOpenSight = JSON.parse(sessionStorage.getItem("selectedOpenSight") || "null");
    const savedMuzzleBrakeOrSuppressor = JSON.parse(sessionStorage.getItem("selectedMuzzleBrakeOrSuppressor") || "null");

    this.subscription = this.barrelService.state$.subscribe((state) => {
      this.state = state; // Aktualizuje lokalny stan
    });
  
    this.barrelService.getData().subscribe(
      (data) => {
        this.features = data.features;
        this.rifles = data.rifles;

        this.rifleService.contours$.subscribe((contours) => {
          this.contours = contours;
        });

        this.rifleService.model$.subscribe(() => {
          this.barrelService.resetOptions();          
        })

        if (savedRifle && this.rifles.length > 0) {
          this.selectedRifle = this.rifles.find(c => c.id === savedRifle.id) || null;
        }
  
        // Ustawienie selectedContour z sessionStorage po wybraniu karabinu
        if (savedContour && this.contours.length > 0) {
          this.selectedContour = this.contours.find(c => c.id === savedContour.id) || null;
          if (this.selectedContour) {
            this.onSelectContour(this.selectedContour);
          }
        }
  
        // Ustawienie selectedCaliber z sessionStorage po wybraniu konturu
        if (savedCaliber && this.calibers.length > 0) {
          this.selectedCaliber = this.calibers.find(c => c.id === savedCaliber.id) || null;
          if (this.selectedCaliber) {
            this.onSelectCaliber(this.selectedCaliber);
          }
        }

        if (savedProfile && this.profiles.length > 0) {
          this.selectedProfile = this.profiles.find(c => c.id === savedProfile.id) || null;
          if(this.selectedProfile) {
            this.onSelectProfile(this.selectedProfile);
          }
        }

        if(savedLenght && this.lengths.length > 0) {
          this.selectedLength = this.lengths.find(c => c.id === savedLenght.id) || null;
          if(this.selectedLength) {
            this.onSelectLength(this.selectedLength);
          }
        }

        if(savedOpenSight && this.openSights.length > 0) {
          this.selectedOpenSight = this.openSights.find(c => c.id === savedOpenSight.id) || null;
          if(this.selectedOpenSight) {
            this.onSelectOpenSight(this.selectedOpenSight);
          }
        }

        if(savedMuzzleBrakeOrSuppressor && this.muzzleBrakesOrSuppressors.length > 0) {
          this.selectedMuzzleBrakeOrSuppressor = this.muzzleBrakesOrSuppressors.find(c => c.id === savedMuzzleBrakeOrSuppressor.id) || null;
          if(this.selectedMuzzleBrakeOrSuppressor) {
            this.onSelectMuzzleBrakeOrSuppressor(this.selectedMuzzleBrakeOrSuppressor);
          }
        }        

      },
      (error) => {
        console.error("Błąd przy ładowaniu danych:", error);
      }
    );
  }
  
  onNext(): void {
    this.router.navigate(["/r8/stock"]);
  }

  onSelectContour(contour: Option): void {
    this.selectedContour = contour;
    sessionStorage.setItem("selectedContour", JSON.stringify(contour));
    this.updateOptionsBasedOnRifle("contour");

    this.barrelService.updateState({
      selectedContour: contour,
      isDisabledCaliber: false,
    });

  }
    
  onSelectCaliber(caliber: Option): void {
    this.selectedCaliber = caliber;
    sessionStorage.setItem("selectedCaliber", JSON.stringify(caliber));

    this.updateOptionsBasedOnRifle("caliber");

    this.barrelService.updateState({
      selectedCaliber: caliber,
      isDisabledProfile: false,
    });

  }

  onSelectProfile(profile: Option): void {
    this.selectedProfile = profile;
    sessionStorage.setItem("selectedProfile", JSON.stringify(profile));


    this.updateOptionsBasedOnRifle("profile");


  } 

  onSelectLength(length: Option): void {
    this.selectedLength = length;
    sessionStorage.setItem("selectedLenght", JSON.stringify(length));

    this.updateOptionsBasedOnRifle("length");


  }
  
  onSelectOpenSight(openSight: Option): void {
    this.selectedOpenSight = openSight;
    sessionStorage.setItem("selectedOpenSight", JSON.stringify(openSight))

    this.updateOptionsBasedOnRifle("openSight");


  }

  onSelectMuzzleBrakeOrSuppressor(muzzleBrakeOrSuppressor: Option): void {
    this.selectedMuzzleBrakeOrSuppressor = muzzleBrakeOrSuppressor;
    sessionStorage.setItem("selectedMuzzleBrakeOrSuppressor", JSON.stringify(muzzleBrakeOrSuppressor))


  }

  public updateOptionsBasedOnRifle(changedOption: string): void {
    if (!this.selectedRifle) {
       this.barrelService.resetOptions();
       return;
    }

    if (changedOption === "contour") {
        this.selectedCaliber = null;
        this.selectedProfile = null;
        this.selectedLength = null;
        this.selectedOpenSight = null;
        this.selectedMuzzleBrakeOrSuppressor = null;
        this.updateCalibersForSelectedContour();
    }

    if (changedOption === "caliber") {
        this.selectedProfile = null;
        this.selectedLength = null;
        this.selectedOpenSight = null;
        this.selectedMuzzleBrakeOrSuppressor = null;
        this.updateProfilsForSelectedCaliber();
    }

    if (changedOption === "profile") {
        this.selectedLength = null;
        this.selectedOpenSight = null;
        this.selectedMuzzleBrakeOrSuppressor = null;
        this.updateLengthsForSelectedProfil();
    }

    if (changedOption === "length") {
        this.selectedOpenSight = null;
        this.selectedMuzzleBrakeOrSuppressor = null;
        this.updateOpenSightsForSelectedLength();
    }

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

  ngOnDestroy(): void {
    // Odsubskrybuj, aby zapobiec wyciekom pamięci
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  

}
