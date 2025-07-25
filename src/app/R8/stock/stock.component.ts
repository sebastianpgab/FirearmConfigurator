import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { Router } from "@angular/router";

import { Rifle } from "../rifle/model";
import { Option } from "../option/model";
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
    "stockInlay",        // ← nowy
    "stockInlaySeam",    // ← nowy, niżej w hierarchii
    "recoilPad",
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
  recoilPads: Option[] = [];
  stockInlays: Option[] = [];
  stockInlaySeams: Option[] = [];
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

  shouldShowSyntheticStock(): boolean {
    const rifleName = this.state?.selectedRifle?.name || '';
    return rifleName.startsWith('Blaser R8 Professional') || rifleName.startsWith('Blaser R8 Ultimate') || rifleName.startsWith('Blaser R8 Safari Professional Hunter');
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

  // 3) Po wyborze woodCategory – opcjonalnie stockInlay (tylko przy "leather")
  if (this.state.selectedWoodCategory) {
    // jeśli to kolba "leather", ładujemy inlaye
    if (this.state.selectedButtstockType?.name.includes('leather')) {
      this.updateStockInlayForSelectedWoodCategory();
    } else {
      this.stockInlays = [];
    }
  }

  // 4) Po wyborze stockInlay – opcjonalnie stockInlaySeam
  if (this.state.selectedStockInlay) {
    this.updateStockInlaySeamForSelectedInlay();
  }

  // 5) Teraz, gdy mamy już woodCategory (i ewentualnie inlay), wypełniamy recoilPads
  if (this.state.selectedWoodCategory) {
    this.updateRecoilPadForSelectedWoodCategory();
  }

  // 6) Jeśli selectedRecoilPad, wypełniamy pistolGripCap
  if (this.state.selectedRecoilPad) {
    this.updatePistolGripCapForSelectedRecoilPad();
  }

  // 7) Jeśli selectedPistolGripCap, wypełniamy kickstops
  if (this.state.selectedPistolGripCap) {
    this.updateKickstopForSelectedPistolGripCap();
  }

  // 8) Jeśli selectedKickstop, wypełniamy stockMagazines
  if (this.state.selectedKickstop) {
    this.updateStockMagazineForSelectedKickstop();
  }

  // 9) Na końcu – forearmOptions
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
      
      if (Array.isArray(availableButtstockTypeIds)) {
        this.buttstockTypes = this.allButtstockTypes.filter((option) =>
          availableButtstockTypeIds.includes(option.id)
        );
      } else {
        this.buttstockTypes = []; // lub log błędu
      }
    } else {
      this.buttstockTypes = [];
    }
  }


  private updateWoodCategoryForSelectedButtstockType(): void {
    if (this.state.selectedButtstockType.availableWoodCategories) {
      let woodCategoryIds = this.state.selectedRifle.availableWoodCategories ?? this.state.selectedButtstockType.availableWoodCategories;

      if (this.state.selectedRifle.name === 'Blaser R8 Silence') {
        const idsToRemove = [1, 9];
        woodCategoryIds = woodCategoryIds.filter((id: number) => !idsToRemove.includes(id));
      }
      
      this.woodCategories = this.configuratorService.filterOptions(
        this.features,
        "woodCategories",
        woodCategoryIds      
      );
    } else {
      this.woodCategories = [];
    }
  }

  private updateStockInlayForSelectedWoodCategory(): void {
  if (this.state.selectedRifle?.name.includes('Leather')) {
    const inlayIds = this.state.selectedRifle.availableStockInlays;
    this.stockInlays = this.configuratorService.filterOptions(
      this.features,
      'stockInlays',
      inlayIds
    );
  } else {
    this.stockInlays = [];
  }
}

  private updateStockInlaySeamForSelectedInlay(): void {
    if (this.state.selectedStockInlay) {
      const stockInlaySeamIds = this.state.selectedStockInlay.availableStockInlaySeams;
      this.stockInlaySeams = this.configuratorService.filterOptions(
        this.features,
        'stockInlaySeams',
        stockInlaySeamIds
      );
    } else {
      this.stockInlaySeams = [];
    }
  }

  private updateRecoilPadForSelectedWoodCategory(): void {
    let recoilPadIds: number[] = [];

    if (this.state.selectedRifle.name.startsWith("Blaser R8 Safari")) {
      recoilPadIds = [12];
    } else if (this.state.selectedWoodCategory) {
      recoilPadIds = this.state.selectedWoodCategory.availableRecoilPads;
    }

    if (recoilPadIds.length > 0) {
      this.recoilPads = this.configuratorService.filterOptions(
        this.features,
        "recoilPads",
        recoilPadIds
      );
    } else {
      this.recoilPads = [];
    }
  }


  private updatePistolGripCapForSelectedRecoilPad(): void {
    if (this.state.selectedRecoilPad) {
      const pistolGripCapIds = this.state.selectedRifle.availablePistolGripCaps;
      this.pistolGripCaps = this.configuratorService.filterOptions(
        this.features,
        "pistolGripCaps",
        pistolGripCapIds
      );
    } else {
      this.pistolGripCaps = [];
    }
  }

  private updateKickstopForSelectedPistolGripCap(): void {
    if (this.state.selectedPistolGripCap) {
      const kickstopIds = this.state.selectedRifle.availableKickstops;
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
      const magazineIds = this.state.selectedRifle.availableStockMagazines;
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
      const forearmIds = this.state.selectedRifle.availableForearmOptions;
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

    let isDisabledRecoilPad = false;
    if(this.state.selectedRifle?.name.includes('Leather')) {
      isDisabledRecoilPad = true;
    }

    this.configuratorService.resetOptionsAfter("woodCategory", this.optionHierarchy);
    this.configuratorService.updateState({
      selectedWoodCategory: newWoodCategory,
      isDisabledRecoilPad: isDisabledRecoilPad,
    });

    this.updateRecoilPadForSelectedWoodCategory();
    this.updateStockInlayForSelectedWoodCategory();
  }

  onSelectStockInlay(newInlay: Option): void {
    const oldId = this.state.selectedStockInlay?.id;
    if (oldId === newInlay.id) {
      return;
    }

    this.configuratorService.resetOptionsAfter('stockInlay', this.optionHierarchy);

    const listOfIds = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
    const isRecoilPadDisabled = listOfIds.includes(newInlay.id);

    this.configuratorService.updateState({
      selectedStockInlay: newInlay,
      isDisabledStockInlaySeam: false,
      isDisabledRecoilPad: isRecoilPadDisabled
    });

    this.updateStockInlaySeamForSelectedInlay();
  }

// tu jest bład bo jak wybiore ta opcje to mi automatycznie znika z wiodku
  onSelectStockInlaySeam(newSeam: Option): void {
    if (this.state.selectedStockInlaySeam?.id === newSeam.id) return;

    this.configuratorService.resetOptionsAfter('stockInlaySeam', this.optionHierarchy);
    this.configuratorService.updateState({
      selectedStockInlaySeam: newSeam
    });
    this.state.isDisabledRecoilPad = false
  }

  onSelectRecoilPad(newRecoilPad: Option): void {
    const oldId = this.state.selectedRecoilPad?.id;
    if (oldId === newRecoilPad.id) {
      return;
    }

    this.configuratorService.resetOptionsAfter("recoilPad", this.optionHierarchy);
    this.configuratorService.updateState({
      selectedRecoilPad: newRecoilPad,
      isDisabledPistolGripCap: false,
    });

    this.updatePistolGripCapForSelectedRecoilPad();
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

    if (newForearm.id === 1) {  
      const availableIds = this.state.selectedStockMagazine?.availableForearmOptions ?? [];
    
      this.configuratorService.updateDependentFeature(
        this.features,            // Obiekt z dostępnymi opcjami
        "forearmOptions",  // Klucz zmienianej opcji (na podstawie czego zmieniamy)
        availableIds,             // Lista dostępnych opcji
        "kickstops",       // Klucz opcji, którą zmieniamy
        1, // Nowe ID do ustawienia
        "selectedKickstop"    //Wybra opcja                   
      );
    }
    
    this.configuratorService.resetOptionsAfter("forearmOption", this.optionHierarchy);
    this.configuratorService.updateState({
      selectedForearmOption: newForearm,
    });
  }

  isLeatherRifleSelected(): boolean {
    // najpierw zabezpiecz się przed undefined
    const name = this.state.selectedRifle?.name ?? '';
    // returns true jeśli nazwa zawiera "Leather", false w przeciwnym razie
    return name.includes('Leather') && !! this.state.selectedWoodCategory;
  }

  isStockInlaySelected(): boolean {
    const listOfIds = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
    const selectedId = this.state.selectedStockInlay?.id;

    // zabezpieczenie przed undefined
    if (selectedId == null)  return false;
    return listOfIds.includes(selectedId);
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
