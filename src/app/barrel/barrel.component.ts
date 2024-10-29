import { Component, OnInit } from "@angular/core";
import { Rifle } from "../rifle/model";
import { BarrelService } from "./barrel.service";
import { Option } from "../option/model";
@Component({
  selector: 'app-barrel',
  templateUrl: './barrel.component.html',
  styleUrls: [] 
})
export class BarrelComponent implements OnInit {

  features: any;
  rifles: Rifle[] = [];
  contours: Option[] = [];  // Pusta tablica na początek
  calibers: string[] = ['309', '321'];  
  profiles: string[] = ['Okrągła', 'Ryflowana'];
  lengths: string[] = ['22 cali', '23 cali'];
  openSights: string[] = ['światłowodowe',  'trapezowe'];
  muzzleBrakesOrSuppressors: string[] = ['tłumik', 'kompessator'];


  isContourDropdownOpen = false; // Kontrola widoczności listy

  selectedCaliber: string = ''; 
  selectedContour: Option = { id: 0, name: '', price: 0, imageUrl: '' };
  selectedProfile: string = '';
  selectedLenght: string = '';
  selectedOpenSight: string = '';
  selectedMuzzleBreakorSilencer: string = '';
  
  isDisabledCaliber: boolean = true;
  isDisabledProfile: boolean = true;
  isDisabledLength: boolean = true;
  isDisabledOpenSight: boolean = true;
  isDisabledMuzzleBreakorSilencer: boolean = true;

  constructor(private barrelService: BarrelService) {}

  ngOnInit() {
    this.barrelService.getData().subscribe(data => {
      this.features = data.features;
      this.rifles = data.rifles;
      this.contours = this.features.contours;
      this.calibers = this.features.calibers;
      this.profiles = this.features.profiles;
      this.lengths = this.features.lengths;
      this.openSights = this.features.openSights;
      this.muzzleBrakesOrSuppressors = this.features.muzzleBrakesOrSuppressors;
    }, error => {
      console.error('Błąd przy ładowaniu danych:', error);
    });
  }

  turnOfOption(): void {
    this.isDisabledCaliber = this.selectedContour.name === '';
    this.isDisabledProfile = this.selectedCaliber === '';
    this.isDisabledLength = this.selectedProfile === '';
    this.isDisabledOpenSight = this.selectedLenght === '';
    this.isDisabledMuzzleBreakorSilencer = this.selectedOpenSight === '';
  }
  
}
