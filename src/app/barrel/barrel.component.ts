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
  calibers: Option[] = [];  
  profiles: Option[] = [];
  lengths: Option[] = [];
  openSights: Option[] = [];
  muzzleBrakesOrSuppressors: Option[] = [];



  selectedCaliber: Option = { id: 0, name: '', price: 0, imageUrl: '' }; 
  selectedContour: Option = { id: 0, name: '', price: 0, imageUrl: '' };
  selectedProfile: Option = { id: 0, name: '', price: 0, imageUrl: '' };
  selectedLenght: Option = { id: 0, name: '', price: 0, imageUrl: '' };
  selectedOpenSight: Option = { id: 0, name: '', price: 0, imageUrl: '' };
  selectedMuzzleBreakorSilencer: Option = { id: 0, name: '', price: 0, imageUrl: '' };
  
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
    this.isDisabledProfile = this.selectedCaliber.name === '';
    this.isDisabledLength = this.selectedProfile.name === '';
    this.isDisabledOpenSight = this.selectedLenght.name === '';
    this.isDisabledMuzzleBreakorSilencer = this.selectedOpenSight.name === '';
  }

}
