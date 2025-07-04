import { Component, OnInit, OnDestroy, ChangeDetectorRef } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";

import { Rifle } from "../rifle/model";
import { Option } from "../option/model";
import { ConfiguratorService } from "src/app/core/services/configurator.service";
import { BarrelService } from "./barrel.service";

@Component({
  selector: "app-barrel",
  templateUrl: "./barrel.component.html",
  styleUrls: [],
})
export class BarrelComponent implements OnInit, OnDestroy {
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

  // Dane z pliku JSON
  features: any;
  rifles: Rifle[] = [];
  allContours: Option[] = [];

  // Listy opcji do kolejnych mat-select
  contours: Option[] = [];
  calibers: Option[] = [];
  profiles: Option[] = [];
  lengths: Option[] = [];
  openSights: Option[] = [];
  muzzleBrakesOrSuppressors: Option[] = [];

  // Aktualny stan z serwisu
  state: any;

  constructor(
    private router: Router,
    private configuratorService: ConfiguratorService,
    private cdr: ChangeDetectorRef,
    private barrelService: BarrelService
  ) {}

  ngOnInit(): void {
    // Subskrybujemy stan
    this.subscription = this.configuratorService.state$.subscribe((state) => {
      this.state = state; 
    });

    // Pobieramy dane z pliku JSON
    this.configuratorService.getData().subscribe(
      (data) => {
        this.features = data.features;
        this.rifles = data.rifles;
        this.allContours = this.features.contours;

        // Od razu przy starcie odtwarzamy (przywracamy) listy zależne od tego, co jest w stanie:
        this.restoreSelections();
      },
      (error) => {
        console.error("Błąd przy ładowaniu danych:", error);
      }
    );
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  /**
   * compareOptionsById – do [compareWith] w mat-select,
   * aby rozpoznać tę samą opcję (po id) nawet jeśli obiekt jest inny referencyjnie.
   */
  compareOptionsById = (o1: Option, o2: Option) =>
    o1 && o2 ? o1.id === o2.id : o1 === o2;

  /**
   * Metoda przywraca zawartość wszystkich list (contours, calibers, profiles, itd.)
   * na podstawie aktualnego stanu (this.state).
   */
  private restoreSelections(): void {
    // 1) Ustawiamy listę contourów na podstawie wybranego rifle
    this.updateContoursBasedOnRifle();

    // 2) Jeśli mamy wybrany contour, wypełniamy calibers
    if (this.state.selectedContour) {
      this.updateCalibersForSelectedContour();
    }
    // 3) Jeśli mamy wybrany caliber, wypełniamy profiles
    if (this.state.selectedCaliber) {
      this.updateProfilesForSelectedCaliber();
    }
    // 4) Jeśli mamy wybrany profile, wypełniamy lengths
    if (this.state.selectedProfile) {
      this.updateLengthsForSelectedProfile();
    }
    // 5) Jeśli mamy wybrany length, wypełniamy openSights
    if (this.state.selectedLength) {
      this.updateOpenSightsForSelectedLength();
    }
    // 6) Jeśli mamy wybrany openSight, wypełniamy muzzleBrakesOrSuppressors
    if (this.state.selectedOpenSight) {
      this.updateMuzzleBrakesOrSuppressorsForSelectedOpenSight();
    }
  }

  /**
   * Ustawiamy listę contourów w oparciu o selectedRifle
   */
  private updateContoursBasedOnRifle(): void {
    if (this.state.selectedRifle) {
      this.contours = this.allContours.filter((contour) =>
        this.state.selectedRifle.availableContours.includes(contour.id)
      );
    } else {
      this.contours = [];
    }
  }

  // --- EVENTY WYBORU opcji w mat-select ---

  onSelectContour(newContour: Option): void {
    const oldContourId = this.state.selectedContour?.id;
    if (oldContourId === newContour.id) {
      return; // Ten sam contour - nic nie robimy
    }
    // reset + update
    this.configuratorService.resetOptionsAfter("contour", this.optionHierarchy);
    this.configuratorService.updateState({
      selectedContour: newContour,
      isDisabledCaliber: false,
    });

    // wypełniamy listę calibers
    this.updateCalibersForSelectedContour();
  }

  onSelectCaliber(newCaliber: Option): void {
    const oldCaliberId = this.state.selectedCaliber?.id;
    if (oldCaliberId === newCaliber.id) {
      return;
    }
    this.configuratorService.resetOptionsAfter("caliber", this.optionHierarchy);
    this.configuratorService.updateState({
      selectedCaliber: newCaliber,
      isDisabledProfile: false,
    });
    this.updateProfilesForSelectedCaliber();
  }

  onSelectProfile(newProfile: Option): void {
    const oldProfileId = this.state.selectedProfile?.id;
    if (oldProfileId === newProfile.id) {
      return;
    }
    this.configuratorService.resetOptionsAfter("profile", this.optionHierarchy);
    this.configuratorService.updateState({
      selectedProfile: newProfile,
      isDisabledLength: false,
    });
    this.updateLengthsForSelectedProfile();
  }

  onSelectLength(newLength: Option): void {
    const oldLengthId = this.state.selectedLength?.id;
    if (oldLengthId === newLength.id) {
      return;
    }
    this.configuratorService.resetOptionsAfter("length", this.optionHierarchy);
    this.configuratorService.updateState({
      selectedLength: newLength,
      isDisabledOpenSight: false,
    });
    this.updateOpenSightsForSelectedLength();
  }

  onSelectOpenSight(newOpenSight: Option): void {
    const oldOpenSightId = this.state.selectedOpenSight?.id;
    if (oldOpenSightId === newOpenSight.id) {
      return;
    }
    this.configuratorService.resetOptionsAfter("openSight", this.optionHierarchy);
    this.configuratorService.updateState({
      selectedOpenSight: newOpenSight,
      isDisabledMuzzleBrakeOrSuppressor: false,
    });
    this.updateMuzzleBrakesOrSuppressorsForSelectedOpenSight();
  }

  onSelectMuzzleBrakeOrSuppressor(newMuzzle: Option): void {
    const oldMuzzleId = this.state.selectedMuzzleBrakeOrSuppressor?.id;
    if (oldMuzzleId === newMuzzle.id) {
      return;
    }
    this.configuratorService.resetOptionsAfter("muzzleBrakeOrSuppressor", this.optionHierarchy);
    this.configuratorService.updateState({
      selectedMuzzleBrakeOrSuppressor: newMuzzle,
    });
  }

  // --- METODY do wypełniania list, zależnych od wyższych opcji (contour, caliber, itp.) ---

  private updateCalibersForSelectedContour(): void {
    if (this.state.selectedContour) {
      const caliberIds = this.state.selectedContour.availableCalibers;
      this.calibers = this.configuratorService.filterOptions(
        this.features,
        "calibers",
        caliberIds
      );
    } else {
      this.calibers = [];
    }
  }

  private updateProfilesForSelectedCaliber(): void {
    if (this.state.selectedCaliber) {
      const profileIds = this.state.selectedCaliber.availableProfiles;
      this.profiles = this.configuratorService.filterOptions(
        this.features,
        "profiles",
        profileIds
      ); 
    if (this.state.selectedContour?.id === 3) { //usun round
      const indexRound = this.profiles.findIndex(profile => profile.id === 1); //znajduje indeks gdzie profil jest Round
      if (indexRound !== -1) {
        this.profiles.splice(indexRound, 1); //usuwa jeden element zaczynający się od indexu 'indexRound'
      }
    }
    if (this.state.selectedContour?.id === 5 || this.state.selectedContour?.id === 6) { //usun wybor ryflowania 5 == silence lub 6 = tracking
      const indexFluted = this.profiles.findIndex(profile => profile.id === 2); //znajduje indeks gdzie profil jest Fluted
      if (indexFluted !== -1) {
        this.profiles.pop();
      }
    }
    if (this.state.selectedCaliber?.id === 14) { // jesli został wybrany kaliber Lapua
      const indexFluted = this.profiles.findIndex(profile => profile.id === 2); //znajduje indeks gdzie profil jest Fluted
      if (indexFluted !== -1) {
        this.profiles.pop();
      }
    } 
     if (this.state.selectedCaliber?.id === 19 && this.state.selectedContour?.id === 1) { // jesli został wybrany kaliber 8x68 S oraz kontur sandard 
      const indexFluted = this.profiles.findIndex(profile => profile.id === 2); //znajduje indeks gdzie profil jest Fluted
      if (indexFluted !== -1) {
        this.profiles.pop();
      }
    } 
    }
  }

  private updateLengthsForSelectedProfile(): void {
    if (!this.state.selectedProfile) {
      this.lengths = [];
      return;
    }

    const lengthIds = this.state.selectedProfile.availableLengths;
    const allLengths = this.configuratorService.filterOptions(
      this.features,
      "lengths",
      lengthIds
    );

    const contourType = this.extractContourType(this.state.selectedContour); // np. 'Standard'
    const selectedCaliber = this.state.selectedCaliber;

    this.barrelService.getBarrelLengthMap().subscribe((map) => {
      const rifleLengths = map[selectedCaliber.name];

      // uwzględniamy oba warianty: zwykły i ryflowany
      const allowedLengths = [
        ...(rifleLengths?.[contourType] || []),
        ...(rifleLengths?.[`${contourType} Ryflowana`] || [])
      ];

      const filteredByContourAndRifleType = allLengths.filter(length => {
        const name = length.name.toLowerCase();
        return name.includes(contourType.toLowerCase());
      });

      this.lengths = allowedLengths.length > 0
        ? filteredByContourAndRifleType.filter(length =>
            allowedLengths.some(mm => length.name.includes(`${mm}`))
          )
        : filteredByContourAndRifleType;
    });
  }


private extractContourType(contour: any): string {
  if (!contour.name) return '';
  if (contour.name.includes('Standard')) return 'Standard';
  if (contour.name.includes('Semi-Weight')) return 'Semi-Weight';
  if (contour.name.includes('Match')) return 'Match';
  if (contour.name.includes('Safari')) return 'Safari';
  if (contour.name.includes('Silence')) return 'Silence';
  if (contour.name.includes('Tracking')) return 'Tracking';
  return '';
}

  private updateOpenSightsForSelectedLength(): void {
    if (this.state.selectedLength) {
    this.state.selectedContour.imageUrl = 'assets/BlaserR8/puzzle/empty_png.png';
      const openSightIds = this.state.selectedLength.availableOpenSights;
      this.openSights = this.configuratorService.filterOptions(
        this.features,
        "openSights",
        openSightIds
      );
    } else {
      this.openSights = [];
    }
  }

  private updateMuzzleBrakesOrSuppressorsForSelectedOpenSight(): void {
      if (this.state.selectedOpenSight) {
          const muzzleIds = this.state.selectedOpenSight.availableMuzzleBrakesOrSuppressors;
          this.muzzleBrakesOrSuppressors = this.configuratorService.filterOptions(
              this.features,
              "muzzleBrakesOrSuppressors",
              muzzleIds
          );

          this.applyCaliberSpecificMuzzleFilter();

      } else {
          this.muzzleBrakesOrSuppressors = [];
      }

      this.cdr.detectChanges();
  }

  private applyCaliberSpecificMuzzleFilter(): void {
      const selectedCaliber = this.state.selectedCaliber.name;

      if (selectedCaliber === '17 HMR' ||  
          selectedCaliber === '22 WMR' || 
          selectedCaliber === '22 Hornet') {
        
        this.muzzleBrakesOrSuppressors = this.muzzleBrakesOrSuppressors.filter(item => {
        const normalized = item.name.toLowerCase().replace(/\s*\(.*?\)\s*/g, '').trim();
        return normalized === 'gwint na lufie' || normalized === 'brak';
      });

      } else if (selectedCaliber === '338 Lapua' ||  
                selectedCaliber === '375 H&H Mag.' || 
                selectedCaliber === '10,3 x 68 Mag.') {

          this.muzzleBrakesOrSuppressors = this.muzzleBrakesOrSuppressors.filter(item => {
              const isGwint = item.name.includes('Gwint na lufie');
              const isBrak = item.name.includes('Brak');
              const isDualBrake = item.name.includes('Blaser Dual Brake');

              if (selectedCaliber === '338 Lapua') {
                  return isGwint || isDualBrake;
              } else {
                  return isGwint || isBrak || isDualBrake;
              }
          });
      }
  }



  // --- Nawigacja ---
  onNext(): void {
    this.router.navigate(["/r8/stock"]);
  }
  onBack(): void {
    this.router.navigate(["/r8/model"]);
  }
}
