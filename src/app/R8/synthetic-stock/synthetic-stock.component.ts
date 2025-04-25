import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { Rifle } from '../rifle/model';
import { Option } from "../option/model";
import { ConfiguratorService } from 'src/app/core/services/configurator.service';

@Component({
  selector: 'app-synthetic-stock',
  templateUrl: './synthetic-stock.component.html',
  styleUrls: []
})
export class SyntheticStockComponent implements OnInit, OnDestroy {
  private subscription!: Subscription;
  private optionHierarchy = [
    "stockColor",
    "stockInlay",
    "modularStockOption",
    "recoilPad",
    "kickstop"
  ];

  features: any;
  rifles: Rifle[] = [];
  allStockColors: Option[] = [];
  allInlays: Option[] = [];
  allModularOptions: Option[] = [];
  allRecoilPads: Option[] = [];
  allKickstops: Option[] = [];

  stockColors: Option[] = [];
  stockInlays: Option[] = [];
  modularStockOptions: Option[] = [];
  recoilPads: Option[] = [];
  kickstops: Option[] = [];

  state: any;

  constructor(
    private router: Router,
    private configuratorService: ConfiguratorService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.subscription = this.configuratorService.state$.subscribe((state) => {
      this.state = state;
    });

    this.configuratorService.getData().subscribe(
      (data) => {
        this.features = data.features;
        this.rifles = data.rifles;

        this.allStockColors = this.features.stockColorsSynthetic;
        this.allInlays = this.features.stockInlaysSynthetic;
        this.allModularOptions = this.features.modularStockOptionsSynthetic;
        this.allRecoilPads = this.features.recoilPadsSynthetic;
        this.allKickstops = this.features.kickstopsSynthetic;

        this.restoreSelections();
      },
      (error) => console.error("Błąd przy ładowaniu danych:", error)
    );
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

  compareOptionsById = (o1: Option, o2: Option): boolean => {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  };

  shouldShowOption(key: string): boolean {
    const rifle = this.state.selectedRifle;
    return rifle && Array.isArray(rifle[`available${key}`]) && rifle[`available${key}`].length > 0;
  }

  private restoreSelections(): void {
    this.updateStockColorsBasedOnRifle();

    if (this.state.selectedStockColorSynthetic) this.updateStockInlay();
    if (this.state.selectedStockInlaySynthetic) this.updateModularStockOption();
    if (this.state.selectedModularStockOptionSynthetic) this.updateRecoilPad();
    if (this.state.selectedRecoilPadSynthetic) this.updateKickstop();
  }

  private updateStockColorsBasedOnRifle(): void {
    const ids = this.state.selectedRifle?.availableStockColorsSynthetic || [];
    this.stockColors = this.allStockColors.filter(opt => ids.includes(opt.id));
  }

  private updateStockInlay(): void {
    const ids = this.state.selectedRifle?.availableStockInlaysSynthetic || [];
    this.stockInlays = this.allInlays.filter(opt => ids.includes(opt.id));
  }

  private updateModularStockOption(): void {
    const ids = this.state.selectedRifle?.availableModularStockOptionsSynthetic || [];
    this.modularStockOptions = this.allModularOptions.filter(opt => ids.includes(opt.id));
  }

  private updateRecoilPad(): void {
    const ids = this.state.selectedRifle?.availableRecoilPadsSynthetic || [];
    this.recoilPads = this.allRecoilPads.filter(opt => ids.includes(opt.id));
  }

  private updateKickstop(): void {
    const ids = this.state.selectedRifle?.availableKickstopsSynthetic || [];
    this.kickstops = this.allKickstops.filter(opt => ids.includes(opt.id));
  }

  onSelectStockColorSynthetic(option: Option): void {
    this.configuratorService.resetOptionsAfter("stockColor", this.optionHierarchy);
    this.configuratorService.updateState({
      selectedStockColorSynthetic: option
    });

    this.updateStockInlay();
    this.updateModularStockOption();
    this.updateRecoilPad();
    this.updateKickstop();
    this.cdr.detectChanges();
  }

  onSelectStockInlaySynthetic(option: Option): void {
    this.configuratorService.resetOptionsAfter("stockInlay", this.optionHierarchy);
    this.configuratorService.updateState({ selectedStockInlaySynthetic: option });
  }

  onSelectModularStockOptionSynthetic(option: Option): void {
    this.configuratorService.resetOptionsAfter("modularStockOption", this.optionHierarchy);
    this.configuratorService.updateState({ selectedModularStockOptionSynthetic: option });
  }

  onSelectRecoilPadSynthetic(option: Option): void {
    this.configuratorService.resetOptionsAfter("recoilPad", this.optionHierarchy);
    this.configuratorService.updateState({ selectedRecoilPadSynthetic: option });
  }

  onSelectKickstopSynthetic(option: Option): void {
    this.configuratorService.updateState({ selectedKickstopSynthetic: option });
  }

  onNext(): void {
    this.router.navigate(["/r8/chamberBolt"]);
  }

  onBack(): void {
    this.router.navigate(["/r8/barrel"]);
  }
}