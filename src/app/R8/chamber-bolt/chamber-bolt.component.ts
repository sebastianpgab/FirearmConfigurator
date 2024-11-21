import { Component, OnInit } from "@angular/core";
import { Rifle } from "../rifle/model";
import { ChamberBoltService } from "./chamber-bolt.service";
import { Option } from "../../option/model";
import { Router } from '@angular/router';

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
    private router: Router
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
    this.router.navigate(['/next-step']);
  }

  onSelectRifle(rifle: Rifle) {
    this.selectedRifle = rifle;

    // Save selected rifle to sessionStorage
    sessionStorage.setItem('selectedRifle', JSON.stringify(rifle));

    // Update options based on newly selected rifle
    this.updateOptionsBasedOnRifle();

    // Update option states
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

    this.chamberEngravings = this.filterOptions('chamberEngravings', this.selectedRifle.availableChamberEngravings);
    this.boltHandles = this.filterOptions('boltHandles', this.selectedRifle.availableBoltHandles);
    this.triggers = this.filterOptions('triggers', this.selectedRifle.availableTriggers);
    this.boltHeads = this.filterOptions('boltHeads', this.selectedRifle.availableBoltHeads);
    this.slidingSafeties = this.filterOptions('slidingSafeties', this.selectedRifle.availableSlidingSafeties);
  }

  private filterOptions(featureKey: string, availableIds: number[] | undefined): Option[] {
    return availableIds
      ? this.features[featureKey].filter((option: Option) =>
          availableIds.includes(option.id)
        )
      : [];
  }

  public updateOptionStates(): void {
    this.isDisabledBoltHandle = !this.selectedChamberEngraving;
    this.isDisabledTrigger = !this.selectedBoltHandle;
    this.isDisabledBoltHead = !this.selectedTrigger;
    this.isDisabledSlidingSafety = !this.selectedBoltHead;
  }
}
