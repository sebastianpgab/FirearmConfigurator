import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { Router } from "@angular/router";

import { Rifle } from "../rifle/model";
import { Option } from "../../option/model";
import { ConfiguratorService } from "src/app/core/services/configurator.service";

@Component({
  selector: "app-stock",
  templateUrl: "./stock.component.html",
  styleUrls: [],
})
export class StockComponent implements OnInit, OnDestroy {
  private subscription!: Subscription;

  /**
   * Hierarchia opcji – do resetowania "niższych" opcji,
   * jeśli zmieniamy coś wyżej w łańcuchu.
   */
  private optionHierarchy = [
    "rifle",
    "buttstockType",
    "woodCategory",
    "lengthOfPull",
    "individualButtstockMeasure",
    "buttstockMeasuresType",
    "pistolGripCap",
    "kickstop",
    "stockMagazine",
    "forearmOption",
  ];

  // Dane z pliku JSON (features) i listy modeli
  features: any;
  rifles: Rifle[] = [];
  allButtstockTypes: Option[] = [];

  // Listy opcji do kolejnych selectów
  buttstockTypes: Option[] = [];
  woodCategories: Option[] = [];
  lengthsOfPull: Option[] = [];
  individualButtstockMeasures: Option[] = [];
  buttstockMeasuresTypes: Option[] = [];
  pistolGripCaps: Option[] = [];
  kickstops: Option[] = [];
  stockMagazines: Option[] = [];
  forearmOptions: Option[] = [];

  // Aktualny stan z serwisu (wybrane opcje, flagi isDisabled itp.)
  state: any;

  constructor(
    private router: Router,
    private configuratorService: ConfiguratorService
  ) {}

