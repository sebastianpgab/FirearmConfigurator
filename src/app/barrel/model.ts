import { Option } from "../option/model";

export interface Barrel {
    calibers: Option[];
    contour: Option[];
    profiles: Option[];
    lengths: Option[];
    openSights: Option[];
    muzzleBrakesOrSuppressors: Option[];
}