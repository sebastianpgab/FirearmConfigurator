import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Rifle } from './model';
import { Option } from "../option/model";
import { ConfiguratorService } from 'src/app/core/services/configurator.service';
import { RifleService } from './rifle.service';

@Component({
  selector: 'app-rifle',
  templateUrl: './rifle.component.html',
  styles: []
})
export class RifleComponent implements OnInit, OnDestroy {

  private subscription!: Subscription;

  // Główna hierarchia opcji – do resetowania w serwisie
  private optionHierarchy = [
    "rifle",
    "handConfiguration",
    "contour",
    "caliber",
    "profile",
    "length",
    "openSight",
    "muzzleBrakeOrSuppressor",
    "buttstockType",
    "woodCategory",
    "lengthOfPull",
    "individualButtstockMeasure",
    "buttstockMeasuresType",
    "pistolGripCap",
    "kickstop",
    "stockMagazine",
    "forearmOption"
  ];

  rifles: Rifle[] = [];
  handConfigurations: Option[] = [];
  features: any;
  state: any;

  constructor(
    private configuratorService: ConfiguratorService,
    private rifleService: RifleService
  ) {}

  ngOnInit(): void {
    // Subskrypcja stanu
    this.subscription = this.configuratorService.state$.subscribe((state) => {
      this.state = state;
    });

    // Pobieramy dane z pliku JSON
    this.configuratorService.getData().subscribe(
      (data) => {
        this.features = data.features;
        this.rifles = data.rifles;

        // Przywracamy ewentualne wybory, jeśli user już wybrał karabin
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
   * Metoda przywraca stan widoku (np. jeśli użytkownik wraca do tego widoku,
   * a w serwisie już jest wybrany rifle).
   */
  private restoreSelections(): void {
    // Tu można dodać logikę zależną od selectedRifle
    // np. updateContoursForSelectedRifle(...) – jeśli to faktycznie konieczne w tym komponencie
    if (this.state.selectedRifle) {
      // Na przykład:
      this.rifleService.updateContoursForSelectedRifle(this.state.selectedRifle, this.features);
    }
  }

  /**
   * Gdy użytkownik wybiera inny rifle z listy:
   */
  onSelectRifle(newRifle: Rifle): void {
    const oldRifle = this.state.selectedRifle;
    if (oldRifle && oldRifle.id === newRifle.id) {
      // Ten sam rifle – nic nie robimy
      return;
    }
    // Resetujemy opcje w serwisie, niższe w hierarchii
    this.configuratorService.resetOptionsAfter("rifle", this.optionHierarchy);

    // Uaktualniamy stan globalny
    this.configuratorService.updateState({
      selectedRifle: newRifle,
      isDisabledHandConfiguration: false,
     });
     
    this.updateHandConfigurationsForSelectedRifle(newRifle, this.features);
   }


  onSelectHandConfiguration(newHandConf: Option): void{
    const oldId = this.state.selectedHandConfiguration?.id;
    if(oldId == newHandConf.id) {
      return;
    }
    this.configuratorService.resetOptionsAfter("handConfiguration", this.optionHierarchy);
      this.configuratorService.updateState({
        selectedForearmOption: newHandConf,
      });
    }

    public updateHandConfigurationsForSelectedRifle(selectedRifle: Rifle | null, features: any[]): void {
      if(this.state.selectedRifle) {
        const handConfigurationIds = this.state.selectedRifle.availableHandConfigurations;
        this.handConfigurations = this.configuratorService.filterOptions(
          this.features, 
          "handConfigurations", 
          handConfigurationIds);
      }else {
        this.handConfigurations = [];
      }
    }

  compareById = (o1: Rifle, o2: Rifle) => {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  };
}
