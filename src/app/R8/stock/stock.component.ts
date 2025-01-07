import { Component, OnInit } from "@angular/core";
import { Stock } from "./model";
import { StockService } from "./stock.service";
import { Option } from "../../option/model";
import { Rifle } from "../rifle/model";
import { Router } from '@angular/router';
import { ConfiguratorService } from "src/app/core/services/configurator.service";
import { subscribeOn, Subscription } from "rxjs";
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
    private router: Router,
    private configuratorService: ConfiguratorService,
    private rifleService: RifleService
  ) {}

  ngOnInit() { 
    const savedRifle = JSON.parse(sessionStorage.getItem('selectedRifle') || 'null');
    const savedButtstockType = JSON.parse(sessionStorage.getItem("selectedButtstockType") || "null");
    const savedWoodCategory = JSON.parse(sessionStorage.getItem("selectedWoodCategory") || "null");
    const savedLengthOfPull = JSON.parse(sessionStorage.getItem("selectedLengthOfPull") || "null");
    const savedIndividualButtstockMeasure = JSON.parse(sessionStorage.getItem("selectedIndividualButtstockMeasure") || "null")
    const savedButtstockMeasuresType = JSON.parse(sessionStorage.getItem("selectedButtstockMeasuresType") || "null")
    const savedPistolGripCap = JSON.parse(sessionStorage.getItem("selectedPistolGripCap") || "null")
    const savedKickstop = JSON.parse(sessionStorage.getItem("selectedKickstop") || "null");
    const savedStockMagazine = JSON.parse(sessionStorage.getItem("selectedStockMagazine") || "null")
    const savedForearmOption = JSON.parse(sessionStorage.getItem("selectedForearmOption") || "null")

    this.subscription = this.configuratorService.state$.subscribe((state) => {
      this.state = state;
    })

    this.configuratorService.getData().subscribe(
      (data) => {
        this.features = data.features;
        this.rifles = data.rifles;
        this.buttstockTypes = this.features.buttstockTypes;

        this.rifleService.model$.subscribe(() => {
          this.stockService.resetOptions();     
        })

        if (savedRifle && this.rifles.length > 0) {
          this.selectedRifle = this.rifles.find(c => c.id === savedRifle.id) || null;
        }

     
      },
      (error) => {
        console.error('Błąd przy ładowaniu danych:', error);
      }
    );
  }

  onSelectButtstockType(buttstockType: Option): void {
    this.selectedButtstockType = buttstockType;
    sessionStorage.setItem("selectedButtstockType", JSON.stringify(buttstockType));
    this.updateOptionsBasedOnRifle("buttstockType");

    this.configuratorService.updateState({
      selectedButtstockType: buttstockType,
      isDisabledWoodCategory: false;
    })
  }

  public updateOptionsBasedOnRifle(changedOption: string): void {
    if (!this.selectedRifle) {
      this.stockService.resetOptions();
      sessionStorage.clear();
      return;
    }

    this.configuratorService.resetOptionsAfter(changedOption);

    if(changedOption === "buttstockType") {
      this.updateWoodCategoryForSelectedButtstockType();
    }

  }

  private updateWoodCategoryForSelectedButtstockType(): void {
    if (this.selectedButtstockType) {
      const woodCategoryIds = this.selectedButtstockType.
    }
  }

  onNext(): void {
    sessionStorage.setItem('selectedRifle', JSON.stringify(this.selectedRifle));
    this.router.navigate(['/r8/chamberBolt']);
  }

  onBack(): void {
    this.router.navigate(['/r8/barrel']);
  }
}
