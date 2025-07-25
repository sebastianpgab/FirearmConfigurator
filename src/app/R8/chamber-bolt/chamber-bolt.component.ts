import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";

import { Rifle } from "../rifle/model";
import { Option } from "../option/model";
import { ConfiguratorService } from "src/app/core/services/configurator.service";

@Component({
  selector: "app-chamber-bolt",
  templateUrl: "./chamber-bolt.component.html",
  styleUrls: [],
})
export class ChamberBoltComponent implements OnInit, OnDestroy {
  private subscription!: Subscription;

  /**
   * Hierarchia opcji – do resetowania "niższych" opcji,
   * jeśli zmieniamy coś wyżej.
   */
  private optionHierarchy = [
    "rifle",
    "chamberEngraving",
    "boltHandle",
    "trigger",
    "boltHead",
    "slidingSafety",
  ];

  // Dane z pliku JSON
  features: any;
  rifles: Rifle[] = [];

  // Listy opcji do kolejnych mat-select
  chamberEngravings: Option[] = [];
  boltHandles: Option[] = [];
  triggers: Option[] = [];
  boltHeads: Option[] = [];
  slidingSafeties: Option[] = [];

  // Aktualny stan z serwisu
  state: any;

  constructor(
    private router: Router,
    private configuratorService: ConfiguratorService
  ) {}

