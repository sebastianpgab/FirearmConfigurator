export interface Option{
    id: number,
    name: string,
    price: number,
    description?: string;
    iconImageUrl?: string;
    imageUrl?: string;
    previewLabel?: string;
    secondaryImageUrl?: string;
    thirdImageUrl?: string;
    fourthImageUrl?: string;
    fifthImageUrl?: string;
    sixthImageUrl?: string;
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
    availableStockInlaysSynthetic?: [];
    availableModularStockOptionsSynthetic?: [];
    availableRecoilPadsSynthetic?: [];
    availableKickstopsSynthetic?: [];
}