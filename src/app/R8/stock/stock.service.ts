import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  private jsonUrl = 'assets/dataR8.json';  // Ścieżka do pliku JSON zawierającego karabiny i kolby
  private stateSubject = new BehaviorSubject<any>({
    selectedButtstockType: null,
    selectedWoodCategory: null,
    selectedLengthOfPull: null,
    selectedIndividualButtstockMeasure: null,
    selectedButtstockMeasuresType: null,
    selectedPistolGripCap: null,
    selectedKickstop: null,
    selectedStockMagazine: null,
    selectedForearmOption: null
  });
  constructor(private http: HttpClient) {}

}
