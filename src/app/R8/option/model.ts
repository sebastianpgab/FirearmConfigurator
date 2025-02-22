export interface Option{
    id: number,
    name: string,
    price: number,
    imageUrl?: string;
    secondaryImageUrl?: string;
    availableCalibers?: [];
    availableProfiles?: [];
    availableLengths?: [];
    availableOpenSights?: [];
    availableMuzzleBrakesOrSuppressors?: [];
    availableButtstockTypes?: [];
    availableWoodCategories?: [];
    availableLengthsOfPull?: [];
    availableIndividualButtstockMeasures?: [];
    availableButtstockMeasuresTypes?: [];
    availablePistolGripCaps?: [];
    availableKickstops?: [];
    availableStockMagazines? : [];
    availableForearmOptions?: [];
    availableBoltHandles?: [];
}