  ngOnInit(): void {
    // Subskrypcja stanu
    this.subscription = this.configuratorService.state$.subscribe((state) => {
      this.state = state;
    });

    // Pobieramy dane
    this.configuratorService.getData().subscribe(
      (data) => {
        this.features = data.features;
        this.rifles = data.rifles;
        this.allButtstockTypes = this.features.buttstockTypes;

        // Przywracamy listy na podstawie aktualnie zapisanych w state wyborów
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
   * compareOptionsById – funkcja pomocnicza do [compareWith] w mat-select,
   * umożliwia Angularowi wykrycie tej samej opcji (po id), nawet gdy obiekt jest inny referencyjnie.
   */
  compareOptionsById = (o1: Option, o2: Option) => {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  };

  /**
   * Przywracamy listy opcji w kolejności (buttstockType -> woodCategory -> lengthOfPull -> ...),
   * jeśli w stanie jest już coś wybrane.
   */
  private restoreSelections(): void {
    // 1) buttstockTypes zależne od wybranego karabinu
    this.updateButtstockTypesBasedOnRifle();

    // 2) Jeśli mamy selectedButtstockType, wypełniamy woodCategories
    if (this.state.selectedButtstockType) {
      this.updateWoodCategoryForSelectedButtstockType();
    }
    // 3) Jeśli selectedWoodCategory, wypełniamy lengthsOfPull
    if (this.state.selectedWoodCategory) {
      this.updateLengthOfPullForSelectedWoodCategory();
    }
    // 4) Jeśli selectedLengthOfPull, wypełniamy individualButtstockMeasures
    if (this.state.selectedLengthOfPull) {
      this.updateIndividualButtstockMeasureForSelectedLengthOfPull();
    }
    // 5) Jeśli selectedIndividualButtstockMeasure, wypełniamy buttstockMeasuresTypes
    if (this.state.selectedIndividualButtstockMeasure) {
      this.updateButtstockMeasuresTypeForSelectedIndividualButtstockMeasure();
    }
    // 6) Jeśli selectedButtstockMeasuresType, wypełniamy pistolGripCaps
    if (this.state.selectedButtstockMeasuresType) {
      this.updatePistolGripCapForSelectedButtstockMeasuresType();
    }
    // 7) Jeśli selectedPistolGripCap, wypełniamy kickstops
    if (this.state.selectedPistolGripCap) {
      this.updateKickstopForSelectedPistolGripCap();
    }
    // 8) Jeśli selectedKickstop, wypełniamy stockMagazines
    if (this.state.selectedKickstop) {
      this.updateStockMagazineForSelectedKickstop();
    }
    // 9) Jeśli selectedStockMagazine, wypełniamy forearmOptions
    if (this.state.selectedStockMagazine) {
      this.updateForearmOptionForSelectedStockMagazine();
    }
  }

  // ==============================
  //  Metody prywatne do wypełniania list
  // ==============================

  /**
   * Od wybranego karabinu (selectedRifle) zależy, jakie buttstockTypes są dostępne.
   */
  private updateButtstockTypesBasedOnRifle(): void {
    if (this.state.selectedRifle) {
      const availableButtstockTypeIds = this.state.selectedRifle.availableButtstockTypes;
      this.buttstockTypes = this.allButtstockTypes.filter((option) =>
        availableButtstockTypeIds.includes(option.id)
      );
    } else {
      this.buttstockTypes = [];
    }
  }

  private updateWoodCategoryForSelectedButtstockType(): void {
    if (this.state.selectedButtstockType) {
      const woodCategoryIds = this.state.selectedButtstockType.availableWoodCategories;
      this.woodCategories = this.configuratorService.filterOptions(
        this.features,
        "woodCategories",
        woodCategoryIds
      );
    } else {
      this.woodCategories = [];
    }
  }

  private updateLengthOfPullForSelectedWoodCategory(): void {
    if (this.state.selectedWoodCategory) {
      const lengthOfPullIds = this.state.selectedWoodCategory.availableLengthsOfPull;
      this.lengthsOfPull = this.configuratorService.filterOptions(
        this.features,
        "lengthsOfPull",
        lengthOfPullIds
      );
    } else {
      this.lengthsOfPull = [];
    }
  }

  private updateIndividualButtstockMeasureForSelectedLengthOfPull(): void {
    if (this.state.selectedLengthOfPull) {
      const measureIds = this.state.selectedLengthOfPull.availableIndividualButtstockMeasures;
      this.individualButtstockMeasures = this.configuratorService.filterOptions(
        this.features,
        "individualButtstockMeasures",
        measureIds
      );
    } else {
      this.individualButtstockMeasures = [];
    }
  }

  private updateButtstockMeasuresTypeForSelectedIndividualButtstockMeasure(): void {
    if (this.state.selectedIndividualButtstockMeasure) {
      const measureTypeIds = this.state.selectedIndividualButtstockMeasure.availableButtstockMeasuresTypes;
      this.buttstockMeasuresTypes = this.configuratorService.filterOptions(
        this.features,
        "buttstockMeasuresTypes",
        measureTypeIds
      );
    } else {
      this.buttstockMeasuresTypes = [];
    }
  }

  private updatePistolGripCapForSelectedButtstockMeasuresType(): void {
    if (this.state.selectedButtstockMeasuresType) {
      const capIds = this.state.selectedButtstockMeasuresType.availablePistolGripCaps;
      this.pistolGripCaps = this.configuratorService.filterOptions(
        this.features,
        "pistolGripCaps",
        capIds
      );
    } else {
      this.pistolGripCaps = [];
    }
  }

  private updateKickstopForSelectedPistolGripCap(): void {
    if (this.state.selectedPistolGripCap) {
      const kickstopIds = this.state.selectedPistolGripCap.availableKickstops;
      this.kickstops = this.configuratorService.filterOptions(
        this.features,
        "kickstops",
        kickstopIds
      );
    } else {
      this.kickstops = [];
    }
  }

  private updateStockMagazineForSelectedKickstop(): void {
    if (this.state.selectedKickstop) {
      const magazineIds = this.state.selectedKickstop.availableStockMagazines;
      this.stockMagazines = this.configuratorService.filterOptions(
        this.features,
        "stockMagazines",
        magazineIds
      );
    } else {
      this.stockMagazines = [];
    }
  }

  private updateForearmOptionForSelectedStockMagazine(): void {
    if (this.state.selectedStockMagazine) {
      const forearmIds = this.state.selectedStockMagazine.availableForearmOptions;
      this.forearmOptions = this.configuratorService.filterOptions(
        this.features,
        "forearmOptions",
        forearmIds
      );
    } else {
      this.forearmOptions = [];
    }
  }

  // ==============================
  // EVENTY WYBORU (onSelect...)
  // ==============================

  onSelectButtstockType(newButtstockType: Option): void {
    const oldId = this.state.selectedButtstockType?.id;
    if (oldId === newButtstockType.id) {
      return; // bez zmian
    }

    this.configuratorService.resetOptionsAfter("buttstockType", this.optionHierarchy);
    this.configuratorService.updateState({
      selectedButtstockType: newButtstockType,
      isDisabledWoodCategory: false,
    });

    // Wypełniamy kolejną listę
    this.updateWoodCategoryForSelectedButtstockType();
  }

  onSelectWoodCategory(newWoodCategory: Option): void {
    const oldId = this.state.selectedWoodCategory?.id;
    if (oldId === newWoodCategory.id) {
      return;
    }

    this.configuratorService.resetOptionsAfter("woodCategory", this.optionHierarchy);
    this.configuratorService.updateState({
      selectedWoodCategory: newWoodCategory,
      isDisabledLengthOfPull: false,
    });

    this.updateLengthOfPullForSelectedWoodCategory();
  }

  onSelectLengthOfPull(newLength: Option): void {
    const oldId = this.state.selectedLengthOfPull?.id;
    if (oldId === newLength.id) {
      return;
    }

    this.configuratorService.resetOptionsAfter("lengthOfPull", this.optionHierarchy);
    this.configuratorService.updateState({
      selectedLengthOfPull: newLength,
      isDisabledIndividualButtstockMeasure: false,
    });

    this.updateIndividualButtstockMeasureForSelectedLengthOfPull();
  }

  onSelectIndividualButtstockMeasure(newMeasure: Option): void {
    const oldId = this.state.selectedIndividualButtstockMeasure?.id;
    if (oldId === newMeasure.id) {
      return;
    }

    this.configuratorService.resetOptionsAfter("individualButtstockMeasure", this.optionHierarchy);
    this.configuratorService.updateState({
      selectedIndividualButtstockMeasure: newMeasure,
      isDisabledButtstockMeasuresType: false,
    });

    this.updateButtstockMeasuresTypeForSelectedIndividualButtstockMeasure();
  }

  onSelectButtstockMeasuresType(newMeasureType: Option): void {
    const oldId = this.state.selectedButtstockMeasuresType?.id;
    if (oldId === newMeasureType.id) {
      return;
    }

    this.configuratorService.resetOptionsAfter("buttstockMeasuresType", this.optionHierarchy);
    this.configuratorService.updateState({
      selectedButtstockMeasuresType: newMeasureType,
      isDisabledPistolGripCap: false,
    });

    this.updatePistolGripCapForSelectedButtstockMeasuresType();
  }

  onSelectPistolGripCap(newCap: Option): void {
    const oldId = this.state.selectedPistolGripCap?.id;
    if (oldId === newCap.id) {
      return;
    }

    this.configuratorService.resetOptionsAfter("pistolGripCap", this.optionHierarchy);
    this.configuratorService.updateState({
      selectedPistolGripCap: newCap,
      isDisabledKickstop: false,
    });

    this.updateKickstopForSelectedPistolGripCap();
  }

  onSelectKickstop(newKickstop: Option): void {
    const oldId = this.state.selectedKickstop?.id;
    if (oldId === newKickstop.id) {
      return;
    }

    this.configuratorService.resetOptionsAfter("kickstop", this.optionHierarchy);
    this.configuratorService.updateState({
      selectedKickstop: newKickstop,
      isDisabledStockMagazine: false,
    });

    this.updateStockMagazineForSelectedKickstop();
  }

  onSelectStockMagazine(newMagazine: Option): void {
    const oldId = this.state.selectedStockMagazine?.id;
    if (oldId === newMagazine.id) {
      return;
    }

    this.configuratorService.resetOptionsAfter("stockMagazine", this.optionHierarchy);
    this.configuratorService.updateState({
      selectedStockMagazine: newMagazine,
      isDisabledForearmOption: false,
    });

    this.updateForearmOptionForSelectedStockMagazine();
  }

  onSelectForearmOption(newForearm: Option): void {
    const oldId = this.state.selectedForearmOption?.id;
    if (oldId === newForearm.id) {
      return;
    }

    this.configuratorService.resetOptionsAfter("forearmOption", this.optionHierarchy);
    this.configuratorService.updateState({
      selectedForearmOption: newForearm,
    });
  }

  // ==============================
  // Nawigacja
  // ==============================
  onNext(): void {
    // Przejście do kolejnego kroku, np. chamberBolt
    this.router.navigate(["/r8/chamberBolt"]);
  }

  onBack(): void {
    // Powrót do poprzedniego ekranu, np. barrel
    this.router.navigate(["/r8/barrel"]);
  }
}
