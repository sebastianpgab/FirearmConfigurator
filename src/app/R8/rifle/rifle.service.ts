import { Injectable } from '@angular/core';
import { Option } from "../../option/model";
import { ConfiguratorService } from 'src/app/core/services/configurator.service';
import { BarrelService } from '../barrel/barrel.service';
import { Rifle } from './model';


@Injectable({
  providedIn: 'root'
})
export class RifleService {

  features: any;
  constructor(private configuratorService: ConfiguratorService, private barrelService: BarrelService) { }

  public updateContoursForSelectedRifle(selectedRifle: any): Option[] {
    if (selectedRifle) {
      const contourIds = selectedRifle.availableContours;
      return this.configuratorService.filterOptions(this.features, "contours", contourIds);
    }
    return [];
  }   
}
