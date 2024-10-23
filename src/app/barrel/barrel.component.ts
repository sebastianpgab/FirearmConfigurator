import { Component, OnInit } from "@angular/core";
import { Rifle } from "../rifle/model";
import { BarrelService } from "./barrel.service";

@Component({
  selector: 'app-barrel',
  templateUrl: './barrel.component.html',
  styleUrls: [] 
})
export class BarrelComponent implements OnInit {

  rifles: Rifle[] = [];
  calibers: string[] = ['309', '321'];  // Tablica stringów
  features: any;
  selectedCaliber: string = '';  // Wybrany kaliber


  constructor(private barrelService: BarrelService) {}

  ngOnInit() {
    this.barrelService.getData().subscribe(data => {
      this.features = data.features;
      this.rifles = data.rifles;
      // Dane kalibrów są już ustawione na sztywno w tym przypadku
    }, error => {
      console.error('Błąd przy ładowaniu danych:', error);
    });
  }
}
