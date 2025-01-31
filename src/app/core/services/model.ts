import { Option } from "src/app/R8/option/model";
import { Rifle } from "src/app/R8/rifle/model";

export interface ConfiguratorState {
    selectedRifle: Rifle | null;
    selectedContour: Option | null;
    selectedCaliber: Option | null;
    selectedProfile: Option | null;
    selectedLength: Option | null;
    selectedOpenSight: Option | null;
    selectedMuzzleBrakeOrSuppressor: Option | null;
    selectedButtstockType: Option | null;
    selectedWoodCategory: Option | null;
    selectedLengthOfPull: Option | null;
    selectedIndividualButtstockMeasure: Option | null;
    selectedButtstockMeasuresType: Option | null;
    selectedPistolGripCap: Option | null;
    selectedKickstop: Option | null;
    selectedStockMagazine: Option | null;
    selectedForearmOption: Option | null;
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
  