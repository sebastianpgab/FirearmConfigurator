import { Component, OnInit } from "@angular/core";
import { Rifle } from "../rifle/model";
import { BarrelService } from "./barrel.service";
import { Option } from "../../option/model";
import { Router } from '@angular/router';
import { ConfiguratorService } from "src/app/core/services/configurator.service";

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

  selectedRifle: Rifle | null = null;
  selectedContour: Option | null = null;
  selectedCaliber: Option | null = null;
  selectedProfile: Option | null = null;
  selectedLength: Option | null = null;
  selectedOpenSight: Option | null = null;
  selectedMuzzleBrakeOrSuppressor: Option | null = null;

  isDisabledCaliber: boolean = true;
  isDisabledProfile: boolean = true;
  isDisabledLength: boolean = true;
  isDisabledOpenSight: boolean = true;
  isDisabledMuzzleBrakeOrSuppressor: boolean = true;

  constructor(
    private barrelService: BarrelService,
    private router: Router,
    private configuratorService: ConfiguratorService
  ) {}

  ngOnInit() {
    // Odczytanie zapisanej strzelby z sessionStorage
    const savedRifle = JSON.parse(sessionStorage.getItem('selectedRifle') || 'null');

    this.barrelService.getData().subscribe(data => {
      this.features = data.features;
      this.rifles = data.rifles;

      // Ustawienie wybranej strzelby
      this.selectedRifle = savedRifle ? savedRifle : this.rifles[0];

      // Aktualizacja opcji na podstawie wybranej strzelby
      this.updateOptionsBasedOnRifle();

      // Aktualizacja stanów opcji (włączanie/wyłączanie)
      this.updateOptionStates();

    }, error => {
      console.error('Błąd przy ładowaniu danych:', error);
    });
  }

  onNext(): void {
    // Zapisanie wybranej strzelby do sessionStorage
    sessionStorage.setItem('selectedRifle', JSON.stringify(this.selectedRifle));

    // Nawigacja do kolejnego kroku
    this.router.navigate(['/r8/stock']);
  }

  onSelectRifle(rifle: Rifle) {
    this.selectedRifle = rifle;

    // Zapisanie wybranej strzelby do sessionStorage
    sessionStorage.setItem('selectedRifle', JSON.stringify(rifle));

    // Aktualizacja opcji na podstawie nowo wybranej strzelby
    this.updateOptionsBasedOnRifle();

    // Aktualizacja stanów opcji
    this.updateOptionStates();
  }

  private updateOptionsBasedOnRifle(): void {
    if (!this.selectedRifle) {
      this.contours = [];
      this.calibers = [];
      this.profiles = [];
      this.lengths = [];
      this.openSights = [];
      this.muzzleBrakesOrSuppressors = [];
      return;
    }

    this.contours = this.configuratorService.filterOptions(this.features, 'contours', this.selectedRifle.availableContours);
    this.calibers = this.configuratorService.filterOptions(this.features, 'calibers', this.selectedRifle.availableCalibers);
    this.profiles = this.configuratorService.filterOptions(this.features, 'profiles', this.selectedRifle.availableProfiles);
    this.lengths = this.configuratorService.filterOptions(this.features, 'lengths', this.selectedRifle.availableLengths);
    this.openSights = this.configuratorService.filterOptions(this.features, 'openSights', this.selectedRifle.availableOpenSights);
    this.muzzleBrakesOrSuppressors = this.configuratorService.filterOptions(this.features, 'muzzleBrakesOrSuppressors', this.selectedRifle.availableMuzzleBrakesOrSuppressors);
  }

  public updateOptionStates(): void {
    this.isDisabledCaliber = !this.selectedContour;
    this.isDisabledProfile = !this.selectedCaliber;
    this.isDisabledLength = !this.selectedProfile;
    this.isDisabledOpenSight = !this.selectedLength;
    this.isDisabledMuzzleBrakeOrSuppressor = !this.selectedOpenSight;
  }
}
