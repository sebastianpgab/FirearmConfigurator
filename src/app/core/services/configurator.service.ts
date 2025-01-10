import { Injectable } from '@angular/core';
import { Option } from "../../option/model";
import { HttpClient } from '@angular/common/http';
import { ConfiguratorState } from "src/app/core/services/model"
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfiguratorService {

  private jsonUrl = 'assets/dataR8.json';  // Ścieżka do pliku JSON

  private optionHierarchy = [
    "rifle",
    "contour",
    "caliber",
    "profile",
    "length",
    "openSight",
    "muzzleBrakeOrSuppressor",
  ];

  private stateSubject = new BehaviorSubject<ConfiguratorState>({ 
    selectedRifle: null,
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
  });

  state$ = this.stateSubject.asObservable();

  constructor(private http: HttpClient) {}

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

  public resetOptionsAfter(optionName: string): void {
    const startIndex = this.optionHierarchy.indexOf(optionName) + 1;
  
    if (startIndex > 0) {
      for (let i = startIndex; i < this.optionHierarchy.length; i++) {
        const option = this.optionHierarchy[i];
        const formattedOption = this.formatOptionName(option);
        //tu trzeba zrobić tak żeby stan był od razu odświeżany
        sessionStorage.removeItem(formattedOption);
      }
    } else {
      console.log(`Opcja ${optionName} nie została znaleziona w hierarchii.`);
    }
  }
  
  private formatOptionName(option: string): string {
    return "selected" + option.charAt(0).toUpperCase() + option.slice(1);
  }
  
  
  
}
