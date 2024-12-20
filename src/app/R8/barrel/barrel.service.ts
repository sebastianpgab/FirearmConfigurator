import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BarrelService {
  private jsonUrl = 'assets/dataR8.json'; // Ścieżka do pliku JSON

  // Wspólny stan dla komponentów
  private stateSubject = new BehaviorSubject<any>({
    selectedRifle: null,
    selectedContour: null,
    selectedCaliber: null,
    selectedProfile: null,
    selectedLength: null,
    selectedOpenSight: null,
    selectedMuzzleBrakeOrSuppressor: null,
    isDisabledCaliber: true,
    isDisabledProfile: true,
    isDisabledLength: true,
    isDisabledOpenSight: true,
    isDisabledMuzzleBrakeOrSuppressor: true,
  });

  state$ = this.stateSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Pobierz dane z pliku JSON
  getData(): Observable<any> {
    return this.http.get<any>(this.jsonUrl);
  }

  updateState(partialState: Partial<any>): void {
    const currentState = this.stateSubject.getValue();
    this.stateSubject.next({ ...currentState, ...partialState });
  }
  
  resetOptions(): void {
    this.updateState({
      selectedContour: null,
      selectedCaliber: null,
      selectedProfile: null,
      selectedLength: null,
      selectedOpenSight: null,
      selectedMuzzleBrakeOrSuppressor: null,
      isDisabledCaliber: true,
      isDisabledProfile: true,
      isDisabledLength: true,
      isDisabledOpenSight: true,
      isDisabledMuzzleBrakeOrSuppressor: true,
    });
  }
}
