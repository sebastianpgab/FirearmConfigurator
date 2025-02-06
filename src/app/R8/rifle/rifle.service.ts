import { Injectable } from '@angular/core';
import { Option } from "../option/model";
import { ConfiguratorService } from 'src/app/core/services/configurator.service';
import { BarrelService } from '../barrel/barrel.service';
import { Rifle } from './model';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class RifleService {


  constructor(private configuratorService: ConfiguratorService) { }

  public updateContoursForSelectedRifle(selectedRifle: Rifle | null, features: any[]): void {
    if (selectedRifle) {
        const contourIds = selectedRifle.availableContours;
        const contours = this.configuratorService.filterOptions(features, "contours", contourIds);
    }
  }

 
}
