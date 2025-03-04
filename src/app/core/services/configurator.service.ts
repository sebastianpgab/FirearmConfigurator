import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

import { Option } from '../../R8/option/model';
import { ConfiguratorState } from 'src/app/core/services/model';

@Injectable({
  providedIn: 'root'
})
export class ConfiguratorService {
  /** Ścieżka do pliku JSON z danymi konfiguracyjnymi */
  private readonly jsonUrl = 'assets/dataR8.json';

  /** Główny stan konfiguratora przechowywany w BehaviorSubject */
  private readonly stateSubject = new BehaviorSubject<ConfiguratorState>({
    selectedRifle: null,
    selectedHandConfiguration: null,
    selectedContour: null,
    selectedCaliber: null,
    selectedProfile: null,
    selectedLength: null,
    selectedOpenSight: null,
    selectedMuzzleBrakeOrSuppressor: null,
    selectedButtstockType: null,
    selectedWoodCategory: null,
    selectedRecoilPad: null,
    selectedIndividualButtstockMeasure: null,
    selectedButtstockMeasuresType: null,
    selectedPistolGripCap: null,
    selectedKickstop: null,
    selectedStockMagazine: null,
    selectedForearmOption: null,
    selectedChamberEngraving: null,
    selectedBoltHandle: null,
    selectedTrigger: null,
    selectedBoltHead: null,
    selectedSlidingSafety: null,
    isDisabledHandConfiguration: true,
    isDisabledCaliber: true,
    isDisabledProfile: true,
    isDisabledLength: true,
    isDisabledOpenSight: true,
    isDisabledMuzzleBrakeOrSuppressor: true,
    isDisabledWoodCategory: true,
    isDisabledRecoilPad: true,
    isDisabledIndividualButtstockMeasure: true,
    isDisabledButtstockMeasuresType: true,
    isDisabledPistolGripCap: true,
    isDisabledKickstop: true,
    isDisabledStockMagazine: true,
    isDisabledForearmOption: true,
    isDisabledBoltHandle: true,
    isDisabledTrigger: true,
    isDisabledBoltHead: true,
    isDisabledSlidingSafety: true
  });

