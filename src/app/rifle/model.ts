import {Barrel} from '../R8/barrel/model';


export interface Rifle {
    id: number;
    name: string;
    price: number,
    imageUrl?: string;
    barrels: Barrel[];
    availableContours: number[];
    availableCalibers: number[]; 
    availableProfiles: number[];
    availableLengths: number[];
    availableOpenSights: number[];
    availableMuzzleBrakesOrSuppressors: number[];

}