import { Component, OnInit } from "@angular/core";
import { Rifle } from "../rifle/model";
import { ChamberBoltService } from "./chamber-bolt.service";
import { Option } from "../../option/model";
import { Router } from '@angular/router';
import { ConfiguratorService } from "src/app/core/services/configurator.service";

@Component({
  selector: 'app-chamber-bolt',
  templateUrl: './chamber-bolt.component.html',
  styleUrls: [] 
})
export class ChamberBoltComponent implements OnInit {

  features: any;
  rifles: Rifle[] = [];
  chamberEngravings: Option[] = [];
  boltHandles: Option[] = [];
  triggers: Option[] = [];
  boltHeads: Option[] = [];
  slidingSafeties: Option[] = [];

  selectedRifle: Rifle | null = null;
  selectedChamberEngraving: Option | null = null;
  selectedBoltHandle: Option | null = null;
  selectedTrigger: Option | null = null;
  selectedBoltHead: Option | null = null;
  selectedSlidingSafety: Option | null = null;

  isDisabledBoltHandle: boolean = true;
  isDisabledTrigger: boolean = true;
  isDisabledBoltHead: boolean = true;
  isDisabledSlidingSafety: boolean = true;

  constructor(
    private chamberBoltService: ChamberBoltService,
    private router: Router,
    private configuratorService: ConfiguratorService
  ) {}

  ngOnInit() {
    // Retrieve saved rifle from sessionStorage
    const savedRifle = JSON.parse(sessionStorage.getItem('selectedRifle') || 'null');

    this.chamberBoltService.getData().subscribe(data => {
      this.features = data.features;
      this.rifles = data.rifles;

      // Set selected rifle
      this.selectedRifle = savedRifle ? savedRifle : this.rifles[0];

      // Update options based on selected rifle
      this.updateOptionsBasedOnRifle();

      // Update option states
      this.updateOptionStates();

    }, error => {
      console.error('Error loading data:', error);
    });
  }

  onNext(): void {
    // Save selected rifle to sessionStorage
    sessionStorage.setItem('selectedRifle', JSON.stringify(this.selectedRifle));

    // Navigate to the next step
    this.router.navigate(['/r8/accessory']);
  }

  onBack() {
    this.router.navigate(['/r8/stock']);
  }

  onSelectRifle(rifle: Rifle) {
    this.selectedRifle = rifle;

    sessionStorage.setItem('selectedRifle', JSON.stringify(rifle));

    this.updateOptionsBasedOnRifle();

    this.updateOptionStates();
  }

  private updateOptionsBasedOnRifle(): void {
    if (!this.selectedRifle) {
      this.chamberEngravings = [];
      this.boltHandles = [];
      this.triggers = [];
      this.boltHeads = [];
      this.slidingSafeties = [];
      return;
    }

    this.chamberEngravings = this.configuratorService.filterOptions(this.features, 'chamberEngravings', this.selectedRifle.availableChamberEngravings);
    this.boltHandles = this.configuratorService.filterOptions(this.features, 'boltHandles', this.selectedRifle.availableBoltHandles);
    this.triggers = this.configuratorService.filterOptions(this.features, 'triggers', this.selectedRifle.availableTriggers);
    this.boltHeads = this.configuratorService.filterOptions(this.features, 'boltHeads', this.selectedRifle.availableBoltHeads);
    this.slidingSafeties = this.configuratorService.filterOptions(this.features, 'slidingSafeties', this.selectedRifle.availableSlidingSafeties);
  }

  public updateOptionStates(): void {
    this.isDisabledBoltHandle = !this.selectedChamberEngraving;
    this.isDisabledTrigger = !this.selectedBoltHandle;
    this.isDisabledBoltHead = !this.selectedTrigger;
    this.isDisabledSlidingSafety = !this.selectedBoltHead;
  }
}
