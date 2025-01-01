import { Injectable } from '@angular/core';
import { Rifle } from 'src/app/R8/rifle/model';
import { Option } from "../../option/model";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  constructor(private http: HttpClient) {}

  getData(): Observable<any> {
    return this.http.get<any>(this.jsonUrl);
  }

  public filterOptions(features: any, featureKey: string, availableIds: number[] | undefined): Option[] {
    return availableIds
      ? features[featureKey].filter((option: Option) =>
          availableIds.includes(option.id)): [];
  }

  public resetOptionsAfter(optionName: string, component: any): void {
    const startIndex = this.optionHierarchy.indexOf(optionName) + 1;
  
    if (startIndex > 0) {
      for (let i = startIndex; i < this.optionHierarchy.length; i++) {
        const option = this.optionHierarchy[i];
        const formattedOption = this.formatOptionName(option);
        component[`selected${option.charAt(0).toUpperCase() + option.slice(1)}`] = null;
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
