import {Barrel} from '../barrel/model';
import { Stock } from '../../R8/stock/model';
import { Accessory } from '../accessory/model';

export interface Rifle {
    id: number;
    name: string;
    price: number,
    description: string,
    imageUrl?: string;

    availableHandConfigurations: number[];

    availableContours: number[];
    availableCalibers: number[]; 
    availableProfiles: number[];
    availableLengths: number[];
    availableOpenSights: number[];
    availableMuzzleBrakesOrSuppressors: number[];

    availableStockInlaysSynthetic: number[];
    availableModularStockOptionsSynthetic: number[];
    availableRecoilPadsSynthetic: number[];
    availableKickstopsSynthetic: number[];

    availableButtstockTypes: number[];
    availableWoodCategories: number[];
    availableStockInlays: number [];
    availableStockInlaySeams: number [];
    availableLengthsOfPull: number[];
    availableIndividualButtstockMeasures: number[];
    availableButtstockMeasuresTypes: number[];
    availablePistolGripCaps: number[];
    availableKickstops: number[];
    availableStockMagazines: number[];
    availableForearmOptions: number[];

    availableChamberEngravings: number[]; // Lista dostępnych zamków
    availableBoltHandles: number[];
    availableTriggers: number[];
    availableBoltHeads: number[];
    availableSlidingSafeties: number[];

    availableGunCases: number[];
    availableSoftGunCovers: number[];
    availableRifleSlings: number [];
}