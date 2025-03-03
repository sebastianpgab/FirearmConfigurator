import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ConfiguratorService } from 'src/app/core/services/configurator.service';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  private jsonUrl = 'assets/dataR8.json';  // Ścieżka do pliku JSON zawierającego karabiny i kolby
  private stateSubject = new BehaviorSubject<any>({
    selectedButtstockType: null,
    selectedWoodCategory: null,
    selectedRecoilPad: null,
    selectedIndividualButtstockMeasure: null,
    selectedButtstockMeasuresType: null,
    selectedPistolGripCap: null,
    selectedKickstop: null,
    selectedStockMagazine: null,
    selectedForearmOption: null
  });
  constructor(private http: HttpClient, private configuratorService: ConfiguratorService) {}

    
  resetOptions(): void {
    this.configuratorService.updateState({
      selectedButtstockType: null,
      selectedWoodCategory: null,
      selectedRecoilPad: null,
      selectedIndividualButtstockMeasure: null,
      selectedButtstockMeasuresType: null,
      selectedPistolGripCap: null,
      selectedKickstop: null,
      selectedStockMagazine: null,
      selectedForearmOption: null,
      isDisabledWoodCategory: true,
      isDisabledRecoilPad: true,
      isDisabledIndividualButtstockMeasure: true,
      isDisabledButtstockMeasuresType: true,
      isDisabledPistolGripCap: true,
      isDisabledKickstop: true,
      isDisabledStockMagazine: true,
      isDisabledForearmOption: true,
    });
  }

}
