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
  calibers: string[] = ['309', '321'];  
  contours: string[] = ['Standard', 'Semi-weight']; 
  profiles: string[] = ['Okrągła', 'Ryflowana'];
  features: any;
  selectedCaliber: string = ''; 
  selectedContour: string = '';
  selectedProfile: string = '';
  isDisabledCaliber: boolean = true;
  isDisabledProfile: boolean = true;

  constructor(private barrelService: BarrelService) {}

  ngOnInit() {
    this.barrelService.getData().subscribe(data => {
      this.features = data.features;
      this.rifles = data.rifles;
    }, error => {
      console.error('Błąd przy ładowaniu danych:', error);
    });
  }

  turnOfOption(): void {
    // Jeśli Kontur został wybrany, odblokuj Kaliber
    if (this.selectedContour !== '') {
      this.isDisabledCaliber = false;
    } else {
      this.isDisabledCaliber = true;
      this.isDisabledProfile = true; // Resetuj profil, jeśli kaliber jest wyłączony
    }

    // Jeśli Kaliber został wybrany, odblokuj Profil
    if (this.selectedCaliber !== '') {
      this.isDisabledProfile = false;
    } else {
      this.isDisabledProfile = true;
    }
  }
}