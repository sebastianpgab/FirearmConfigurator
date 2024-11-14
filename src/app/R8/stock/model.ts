import {Option} from '../../option/model'

export interface Stock {
    buttstockType: Option[]; // Typ kolby, np. "Buttstock with double rabbet on Bavarian cheek piece"
    woodCategory: Option[]; // Kategoria drewna, np. "Wood Grade 4"
    lengthOfPull: Option[]; // Długość naciągu, np. "Standard Length of Pull incl. 15 mm (½”) Recoil Pad"
    individualButtstockMeasures: Option[]; // Czy ma indywidualne wymiary kolby (tak/nie)
    buttstockMeasuresType: Option[]; // Typ wymiarów, np. "Buttstock with factory measures"
    pistolGripCap: Option[]; // Czy jest nasadka na chwyt pistoletowy, np. "None"
    kickstop: Option[]; // Czy posiada kickstop, np. "None"
    stockMagazine: Option[]; // Czy kolba ma magazyn, np. "None"
    forearmOption: Option[]; // Opcje przedłużenia, np. "Black (synthetic) fore-end tip"
}
