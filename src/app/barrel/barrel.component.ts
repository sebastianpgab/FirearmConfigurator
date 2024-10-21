import { Component, OnInit } from '@angular/core';
import { BarrelService } from './barrel.service';
import { Option } from '../option/model';

@Component({
  selector: 'app-barrel',
  templateUrl: './barrel.component.html',
  styles: []
})
export class BarrelComponent implements OnInit {
  jsonDataCalibers: Option[] = [];  // Tablica obiektów typu Option
  jsonDataContours: Option[] = [];  // Tablica obiektów typu Option
  jsonDataProfiles: Option[] = [];  // Tablica obiektów typu Option
  jsonDataLengths: Option[] = [];  // Tablica obiektów typu Option
  jsonDataOpenSights: Option[] = [];  // Tablica obiektów typu Option
  jsonDataMuzzleBrakesOrSuppressors: Option[] = [];  // Tablica obiektów typu Option


  constructor(private barrelService: BarrelService) {}

  ngOnInit() {
    this.barrelService.getData().subscribe(data => {
      // Zakładamy, że dane JSON zawierają tablicę 'calibers'
      this.jsonDataCalibers = data.calibers as Option[]; 
      this.jsonDataContours = data.contours as Option[];
      this.jsonDataProfiles = data.profiles as Option[];
      this.jsonDataLengths = data.lengths as Option[];
      this.jsonDataOpenSights = data.openSights as Option[];
      this.jsonDataMuzzleBrakesOrSuppressors = data.muzzleBrakesOrSuppressors as Option[];
      console.log();  // Sprawdź w konsoli
    }, error => {
      console.error('Błąd przy ładowaniu danych:', error);
    });
  }
}