import { Component, OnInit } from "@angular/core";
import { Stock } from "./model";
import { StockService } from "./stock.service";
import { Option } from "../../option/model";
import { Rifle } from "../rifle/model";
import { Router } from '@angular/router';
import { ConfiguratorService } from "src/app/core/services/configurator.service";
import { Subscription } from "rxjs";
import { RifleService } from "../rifle/rifle.service";

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: []
})
export class StockComponent implements OnInit {
  features: any;
  rifles: Rifle[] = [];
  state: any; // Przechowuje aktualny stan z serwisu

  private subscription!: Subscription;
  
  // Listy opcji
  allButtstockTypes: Option[] = [];
  buttstockTypes: Option[] = [];
  woodCategories: Option[] = [];
  lengthsOfPull: Option[] = [];
  individualButtstockMeasures: Option[] = [];
  buttstockMeasuresTypes: Option[] = [];
  pistolGripCaps: Option[] = [];
  kickstops: Option[] = [];
  stockMagazines: Option[] = [];
  forearmOptions: Option[] = [];

  // Wybrane opcje
  selectedRifle: Rifle | null = null;

  selectedButtstockType: Option | null = null;
  selectedWoodCategory: Option | null = null;
  selectedLengthOfPull: Option | null = null;
  selectedIndividualButtstockMeasure: Option | null = null;
  selectedButtstockMeasuresType: Option | null = null;
  selectedPistolGripCap: Option | null = null;
  selectedKickstop: Option | null = null;
  selectedStockMagazine: Option | null = null;
  selectedForearmOption: Option | null = null;

  // Flagi do disabled/enabled
  isDisabledWoodCategory: boolean = true;
  isDisabledLengthOfPull: boolean = true;
  isDisabledIndividualButtstockMeasure: boolean = true;
  isDisabledButtstockMeasuresType: boolean = true;
  isDisabledPistolGripCap: boolean = true;
  isDisabledKickstop: boolean = true;
  isDisabledStockMagazine: boolean = true;
  isDisabledForearmOption: boolean = true;

  constructor(
    private stockService: StockService,
    private router: Router,
    private configuratorService: ConfiguratorService,
    private rifleService: RifleService
  ) {}

