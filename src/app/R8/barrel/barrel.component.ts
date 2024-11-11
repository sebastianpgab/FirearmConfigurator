import { Component, OnInit, Optional } from "@angular/core";
import { Rifle } from "../../rifle/model";
import { BarrelService } from "./barrel.service";
import { Option } from "../../option/model";

@Component({
  selector: 'app-barrel',
  templateUrl: './barrel.component.html',
  styleUrls: [] 
})
export class BarrelComponent implements OnInit {
  
  features: any;
  rifles: Rifle[] = [];
  contours: Option[] = [];
  calibers: Option[] = [];
  profiles: Option[] = [];
  lengths: Option[] = [];
  openSights: Option[] = [];
  muzzleBrakesOrSuppressors: Option[] = [];

  selectedRifle: Rifle | null = null; // Wybrany rifle z szablonu
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

  onSelectRifle(rifle: Rifle) {
    this.selectedRifle = rifle;
  
    // Filtrowanie konturów
    this.contours = rifle.availableContours
      ? this.features.contours.filter((contour: Option) =>
          rifle.availableContours.includes(contour.id)
        )
      : []; // Pusta tablica, jeśli brak `availableContours`
  
    // Filtrowanie kalibrów
    this.calibers = rifle.availableCalibers
      ? this.features.calibers.filter((caliber: Option) =>
          rifle.availableCalibers.includes(caliber.id)
        )
      : [];
  
    // Filtrowanie profili
    this.profiles = rifle.availableProfiles
      ? this.features.profiles.filter((profile: Option) =>
          rifle.availableProfiles.includes(profile.id)
        )
      : [];
  
    // Filtrowanie długości
    this.lengths = rifle.availableLengths
      ? this.features.lengths.filter((length: Option) =>
          rifle.availableLengths.includes(length.id)
        )
      : [];
  
    // Filtrowanie otwartych przyrządów celowniczych
    this.openSights = rifle.availableOpenSights
      ? this.features.openSights.filter((openSight: Option) =>
          rifle.availableOpenSights.includes(openSight.id)
        )
      : [];
  
    // Filtrowanie hamulców wylotowych lub tłumików
    this.muzzleBrakesOrSuppressors = rifle.availableMuzzleBrakesOrSuppressors
      ? this.features.muzzleBrakesOrSuppressors.filter((muzzleBrakeOrSuppressor: Option) =>
          rifle.availableMuzzleBrakesOrSuppressors.includes(muzzleBrakeOrSuppressor.id)
        )
      : [];
  
    // Zaktualizowanie dostępności opcji
    this.turnOfOption();
  }
  
  turnOfOption(): void {
    this.isDisabledCaliber = this.selectedContour.name === '';
    this.isDisabledProfile = this.selectedCaliber.name === '';
    this.isDisabledLength = this.selectedProfile.name === '';
    this.isDisabledOpenSight = this.selectedLenght.name === '';
    this.isDisabledMuzzleBreakorSilencer = this.selectedOpenSight.name === '';
  }
}