  ngOnInit(): void {
    // Subskrybujemy stan z ConfiguratorService
    this.subscription = this.configuratorService.state$.subscribe((state) => {
      this.state = state;
    });

    // Pobieramy dane z pliku JSON (lub z dowolnego źródła)
    this.configuratorService.getData().subscribe(
      (data) => {
        this.features = data.features;
        this.rifles = data.rifles;

        // Przy starcie odtwarzamy listy zależne od tego, co jest już w stanie (jeśli jest)
        this.restoreSelections();
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

  /**
   * compareOptionsById – do [compareWith] w mat-select,
   * aby rozpoznać tę samą opcję (po id) nawet jeśli obiekt jest inny referencyjnie.
   */
  compareOptionsById = (o1: Option, o2: Option) =>
    o1 && o2 ? o1.id === o2.id : o1 === o2;

  /**
   * Odtwarza zawartość wszystkich list (chamberEngravings, boltHandles, triggers, itp.)
   * na podstawie aktualnego stanu (this.state).
   */
  private restoreSelections(): void {
    // 1) Jeśli mamy wybrany Rifle, aktualizujemy listę chamberEngravings:
    if (this.state?.selectedRifle) {
      this.updateChamberEngravingsBasedOnRifle();
    } else {
      this.chamberEngravings = [];
    }

    // 2) Jeśli mamy wybrany Chamber Engraving, aktualizujemy listę boltHandles:
    if (this.state?.selectedChamberEngraving) {
      this.updateBoltHandlesBasedOnChamberEngraving();
    } else {
      this.boltHandles = [];
    }

    // 3) Jeśli mamy wybrany Bolt Handle, aktualizujemy listę triggers:
    if (this.state?.selectedBoltHandle) {
      this.updateTriggersBasedOnBoltHandle();
    } else {
      this.triggers = [];
    }

    // 4) Jeśli mamy wybrany Trigger, aktualizujemy listę boltHeads:
    if (this.state?.selectedTrigger) {
      this.updateBoltHeadsBasedOnTrigger();
    } else {
      this.boltHeads = [];
    }
  }

  // ------------------------------------------
  // Metody obsługujące zmianę każdej opcji:
  // ------------------------------------------

  onSelectRifle(newRifle: Rifle): void {
    const oldRifleId = this.state.selectedRifle?.id;
    if (oldRifleId === newRifle.id) {
      return; // nic się nie zmieniło
    }

    // Resetujemy opcje "niższe" w hierarchii (od "rifle" w dół)
    this.configuratorService.resetOptionsAfter("rifle", this.optionHierarchy);

    // Ustawiamy nowy stan
    this.configuratorService.updateState({
      selectedRifle: newRifle,
    });

    this.updateChamberEngravingsBasedOnRifle();
  }

  onSelectChamberEngraving(newChamberEngraving: Option): void {
    const oldChamberEngravingId = this.state.selectedChamberEngraving?.id;
    if (oldChamberEngravingId === newChamberEngraving.id) {
      return;
    }

    this.configuratorService.resetOptionsAfter("chamberEngraving", this.optionHierarchy);
    this.configuratorService.updateState({
      selectedChamberEngraving: newChamberEngraving,
      isDisabledBoltHandle: false,
    });

    this.updateBoltHandlesBasedOnChamberEngraving();
  }

  onSelectBoltHandle(newBoltHandle: Option): void {
    const oldBoltHandleId = this.state.selectedBoltHandle?.id;
    if (oldBoltHandleId === newBoltHandle.id) {
      return;
    }

    this.configuratorService.resetOptionsAfter("boltHandle", this.optionHierarchy);
    this.configuratorService.updateState({
      selectedBoltHandle: newBoltHandle,
      isDisabledTrigger: false,
    });

    this.updateTriggersBasedOnBoltHandle();
  }

  onSelectTrigger(newTrigger: Option): void {
    const oldTriggerId = this.state.selectedTrigger?.id;
    if (oldTriggerId === newTrigger.id) {
      return;
    }

    this.configuratorService.resetOptionsAfter("trigger", this.optionHierarchy);
    this.configuratorService.updateState({
      selectedTrigger: newTrigger,
      isDisabledBoltHead: false,
    });

    this.updateBoltHeadsBasedOnTrigger();
  }

  onSelectBoltHead(newBoltHead: Option): void {
    const oldBoltHeadId = this.state.selectedBoltHead?.id;
    if (oldBoltHeadId === newBoltHead.id) {
      return;
    }

    this.configuratorService.resetOptionsAfter("boltHead", this.optionHierarchy);
    this.configuratorService.updateState({
      selectedBoltHead: newBoltHead,
    });

  }

  // ------------------------------------------
  // Metody aktualizujące listy zależne od poprzednich wyborów
  // ------------------------------------------

  private updateChamberEngravingsBasedOnRifle(): void {
    if (this.state.selectedRifle) {
      this.chamberEngravings = this.configuratorService.filterOptions(
        this.features,
        "chamberEngravings",
        this.state.selectedRifle.availableChamberEngravings
      );
    } else {
      this.chamberEngravings = [];
    }
  }

  private updateBoltHandlesBasedOnChamberEngraving(): void {
    if (this.state.selectedChamberEngraving) {
      this.boltHandles = this.configuratorService.filterOptions(
        this.features,
        "boltHandles",
        this.state.selectedChamberEngraving.availableBoltHandles
      );
    } else {
      this.boltHandles = [];
    }
  }

private updateTriggersBasedOnBoltHandle(): void {
  let availableTriggers = this.state.selectedRifle?.availableTriggers;

  // Jeśli lista jest pusta lub undefined/null, użyj zapasowej z bolt handle
  if (!availableTriggers || availableTriggers.length === 0) {
    availableTriggers = this.state.selectedBoltHandle?.availableTriggers || [];
  }

  this.triggers = this.configuratorService.filterOptions(
    this.features,
    "triggers",
    availableTriggers
  );
}

  private updateBoltHeadsBasedOnTrigger(): void {
    let availableBoltHeads = this.state.selectedRifle?.availableBoltHeads;

    if (!availableBoltHeads || availableBoltHeads.length === 0) { 
      availableBoltHeads = this.state.selectedTrigger.availableBoltHeads || [];
    }
      this.boltHeads = this.configuratorService.filterOptions(
        this.features,
        "boltHeads",
        availableBoltHeads
      );
  }

  // --- Nawigacja ---
  onNext(): void {
    this.router.navigate(["/r8/accessory"]);
  }

  onBack(): void {
    this.router.navigate(["/r8/stock"]);
  }
}
