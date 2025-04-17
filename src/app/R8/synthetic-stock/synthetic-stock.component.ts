import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { Rifle } from '../rifle/model';
import { Option } from "../option/model";
import { Router } from '@angular/router';
import { ConfiguratorService } from 'src/app/core/services/configurator.service';


@Component({
  selector: 'app-synthetic-stock',
  templateUrl: './synthetic-stock.component.html',
  styles: [
  ]
})
export class SyntheticStockComponent {

  private subscription!: Subscription;

  private optionHierarchy = [
    "stockInlay",
    "modularStockOption",
    "recoilPad",
    "kickstop"
  ];

  features: any;
  rifles: Rifle[] = [];
  allStockColors: Option[] = [];

  stockColor: Option[] = [];
  stockInlays: Option[] = [];
  modularStockOptions: Option[] = [];
  recoilPads: Option[] = [];
  kickstops: Option[] = [];

  state: any;

  constructor(
    private router: Router,
    private configuratorService: ConfiguratorService
  ) {}

  ngOnInit(): void {
    this.subscription = this.configuratorService.state$.subscribe((state) => {
      this.state = state;
    });

    this.configuratorService.getData().subscribe(
      (data) => {
        this.features = data.features;
        this.rifles = data.rifles;
        this.allStockColors = this.features.allStockColors;

        this.restoreSelections();
      },
      (error) => {
        console.error("Błąd przy ładowaniu danych:", error);
      }
    );
  }

  restoreSelections() {
    this.updateStockColorBasedOnRifle();
    this.loadNextAvailableOption();
  }

  onStockColorChange(color: Option) {
    this.state.selectedStockColor = color;
    this.loadNextAvailableOption();
  }

  private loadNextAvailableOption(): void {
    for (const optionName of this.optionHierarchy) {
      const methodName = `update${this.capitalizeFirstLetter(optionName)}`;
      if (typeof (this as any)[methodName] === 'function') {
        const updated = (this as any)[methodName]();
        if (updated) break;
      }
    }
  }

  private capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  private updateStockColorBasedOnRifle(): void {
    if (this.state.selectedRifle) {
      const availableStockColorIds = this.state.selectedRifle.availableButtstockTypes;
      this.stockColor = this.allStockColors.filter((option) =>
        availableStockColorIds.includes(option.id)
      );
    } else {
      this.stockColor = [];
    }
  }

  private updateStockInlay(): boolean {
    if (this.state.selectedStockColor) {
      const stockInlayIds = this.state.selectedRifle.availableStockInlays
        ?? this.state.selectedStockColor.availableStockInlays;

      if (stockInlayIds && stockInlayIds.length > 0) {
        this.stockInlays = this.configuratorService.filterOptions(
          this.features,
          "stockInlays",
          stockInlayIds
        );
        return true;
      }
    }
    this.stockInlays = [];
    return false;
  }

  private updateModularStockOption(): boolean {
    if (this.state.selectedStockColor) {
      const modularOptionIds = this.state.selectedRifle.availableModularStockOptions
        ?? this.state.selectedStockColor.availableModularStockOptions;

      if (modularOptionIds && modularOptionIds.length > 0) {
        this.modularStockOptions = this.configuratorService.filterOptions(
          this.features,
          "modularStockOptions",
          modularOptionIds
        );
        return true;
      }
    }
    this.modularStockOptions = [];
    return false;
  }

  private updateRecoilPad(): boolean {
    if (this.state.selectedStockColor) {
      const recoilPadIds = this.state.selectedRifle.availableRecoilPads
        ?? this.state.selectedStockColor.availableRecoilPads;

      if (recoilPadIds && recoilPadIds.length > 0) {
        this.recoilPads = this.configuratorService.filterOptions(
          this.features,
          "recoilPads",
          recoilPadIds
        );
        return true;
      }
    }
    this.recoilPads = [];
    return false;
  }

  private updateKickstop(): boolean {
    if (this.state.selectedStockColor) {
      const kickstopIds = this.state.selectedRifle.availableKickstops
        ?? this.state.selectedStockColor.availableKickstops;

      if (kickstopIds && kickstopIds.length > 0) {
        this.kickstops = this.configuratorService.filterOptions(
          this.features,
          "kickstops",
          kickstopIds
        );
        return true;
      }
    }
    this.kickstops = [];
    return false;
  }

  onNext(): void {
    // Przejście do kolejnego kroku, np. chamberBolt
    this.router.navigate(["/r8/chamberBolt"]);
  }

  onBack(): void {
    // Powrót do poprzedniego ekranu, np. barrel
    this.router.navigate(["/r8/barrel"]);
  }
}