  ngOnInit() { 
    // Odczytujemy z sessionStorage
    const savedRifle = JSON.parse(sessionStorage.getItem('selectedRifle') || 'null');
    const savedButtstockType = JSON.parse(sessionStorage.getItem("selectedButtstockType") || "null");
    const savedWoodCategory = JSON.parse(sessionStorage.getItem("selectedWoodCategory") || "null");
    const savedLengthOfPull = JSON.parse(sessionStorage.getItem("selectedLengthOfPull") || "null");
    const savedIndividualButtstockMeasure = JSON.parse(sessionStorage.getItem("selectedIndividualButtstockMeasure") || "null");
    const savedButtstockMeasuresType = JSON.parse(sessionStorage.getItem("selectedButtstockMeasuresType") || "null");
    const savedPistolGripCap = JSON.parse(sessionStorage.getItem("selectedPistolGripCap") || "null");
    const savedKickstop = JSON.parse(sessionStorage.getItem("selectedKickstop") || "null");
    const savedStockMagazine = JSON.parse(sessionStorage.getItem("selectedStockMagazine") || "null");
    const savedForearmOption = JSON.parse(sessionStorage.getItem("selectedForearmOption") || "null");

    this.subscription = this.configuratorService.state$.subscribe((state) => {
      this.state = state;
    });

    // Pobieramy dane z serwisu
    this.configuratorService.getData().subscribe(
      (data) => {
        this.features = data.features;
        this.rifles = data.rifles;
        this.allButtstockTypes = this.features.buttstockTypes;

        // Reset stanu przy zmianie modelu w rifleService
        this.rifleService.model$.subscribe(() => {
          this.stockService.resetOptions();     
        });

        // Przywracamy zapisane wartości
        if (savedRifle && this.rifles.length > 0) {
          this.selectedRifle = this.rifles.find(c => c.id === savedRifle.id) || null;
        }

        if(this.selectedRifle){
          this.buttstockTypes = this.allButtstockTypes.filter(buttstockType => 
            this.selectedRifle?.availableButtstockTypes.includes(buttstockType.id)
          );
        } else {
          this.buttstockTypes = [];
        }

        if (savedButtstockType && this.buttstockTypes.length > 0) {
          this.selectedButtstockType = this.buttstockTypes.find(c => c.id === savedButtstockType.id) || null;
          if (this.selectedButtstockType) {
            this.onSelectButtstockType(this.selectedButtstockType);
          }
        }

        if (savedWoodCategory && this.woodCategories.length > 0) {
          this.selectedWoodCategory = this.woodCategories.find(c => c.id === savedWoodCategory.id) || null;
          if (this.selectedWoodCategory) {
            this.onSelectWoodCategory(this.selectedWoodCategory);
          }
        }

        if (savedLengthOfPull && this.lengthsOfPull.length > 0) {
          this.selectedLengthOfPull = this.lengthsOfPull.find(c => c.id === savedLengthOfPull.id) || null;
          if (this.selectedLengthOfPull) {
            this.onSelectLengthOfPull(this.selectedLengthOfPull);
          }
        }

        if (savedIndividualButtstockMeasure && this.individualButtstockMeasures.length > 0) {
          this.selectedIndividualButtstockMeasure = this.individualButtstockMeasures.find(c => c.id === savedIndividualButtstockMeasure.id) || null;
          if (this.selectedIndividualButtstockMeasure) {
            this.onSelectIndividualButtstockMeasure(this.selectedIndividualButtstockMeasure);
          }
        }

        if (savedButtstockMeasuresType && this.buttstockMeasuresTypes.length > 0) {
          this.selectedButtstockMeasuresType = this.buttstockMeasuresTypes.find(c => c.id === savedButtstockMeasuresType.id) || null;
          if (this.selectedButtstockMeasuresType) {
            this.onSelectButtstockMeasuresType(this.selectedButtstockMeasuresType);
          }
        }

        if (savedPistolGripCap && this.pistolGripCaps.length > 0) {
          this.selectedPistolGripCap = this.pistolGripCaps.find(c => c.id === savedPistolGripCap.id) || null;
          if (this.selectedPistolGripCap) {
            this.onSelectPistolGripCap(this.selectedPistolGripCap);
          }
        }

        if (savedKickstop && this.kickstops.length > 0) {
          this.selectedKickstop = this.kickstops.find(c => c.id === savedKickstop.id) || null;
          if (this.selectedKickstop) {
            this.onSelectKickstop(this.selectedKickstop);
          }
        }

        if (savedStockMagazine && this.stockMagazines.length > 0) {
          this.selectedStockMagazine = this.stockMagazines.find(c => c.id === savedStockMagazine.id) || null;
          if (this.selectedStockMagazine) {
            this.onSelectStockMagazine(this.selectedStockMagazine);
          }
        }

        if (savedForearmOption && this.forearmOptions.length > 0) {
          this.selectedForearmOption = this.forearmOptions.find(c => c.id === savedForearmOption.id) || null;
          if (this.selectedForearmOption) {
            this.onSelectForearmOption(this.selectedForearmOption);
          }
        }
      },
      (error) => {
        console.error('Błąd przy ładowaniu danych:', error);
      }
    );
  }

  // ==============================
  // Metody onSelect
  // ==============================

  onSelectButtstockType(buttstockType: Option): void {
    this.selectedButtstockType = buttstockType;
    sessionStorage.setItem("selectedButtstockType", JSON.stringify(buttstockType));
    this.updateOptionsBasedOnRifle("buttstockType");

    this.configuratorService.updateState({
      selectedButtstockType: buttstockType,
      isDisabledWoodCategory: false
    });
  }

  onSelectWoodCategory(woodCategory: Option): void {
    this.selectedWoodCategory = woodCategory;
    sessionStorage.setItem("selectedWoodCategory", JSON.stringify(woodCategory));
    this.updateOptionsBasedOnRifle("woodCategory");

    this.configuratorService.updateState({
      selectedWoodCategory: woodCategory,
      isDisabledLengthOfPull: false
    });
  }

  onSelectLengthOfPull(lengthOfPull: Option): void {
    this.selectedLengthOfPull = lengthOfPull;
    sessionStorage.setItem("selectedLengthOfPull", JSON.stringify(lengthOfPull));
    this.updateOptionsBasedOnRifle("lengthOfPull");

    this.configuratorService.updateState({
      selectedLengthOfPull: lengthOfPull,
      isDisabledIndividualButtstockMeasure: false
    });
  }

