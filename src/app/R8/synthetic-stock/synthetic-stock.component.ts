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
    "stockColorSynthetic",
    "stockInlaySynthetic",
    "recoilPadSynthetic",
    "modularStockOptionSynthetic",
    "kickstopSynthetic"
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

    /*this.updateStockInlay();*/
    if(this.state.selectedRecoilPadSynthetic){
      this.updateRecoilPad();
    }
    if(this.state.selectedRecoilPadSynthetic){
     this.updateModularStockOption();
    }
    if(this.state.selectedKickstop){
     this.updateKickstop();
    }
  }

  private updateStockColorsBasedOnRifle(): void {
    const ids = this.state.selectedRifle?.availableStockColorsSynthetic || [];
    this.stockColors = this.allStockColors.filter(opt => ids.includes(opt.id));
  }

  /*private updateStockInlay(): void {
    const ids = this.state.selectedRifle?.availableStockInlaysSynthetic || [];
    this.stockInlays = this.allInlays.filter(opt => ids.includes(opt.id));
  }*/

  private updateModularStockOption(): void {
    var ids = this.state.selectedRifle?.availableModularStockOptionsSynthetic || [];
    if(this.state.selectedStockColorSynthetic.name === "Ciemna Zieleń" && 
      this.state.selectedRifle.name === "Blaser R8 Professional")
    {
      ids = [1, 2];
    }
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

onSelectStockColorSynthetic(newStockColor: Option): void {
  const oldId = this.state.selectedStockColorSynthetic?.id;
  if (oldId === newStockColor.id) return;

  this.configuratorService.resetOptionsAfter("stockColorSynthetic", this.optionHierarchy);
  this.configuratorService.updateState({
    selectedStockColorSynthetic: newStockColor,
    isDisabledRecoilPadSynthetic: false,
  });
  this.updateRecoilPad();
}

/*onSelectStockInlaySynthetic(newStockInlay: Option): void {
  const oldId = this.state.selectedStockInlaySynthetic?.id;
  if (oldId === newStockInlay.id) return;

  this.configuratorService.resetOptionsAfter("stockInlaySynthetic", this.optionHierarchy);
  this.configuratorService.updateState({ selectedStockInlaySynthetic: newStockInlay });
}*/

onSelectRecoilPadSynthetic(newRecoilPad: Option): void {
  const oldId = this.state.selectedRecoilPadSynthetic?.id;
  if (oldId === newRecoilPad.id) return;

  this.configuratorService.resetOptionsAfter("recoilPadSynthetic", this.optionHierarchy);
  this.configuratorService.updateState({ 
    selectedRecoilPadSynthetic: newRecoilPad,
    isDisabledModularStockOptionSynthetic: false
  });
  this.updateModularStockOption();
}

onSelectModularStockOptionSynthetic(newModularStock: Option): void {
  const oldId = this.state.selectedModularStockSynthetic?.id;
  if (oldId === newModularStock.id) return;

  this.configuratorService.resetOptionsAfter("modularStockSynthetic", this.optionHierarchy);
  this.configuratorService.updateState({ 
    selectedModularStockOptionSynthetic: newModularStock,
    isDisabledKickstopSynthetic: false,

  });
  this.updateKickstop();

}

onSelectKickstopSynthetic(newKickstop: Option): void {
  const oldId = this.state.selectedKickstopSynthetic?.id;
  if (oldId === newKickstop.id) return;

  this.configuratorService.updateState({ selectedKickstopSynthetic: newKickstop });
}


  onNext(): void {
    this.router.navigate(["/r8/chamberBolt"]);
  }

  onBack(): void {
    this.router.navigate(["/r8/barrel"]);
  }
}