import { Rifle } from "src/app/R8/rifle/model";

export interface ConfiguratorState {
    selectedRifle: Rifle | null;
    selectedContour: string | null;
    selectedCaliber: string | null;
    selectedProfile: string | null;
    selectedLength: string | null;
    selectedOpenSight: string | null;
    selectedMuzzleBrakeOrSuppressor: string | null;
    selectedButtstockType: string | null;
    selectedWoodCategory: string | null;
    selectedLengthOfPull: string | null;
    selectedIndividualButtstockMeasure: string | null;
    selectedButtstockMeasuresType: string | null;
    selectedPistolGripCap: string | null;
    selectedKickstop: string | null;
    selectedStockMagazine: string | null;
    selectedForearmOption: string | null;
    isDisabledCaliber: boolean;
    isDisabledProfile: boolean;
    isDisabledLength: boolean;
    isDisabledOpenSight: boolean;
    isDisabledMuzzleBrakeOrSuppressor: boolean;
    isDisabledWoodCategory: boolean;
    isDisabledLengthOfPull: boolean;
    isDisabledIndividualButtstockMeasure: boolean;
    isDisabledButtstockMeasuresType: boolean;
    isDisabledPistolGripCap: boolean;
    isDisabledKickstop: boolean;
    isDisabledStockMagazine: boolean;
    isDisabledForearmOption: boolean;
  }
  