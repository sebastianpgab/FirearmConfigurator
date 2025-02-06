import { Injectable } from '@angular/core';
import { Option } from "../../R8/option/model";
import { HttpClient } from '@angular/common/http';
import { ConfiguratorState } from "src/app/core/services/model"
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ConfiguratorService {

  private jsonUrl = 'assets/dataR8.json';  // Ścieżka do pliku JSON

  private stateSubject = new BehaviorSubject<ConfiguratorState>({ 
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
    selectedLengthOfPull: null,
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
    isDisabledLengthOfPull: true,
    isDisabledIndividualButtstockMeasure: true,
    isDisabledButtstockMeasuresType: true,
    isDisabledPistolGripCap: true,
    isDisabledKickstop: true,
    isDisabledStockMagazine: true,
    isDisabledForearmOption: true,
    isDisabledBoltHandle: true,
    isDisabledTrigger: true,
    isDisabledBoltHead: true,
    isDisabledslidingSafety: true
  });

  state$ = this.stateSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  public getData(): Observable<any> {
    return this.http.get<any>(this.jsonUrl);
  }

  public updateState(partialState: Partial<any>): void {
    const currentState = this.stateSubject.getValue();
    this.stateSubject.next({ ...currentState, ...partialState });
  }

  public filterOptions(features: any, featureKey: string, availableIds: number[] | undefined): Option[] {
    return availableIds
      ? features[featureKey].filter((option: Option) =>
          availableIds.includes(option.id)): [];
  }

  public resetOptionsAfter(optionName: string, optionHierarchy: string[]): void {
      const startIndex = optionHierarchy.indexOf(optionName) + 1;
  
      if (startIndex > 0) {
        const resetState: any = {};
  
        for (let i = startIndex; i < optionHierarchy.length; i++) {
          const option = optionHierarchy[i];
          const formattedOption = this.formatOptionName(option);
          const formattedIsDisabled = this.formatIisDisabled(option);
    
          resetState[formattedOption] = null;
          resetState[formattedIsDisabled] = true;
        }
  
        // Dopiero teraz ustawiamy te wszystkie wartości na null w state
        this.updateState(resetState);
      } else {
        console.log(`Opcja ${optionName} nie została znaleziona w hierarchii.`);
    }
  }
  
  private formatOptionName(option: string): string {
    return "selected" + option.charAt(0).toUpperCase() + option.slice(1);
  }

  private formatIisDisabled(option: string): string {
    return "isDisabled" + option.charAt(0).toUpperCase() + option.slice(1);
  }
  
  public isPageReloaded(): boolean {
    // Używamy PerformanceNavigationTiming, aby sprawdzić typ nawigacji
    const entries = window.performance.getEntriesByType('navigation');
    if (entries.length > 0) {
      const navigationEntry = entries[0] as PerformanceNavigationTiming;
      return navigationEntry.type === 'reload';
    }

    // Alternatywa dla starszych przeglądarek
    const navigationType = (window.performance as any).navigation?.type;
    return navigationType === 1; // 1 oznacza odświeżenie
  }
  
  
}
