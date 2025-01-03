import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ConfiguratorService } from 'src/app/core/services/configurator.service';

@Injectable({
  providedIn: 'root',
})
export class BarrelService {
  private jsonUrl = 'assets/dataR8.json'; // Ścieżka do pliku JSON

  constructor(private http: HttpClient, private configuratorService: ConfiguratorService) {}
  
  resetOptions(): void {
    this.configuratorService.updateState({
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
