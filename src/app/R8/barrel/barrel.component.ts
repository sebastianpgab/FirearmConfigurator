import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";

import { Rifle } from "../rifle/model";
import { Option } from "../option/model";
import { ConfiguratorService } from "src/app/core/services/configurator.service";

@Component({
  selector: "app-barrel",
  templateUrl: "./barrel.component.html",
  styleUrls: [],
})
export class BarrelComponent implements OnInit, OnDestroy {
  private subscription!: Subscription;

  /**
   * Hierarchia opcji – do resetowania "niższych" opcji,
   * jeśli zmieniamy coś wyżej.
   */
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
    private configuratorService: ConfiguratorService
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
    } else {
      this.profiles = [];
    }
  }

  private updateLengthsForSelectedProfile(): void {
    if (this.state.selectedProfile) {
      const lengthIds = this.state.selectedProfile.availableLengths;
      this.lengths = this.configuratorService.filterOptions(
        this.features,
        "lengths",
        lengthIds
      );
    } else {
      this.lengths = [];
    }
  }

  private updateOpenSightsForSelectedLength(): void {
    if (this.state.selectedLength) {
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
    } else {
      this.muzzleBrakesOrSuppressors = [];
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