  /** Strumień do obserwowania stanu (np. w komponencie) */
  public state$ = this.stateSubject.asObservable();

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router
  ) {}

  /** Zwraca aktualny stan konfiguratora (snapshot) */
  public getState(): ConfiguratorState {
    return this.stateSubject.value;
  }

  /** Pobiera dane z pliku JSON */
  public getData(): Observable<any> {
    return this.http.get<any>(this.jsonUrl);
  }

  /** Aktualizuje stan konfiguratora (częściowo) */
  public updateState(partialState: Partial<ConfiguratorState>): void {
    const currentState = this.getState();
    this.stateSubject.next({ ...currentState, ...partialState });
  }

  /** Filtruje opcje na podstawie dostępnych ID */
  public filterOptions(features: any, featureKey: string, availableIds: number[] | undefined): Option[] {
    if (!availableIds) { return []; }
    return features[featureKey].filter((option: Option) =>
      availableIds.includes(option.id)
    );
  }

  /**
   * Resetuje opcje (i ich disabled) od danego miejsca w hierarchii.
   * @param optionName nazwa opcji od której zaczynamy reset
   * @param optionHierarchy tablica zawierająca kolejność opcji
   */
  public resetOptionsAfter(optionName: string, optionHierarchy: string[]): void {
    const startIndex = optionHierarchy.indexOf(optionName) + 1;
    if (startIndex <= 0) {
      console.warn(`Opcja "${optionName}" nie została znaleziona w hierarchii.`);
      return;
    }

    const resetState: Partial<ConfiguratorState> = {};
    for (let i = startIndex; i < optionHierarchy.length; i++) {
      const option = optionHierarchy[i];
      const formattedOption = this.formatOptionName(option);
      const formattedIsDisabled = this.formatIsDisabledName(option);

      // Wyzerowanie wartości "selected..." i ustawienie "isDisabled..." na true
      (resetState as any)[formattedOption] = null;
      (resetState as any)[formattedIsDisabled] = true;
    }

    this.updateState(resetState);
  }

  private formatOptionName(option: string): string {
    return 'selected' + option.charAt(0).toUpperCase() + option.slice(1);
  }

  private formatIsDisabledName(option: string): string {
    return 'isDisabled' + option.charAt(0).toUpperCase() + option.slice(1);
  }

  /** Pomocnicza metoda do pobrania wybranej opcji na podstawie typu */
  private getSelectedItem(type: 'openSight' | 'muzzleBrakeOrSuppressor') {
    const { selectedOpenSight, selectedMuzzleBrakeOrSuppressor } = this.getState();
    switch (type) {
      case 'openSight':
        return selectedOpenSight;
      case 'muzzleBrakeOrSuppressor':
        return selectedMuzzleBrakeOrSuppressor;
      default:
        return null;
    }
  }

  /** Pobiera pozycję na podstawie długości dla określonego typu elementu */
  private getBasePosition(
    type: 'openSight' | 'muzzleBrakeOrSuppressor',
    length: number
  ) {
    const positionMap: Record<
      string,
      Record<number, { top: string; left: string }>
    > = {
      openSight: {
        50: { top: '5%', left: '30%' },
        52: { top: '0%', left: '-5.5%' },
        58: { top: '0%', left: '-0.5%' },
        65: { top: '8%', left: '36%' },
        70: { top: '9%', left: '38%' }
      },
      muzzleBrakeOrSuppressor: {
        50: { top: '2%', left: '50%' },
        52: { top: '0%', left: '2.2%' },
        58: { top: '0%', left: '7%' },
        65: { top: '5%', left: '44%' },
        70: { top: '6%', left: '42%' }
      }
    };
    return positionMap[type]?.[length] ?? { top: '0%', left: '0%' };
  }

  /**
   * Określa pozycję elementu (np. przyrządów celowniczych) na podstawie 
   * wybranej opcji i długości lufy
   */
  public getAttachmentPosition(type: 'openSight' | 'muzzleBrakeOrSuppressor') {
    const selectedItem = this.getSelectedItem(type);
    if (!selectedItem) {
      return { top: '0%', left: '0%' };
    }

    // Pobranie długości z nazwy (np. "R8 - 52 cm")
    const match = selectedItem.name.match(/\d+/);
    const length = match ? parseInt(match[0], 10) : 0;
    const position = this.getBasePosition(type, length);

    // Jeśli mamy "gwint" (czyli muzzle brake/suppressor), przesuwamy openSight
    const { selectedMuzzleBrakeOrSuppressor } = this.getState();
    if (type === 'openSight' && selectedMuzzleBrakeOrSuppressor?.name) {
      return {
        top: position.top,
        left: `calc(${position.left} - 0.8%)`
      };
    }
    return position;
  }

  //Zmien opcje X gdy zostanie wybrana opcja Y
  public updateDependentFeature(
    features: any,
    featureKey1: string,
    availableIds: number[] | undefined,
    featureKey2: string,
    selectedId: number,
    featureName: string
  ) {
    if (!features?.[featureKey1] || !availableIds?.length) {
      console.warn(`Nieprawidłowe dane dla ${featureKey1}`);
      return;
    }
  
    const featureOptions = features[featureKey2] ?? [];
    const newSelectedOption = featureOptions.find((option: Option) => option.id === selectedId);
  
    if (!newSelectedOption) {
      console.warn(`Nie znaleziono opcji ${selectedId} dla ${featureKey2}`);
      return;
    }
  
    console.log(`Aktualizacja ${featureKey2}:`, newSelectedOption);
    this.stateSubject.next({ ...this.stateSubject.value, [featureName]: newSelectedOption });
  }
  
  
}
