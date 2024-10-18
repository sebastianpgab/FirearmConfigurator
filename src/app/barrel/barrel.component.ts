import { Component, OnInit } from '@angular/core';
import { BarrelService } from './barrel.service';
import { Option } from '../option/model';

@Component({
  selector: 'app-barrel',
  templateUrl: './barrel.component.html',
  styles: []
})
export class BarrelComponent implements OnInit {
  jsonData: Option[] = [];  // Tablica obiektów typu Option

  constructor(private barrelService: BarrelService) {}

  ngOnInit() {
    this.barrelService.getData().subscribe(data => {
      // Zakładamy, że dane JSON zawierają tablicę 'calibers'
      this.jsonData = data.calibers as Option[];  // Rzutowanie danych na typ Option
      console.log(this.jsonData);  // Sprawdź w konsoli
    }, error => {
      console.error('Błąd przy ładowaniu danych:', error);
    });
  }
}
