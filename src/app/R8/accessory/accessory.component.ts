import { Component, OnInit, OnDestroy } from "@angular/core";
import { Option } from "../option/model";
import { AccessoryService } from "./accessory.service";
import { Router } from "@angular/router";
import { Rifle } from "../rifle/model";
import { ConfiguratorService } from "src/app/core/services/configurator.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-accessory",
  templateUrl: "./accessory.component.html",
  styleUrls: [],
})
export class AccessoryComponent implements OnInit, OnDestroy {
  private subscription!: Subscription;
  
  rifles: Rifle[] = [];
  features: any;
  
  gunCases: Option[] = [];
  softGunCovers: Option[] = [];
  rifleSlings: Option[] = [];
  
  state: any;
  
  selectedRifle: Rifle | null = null;
  selectedGunCase: Option | null = null;
  selectedSoftGunCover: Option | null = null;
  selectedRifleSling: Option | null = null;

  constructor(
    private accessoryService: AccessoryService,
    private router: Router,
    public configuratorService: ConfiguratorService
  ) {}

  ngOnInit(): void {
    // Subskrypcja stanu
    this.subscription = this.configuratorService.state$.subscribe((state) => {
      this.state = state;
      this.selectedRifle = this.state?.selectedRifle || null;
      this.restoreSelections();
    });

    ;this.configuratorService.getData().subscribe(
      (data) => {
        this.features = data.features;
        this.rifles = data.rifles;

        this.updateOptionsBasedOnRifle();
      },
      (error) => {
        console.error("Błąd przy ładowaniu danych:", error);
      }
    );
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  compareOptionsById = (o1: Option, o2: Option) =>
  o1 && o2 ? o1.id === o2.id : o1 === o2;

  /**
   * Przywracanie wybranych opcji po załadowaniu stanu.
   */
  private restoreSelections(): void {
    if (this.state?.selectedGunCase) {
      this.selectedGunCase = this.state.selectedGunCase;
    }
    if (this.state?.selectedSoftGunCover) {
      this.selectedSoftGunCover = this.state.selectedSoftGunCover;
    }
    if (this.state?.selectedRifleSling) {
      this.selectedRifleSling = this.state.selectedRifleSling;
    }
  }

  /**
   * Aktualizacja dostępnych opcji na podstawie wybranej broni.
   */
  private updateOptionsBasedOnRifle(): void {

    this.gunCases = this.configuratorService.filterOptions(
      this.features,
      "gunCases",
      this.state.selectedRifle.availableGunCases
    );
    this.softGunCovers = this.configuratorService.filterOptions(
      this.features,
      "softGunCovers",
      this.state.selectedRifle.availableSoftGunCovers
    );
    this.rifleSlings = this.configuratorService.filterOptions(
      this.features,
      "rifleSlings",
      this.state.selectedRifle.availableRifleSlings
    );
  }

  /**
   * Obsługa wyboru walizki.
   */
  onSelectGunCase(gunCase: Option): void {
    this.selectedGunCase = gunCase;
    this.configuratorService.updateState({ selectedGunCase: gunCase });
  }

  /**
   * Obsługa wyboru pokrowca.
   */
  onSelectSoftGunCover(softGunCover: Option): void {
    this.selectedSoftGunCover = softGunCover;
    this.configuratorService.updateState({ selectedSoftGunCover: softGunCover });
  }

  /**
   * Obsługa wyboru pasa.
   */
  onSelectRifleSling(rifleSling: Option): void {
    this.selectedRifleSling = rifleSling;
    this.configuratorService.updateState({ selectedRifleSling: rifleSling });
  }

  /**
   * Przejście do następnego kroku.
   */
  onNext(): void {
    if (!this.state.selectedGunCase) {
     this.configuratorService.showTemporaryToast('Aby kontynuować, wybierz akcesoria.');
    return;
  }
    this.router.navigate(["/r8/summary"]);
  }

  /**
   * Powrót do poprzedniego kroku.
   */
  onBack(): void {
    this.router.navigate(["/r8/chamberBolt"]);
  }
}