  onSelectIndividualButtstockMeasure(measure: Option): void {
    this.selectedIndividualButtstockMeasure = measure;
    sessionStorage.setItem("selectedIndividualButtstockMeasure", JSON.stringify(measure));
    this.updateOptionsBasedOnRifle("individualButtstockMeasure");

    this.configuratorService.updateState({
      selectedIndividualButtstockMeasure: measure,
      isDisabledButtstockMeasuresType: false
    });
  }

  onSelectButtstockMeasuresType(measureType: Option): void {
    this.selectedButtstockMeasuresType = measureType;
    sessionStorage.setItem("selectedButtstockMeasuresType", JSON.stringify(measureType));
    this.updateOptionsBasedOnRifle("buttstockMeasuresType");

    this.configuratorService.updateState({
      selectedButtstockMeasuresType: measureType,
      isDisabledPistolGripCap: false
    });
  }

  onSelectPistolGripCap(cap: Option): void {
    this.selectedPistolGripCap = cap;
    sessionStorage.setItem("selectedPistolGripCap", JSON.stringify(cap));
    this.updateOptionsBasedOnRifle("pistolGripCap");

    this.configuratorService.updateState({
      selectedPistolGripCap: cap,
      isDisabledKickstop: false
    });
  }

  onSelectKickstop(kickstop: Option): void {
    this.selectedKickstop = kickstop;
    sessionStorage.setItem("selectedKickstop", JSON.stringify(kickstop));
    this.updateOptionsBasedOnRifle("kickstop");

    this.configuratorService.updateState({
      selectedKickstop: kickstop,
      isDisabledStockMagazine: false
    });
  }

  onSelectStockMagazine(magazine: Option): void {
    this.selectedStockMagazine = magazine;
    sessionStorage.setItem("selectedStockMagazine", JSON.stringify(magazine));
    this.updateOptionsBasedOnRifle("stockMagazine");

    this.configuratorService.updateState({
      selectedStockMagazine: magazine,
      isDisabledForearmOption: false
    });
  }

  onSelectForearmOption(forearm: Option): void {
    this.selectedForearmOption = forearm;
    sessionStorage.setItem("selectedForearmOption", JSON.stringify(forearm));
    this.updateOptionsBasedOnRifle("forearmOption");

    // w tym miejscu możesz nie mieć kolejnej opcji do „odblokowania”,
    // więc ewentualnie zaktualizuj stan w inny sposób:
    this.configuratorService.updateState({
      selectedForearmOption: forearm
      // tu np. nic nie odblokowujemy dalej...
    });
  }

  // ==============================
  // Metoda główna do aktualizacji
  // ==============================
  public updateOptionsBasedOnRifle(changedOption: string): void {
    if (!this.selectedRifle) {
      this.stockService.resetOptions();
      sessionStorage.clear();
      return;
    }

    // Resetujemy w serwisie wszystkie opcje zależne od changedOption
    this.configuratorService.resetOptionsAfter(changedOption);

    if (changedOption === "buttstockType") {
      this.updateWoodCategoryForSelectedButtstockType();
    }

    if (changedOption === "woodCategory") {
      this.updateLengthOfPullForSelectedWoodCategory();
    }

    if (changedOption === "lengthOfPull") {
      this.updateIndividualButtstockMeasureForSelectedLengthOfPull();
    }

    if (changedOption === "individualButtstockMeasure") {
      this.updateButtstockMeasuresTypeForSelectedIndividualButtstockMeasure();
    }

    if (changedOption === "buttstockMeasuresType") {
      this.updatePistolGripCapForSelectedButtstockMeasuresType();
    }

    if (changedOption === "pistolGripCap") {
      this.updateKickstopForSelectedPistolGripCap();
    }

    if (changedOption === "kickstop") {
      this.updateStockMagazineForSelectedKickstop();
    }

    if (changedOption === "stockMagazine") {
      this.updateForearmOptionForSelectedStockMagazine();
    }

    // "forearmOption" może już niczego nie aktualizować,
    // ale można dodać analogiczną metodę, jeśli to potrzebne.
  }

