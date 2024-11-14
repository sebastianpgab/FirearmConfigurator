import { Component, OnInit } from "@angular/core";
import { Stock } from "./model";
import { StockService } from "./stock.service";
import { Option } from "../../option/model";
import { Rifle } from "../rifle/model"; // Importujemy model Rifle

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: [] 
})
export class StockComponent implements OnInit {
  
  features: any;
  rifles: Rifle[] = []; // Lista karabinów
  
  
  buttstockTypes: Option[] = [];
  woodCategories: Option[] = [];
  lengthsOfPull: Option[] = [];
  individualButtstockMeasures: Option[] = [];
  buttstockMeasuresTypes: Option[] = [];
  pistolGripCaps: Option[] = [];
  kickstops: Option[] = [];
  stockMagazines: Option[] = [];
  forearmOptions: Option[] = [];

  selectedRifle: Rifle | null = null; // Wybrany karabin
  selectedStock: Stock | null = null; // Wybrana kolba

  selectedButtstockType: Option = { id: 0, name: '', price: 0, imageUrl: '' }; 
  selectedWoodCategory: Option = { id: 0, name: '', price: 0, imageUrl: '' };
  selectedLengthOfPull: Option = { id: 0, name: '', price: 0, imageUrl: '' };
  selectedIndividualButtstockMeasure: Option = { id: 0, name: '', price: 0, imageUrl: '' };
  selectedButtstockMeasuresType: Option = { id: 0, name: '', price: 0, imageUrl: '' };
  selectedPistolGripCap: Option = { id: 0, name: '', price: 0, imageUrl: '' };
  selectedKickstop: Option = { id: 0, name: '', price: 0, imageUrl: '' };
  selectedStockMagazine: Option = { id: 0, name: '', price: 0, imageUrl: '' };
  selectedForearmOption: Option = { id: 0, name: '', price: 0, imageUrl: '' };

  // Zmienne kontrolujące dostępność pól
  isDisabledButtstockType: boolean = false;
  isDisabledWoodCategory: boolean = true;
  isDisabledLengthOfPull: boolean = true;
  isDisabledIndividualButtstockMeasure: boolean = true;
  isDisabledButtstockMeasuresType: boolean = true;
  isDisabledPistolGripCap: boolean = true;
  isDisabledKickstop: boolean = true;
  isDisabledStockMagazine: boolean = true;
  isDisabledForearmOption: boolean = true;

  constructor(private stockService: StockService) {}

  ngOnInit() {
    this.stockService.getData().subscribe(data => {
      this.features = data.features;
      this.rifles = data.rifles;
      this.selectedRifle = this.rifles[0];
      
      // Inicjalizacja opcji
      this.buttstockTypes = this.features.buttstockTypes;
      this.woodCategories = this.features.woodCategories;
      this.lengthsOfPull = this.features.lengthsOfPull;
      this.individualButtstockMeasures = this.features.individualButtstockMeasures;
      this.buttstockMeasuresTypes = this.features.buttstockMeasuresTypes;
      this.pistolGripCaps = this.features.pistolGripCaps;
      this.kickstops = this.features.kickstops;
      this.stockMagazines = this.features.stockMagazines;
      this.forearmOptions = this.features.forearmOptions;

      // Inicjalizacja wybranej kolby

    }, error => {
      console.error('Błąd przy ładowaniu danych:', error);
    });
  }

  onSelectRifle(rifle: Rifle) {
    this.selectedRifle = rifle;
    
    // Filtrowanie opcji na podstawie wybranego karabinu
    this.buttstockTypes = rifle.availableButtstockTypes
      ? this.features.buttstockTypes.filter((option: Option) =>
          rifle.availableButtstockTypes.includes(option.id)
        )
      : [];
    
    this.woodCategories = rifle.availableWoodCategories
      ? this.features.woodCategories.filter((option: Option) =>
          rifle.availableWoodCategories.includes(option.id)
        )
      : [];

    this.lengthsOfPull = rifle.availableLengthsOfPull
      ? this.features.lengthsOfPull.filter((option: Option) =>
          rifle.availableLengthsOfPull.includes(option.id)
        )
      : [];

    this.individualButtstockMeasures = rifle.availableIndividualButtstockMeasures
      ? this.features.individualButtstockMeasures.filter((option: Option) =>
          rifle.availableIndividualButtstockMeasures.includes(option.id)
        )
      : [];

    this.buttstockMeasuresTypes = rifle.availableButtstockMeasuresTypes
      ? this.features.buttstockMeasuresTypes.filter((option: Option) =>
          rifle.availableButtstockMeasuresTypes.includes(option.id)
        )
      : [];

    this.pistolGripCaps = rifle.availablePistolGripCaps
      ? this.features.pistolGripCaps.filter((option: Option) =>
          rifle.availablePistolGripCaps.includes(option.id)
        )
      : [];

    this.kickstops = rifle.availableKickstops
      ? this.features.kickstops.filter((option: Option) =>
          rifle.availableKickstops.includes(option.id)
        )
      : [];

    this.stockMagazines = rifle.availableStockMagazines
      ? this.features.stockMagazines.filter((option: Option) =>
          rifle.availableStockMagazines.includes(option.id)
        )
      : [];

    this.forearmOptions = rifle.availableForearmOptions
      ? this.features.forearmOptions.filter((option: Option) =>
          rifle.availableForearmOptions.includes(option.id)
        )
      : [];

    // Aktualizacja dostępności pól
    this.updateOptions();
  }

  updateOptions(): void {
    this.isDisabledWoodCategory = !this.selectedButtstockType.name;
    this.isDisabledLengthOfPull = !this.selectedWoodCategory.name;
    this.isDisabledIndividualButtstockMeasure = !this.selectedLengthOfPull.name;
    this.isDisabledButtstockMeasuresType = !this.selectedIndividualButtstockMeasure.name;
    this.isDisabledPistolGripCap = !this.selectedButtstockMeasuresType.name;
    this.isDisabledKickstop = !this.selectedPistolGripCap.name;
    this.isDisabledStockMagazine = !this.selectedKickstop.name;
    this.isDisabledForearmOption = !this.selectedStockMagazine.name;
  }
}
