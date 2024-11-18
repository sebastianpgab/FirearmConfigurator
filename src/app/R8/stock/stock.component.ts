import { Component, OnInit } from "@angular/core";
import { Stock } from "./model";
import { StockService } from "./stock.service";
import { Option } from "../../option/model";
import { Rifle } from "../rifle/model";
import { Router } from '@angular/router';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: []
})
export class StockComponent implements OnInit {

  features: any;
  rifles: Rifle[] = [];

  buttstockTypes: Option[] = [];
  woodCategories: Option[] = [];
  lengthsOfPull: Option[] = [];
  individualButtstockMeasures: Option[] = [];
  buttstockMeasuresTypes: Option[] = [];
  pistolGripCaps: Option[] = [];
  kickstops: Option[] = [];
  stockMagazines: Option[] = [];
  forearmOptions: Option[] = [];

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
    private router: Router
  ) {}

  ngOnInit() {
    const savedRifle = JSON.parse(sessionStorage.getItem('selectedRifle') || 'null');
    this.selectedRifle = savedRifle;

    this.stockService.getData().subscribe(
      (data) => {
        this.features = data.features;
        this.rifles = data.rifles;

        if (!this.selectedRifle && this.rifles.length > 0) {
          this.selectedRifle = this.rifles[0];
        }

        // Aktualizacja opcji na podstawie wybranego karabinu
        this.updateOptionsBasedOnRifle();

        // Aktualizacja stanów opcji
        this.updateOptionStates();
      },
      (error) => {
        console.error('Błąd przy ładowaniu danych:', error);
      }
    );
  }

  onNext(): void {
    // Zapisanie wybranej strzelby do sessionStorage
    sessionStorage.setItem('selectedRifle', JSON.stringify(this.selectedRifle));

    // Nawigacja do kolejnego kroku
    this.router.navigate(['/next-step']);
  }

  onSelectRifle(rifle: Rifle) {
    this.selectedRifle = rifle;

    // Zapisanie wybranej strzelby do sessionStorage
    sessionStorage.setItem('selectedRifle', JSON.stringify(rifle));

    // Aktualizacja opcji na podstawie nowo wybranego karabinu
    this.updateOptionsBasedOnRifle();

    // Aktualizacja stanów opcji
    this.updateOptionStates();
  }

  private updateOptionsBasedOnRifle(): void {
    if (!this.selectedRifle) {
      this.buttstockTypes = [];
      this.woodCategories = [];
      this.lengthsOfPull = [];
      this.individualButtstockMeasures = [];
      this.buttstockMeasuresTypes = [];
      this.pistolGripCaps = [];
      this.kickstops = [];
      this.stockMagazines = [];
      this.forearmOptions = [];
      return;
    }

    this.buttstockTypes = this.filterOptions('buttstockTypes', this.selectedRifle.availableButtstockTypes);
    this.woodCategories = this.filterOptions('woodCategories', this.selectedRifle.availableWoodCategories);
    this.lengthsOfPull = this.filterOptions('lengthsOfPull', this.selectedRifle.availableLengthsOfPull);
    this.individualButtstockMeasures = this.filterOptions('individualButtstockMeasures', this.selectedRifle.availableIndividualButtstockMeasures);
    this.buttstockMeasuresTypes = this.filterOptions('buttstockMeasuresTypes', this.selectedRifle.availableButtstockMeasuresTypes);
    this.pistolGripCaps = this.filterOptions('pistolGripCaps', this.selectedRifle.availablePistolGripCaps);
    this.kickstops = this.filterOptions('kickstops', this.selectedRifle.availableKickstops);
    this.stockMagazines = this.filterOptions('stockMagazines', this.selectedRifle.availableStockMagazines);
    this.forearmOptions = this.filterOptions('forearmOptions', this.selectedRifle.availableForearmOptions);
  }

  private filterOptions(featureKey: string, availableIds: number[] | undefined): Option[] {
    return availableIds
      ? this.features[featureKey].filter((option: Option) =>
          availableIds.includes(option.id)
        )
      : [];
  }

  updateOptionStates(): void {
    this.isDisabledWoodCategory = !this.selectedButtstockType;
    this.isDisabledLengthOfPull = !this.selectedWoodCategory;
    this.isDisabledIndividualButtstockMeasure = !this.selectedLengthOfPull;
    this.isDisabledButtstockMeasuresType = !this.selectedIndividualButtstockMeasure;
    this.isDisabledPistolGripCap = !this.selectedButtstockMeasuresType;
    this.isDisabledKickstop = !this.selectedPistolGripCap;
    this.isDisabledStockMagazine = !this.selectedKickstop;
    this.isDisabledForearmOption = !this.selectedStockMagazine;
  }
}