  // ==============================
  // Metody prywatne do filtrowania
  // ==============================

  private updateWoodCategoryForSelectedButtstockType(): void {
    if (this.selectedButtstockType) {
      const woodCategoryIds = this.selectedButtstockType.availableWoodCategories;
      this.woodCategories = this.configuratorService.filterOptions(
        this.features,
        "woodCategories",
        woodCategoryIds
      );
    } else {
      this.woodCategories = [];
    }
    this.selectedWoodCategory = null;
  }

  private updateLengthOfPullForSelectedWoodCategory(): void {
    if (this.selectedWoodCategory) {
      const lengthOfPullIds = this.selectedWoodCategory.availableLengthsOfPull;
      this.lengthsOfPull = this.configuratorService.filterOptions(
        this.features,
        "lengthsOfPull",
        lengthOfPullIds
      );
    } else {
      this.lengthsOfPull = [];
    }
    this.selectedLengthOfPull = null;
  }

  private updateIndividualButtstockMeasureForSelectedLengthOfPull(): void {
    if (this.selectedLengthOfPull) {
      const measureIds = this.selectedLengthOfPull.availableIndividualButtstockMeasures;
      this.individualButtstockMeasures = this.configuratorService.filterOptions(
        this.features,
        "individualButtstockMeasures",
        measureIds
      );
    } else {
      this.individualButtstockMeasures = [];
    }
    this.selectedIndividualButtstockMeasure = null;
  }

  private updateButtstockMeasuresTypeForSelectedIndividualButtstockMeasure(): void {
    if (this.selectedIndividualButtstockMeasure) {
      const measuresTypeIds = this.selectedIndividualButtstockMeasure.availableButtstockMeasuresTypes;
      this.buttstockMeasuresTypes = this.configuratorService.filterOptions(
        this.features,
        "buttstockMeasuresTypes",
        measuresTypeIds
      );
    } else {
      this.buttstockMeasuresTypes = [];
    }
    this.selectedButtstockMeasuresType = null;
  }

  private updatePistolGripCapForSelectedButtstockMeasuresType(): void {
    if (this.selectedButtstockMeasuresType) {
      const capIds = this.selectedButtstockMeasuresType.availablePistolGripCaps;
      this.pistolGripCaps = this.configuratorService.filterOptions(
        this.features,
        "pistolGripCaps",
        capIds
      );
    } else {
      this.pistolGripCaps = [];
    }
    this.selectedPistolGripCap = null;
  }

  private updateKickstopForSelectedPistolGripCap(): void {
    if (this.selectedPistolGripCap) {
      const kickstopIds = this.selectedPistolGripCap.availableKickstops;
      this.kickstops = this.configuratorService.filterOptions(
        this.features,
        "kickstops",
        kickstopIds
      );
    } else {
      this.kickstops = [];
    }
    this.selectedKickstop = null;
  }

  private updateStockMagazineForSelectedKickstop(): void {
    if (this.selectedKickstop) {
      const magazineIds = this.selectedKickstop.availableStockMagazines;
      this.stockMagazines = this.configuratorService.filterOptions(
        this.features,
        "stockMagazines",
        magazineIds
      );
    } else {
      this.stockMagazines = [];
    }
    this.selectedStockMagazine = null;
  }

  private updateForearmOptionForSelectedStockMagazine(): void {
    if (this.selectedStockMagazine) {
      const forearmIds = this.selectedStockMagazine.availableForearmOptions;
      this.forearmOptions = this.configuratorService.filterOptions(
        this.features,
        "forearmOptions",
        forearmIds
      );
    } else {
      this.forearmOptions = [];
    }
    this.selectedForearmOption = null;
  }

  // ==============================
  // Nawigacja Dalej / Wstecz
  // ==============================
  onNext(): void {
    // Zapamiętujemy wybrane opcje
    sessionStorage.setItem('selectedRifle', JSON.stringify(this.selectedRifle));
    // ... analogicznie dla innych, jeśli chcesz:
    // sessionStorage.setItem('selectedButtstockType', JSON.stringify(this.selectedButtstockType));
    // ...

    this.router.navigate(['/r8/chamberBolt']);
  }

  onBack(): void {
    this.router.navigate(['/r8/barrel']);
  }
}
