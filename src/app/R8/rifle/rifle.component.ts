import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Rifle } from './model';
import { Option } from '../option/model';
import { ConfiguratorService } from 'src/app/core/services/configurator.service';
import { RifleService } from './rifle.service';

@Component({
  selector: 'app-rifle',
  templateUrl: './rifle.component.html',
  styles: []
})
export class RifleComponent implements OnInit, OnDestroy {

  /**
   * Lista nazw pól w stanie, które należy zresetować, gdy zmieni się dana opcja.
   */
  private readonly optionHierarchy: string[] = [
    'rifle',
    'handConfiguration',
    'contour',
    'caliber',
    'profile',
    'length',
    'openSight',
    'muzzleBrakeOrSuppressor',
    'buttstockType',
    'woodCategory',
    'lengthOfPull',
    'individualButtstockMeasure',
    'buttstockMeasuresType',
    'pistolGripCap',
    'kickstop',
    'stockMagazine',
    'forearmOption'
  ];

  private subscription!: Subscription;
  public rifles: Rifle[] = [];
  public handConfigurations: Option[] = [];
  public features: any;
  public state: any;

  constructor(
    private configuratorService: ConfiguratorService,
    private rifleService: RifleService
  ) {}

  ngOnInit(): void {
    // 1. Subskrypcja stanu w serwisie – aktualizuje this.state przy każdej zmianie
    this.subscription = this.configuratorService.state$.subscribe((state) => {
      this.state = state;
    });

    // 2. Pobranie danych z pliku JSON
    this.configuratorService.getData().subscribe(
      (data) => {
        this.features = data.features;
        this.rifles = data.rifles;

        // 3. Przywrócenie wcześniejszych wyborów (np. jeśli użytkownik wraca na ten widok)
        this.restoreSelections();
      },
      (error) => {
        console.error('Błąd przy ładowaniu danych:', error);
      }
    );
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  /**
   * Próba odtworzenia poprzednich wyborów użytkownika (jeśli w stanie jest zapisany rifle).
   */
  private restoreSelections(): void {
    if (this.state.selectedRifle) {
      this.rifleService.updateContoursForSelectedRifle(this.state.selectedRifle, this.features);
      this.updateHandConfigurationsForSelectedRifle(this.state.selectedRifle, this.features);
    }
  }

  /**
   * Reakcja na wybór innego modelu broni (rifle).
   */
  public onSelectRifle(newRifle: Rifle): void {
    // Resetujemy wszystkie opcje w hierarchii, które są "poniżej" rifle
    this.configuratorService.resetOptionsAfter('rifle', this.optionHierarchy);

    // Ustawiamy w stanie nowo wybrany karabin i "odblokowujemy" wybór handConfiguration
    this.configuratorService.updateState({
      selectedRifle: newRifle,
      isDisabledHandConfiguration: false
    });

    // Wczytujemy możliwe warianty prawo-/lewostronne dla tego rifle
    this.updateHandConfigurationsForSelectedRifle(newRifle, this.features);
  }

  /**
   * Reakcja na wybór prawo-/leworęcznej konfiguracji (HandConfiguration).
   */
  public onSelectHandConfiguration(newHandConf: Option): void {
    const oldId = this.state.selectedHandConfiguration?.id;
    if (oldId === newHandConf.id) {
      return;
    }
    // Resetujemy opcje "poniżej" handConfiguration
    this.configuratorService.resetOptionsAfter('handConfiguration', this.optionHierarchy);

    // Aktualizujemy stan o nowo wybraną konfigurację
    this.configuratorService.updateState({
      selectedHandConfiguration: newHandConf
    });
  }

  /**
   * Wypełnia listę 'handConfigurations' na podstawie wybranego modelu broni.
   */
  public updateHandConfigurationsForSelectedRifle(selectedRifle: Rifle | null, features: any[]): void {
    if (selectedRifle) {
      const handConfigurationIds = selectedRifle.availableHandConfigurations;
      this.handConfigurations = this.configuratorService.filterOptions(
        features,
        'handConfigurations',
        handConfigurationIds
      );
    } else {
      this.handConfigurations = [];
    }
  }

  public compareById = (o1: Rifle, o2: Rifle): boolean => {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  };
}
