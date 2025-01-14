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
  
  private subscription!: Subscription;

  private optionHierarchy = [
    "rifle",
    "contour",
    "caliber",
    "profile",
    "length",
    "openSight",
    "muzzleBrakeOrSuppressor",
  ];

  features: any;
  options: any = {};
  rifles: Rifle[] = [];
  state: any; // Przechowuje aktualny stan z serwisu
  allContours: Option[] = [];
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
    const savedLength = JSON.parse(sessionStorage.getItem("selectedLength") || "null");
    const savedOpenSight = JSON.parse(sessionStorage.getItem("selectedOpenSight") || "null");
    const savedMuzzleBrakeOrSuppressor = JSON.parse(sessionStorage.getItem("selectedMuzzleBrakeOrSuppressor") || "null");

    this.subscription = this.configuratorService.state$.subscribe((state) => {
      this.state = state; 
    });

    this.configuratorService.getData().subscribe(
      (data) => {
        this.features = data.features;
        this.rifles = data.rifles;
        this.allContours = this.features.contours;

        this.rifleService.model$.subscribe(() => {
          this.barrelService.resetOptions();          
        })

        if (savedRifle && this.rifles.length > 0) {
          this.selectedRifle = this.rifles.find(c => c.id === savedRifle.id) || null;
        }

        if (this.selectedRifle) {
          this.contours = this.allContours.filter(contour => 
            this.selectedRifle?.availableContours.includes(contour.id)
          );
        } else { 
          this.contours = [];
        }
  
        if (savedContour && this.allContours.length > 0) {
          this.selectedContour = this.allContours.find(c => c.id === savedContour.id) || null;
          if (this.selectedContour) {
            this.onSelectContour(this.selectedContour);
          }
        }
  
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

        if(savedLength && this.lengths.length > 0) {
          this.selectedLength = this.lengths.find(c => c.id === savedLength.id) || null;
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
  
  onSelectContour(contour: Option): void {
    this.selectedContour = contour;
    sessionStorage.setItem("selectedContour", JSON.stringify(contour));
    this.updateOptionsBasedOnRifle("contour");

    this.configuratorService.updateState({
      selectedContour: contour,
      isDisabledCaliber: false,
    });
  }
     
  onSelectCaliber(caliber: Option): void {
    this.selectedCaliber = caliber;
    sessionStorage.setItem("selectedCaliber", JSON.stringify(caliber));
    this.updateOptionsBasedOnRifle("caliber");

    this.configuratorService.updateState({
      selectedCaliber: caliber,
      isDisabledProfile: false,
    });
  }

  onSelectProfile(profile: Option): void {
    this.selectedProfile = profile;
    sessionStorage.setItem("selectedProfile", JSON.stringify(profile));
    this.updateOptionsBasedOnRifle("profile");

    this.configuratorService.updateState({
      selectedProfile: profile,
      isDisabledLength: false,
    });
  } 

  onSelectLength(length: Option): void {
    this.selectedLength = length;
    sessionStorage.setItem("selectedLength", JSON.stringify(length));
    this.updateOptionsBasedOnRifle("length");

    this.configuratorService.updateState({
      selectedLength: length,
      isDisabledOpenSight: false,
    });
  }
  
  onSelectOpenSight(openSight: Option): void {
    this.selectedOpenSight = openSight;
    sessionStorage.setItem("selectedOpenSight", JSON.stringify(openSight))
    this.updateOptionsBasedOnRifle("openSight");

    this.configuratorService.updateState({
      selectedOpenSight: openSight,
      isDisabledMuzzleBrakeOrSuppressor: false,
    })
  }

  onSelectMuzzleBrakeOrSuppressor(muzzleBrakeOrSuppressor: Option): void {
    this.selectedMuzzleBrakeOrSuppressor = muzzleBrakeOrSuppressor;
    sessionStorage.setItem("selectedMuzzleBrakeOrSuppressor", JSON.stringify(muzzleBrakeOrSuppressor))

    this.configuratorService.updateState({
      selectedMuzzleBrakeOrSuppressor: muzzleBrakeOrSuppressor,
    })
  }

  public updateOptionsBasedOnRifle(changedOption: string): void {
    if (!this.selectedRifle) {
      this.barrelService.resetOptions();
      sessionStorage.clear();
      return;
    }
  
    this.configuratorService.resetOptionsAfter(changedOption, this.optionHierarchy);
  
    if (changedOption === "contour") {
      this.updateCalibersForSelectedContour();
    }
  
    if (changedOption === "caliber") {
      this.updateProfilsForSelectedCaliber();
    }
  
    if (changedOption === "profile") {
      this.updateLengthsForSelectedProfil();
    }
  
    if (changedOption === "length") {
      this.updateOpenSightsForSelectedLength();
    }
  
    if (changedOption === "openSight") {
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
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onNext(): void {
    this.router.navigate(["/r8/stock"]);
  }

  onBack() {
    this.router.navigate(['/r8/model']);
    }

}
