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
  lengths: string[] = ['22 cali', '23 cali'];
  openSights: string[] = ['światłowodowe',  'trapezowe'];
  muzzleBrakesOrSuppressors: string[] = ['tłumik', 'kompessator'];

  features: any;
  selectedCaliber: string = ''; 
  selectedContour: string = '';
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
    }

    // Jeśli Kaliber został wybrany, odblokuj Profil
    if (this.selectedCaliber !== '') {
      this.isDisabledProfile = false;
    } else {
      this.isDisabledProfile = true;
    }

    //Jesli Profil został wybrany, odblokuj Długość
    if(this.selectedProfile !== ''){
      this.isDisabledLength= false;
    } else{
      this.isDisabledLength = true;
    }

    //jesli Dlugość została wybrana, odblokuj Przyrządy celownicze
    if(this.selectedLenght !== ''){
      this.isDisabledOpenSight = false;
    } else {
      this.isDisabledOpenSight = true;
    }

    //jeśli Przyrządy celownicze zostały wybrane, odblokuj Hamulce
    if(this.selectedOpenSight !== ''){
      this.isDisabledMuzzleBreakorSilencer = false;
    }else {
      this.isDisabledMuzzleBreakorSilencer = true;
    }
  }

  //jeśli 
}