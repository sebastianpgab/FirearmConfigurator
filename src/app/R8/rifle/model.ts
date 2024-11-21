import {Barrel} from '../barrel/model';
import { Stock } from '../../R8/stock/model';
import { ChamberBolt } from '../chamber-bolt/model';



export interface Rifle {
    id: number;
    name: string;
    price: number,
    imageUrl?: string;

    barrels: Barrel[]; // Lista dostępnych luf
    availableContours: number[];
    availableCalibers: number[]; 
    availableProfiles: number[];
    availableLengths: number[];
    availableOpenSights: number[];
    availableMuzzleBrakesOrSuppressors: number[];

    stocks: Stock[]; // Lista dostępnych kolb dla danego karabinu
    availableButtstockTypes: number[];
    availableWoodCategories: number[];
    availableLengthsOfPull: number[];
    availableIndividualButtstockMeasures: number[];
    availableButtstockMeasuresTypes: number[];
    availablePistolGripCaps: number[];
    availableKickstops: number[];
    availableStockMagazines: number[];
    availableForearmOptions: number[];

    chamberBolt: ChamberBolt[];
    availableChamberEngravings: number[]; // Lista dostępnych zamków
    availableBoltHandles: number[];
    availableTriggers: number[];
    availableBoltHeads: number[];
    availableSlidingSafeties: number[];

}