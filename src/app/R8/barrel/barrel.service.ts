import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { ConfiguratorService } from 'src/app/core/services/configurator.service';

@Injectable({
  providedIn: 'root',
})
export class BarrelService {
  private jsonUrl = 'assets/dataR8.json'; // Ścieżka do pliku JSON

  // BehaviorSubject do propagacji zmian modelu
  private modelChangedSubject = new BehaviorSubject<any>(null);
  modelChanged$ = this.modelChangedSubject.asObservable();

  // Opcje przechowywane w serwisie
  public options = this.resetOptions();

  constructor(private http: HttpClient, private configuratorService: ConfiguratorService) {}

  // Pobierz dane z pliku JSON
  getData(): Observable<any> {
    return this.http.get<any>(this.jsonUrl);
  }

  // Aktualizuj stany opcji w zależności od wybranych wartości
  public updateOptionStates(
    selectedContour: any,
    selectedCaliber: any,
    selectedProfile: any,
    selectedLength: any,
    selectedOpenSight: any
  ): any {
    return {
      isDisabledCaliber: !selectedContour,
      isDisabledProfile: !selectedCaliber,
      isDisabledLength: !selectedProfile,
      isDisabledOpenSight: !selectedLength,
      isDisabledMuzzleBrakeOrSuppressor: !selectedOpenSight,
    };
  }

  // Resetuj opcje do wartości początkowych
  public resetOptions(): any {
    return {
      contours: [],
      calibers: [],
      profiles: [],
      lengths: [],
      openSights: [],
      muzzleBrakesOrSuppressors: [],
      selectedContour: null,
      selectedCaliber: null,
      selectedProfile: null,
      selectedLength: null,
      selectedOpenSight: null,
      selectedMuzzleBrakeOrSuppressor: null,
    };
  }

  // Zmień model i emituj zdarzenie zmiany
  public updateModel(model: any): void {
    this.options = this.resetOptions(); // Reset opcji
    this.modelChangedSubject.next(model); // Emitowanie zdarzenia zmiany modelu
  }
}