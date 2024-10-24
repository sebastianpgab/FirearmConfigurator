import {Barrel} from '../barrel/model';


export interface Rifle {
    id: number;
    name: string;
    price: number,
    imageUrl?: string;
    barrels: Barrel[];
    availableContours: number[]; 
}