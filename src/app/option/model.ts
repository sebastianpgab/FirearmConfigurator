export interface Option{
    id: number,
    name: string,
    price: number,
    imageUrl?: string;
    availableCalibers?: [];
    availableProfiles?: [];
    availableLengths?: [];
    availableOpenSights?: [];
    availableMuzzleBrakesOrSuppressors?: [];
}