import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BarrelService {

  private jsonUrl = 'assets/dataR8.json';  // Ścieżka do pliku JSON
  constructor(private http: HttpClient) {}

  getData(): Observable<any> {
    return this.http.get<any>(this.jsonUrl);
  }

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

}
