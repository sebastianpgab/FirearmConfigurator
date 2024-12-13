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

  constructor(private http: HttpClient) {}

  getData(): Observable<any> {
    return this.http.get<any>(this.jsonUrl);
  }

  public filterOptions(features: any, featureKey: string, availableIds: number[] | undefined): Option[] {
    return availableIds
      ? features[featureKey].filter((option: Option) =>
          availableIds.includes(option.id)): [];
  }
}
