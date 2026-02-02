import {
    EnergyCarrier,
    mapExistingHeatGeneratorToEnergyCarrier,
    getCO2EmissionFactor,
    mapSecondNewHeatGeneratorToEnergyCarrier,
} from "@/tables/CO2EmissionFactorsOfVariousEnergySources";
import merge from "deepmerge";
import {
    BottomSideConstructionMethod,
    ConstructionPart,
    OuterWallConstructionMethod,
    FlatRoofConstructionMethod,
    WindowConstructionMethod,
    getHeatTransferCoefficient,
    AngledRoofConstructionMethod,
} from "@/tables/HeatTransferCoefficientBasedOnComponentAndConstructionYear";
import { Month, getAverageYieldInKiloWattHours } from "@/tables/averageMonthlyPhotovoltaicYield";
import { getAverageYearlyEnergyUsageWithAndWithout } from "@/tables/averageYearlyEnergyUsageBasedOnBuildingTypeAndNumberOfResidents";
import { getEnergyForOneUnitInKWh } from "@/tables/fuelTypeAndMatchingHeatingValue";
import { getJAZ } from "@/tables/jazValuesOfHeatPumpSystems";
import { InsulationType, getLambdaValue } from "@/tables/lambdaValueOfInsulationType";
import { getPercentageOfOuterShell } from "@/tables/percentageOfOuterShellBasedOnBuildingTypeAndConstructionPart";
import {
    HeatTransferConstructionPart,
    getTargetedHeatTransferCoefficient,
} from "@/tables/targetedHeatTransferCoefficientForConstructionParts";
import { getUtilizedHours } from "@/tables/utilizationHoursBasedOnBuildingType";
import { StateCreator, StoreApi, UseBoundStore, create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { getHeatingSystemData } from "@/tables/systemTemperaturesForDifferentHeatingSystems";

export type KeysWhereValueHasCondition<ObjectWithKeys, Condition> = {
    [Key in keyof ObjectWithKeys]: ObjectWithKeys[Key] extends Condition ? Key : never;
}[keyof ObjectWithKeys];

export enum BuildingType {
    Einfamilienhaus = "Einfamilienhaus",
    Mehrfamilienhaus = "Mehrfamilienhaus",
    Reihenmittelhaus = "Reihenmittelhaus",
    Reihenendhaus = "Reihenendhaus",
}
export enum FuelType {
    OilLight = "Heizöl Leicht",
    OilHeavy = "Heizöl Schwer",
    GasL = "Erdgas L",
    GasH = "Erdgas H",
    WoodPellets = "Holzpellets",
    WoodLogs = "Holzscheite",
    WoodChips = "Holzschnitzel",
}
export enum ConsumptionTechnology {
    HeatingAppliance = "Heizwertgerät",
    CondensingAppliance = "Brennwertgerät",
}
// Auswahl des vorhandenen Wärmeerzeugers M23.09.24
export enum ExistingHeatGenerator {
    Gas = "Gas",
    Oil = "Öl",
    SolidFuel = "Festbrennstoff (Holz)",
}
export enum TechnologySelection {
    HeatGenerator = "Wärmeerzeuger",
    Photovoltaic = "Photovoltaik",
    Ventilation = "Lüftung",
}
export enum NewHeatGenerator {
    HeatPump = "Wärmepumpe",
    HybridSystem = "Hybrid-System (Öl/Gas + Wärmepumpe)",
    FuelHeating = "Brennstoffheizung",
}
export enum SecondNewHeatGenerator {
    OilBoilder = "Öl-Kessel",
    GasBoiler = "Gas-Kessel",
}
export enum NewHeatGeneratorFuelHeating {
    Hydrogen = "100% Wasserstoff aufrüstbarer Gaskessel",
    Biomass = "Biomasse (Holz)",
}
export enum ModeOfOperation {
    ParallelOperation = "Parallelbetrieb",
    AlternativeOperation = "Altarnativbetrieb",
}
export enum ExistingDistributionSystem {
    Radiator = "Heizkörper",
    LowTemperatureRadiator = "Niedertemperaturheizkörper",
    UnderfloorHeating = "Fußbodenheizung",
}
export enum HeatPumpType {
    AirWater = "Luft/Wasser",
    BrineWater = "Sole/Wasser",
    WaterWater = "Wasser/Wasser",
    AirAir = "Luft/Luft",
}
export enum DefaultCustom {
    Default = "Default",
    Custom = "Custom",
}
export enum RoofType {
    InvertedRoof = "Umkehrdach",
    TopFloorCeiling = "Oberste Geschossdecke",
    FlatRoof = "Flachdach",
    PitchedRoof = "Schrägdach",
}
// export enum InsulationTypeRoof {
//     MineralWool = "Mineralwolle",
//     FoamGlass = "Schaumglass",
//     PUR = "PUR",
//     EPS = "EPS",
//     XPS = "XPS",
//     Hemp = "Hanf",
//     WoodFiber = "Holzfaser",
//     Custom = "Custom",
// }
// export enum InsulationStandardRoof {
//     GEG = "GEG erfüllen",
//     BEG = "BEG erfüllen",
//     Custom = "Custom",
// }
// export enum InsulationStandardWindows {
//     GEG = "GEG erfüllen",
//     BEG = "BEG erfüllen",
//     Custom = "Custom",
// }

// export enum InsulationStandardBasementCeiling {
//     GEG = "GEG erfüllen",
//     BEG = "BEG erfüllen",
//     Custom = "Custom",
// }

// export enum BasementIsHeated {
//     Heated = "beheizt",
//     NotHeated = "nicht beheizt",
// }

// export enum InsulationTypeBasementCeiling {
//     MineralWool = "Mineralwolle",
//     EPS = "EPS (Polystyrol-Hartschaum)",
//     Hemp = "Hanf",
//     VacuumInsulationPanels = "Vakuum-Isolationspaneele",
//     Custom = "Custom",
// }

// export enum PhotovoltaicInstalled {
//     Installed = "Ja",
//     NotInstalled = "Nein",
// }

// export enum PhotovoltaicRenewed {
//     NotRenewed = "keine nachträgliche Dachsanierung durchgeführt",
//     Renewed = "naträgliche Sanierung durchgeführt",
//     RenewalPlaned = "naträgliche Sanierung in Planung",
// }
export enum FinalEnergyDemand_Q_E_Calculation {
    BasedOnHeatingLoad = "BasedOnHeatingLoad",
    BasedOnHeatingDemand = "BasedOnHeatingDemand",
}
export enum InsulationStandard {
    GEG = "Gebäudeenergiegesetz",
    BEG = "Bundesförderung für effiziente Gebäude",
}
export enum RestrictionsWallInside {
    MonumentalProtection = "monumentalProtection",
    DistanceToHeatingElement = "distanceToHeatingElement",
    LivingAreaCouldGetToSmall = "livingAreaCouldGetToSmall",
}
export enum RestrictionsWallOutside {
    DistanceToStreetProblematic = "distanceToStreetProblematic",
    EnoughRoofOverhang = "enoughRoofOverhang",
    MonumentalProtection = "monumentalProtection",
}
export enum RestrictionsHeatPumpBrineWater {
    NoDrillingPossible = "Keine Bohrungen möglich (Platz, Bohrtiefe, Genehmigungen",
    WaterProtectionArea = "Gebäude befindet sich im Wasserschutzgebiet",
}
export enum RestrictionsHeatPumpWaterWater {
    GroundwaterAvailable = "Grundwasser zur Entnahme vorhanden",
    NoDrillingPossible = "Keine Bohrungen möglich (Platz, Bohrtiefe, Genehmigungen",
    WaterProtectionArea = "Gebäude befindet sich im Wasserschutzgebiet",
}
export enum BigElectricalConsumer {
    ElectricCar = "Elektroauto",
    Heatpump = "Wärmepumpe",
}
export enum WarmWaterOrigin {
    Decentralized = "dezentral",
    Inclusive = "eigener Brennstoff",
    Exclusive = "kein eigener Brennstoff",
}
export enum HeatedUnheated {
    Heated = "Heated",
    Unheated = "Unheated",
}
export enum AngledOrFlat {
    Angled = "Angled",
    Flat = "Flat",
}
// export type CustomValueInput<T> = {
//     _customValue: T,
//     Custom: () => T | undefined;
// }
// export type matchingConstructionPartMethod<T> = {
//     T;
// };
export type VariableStore = {
    building_Dimensions: {
        depth: number | null;
        width: number | null;
        roomHeight: number | null;
        numberOfLevels: number | null;
        area: {
            Default: () => number | undefined;
            Custom: () => number | undefined;
            chosen: DefaultCustom;
            _customValue: number | null;
        };
        volume: {
            Default: () => number | undefined;
            Custom: () => number | undefined;
            chosen: DefaultCustom;
            _customValue: number | null;
        };
    };
    building_Type: BuildingType | null;
    building_YearOfConstruction: number | null;
    building_NumberOfResidents: number | null;
    building_UtilizedHours: {
        Default: () => number | undefined;
        Custom: () => number | undefined;
        chosen: DefaultCustom;
        _customValue: number | null;
    };
    building_Ventilation: {
        airExchangeRate: {
            Default: () => number;
            Custom: () => number | undefined;
            chosen: DefaultCustom;
            _customValue: number | null;
        };
        alreadyHasVentilationSystem: boolean;
        volumeIfDifferentThanBuildingVolume: {
            Default: () => number | undefined;
            Custom: () => number | undefined;
            chosen: DefaultCustom;
            _customValue: number | null;
        };
        usesWRG: boolean;
        efficiencyinPercent: {
            Default: () => number;
            Custom: () => number | undefined;
            chosen: DefaultCustom;
            _customValue: number | null;
        }; // wird im Step beschränkt
    };
    // START OF PART 1
    building_TransmissionHeatLoss_Q_T_ForConstructionPart_AfterGeneralData: (
        constructionPart: ConstructionPart,
    ) => number | undefined;
    building_TransmissionHeatLoss_Q_T_AfterGeneralData: () => number | undefined;
    building_AirVolumeFLow_V_Dot_AfterGeneralData: () => number | undefined;
    building_VentilationHeatLoss_Q_L_WithoutWRG_AfterGeneralData: () => number | undefined;
    building_VentilationHeatLoss_Q_L_WithWRG_AfterGeneralData: () => number | undefined;
    building_VentilationHeatLoss_Q_L_AfterGeneralData: () => number | undefined;
    building_VentilationHeatLoss_Q_L_Savings_AfterGeneralData: () => number | undefined;
    building_HeatingLoad_Q_H_BasedOnHeatingDemand_AfterGeneralData: () => number | undefined;
    building_HeatingLoad_Q_H_BasedOnTransmissionHeatLossAndVentilationHeatLoss_AfterGeneralData: () =>
        | number
        | undefined;
    building_HeatingLoad_Q_H_AfterGeneralData: {
        Default: () => number | undefined;
        Custom: () => number | undefined;
        chosen: DefaultCustom; // `| null` braucht man hier eigentlich gar nicht, weil man das default auch benutzen kann
        _customValue: number | null;
    };
    // building_HeatingLoadReduction_Q_H_Einsparung_AfterGeneralData: () => number | undefined;
    // building_HeatingDemandReduction_Q_W_Einsparung_AfterGeneralData: () => number | undefined;
    building_PreviousYearFuelConsumption: {
        [key in FuelType]: number | null;
    } & { type: FuelType | null }; // muss direkt zu "building_ExistingHeatGenerator" gemappt werden mit "FuelTypeToExistingHeatGeneratorMapping[type]"
    building_ConsumptionTechnology: ConsumptionTechnology | null;
    building_HeatingDemand_Q_W_Fuel_AfterGeneralData: () => number | undefined;
    building_HeatingDemand_Q_W_WP_AfterGeneralData: () => number | undefined;
    building_HeatPumpType: HeatPumpType | undefined | null;
    building_HeatPump_CoverageRatioInPercent_AfterGeneralData: number;
    building_HeatingDemand_Q_W_BasedOnPreviousYearFuelConsumption_AfterGeneralData: () => number | undefined;
    building_HeatingDemand_Q_W_BasedOnHeatingLoad_AfterGeneralData: () => number | undefined;
    building_HeatingDemand_Q_W_AfterGeneralData: {
        Default: () => number | undefined;
        Custom: () => number | undefined;
        chosen: DefaultCustom; // `| null` braucht man hier eigentlich gar nicht, weil man das default auch benutzen kann
        _customValue: number | null;
    };
    // TODO irgendwie denke ich mir, dass man jetzt eigentlich gar keine zwei verschiedenen herangehensweisen braucht für WW. würde auch den edgecase vermeiden, wenn "über wärmebedarf" ausgewählt ist, ww einen custom wert hat für die Heizlast, und dann "über heizlast" ausgewählt wird.
    building_WarmWaterDemand_Q_WW_HeatingDemand: () => number | undefined;
    building_WarmWaterDemand_Q_WW_HeatingLoad: () => number | undefined;
    building_WarmWaterDemand_Q_WW: {
        Default: () => number | undefined;
        Custom: () => number | undefined;
        chosen: DefaultCustom;
        _customValue: number | null;
    };
    building_WarmWaterOrigin: WarmWaterOrigin | null;
    building_FinalEnergyDemand_BasedOn: FinalEnergyDemand_Q_E_Calculation | null;
    building_FinalEnergyDemand_Q_E_AfterGeneralData: () => number | undefined;
    building_SpezificFinalEnergyDemand_Q_E_Spez_AfterGeneralData: () => number | undefined;
    building_YearlyEnergyUsage: {
        Default: () => number | undefined;
        Custom: () => number | undefined;
        chosen: DefaultCustom;
        _customValue: number | null;
    };
    building_ElectricCar: {
        value: {
            Default: () => number | undefined;
            Custom: () => number | undefined;
            chosen: DefaultCustom;
            _customValue: number | null;
        };
        isUsed: boolean;
        valueToElectricity: () => number | undefined;
    };
    building_HeatPump_JAZ: {
        Default: () => number | undefined;
        Custom: () => number | undefined;
        chosen: DefaultCustom;
        _customValue: number | null;
    };
    building_Basic_Electricity: () => number | undefined;
    building_ElectricCar_Electricity: () => number | undefined;
    building_HeatPump_Electricity: () => number | undefined;
    building_ElectricityUsage: () => number | undefined;
    building_CO2Emissions_Fuel_AfterGeneralData: () => number | undefined;
    building_CO2Emissions_Electricity_AfterGeneralData: () => number | undefined;
    building_CO2Emissions_AfterGeneralData: () => number | undefined;
    // -- END OF PART 1
    // START OF PART 2
    building_ConstructionParts: {
        [ConstructionPart.TopSide]: {
            angledOrFlat: AngledOrFlat | null;
            type: RoofType | null; // nur hier - null => kein Type; undefined => Dach außer Schrägdach; rest => passend;
            method: FlatRoofConstructionMethod | AngledRoofConstructionMethod | null;
            area: {
                Default: () => number | undefined;
                Custom: () => number | undefined;
                chosen: DefaultCustom;
                _customValue: number | null;
            };
            installationYearIfDifferentThanConstructionYear: {
                Default: () => number | undefined;
                Custom: () => number | undefined;
                chosen: DefaultCustom;
                _customValue: number | null;
            };
            targetedStandard: InsulationStandard | null;
            thermalTransmissionCoefficient: {
                Default: () => number | undefined;
                Custom: () => number | undefined;
                _customValue: number | null;
                chosen: DefaultCustom;
            };
            insulationType: InsulationType | null;
            lambda: {
                Default: () => number | undefined;
                Custom: () => number | undefined;
                chosen: DefaultCustom;
                _customValue: number | null;
            };
            insulationThickness: () => number | undefined;
        };
        [ConstructionPart.OuterWall]: {
            method: OuterWallConstructionMethod | null;
            area: {
                Default: () => number | undefined;
                Custom: () => number | undefined;
                chosen: DefaultCustom;
                _customValue: number | null;
            };
            installationYearIfDifferentThanConstructionYear: {
                Default: () => number | undefined;
                Custom: () => number | undefined;
                chosen: DefaultCustom;
                _customValue: number | null;
            };
            targetedStandard: InsulationStandard | null;
            thermalTransmissionCoefficient: {
                Default: () => number | undefined;
                Custom: () => number | undefined;
                _customValue: number | null;
                chosen: DefaultCustom;
            };
            restrictions: {
                outside: {
                    [key in RestrictionsWallOutside]: boolean;
                };
                inside: {
                    [key in RestrictionsWallInside]: boolean;
                };
            };
            insulationType: InsulationType | null;
            lambda: {
                Default: () => number | undefined;
                Custom: () => number | undefined;
                chosen: DefaultCustom;
                _customValue: number | null;
            };
            insulationThickness: () => number | undefined;
        };
        [ConstructionPart.Window]: {
            method: WindowConstructionMethod | null;
            area: {
                Default: () => number | undefined;
                Custom: () => number | undefined;
                chosen: DefaultCustom;
                _customValue: number | null;
            };
            installationYearIfDifferentThanConstructionYear: {
                Default: () => number | undefined;
                Custom: () => number | undefined;
                chosen: DefaultCustom;
                _customValue: number | null;
            };
            targetedStandard: InsulationStandard | null;
            thermalTransmissionCoefficient: {
                Default: () => number | undefined;
                Custom: () => number | undefined;
                _customValue: number | null;
                chosen: DefaultCustom;
            };
            sunProtectionExisting: boolean | null;
        };
        [ConstructionPart.BottomSide]: {
            method: BottomSideConstructionMethod | null;
            area: {
                Default: () => number | undefined;
                Custom: () => number | undefined;
                chosen: DefaultCustom;
                _customValue: number | null;
            };
            installationYearIfDifferentThanConstructionYear: {
                Default: () => number | undefined;
                Custom: () => number | undefined;
                chosen: DefaultCustom;
                _customValue: number | null;
            };
            basement: HeatedUnheated | undefined | null;
            targetedStandard: InsulationStandard | null;
            thermalTransmissionCoefficient: {
                Default: () => number | undefined;
                Custom: () => number | undefined;
                _customValue: number | null;
                chosen: DefaultCustom;
            };
            insulationType: InsulationType | null;
            lambda: {
                Default: () => number | undefined;
                Custom: () => number | undefined;
                chosen: DefaultCustom;
                _customValue: number | null;
            };
            insulationThickness: () => number | undefined;
        };
    };
    building_TransmissionHeatLoss_Q_T_ForConstructionPart_AfterInsulation: (
        constructionPartName: ConstructionPart,
    ) => number | undefined;
    building_TransmissionHeatLoss_Q_T_AfterInsulation: () => number | undefined;
    building_HeatingLoad_Q_H_AfterInsulation: () => number | undefined;
    building_HeatingDemand_Q_W_AfterInsulation_BasedOn_Q_H_AfterInsulation: () => number | undefined;
    building_HeatingDemand_Q_W_Savings_AfterInsulation: () => number | undefined;
    building_HeatingDemand_Q_W_Fuel_AfterInsulation: () => number | undefined;
    building_HeatingDemand_Q_W_Fuel_Savings_AfterInsulation: () => number | undefined;
    building_HeatingDemand_Q_W_WP_AfterInsulation: () => number | undefined;
    building_HeatingDemand_Q_W_WP_Savings_AfterInsulation: () => number | undefined;
    building_HeatPump_CoverageRatio_AfterInsulation: () => number | undefined;
    building_FinalEnergyDemand_Q_E_AfterInsulation: () => number | undefined;
    building_SpezificFinalEnergyDemand_Q_E_Spez_AfterInsulation: () => number | undefined;
    building_HeatPump_Electricity_AfterInsulation: () => number | undefined;
    building_ElectricityUsage_AfterInsulation: () => number | undefined;
    building_CO2Emissions_Fuel_AfterInsulation: () => number | undefined;
    building_CO2Emissions_Electricity_AfterInsulation: () => number | undefined;
    building_CO2Emissions_AfterInsulation: () => number | undefined;
    building_CO2Emissions_Savings_AfterInsulation: () => number | undefined;
    // -- END OF PART 2
    // START OF PART 3
    building_HeatingDemand_Q_W_BeforeTechnology: () => number | undefined;
    building_HeatingLoad_Q_H_BeforeTechnology: () => number | undefined;

    // START PHOTOVOLTAIC
    building_Photovoltaic: {
        alreadyHasPhotovoltaic: boolean;
        wantsPhotovoltaic: boolean;
        usableRoofAreaIfDifferentThanRoofArea: {
            Default: () => number | undefined;
            Custom: () => number | undefined;
            chosen: DefaultCustom;
            _customValue: number | null;
        };
        roofYearOfRenovationIfDifferentThanYearOfConstruction: number | null;
        numberOfModules: () => number | undefined;
        usedAreaForModules: () => number | undefined;
        kiloWattPeakOfModules: () => number | undefined;
        kiloWattHoursPerYear: () => number | undefined;

        // additionalYearlyEnergyUsage: () => number | undefined;
        // bigElectricalConsumer: {
        //     [key in BigElectricalConsumer]: {
        //         inUse: boolean;
        //         value: {
        //             Default: () => number | undefined;
        //             Custom: () => number;
        //             chosen: "Default" | "Custom";
        //             _customValue: number;
        //         };
        //         electricity: () => number | undefined;
        //     };
        // };
        degreeOfSelfSufficiency: () => number | undefined;
        gridFeedIn: () => number | undefined;
        gridUsage: () => number | undefined;
    };
    // -- END PHOTOVOLTAIC
    // START VENTILATION
    building_Ventilation_Final: {
        // numberOfDevices: ()=>number| undefined;
        // building_AirVolumeFLow_V_Dot
        qWDifferenceBecauseWRG: () => number | undefined;
        //  building_VentilationHeatLoss_Q_L_WithoutWRG - building_VentilationHeatLoss_Q_L_WithWRG
        co2EmissionsDifferenceOnlyBecauseWRG: () => number | undefined;
        airExchangeRate: {
            Default: () => number;
            Custom: () => number | undefined;
            chosen: DefaultCustom;
            _customValue: number | null;
        };
        wrgEfficiency: {
            Default: () => number;
            Custom: () => number | undefined;
            chosen: DefaultCustom;
            _customValue: number | null;
        }; // wird im Step beschränkt

        airVolumeFlow_V_Dot_AfterTechnology: () => number | undefined;
    };
    building_VentilationHeatLoss_Q_L_WithoutWRG_AfterTechnology: () => number | undefined;
    building_VentilationHeatLoss_Q_L_WithWRG_AfterTechnology: () => number | undefined;
    // -- END VENTILATION
    // START NEW ENERGY SOURCE
    building_ExistingDistributionSystem: ExistingDistributionSystem | null;
    building_ExistingDistributionSystemFlowTemperature: {
        Default: () => number | undefined;
        Custom: () => number | undefined;
        chosen: DefaultCustom;
        _customValue: number | null;
    };
    building_ExistingDistributionSystemCustomReturnTemperature: number;

    building_Technology_PreviousCO2Emissions: () => number | undefined;

    building_ExistingHeatGenerator: ExistingHeatGenerator | null; // TODO eigentlich falsch hier und gehört nach oben verschoben (wird in S05 genutzt)

    building_NewHeatGenerator: NewHeatGenerator | null;
    building_NewHeatPump_CoverageRatio: {
        Default: () => number;
        Custom: () => number | undefined;
        chosen: DefaultCustom;
        _customValue: number | null;
    };
    building_NewHeatPumpType: HeatPumpType | null;
    building_NewHeatPump_JAZ: {
        Default: () => number | undefined;
        Custom: () => number | undefined;
        chosen: DefaultCustom;
        _customValue: number | null;
    };
    building_RestrictionsHeatPump: {
        restrictions: {
            brinewater: {
                [key in RestrictionsHeatPumpBrineWater]: boolean;
            };
            waterwater: {
                [key in RestrictionsHeatPumpWaterWater]: boolean;
            };
        };
    };
    building_HeatingDemand_Q_W_WP_AfterTechnology: () => number | undefined;
    building_NewHeatPump_Electricity: () => number | undefined;
    building_SecondNewHeatGenerator: SecondNewHeatGenerator | null;
    // building_NewHeatGeneratorModeOfOperation: ModeOfOperation | null;
    // START BRENNSTOFFHEIZUNG
    building_NewHeatGeneratorFuelHeating: NewHeatGeneratorFuelHeating | null;
    building_bioFuelStorage: () => number | undefined;
    // -- END BRENNSTOFFHEIZUNG
    building_HeatingDemand_Q_W_AfterTechnology: () => number | undefined;
    building_ElectricityUsage_AfterTechnology: () => number | undefined;
    building_ElectricityFromGrid_AfterTechnology: () => number | undefined;
    building_CO2Emissions_Fuel_AfterTechnology: () => number | undefined;
    building_CO2Emissions_Electricity_AfterTechnology: () => number | undefined;
    building_CO2Emissions_AfterTechnology: () => number | undefined;
    // -- END NEW ENERGY SOURCE

    building_PostalCode: string | null;
    email: {
        deliveryConsent: boolean;
        address: string | null;
    };
};

const initialState: StateCreator<VariableStore> = (_set, get) => ({
    building_Dimensions: {
        depth: null,
        width: null,
        roomHeight: null,
        numberOfLevels: null,
        area: {
            Default: () => {
                const depth = get().building_Dimensions.depth;
                const width = get().building_Dimensions.width;
                const numberOfLevels = get().building_Dimensions.numberOfLevels;
                if (depth === null || width === null || numberOfLevels === null) return undefined;
                return depth * width * numberOfLevels;
            },
            Custom: () => get().building_Dimensions.area._customValue ?? undefined,
            _customValue: null,
            chosen: DefaultCustom.Default,
        },
        volume: {
            Default: () => {
                const areaObj = get().building_Dimensions.area;
                const area = areaObj[areaObj.chosen]();
                const roomHeight = get().building_Dimensions.roomHeight;
                if (roomHeight === null || area === undefined) return undefined;
                return area * roomHeight;
            },
            Custom: () => get().building_Dimensions.volume._customValue ?? undefined,
            _customValue: null,
            chosen: DefaultCustom.Default,
        },
        // outterArea: () => {
        //     const sideA = get().building_Dimensions.length() * get().building_Dimensions.roomheight();
        //     const sideB = get().building_Dimensions.width() * get().building_Dimensions.roomheight();
        //     return 2 * (sideA + sideB); // + Dachfläche und Dachstuhlfläche
        // },
    },
    building_Type: null,
    building_YearOfConstruction: null,
    building_NumberOfResidents: null,
    building_UtilizedHours: {
        Default: () => {
            const buildingType = get().building_Type;
            if (buildingType === null) return undefined;
            return getUtilizedHours(buildingType);
        },
        Custom: () => get().building_UtilizedHours._customValue ?? undefined,
        chosen: DefaultCustom.Default,
        _customValue: null,
    },
    building_Ventilation: {
        airExchangeRate: {
            _customValue: null,
            Default: () => 2,
            Custom: () => get().building_Ventilation.airExchangeRate._customValue ?? undefined,
            chosen: DefaultCustom.Default,
        },
        alreadyHasVentilationSystem: false, // TODO finde ich komisch
        volumeIfDifferentThanBuildingVolume: {
            Default: () => {
                const volumeObj = get().building_Dimensions.volume;
                return volumeObj[volumeObj.chosen]();
            },
            Custom: () => get().building_Ventilation.volumeIfDifferentThanBuildingVolume._customValue ?? undefined,
            _customValue: null,
            chosen: DefaultCustom.Default,
        },
        usesWRG: false,
        efficiencyinPercent: {
            _customValue: null,
            Default: () => 75,
            Custom: () => get().building_Ventilation.efficiencyinPercent._customValue ?? undefined,
            chosen: DefaultCustom.Default,
        },
    },
    building_TransmissionHeatLoss_Q_T_ForConstructionPart_AfterGeneralData: (
        constructionPartName: ConstructionPart,
    ) => {
        const constructionPart = get().building_ConstructionParts[constructionPartName];
        const areaOfComponentObj = constructionPart.area;
        const areaOfComponent = areaOfComponentObj[areaOfComponentObj.chosen]();
        const constructionMethod = constructionPart.method;
        const yearOfConstruction = get().building_YearOfConstruction;
        if (constructionMethod === null || yearOfConstruction === null) return undefined;
        const installationYear =
            constructionPart.installationYearIfDifferentThanConstructionYear[
                constructionPart.installationYearIfDifferentThanConstructionYear.chosen
            ]();
        if (installationYear === undefined) return undefined;
        const coefficient = getHeatTransferCoefficient(installationYear, constructionMethod);
        if (coefficient === undefined || areaOfComponent === undefined) return undefined;
        return (
            (areaOfComponent /* m^2 */ * coefficient /* W/((m^2)*K) */ * 28) /* °C bzw. K */ /
            1000 /* damit kW rauskommt und nicht W */
        );
    },
    building_TransmissionHeatLoss_Q_T_AfterGeneralData: () => {
        // kW
        const values = Object.values(ConstructionPart).map((constructionPartName) =>
            get().building_TransmissionHeatLoss_Q_T_ForConstructionPart_AfterGeneralData(constructionPartName),
        );
        if (values.includes(undefined)) return undefined;
        return values.reduce((accumulator, currentValue) => {
            if (accumulator === undefined && currentValue === undefined) return 0;
            else if (accumulator === undefined) return currentValue;
            else if (currentValue === undefined) return accumulator;
            else return accumulator + currentValue;
        });
    },
    building_AirVolumeFLow_V_Dot_AfterGeneralData: () => {
        // (m^3)/h

        // const baseArea /* m^2 */ = get().building_Dimensions.width() * get().building_Dimensions.length();
        // const roomHeight /* m */ = get().building_Dimensions.roomheight();
        const alreadyHasVentilationSystem = get().building_Ventilation.alreadyHasVentilationSystem;
        const volumeBuildingObj = get().building_Ventilation.volumeIfDifferentThanBuildingVolume;
        const volumeBuilding /* m^3 */ = volumeBuildingObj[volumeBuildingObj.chosen]();
        if (volumeBuilding === undefined) return undefined;
        const volumeDifferentObj = get().building_Ventilation.volumeIfDifferentThanBuildingVolume;
        const volumeDifferent /* m^3 */ = volumeDifferentObj[volumeDifferentObj.chosen]();
        if (volumeDifferent === undefined) return undefined;
        const flowObj = get().building_Ventilation.airExchangeRate;
        const flow = flowObj[flowObj.chosen]();
        if (flow === undefined) return undefined;
        return (alreadyHasVentilationSystem ? volumeDifferent : volumeBuilding) / flow; /* h^(-1) */ // oder auch "/2h"
    },
    building_VentilationHeatLoss_Q_L_WithoutWRG_AfterGeneralData: () => {
        // kW
        const airVolumeFlow = get().building_AirVolumeFLow_V_Dot_AfterGeneralData();
        // const specificThermalCapacity /* J/(kg*K) =  */ = 1010;
        // const airDensity /* kg/m^3 =  */ = 1.21;
        // const together /* ungefähr 0.34 (W*h)/((m^3)*K) */ =
        //     (specificThermalCapacity /* J/(kg*K) */ * airDensity) /* kg/m^3 =  */ / 60 / 60;
        if (airVolumeFlow != undefined) {
            return (
                (airVolumeFlow * 0.34 /* ungefähr `together` */ * 28) /* K */ /
                1000 /* damit kW rauskommt und nicht W */
            );
        }
    },
    building_VentilationHeatLoss_Q_L_WithWRG_AfterGeneralData: () => {
        // kW
        const q_L_WithoutWRG = get().building_VentilationHeatLoss_Q_L_WithoutWRG_AfterGeneralData();
        const wrgEfficiencyObj = get().building_Ventilation.efficiencyinPercent;
        const wrgEfficiency = wrgEfficiencyObj[wrgEfficiencyObj.chosen]();
        if (q_L_WithoutWRG === undefined || wrgEfficiency == undefined) return undefined;
        return q_L_WithoutWRG * ((100 - wrgEfficiency) / 100);
    },
    building_VentilationHeatLoss_Q_L_AfterGeneralData: () => {
        // kW
        const qLWO = get().building_VentilationHeatLoss_Q_L_WithoutWRG_AfterGeneralData();
        const qLW = get().building_VentilationHeatLoss_Q_L_WithWRG_AfterGeneralData();
        const usesWRG = get().building_Ventilation.usesWRG;
        if (qLWO === undefined || qLW === undefined) return undefined;
        return usesWRG ? qLW : qLWO;
    },
    building_VentilationHeatLoss_Q_L_Savings_AfterGeneralData: () => {
        // kW
        const qLWO = get().building_VentilationHeatLoss_Q_L_WithoutWRG_AfterGeneralData();
        const qLW = get().building_VentilationHeatLoss_Q_L_WithWRG_AfterGeneralData();
        const usesWRG = get().building_Ventilation.usesWRG;
        if (qLWO === undefined || qLW === undefined) return undefined;
        return usesWRG ? qLWO - qLW : 0;
    },
    building_HeatingLoad_Q_H_BasedOnTransmissionHeatLossAndVentilationHeatLoss_AfterGeneralData: () => {
        // kW
        const qT = get().building_TransmissionHeatLoss_Q_T_AfterGeneralData();
        const qL = get().building_VentilationHeatLoss_Q_L_AfterGeneralData();
        if (qT === undefined || qL === undefined) return undefined;
        return qT + qL;
    },
    building_HeatingLoad_Q_H_BasedOnHeatingDemand_AfterGeneralData: () => {
        // kW
        const heatingDemandObj = get().building_HeatingDemand_Q_W_AfterGeneralData;
        const usedHeatingDemand = heatingDemandObj[heatingDemandObj.chosen]();
        if (usedHeatingDemand === undefined) return undefined;
        const utilizedHoursObj = get().building_UtilizedHours;
        const utilizedHours = utilizedHoursObj[utilizedHoursObj.chosen]();
        if (utilizedHours === undefined) return undefined;
        return usedHeatingDemand / utilizedHours;
    },
    building_HeatingLoad_Q_H_AfterGeneralData: {
        // kW
        _customValue: null,
        Default: () => {
            const chosen = get().building_FinalEnergyDemand_BasedOn;
            switch (chosen) {
                case FinalEnergyDemand_Q_E_Calculation.BasedOnHeatingDemand:
                    return get().building_HeatingLoad_Q_H_BasedOnHeatingDemand_AfterGeneralData();
                case FinalEnergyDemand_Q_E_Calculation.BasedOnHeatingLoad:
                    return get().building_HeatingLoad_Q_H_BasedOnTransmissionHeatLossAndVentilationHeatLoss_AfterGeneralData();
                default:
                    return undefined;
            }
        },
        Custom: () => get().building_HeatingLoad_Q_H_AfterGeneralData._customValue ?? undefined,
        chosen: DefaultCustom.Default,
    },
    building_PreviousYearFuelConsumption: {
        [FuelType.OilLight]: null,
        [FuelType.OilHeavy]: null,
        [FuelType.GasL]: null,
        [FuelType.GasH]: null,
        [FuelType.WoodPellets]: null,
        [FuelType.WoodLogs]: null,
        [FuelType.WoodChips]: null,
        type: null,
    },
    building_ConsumptionTechnology: null,
    building_HeatingDemand_Q_W_Fuel_AfterGeneralData: () => {
        // kWh/a
        const qWObj = get().building_HeatingDemand_Q_W_AfterGeneralData;
        const qW = qWObj[qWObj.chosen]();
        if (qW === undefined) return undefined;
        const usesHeatpump = get().building_HeatPumpType !== null;
        const ratio = usesHeatpump ? get().building_HeatPump_CoverageRatioInPercent_AfterGeneralData : 0;
        return qW * ((100 - ratio) / 100);
    },
    building_HeatingDemand_Q_W_WP_AfterGeneralData: () => {
        // kWh/a
        const qWObj = get().building_HeatingDemand_Q_W_AfterGeneralData;
        const qW = qWObj[qWObj.chosen]();
        if (qW === undefined) return undefined;
        const usesHeatpump = get().building_HeatPumpType !== null;
        const ratio = usesHeatpump ? get().building_HeatPump_CoverageRatioInPercent_AfterGeneralData : 0;
        return qW * (ratio / 100);
    },
    building_HeatPumpType: null,
    building_HeatPump_CoverageRatioInPercent_AfterGeneralData: 0,
    building_HeatingDemand_Q_W_BasedOnPreviousYearFuelConsumption_AfterGeneralData: () => {
        // kWh/a
        // Fuel
        const fuelObj = get().building_PreviousYearFuelConsumption;
        const consumptionTechnology = get().building_ConsumptionTechnology;
        if (fuelObj.type === null || consumptionTechnology === null) return undefined;
        const usedTypeValue = fuelObj[fuelObj.type];
        if (usedTypeValue === null) return undefined;
        const qWFuel = usedTypeValue * getEnergyForOneUnitInKWh(fuelObj.type, consumptionTechnology);
        if (qWFuel === undefined) return undefined;
        // evtl. WW
        const wwOrigin = get().building_WarmWaterOrigin;
        const qWWObj = get().building_WarmWaterDemand_Q_WW;
        const qWW = qWWObj[qWWObj.chosen]();
        if (wwOrigin === null || qWW === undefined) return undefined;
        // const ammountForWWInFuel = wwOrigin === WarmWaterOrigin.Inclusive ? qWW : 0;
        // WP
        const usesHeatpump = get().building_HeatPumpType !== null;
        const ratio = usesHeatpump ? get().building_HeatPump_CoverageRatioInPercent_AfterGeneralData : 0;
        const qWWP = ratio === 0 ? 0 : qWFuel / ((100 - ratio) / 100) - qWFuel;

        if (qWFuel === undefined || qWWP === undefined) return undefined;
        return qWFuel /* - ammountForWWInFuel */ + qWWP; // TODO Wärmerückgewinnung rausrechnen
    },
    building_HeatingDemand_Q_W_BasedOnHeatingLoad_AfterGeneralData: () => {
        // kWh/a
        const heatingLoadObj = get().building_HeatingLoad_Q_H_AfterGeneralData;
        const usedHeatingLoad = heatingLoadObj[heatingLoadObj.chosen]();
        if (usedHeatingLoad === undefined) return undefined;
        const utilizedHoursObj = get().building_UtilizedHours;
        const utilizedHours = utilizedHoursObj[utilizedHoursObj.chosen]();
        if (utilizedHours === undefined) return undefined;
        return usedHeatingLoad * utilizedHours;
    },
    building_HeatingDemand_Q_W_AfterGeneralData: {
        // kWh/a
        _customValue: null,
        Default: () => {
            const chosen = get().building_FinalEnergyDemand_BasedOn;
            switch (chosen) {
                case FinalEnergyDemand_Q_E_Calculation.BasedOnHeatingDemand:
                    return get().building_HeatingDemand_Q_W_BasedOnPreviousYearFuelConsumption_AfterGeneralData();
                case FinalEnergyDemand_Q_E_Calculation.BasedOnHeatingLoad:
                    return get().building_HeatingDemand_Q_W_BasedOnHeatingLoad_AfterGeneralData();
                default:
                    return undefined;
            }
        },
        Custom: () => get().building_HeatingDemand_Q_W_AfterGeneralData._customValue ?? undefined,
        chosen: DefaultCustom.Default, // ist dann aus einem enum "BasedOnYear" | "BasedOnArea" | "BasedObHeatingLoad" | "Custom"
    },
    building_WarmWaterDemand_Q_WW_HeatingDemand: () => {
        // kWh/a
        const areaObj = get().building_Dimensions.area;
        const heatedArea = areaObj[areaObj.chosen]();
        if (heatedArea === undefined) return undefined;

        return 12.5 /* (kW*h)/((m^2)*a) */ * heatedArea /* m^2 */;
    },
    building_WarmWaterDemand_Q_WW_HeatingLoad: () => {
        // kWh/a
        const residents = get().building_NumberOfResidents;
        if (residents === null) return undefined;
        const utilizedHoursObj = get().building_UtilizedHours;
        const utilizedHours = utilizedHoursObj[utilizedHoursObj.chosen]();
        if (utilizedHours === undefined) return undefined;
        return 0.25 /* kW */ * residents * utilizedHours;
    },
    building_WarmWaterDemand_Q_WW: {
        // TODO irgendwas müsste hier wahrscheinlich gemacht werden.
        // Der Custom Wert kann die Einheit kW oder (kW*h)/a haben.
        // Theoretisch kann die Einheit nur aus dem Kontext der
        // anderen ausgewählten Rechnungen geschlossen werden.
        _customValue: null,
        Default: () => {
            const chosen = get().building_FinalEnergyDemand_BasedOn;
            switch (chosen) {
                case FinalEnergyDemand_Q_E_Calculation.BasedOnHeatingDemand:
                    return get().building_WarmWaterDemand_Q_WW_HeatingDemand();
                case FinalEnergyDemand_Q_E_Calculation.BasedOnHeatingLoad:
                    return get().building_WarmWaterDemand_Q_WW_HeatingLoad();
                default:
                    return undefined;
            }
        },
        Custom: () => get().building_WarmWaterDemand_Q_WW._customValue ?? undefined,
        chosen: DefaultCustom.Default,
    },
    building_WarmWaterOrigin: null,
    building_FinalEnergyDemand_BasedOn: null,
    building_FinalEnergyDemand_Q_E_AfterGeneralData: () => {
        // kWh/a
        const warmWaterOrigin = get().building_WarmWaterOrigin;
        const needsExtraWarmWater = warmWaterOrigin === WarmWaterOrigin.Exclusive; //TODO keine ahnung ob das so stimmt nur mit der einen origin
        const warmWaterObj = get().building_WarmWaterDemand_Q_WW;
        const warmWater = needsExtraWarmWater ? warmWaterObj[warmWaterObj.chosen]() : 0;
        const buildingType = get().building_Type;
        if (buildingType === null) return undefined;
        // const qLSavings = get().building_VentilationHeatLoss_Q_L_Savings_AfterGeneralData() ?? 0;
        if (warmWater === undefined) return undefined;
        const basedOn = get().building_FinalEnergyDemand_BasedOn;
        const utilizedHoursObj = get().building_UtilizedHours;
        const utilizedHours = utilizedHoursObj[utilizedHoursObj.chosen]();
        if (utilizedHours === undefined) return undefined;
        switch (basedOn) {
            case FinalEnergyDemand_Q_E_Calculation.BasedOnHeatingDemand: {
                const heatingDemandObj = get().building_HeatingDemand_Q_W_AfterGeneralData;
                const heatingDemand = heatingDemandObj[heatingDemandObj.chosen]();
                if (heatingDemand === undefined) return undefined;
                return heatingDemand + warmWater /* - qLSavings * utilizedHours */;
            }
            case FinalEnergyDemand_Q_E_Calculation.BasedOnHeatingLoad: {
                const heatingLoadObj = get().building_HeatingLoad_Q_H_AfterGeneralData;
                const heatingLoad = heatingLoadObj[heatingLoadObj.chosen]();
                if (heatingLoad === undefined) return undefined;
                return heatingLoad /* - qLSavings */ * utilizedHours + warmWater;
            }
            default:
                return undefined;
        }
    },
    building_SpezificFinalEnergyDemand_Q_E_Spez_AfterGeneralData: () => {
        // kWh/((m^2)*K)
        const finalEnergyDemand = get().building_FinalEnergyDemand_Q_E_AfterGeneralData();
        const heatedAreaObj = get().building_Dimensions.area;
        const heatedArea = heatedAreaObj[heatedAreaObj.chosen]();
        if (finalEnergyDemand === undefined || heatedArea === undefined || heatedArea === 0) return undefined;
        return finalEnergyDemand / heatedArea;
    },
    building_YearlyEnergyUsage: {
        _customValue: null,
        Default: () => {
            const buildingType = get().building_Type;
            if (buildingType === null) return undefined;
            const persons = get().building_NumberOfResidents;
            if (persons === null) return undefined;
            const usesElectricalWaterHeating = get().building_WarmWaterOrigin === WarmWaterOrigin.Decentralized; // TODO einfach nur hingeklatscht, damit der error nicht mehr ist
            const averageYearlyEnergyUsage = getAverageYearlyEnergyUsageWithAndWithout(buildingType, persons);
            if (usesElectricalWaterHeating) return averageYearlyEnergyUsage.with;
            else return averageYearlyEnergyUsage.without;
        },
        Custom: () => {
            return get().building_YearlyEnergyUsage._customValue ?? undefined;
        },
        chosen: DefaultCustom.Default,
    },
    building_ElectricCar: {
        value: {
            _customValue: null,
            Default: () => 15000,
            Custom: () => get().building_ElectricCar.value._customValue ?? undefined,
            chosen: DefaultCustom.Default,
        }, // km/a
        isUsed: false,
        valueToElectricity: () => {
            // kWh/a
            const valueObj = get().building_ElectricCar.value;
            const value = get().building_ElectricCar.value[valueObj.chosen]();
            if (value === undefined) return undefined;
            return value * (15 /* kWh */ / 100) /* km */;
        },
    },
    building_HeatPump_JAZ: {
        _customValue: null,
        Default: () => {
            const heatPumpType = get().building_HeatPumpType;
            if (heatPumpType === null || heatPumpType === undefined) return undefined;
            const jaz = getJAZ(heatPumpType);
            return jaz;
        },
        Custom: () => {
            return get().building_HeatPump_JAZ._customValue ?? undefined;
        },
        chosen: DefaultCustom.Default,
    },
    building_Basic_Electricity: () => {
        const basicEnergyObj = get().building_YearlyEnergyUsage;
        return basicEnergyObj[basicEnergyObj.chosen]();
    },
    building_ElectricCar_Electricity: () => {
        const carObj = get().building_ElectricCar;
        if (!carObj.isUsed) return undefined;
        return carObj.valueToElectricity();
    },

    building_HeatPump_Electricity: () => {
        // kWh/a
        const jazObj = get().building_HeatPump_JAZ;
        const jaz = jazObj[jazObj.chosen]();
        const ratio = get().building_HeatPump_CoverageRatioInPercent_AfterGeneralData;
        const qWObj = get().building_HeatingDemand_Q_W_AfterGeneralData;
        const type = get().building_HeatPumpType;
        const qW = qWObj[qWObj.chosen]();
        if (jaz === undefined || qW === undefined || type === null) return undefined;
        return ((ratio / 100) * qW) / jaz;
    },
    building_ElectricityUsage: () => {
        // kWh/a
        const basicEnergy = get().building_Basic_Electricity();
        const carEnergy = get().building_ElectricCar_Electricity() ?? 0;
        const heatPumpEnergy = get().building_HeatPump_Electricity() ?? 0;
        if (basicEnergy === undefined) return undefined;
        return basicEnergy + carEnergy + heatPumpEnergy;
    },
    building_CO2Emissions_Fuel_AfterGeneralData: () => {
        // g/a
        const ratio =
            get().building_HeatPumpType === null ? 0 : get().building_HeatPump_CoverageRatioInPercent_AfterGeneralData;
        const qWObj = get().building_HeatingDemand_Q_W_AfterGeneralData;
        const qW = qWObj[qWObj.chosen]();
        const heatGenerator = get().building_ExistingHeatGenerator;
        if (qW === undefined || heatGenerator === null) return undefined;
        const energycarrier = mapExistingHeatGeneratorToEnergyCarrier(heatGenerator);
        const equivalentFuel = getCO2EmissionFactor(energycarrier).co2Equivalent;

        return qW * ((100 - ratio) / 100) * equivalentFuel;
    },
    building_CO2Emissions_Electricity_AfterGeneralData: () => {
        // g/a
        const electricity = get().building_ElectricityUsage();
        const equivalentElectricity = getCO2EmissionFactor(EnergyCarrier.EnergyFromGrid).co2Equivalent;
        if (electricity === undefined) return undefined;
        return electricity * equivalentElectricity;
    },
    building_CO2Emissions_AfterGeneralData: () => {
        // g/a
        const fuelEmission = get().building_CO2Emissions_Fuel_AfterGeneralData();
        const electricityEmission = get().building_CO2Emissions_Electricity_AfterGeneralData();
        if (fuelEmission === undefined || electricityEmission === undefined) return undefined;
        return fuelEmission + electricityEmission;
    },
    // building_HeatingLoadReduction_Q_H_Einsparung_AfterGeneralData
    // building_HeatingLoadReduction_Q_H_Einsparung_AfterGeneralData: () => {
    //     // kW
    //     const values = Object.values(ConstructionPart).map((constructionPartName) => {
    //         const constructionPart = get().building_ConstructionParts[constructionPartName];
    //         const areaOfComponentObj = constructionPart.area;
    //         const areaOfComponent = areaOfComponentObj[areaOfComponentObj.chosen]();
    //         const constructionMethod = constructionPart.method;
    //         const yearOfConstruction = get().building_YearOfConstruction;
    //         if (constructionMethod === null || yearOfConstruction == null) return undefined;
    //         const yearOfInstallation =
    //             constructionPart.installationYearIfDifferentThanConstructionYear ?? yearOfConstruction;
    //         const coefficientNew = getHeatTransferCoefficient(yearOfInstallation, constructionMethod);
    //         const coefficientOld = getHeatTransferCoefficient(yearOfConstruction, constructionMethod);
    //         if (
    //             coefficientNew === undefined ||
    //             coefficientOld === undefined ||
    //             areaOfComponent === undefined ||
    //             yearOfConstruction === yearOfInstallation
    //             //TODO edgecase wenn person sanierungen einträgt, aber dann sich über Q_W alles ausgibt (also über die brennstoffe) -> trotzdem einsparungen angezeigt, weil nicht === undefined
    //         )
    //             return undefined;
    //         return (
    //             (areaOfComponent /* m^2 */ * (coefficientOld - coefficientNew) /* W/((m^2)*K) */ * 28) /* °C bzw. K */ /
    //             1000 /* damit kW rauskommt und nicht W */
    //         );
    //     });
    //     if (values.includes(undefined)) return undefined;
    //     return values.reduce((accumulator, currentValue) => {
    //         if (accumulator === undefined && currentValue === undefined) return 0;
    //         else if (accumulator === undefined) return currentValue;
    //         else if (currentValue === undefined) return accumulator;
    //         else return accumulator + currentValue;
    //     });
    // },
    // building_HeatingDemandReduction_Q_W_Einsparung_AfterGeneralData: () => {
    //     const buildingType = get().building_Type;
    //     const qHEinsparung = get().building_HeatingLoadReduction_Q_H_Einsparung_AfterGeneralData();
    //     if (qHEinsparung === undefined || buildingType === null) return undefined;
    //     const usedHours = getUtilizedHours(buildingType);
    //     return qHEinsparung * usedHours;
    // },

    building_ConstructionParts: {
        [ConstructionPart.TopSide]: {
            angledOrFlat: null,
            type: null, // nur hier
            method: null,
            area: {
                _customValue: null,
                Default: () => {
                    const buildingType = get().building_Type;
                    if (buildingType === null) return undefined;
                    const areaObj = get().building_Dimensions.area;
                    const buildingArea = areaObj[areaObj.chosen]();
                    if (buildingArea === undefined) return undefined;
                    return buildingArea * getPercentageOfOuterShell(buildingType, ConstructionPart.TopSide);
                },
                Custom: () => get().building_ConstructionParts[ConstructionPart.TopSide].area._customValue ?? undefined,
                chosen: DefaultCustom.Default,
            },
            installationYearIfDifferentThanConstructionYear: {
                Default: () => get().building_YearOfConstruction ?? undefined,
                Custom: () =>
                    get().building_ConstructionParts[ConstructionPart.TopSide]
                        .installationYearIfDifferentThanConstructionYear._customValue ?? undefined,
                _customValue: null,
                chosen: DefaultCustom.Default,
            },
            // -- END OF PART1
            targetedStandard: null,
            thermalTransmissionCoefficient: {
                Default: () => {
                    const angled = getTargetedHeatTransferCoefficient(HeatTransferConstructionPart.AngledRoof);
                    const flat = getTargetedHeatTransferCoefficient(HeatTransferConstructionPart.FlatRoofOrTopCeiling);
                    const chosenStandard = get().building_ConstructionParts[ConstructionPart.TopSide].targetedStandard;
                    if (chosenStandard === null) return undefined;
                    if (get().building_ConstructionParts[ConstructionPart.TopSide].type === RoofType.PitchedRoof)
                        return angled[chosenStandard];
                    else return flat[chosenStandard];
                },
                Custom: () =>
                    get().building_ConstructionParts[ConstructionPart.TopSide].thermalTransmissionCoefficient
                        ._customValue ?? undefined,
                chosen: DefaultCustom.Default,
                _customValue: null,
            },
            insulationType: null,
            lambda: {
                Default: () => {
                    const thisConstructionPart = get().building_ConstructionParts[ConstructionPart.TopSide];
                    const insulationType = thisConstructionPart.insulationType;
                    if (insulationType === null) return undefined;
                    return getLambdaValue(insulationType);
                },
                Custom: () =>
                    get().building_ConstructionParts[ConstructionPart.TopSide].lambda._customValue ?? undefined,
                chosen: DefaultCustom.Default,
                _customValue: null,
            },
            insulationThickness: () => {
                const constructionYear = get().building_YearOfConstruction;
                if (constructionYear === null) return undefined;
                const thisConstructionPart = get().building_ConstructionParts[ConstructionPart.TopSide];
                const year =
                    thisConstructionPart.installationYearIfDifferentThanConstructionYear[
                        thisConstructionPart.installationYearIfDifferentThanConstructionYear.chosen
                    ]();
                if (year === undefined) return undefined;
                const constructionMethod = thisConstructionPart.method;
                if (constructionMethod === null) return undefined;
                const oldCoefficient = getHeatTransferCoefficient(year, constructionMethod);
                if (oldCoefficient === undefined) return undefined;
                const newCoefficient =
                    thisConstructionPart.thermalTransmissionCoefficient[
                        thisConstructionPart.thermalTransmissionCoefficient.chosen
                    ]();
                if (newCoefficient === undefined) return undefined;
                const lambdaValue = thisConstructionPart.lambda[thisConstructionPart.lambda.chosen]();
                if (lambdaValue === undefined) return undefined;
                return lambdaValue * (1 / newCoefficient - 1 / oldCoefficient) * 100;
            },
            usesAngledRoofAndNoFlatRoof: () => {
                const current = get().building_ConstructionParts[ConstructionPart.TopSide].method;
                return current === AngledRoofConstructionMethod.Solid || current === AngledRoofConstructionMethod.Wood;
            },
        },
        [ConstructionPart.OuterWall]: {
            method: null,
            area: {
                _customValue: null,
                Default: () => {
                    const buildingType = get().building_Type;
                    if (buildingType === null) return undefined;
                    const areaObj = get().building_Dimensions.area;
                    const buildingArea = areaObj[areaObj.chosen]();
                    if (buildingArea === undefined) return undefined;
                    return buildingArea * getPercentageOfOuterShell(buildingType, ConstructionPart.OuterWall);
                },
                Custom: () =>
                    get().building_ConstructionParts[ConstructionPart.OuterWall].area._customValue ?? undefined,
                chosen: DefaultCustom.Default,
            },
            installationYearIfDifferentThanConstructionYear: {
                Default: () => get().building_YearOfConstruction ?? undefined,
                Custom: () =>
                    get().building_ConstructionParts[ConstructionPart.OuterWall]
                        .installationYearIfDifferentThanConstructionYear._customValue ?? undefined,
                _customValue: null,
                chosen: DefaultCustom.Default,
            },
            // -- END OF PART1
            targetedStandard: null,
            thermalTransmissionCoefficient: {
                Default: () => {
                    const chosenStandard =
                        get().building_ConstructionParts[ConstructionPart.OuterWall].targetedStandard;
                    if (chosenStandard === null) return undefined;
                    return getTargetedHeatTransferCoefficient(HeatTransferConstructionPart.OuterWall)[chosenStandard];
                },
                Custom: () =>
                    get().building_ConstructionParts[ConstructionPart.OuterWall].thermalTransmissionCoefficient
                        ._customValue ?? undefined,
                chosen: DefaultCustom.Default,
                _customValue: null,
            },
            restrictions: {
                outside: {
                    [RestrictionsWallOutside.DistanceToStreetProblematic]: false,
                    [RestrictionsWallOutside.EnoughRoofOverhang]: false,
                    [RestrictionsWallOutside.MonumentalProtection]: false,
                },
                inside: {
                    [RestrictionsWallInside.MonumentalProtection]: false,
                    [RestrictionsWallInside.DistanceToHeatingElement]: false,
                    [RestrictionsWallInside.LivingAreaCouldGetToSmall]: false,
                },
            },
            insulationType: null,
            lambda: {
                Default: () => {
                    const thisConstructionPart = get().building_ConstructionParts[ConstructionPart.OuterWall];
                    const insulationType = thisConstructionPart.insulationType;
                    if (insulationType === null) return undefined;
                    return getLambdaValue(insulationType);
                },
                Custom: () =>
                    get().building_ConstructionParts[ConstructionPart.OuterWall].lambda._customValue ?? undefined,

                chosen: DefaultCustom.Default,
                _customValue: null,
            },
            insulationThickness: () => {
                const constructionYear = get().building_YearOfConstruction;
                if (constructionYear === null) return undefined;
                const thisConstructionPart = get().building_ConstructionParts[ConstructionPart.OuterWall];
                const year =
                    thisConstructionPart.installationYearIfDifferentThanConstructionYear[
                        thisConstructionPart.installationYearIfDifferentThanConstructionYear.chosen
                    ]();
                if (year === undefined) return undefined;
                const constructionMethod = thisConstructionPart.method;
                if (constructionMethod === null) return undefined;
                const oldCoefficient = getHeatTransferCoefficient(year, constructionMethod);
                if (oldCoefficient === undefined) return undefined;
                const newCoefficient =
                    thisConstructionPart.thermalTransmissionCoefficient[
                        thisConstructionPart.thermalTransmissionCoefficient.chosen
                    ]();
                if (newCoefficient === undefined) return undefined;
                const lambdaValue = thisConstructionPart.lambda[thisConstructionPart.lambda.chosen]();
                if (lambdaValue === undefined) return undefined;
                return lambdaValue * (1 / newCoefficient - 1 / oldCoefficient) * 100;
            },
        },
        [ConstructionPart.Window]: {
            method: null,
            area: {
                _customValue: null,
                Default: () => {
                    const buildingType = get().building_Type;
                    if (buildingType === null) return undefined;
                    const areaObj = get().building_Dimensions.area;
                    const buildingArea = areaObj[areaObj.chosen]();
                    if (buildingArea === undefined) return undefined;
                    return buildingArea * getPercentageOfOuterShell(buildingType, ConstructionPart.Window);
                },
                Custom: () => get().building_ConstructionParts[ConstructionPart.Window].area._customValue ?? undefined,
                chosen: DefaultCustom.Default,
            },
            installationYearIfDifferentThanConstructionYear: {
                Default: () => get().building_YearOfConstruction ?? undefined,
                Custom: () =>
                    get().building_ConstructionParts[ConstructionPart.Window]
                        .installationYearIfDifferentThanConstructionYear._customValue ?? undefined,
                _customValue: null,
                chosen: DefaultCustom.Default,
            },
            // -- END OF PART1
            targetedStandard: null,
            thermalTransmissionCoefficient: {
                Default: () => {
                    const chosenStandard = get().building_ConstructionParts[ConstructionPart.Window].targetedStandard;
                    if (chosenStandard === null) return undefined;
                    return getTargetedHeatTransferCoefficient(HeatTransferConstructionPart.Window)[chosenStandard];
                },
                Custom: () =>
                    get().building_ConstructionParts[ConstructionPart.Window].thermalTransmissionCoefficient
                        ._customValue ?? undefined,
                chosen: DefaultCustom.Default,
                _customValue: null,
            },
            sunProtectionExisting: null,
        },
        [ConstructionPart.BottomSide]: {
            method: null,
            area: {
                _customValue: null,
                Default: () => {
                    const buildingType = get().building_Type;
                    if (buildingType === null) return undefined;
                    const areaObj = get().building_Dimensions.area;
                    const buildingArea = areaObj[areaObj.chosen]();
                    if (buildingArea === undefined) return undefined;
                    return buildingArea * getPercentageOfOuterShell(buildingType, ConstructionPart.BottomSide);
                },
                Custom: () =>
                    get().building_ConstructionParts[ConstructionPart.BottomSide].area._customValue ?? undefined,
                chosen: DefaultCustom.Default,
            },
            installationYearIfDifferentThanConstructionYear: {
                Default: () => get().building_YearOfConstruction ?? undefined,
                Custom: () =>
                    get().building_ConstructionParts[ConstructionPart.BottomSide]
                        .installationYearIfDifferentThanConstructionYear._customValue ?? undefined,
                _customValue: null,
                chosen: DefaultCustom.Default,
            },
            // -- END OF PART1
            basement: undefined,
            targetedStandard: null,
            thermalTransmissionCoefficient: {
                Default: () => {
                    const chosenStandard =
                        get().building_ConstructionParts[ConstructionPart.BottomSide].targetedStandard;
                    if (chosenStandard === null) return undefined;
                    return getTargetedHeatTransferCoefficient(HeatTransferConstructionPart.BottomSide)[chosenStandard];
                },
                Custom: () =>
                    get().building_ConstructionParts[ConstructionPart.BottomSide].thermalTransmissionCoefficient
                        ._customValue ?? undefined,
                chosen: DefaultCustom.Default,
                _customValue: null,
            },
            insulationType: null,
            lambda: {
                Default: () => {
                    const thisConstructionPart = get().building_ConstructionParts[ConstructionPart.BottomSide];
                    const insulationType = thisConstructionPart.insulationType;
                    if (insulationType === null) return undefined;
                    return getLambdaValue(insulationType);
                },
                Custom: () =>
                    get().building_ConstructionParts[ConstructionPart.BottomSide].lambda._customValue ?? undefined,

                chosen: DefaultCustom.Default,
                _customValue: null,
            },
            insulationThickness: () => {
                const constructionYear = get().building_YearOfConstruction;
                if (constructionYear === null) return undefined;
                const thisConstructionPart = get().building_ConstructionParts[ConstructionPart.BottomSide];
                const year =
                    thisConstructionPart.installationYearIfDifferentThanConstructionYear[
                        thisConstructionPart.installationYearIfDifferentThanConstructionYear.chosen
                    ]();
                if (year === undefined) return undefined;
                const constructionMethod = thisConstructionPart.method;
                if (constructionMethod === null) return undefined;
                const oldCoefficient = getHeatTransferCoefficient(year, constructionMethod);
                if (oldCoefficient === undefined) return undefined;
                const newCoefficient =
                    thisConstructionPart.thermalTransmissionCoefficient[
                        thisConstructionPart.thermalTransmissionCoefficient.chosen
                    ]();
                if (newCoefficient === undefined) return undefined;
                const lambdaValue = thisConstructionPart.lambda[thisConstructionPart.lambda.chosen]();
                if (lambdaValue === undefined) return undefined;
                return lambdaValue * (1 / newCoefficient - 1 / oldCoefficient) * 100;
            },
        },
    },
    building_TransmissionHeatLoss_Q_T_ForConstructionPart_AfterInsulation: (constructionPartName: ConstructionPart) => {
        const constructionPart = get().building_ConstructionParts[constructionPartName];
        const areaOfComponentObj = constructionPart.area;
        const areaOfComponent = areaOfComponentObj[areaOfComponentObj.chosen]();
        const coefficient =
            constructionPart.thermalTransmissionCoefficient[constructionPart.thermalTransmissionCoefficient.chosen]();
        if (coefficient === undefined || areaOfComponent === undefined) return undefined;
        return (
            (areaOfComponent /* m^2 */ * coefficient /* W/((m^2)*K) */ * 28) /* °C bzw. K */ /
            1000 /* damit kW rauskommt und nicht W */
        );
    },
    building_TransmissionHeatLoss_Q_T_ForConstructionPart_Savings: (constructionPartName: ConstructionPart) => {
        const current =
            get().building_TransmissionHeatLoss_Q_T_ForConstructionPart_AfterGeneralData(constructionPartName);
        const future =
            get().building_TransmissionHeatLoss_Q_T_ForConstructionPart_AfterInsulation(constructionPartName);
        if (current === undefined || future === undefined) return undefined;
        return current - future;
    },
    building_TransmissionHeatLoss_Q_T_AfterInsulation: () => {
        // kW
        const oldValues = Object.values(ConstructionPart).map((constructionPartName) =>
            get().building_TransmissionHeatLoss_Q_T_ForConstructionPart_AfterGeneralData(constructionPartName),
        );
        const values = Object.values(ConstructionPart)
            .map((constructionPartName) =>
                get().building_TransmissionHeatLoss_Q_T_ForConstructionPart_AfterInsulation(constructionPartName),
            )
            .map((part, index) => part ?? oldValues[index]);
        return values.reduce((accumulator, currentValue) => {
            if (accumulator === undefined && currentValue === undefined) return 0;
            else if (accumulator === undefined) return currentValue;
            else if (currentValue === undefined) return accumulator;
            else return accumulator + currentValue;
        });
    },
    building_HeatingLoad_Q_H_AfterInsulation: () => {
        const qT = get().building_TransmissionHeatLoss_Q_T_AfterInsulation();
        const qL = get().building_VentilationHeatLoss_Q_L_AfterGeneralData();
        if (qT === undefined || qL === undefined) return undefined;
        return qT + qL;
    },
    building_HeatingDemand_Q_W_AfterInsulation_BasedOn_Q_H_AfterInsulation: () => {
        const buildingType = get().building_Type;
        const usedHeatingLoad = get().building_HeatingLoad_Q_H_AfterInsulation();
        const utilizedHoursObj = get().building_UtilizedHours;
        const utilizedHours = utilizedHoursObj[utilizedHoursObj.chosen]();
        if (buildingType === null || usedHeatingLoad === undefined || utilizedHours === undefined) return undefined;
        return usedHeatingLoad * utilizedHours;
    },
    // Q_W_DIFF
    building_HeatingDemand_Q_W_Savings_AfterInsulation: () => {
        const oldQWObj = get().building_HeatingDemand_Q_W_AfterGeneralData;
        const oldQW = oldQWObj[oldQWObj.chosen]();
        const newQW = get().building_HeatingDemand_Q_W_AfterInsulation_BasedOn_Q_H_AfterInsulation();
        if (oldQW === undefined || newQW === undefined) return undefined;
        return oldQW - newQW;
    },
    // QW brennstoff neu
    building_HeatingDemand_Q_W_Fuel_AfterInsulation: () => {
        const qWNew = get().building_HeatingDemand_Q_W_AfterInsulation_BasedOn_Q_H_AfterInsulation();
        const ratioNew = get().building_HeatPump_CoverageRatio_AfterInsulation();
        if (qWNew === undefined) return undefined;
        if (ratioNew === undefined) return qWNew;
        else return qWNew * (1 - ratioNew);
    },
    // QW brennstoff savings
    building_HeatingDemand_Q_W_Fuel_Savings_AfterInsulation: () => {
        const qWFuelCurrent = get().building_HeatingDemand_Q_W_Fuel_AfterGeneralData();
        const qWFuelNew = get().building_HeatingDemand_Q_W_Fuel_AfterInsulation();
        if (qWFuelCurrent == undefined || qWFuelNew === undefined) return undefined;
        else return qWFuelCurrent - qWFuelNew;
    },
    // QW WP neu
    building_HeatingDemand_Q_W_WP_AfterInsulation: () => {
        const qWNew = get().building_HeatingDemand_Q_W_AfterInsulation_BasedOn_Q_H_AfterInsulation();
        const ratioNew = get().building_HeatPump_CoverageRatio_AfterInsulation();
        if (qWNew === undefined || ratioNew === undefined) return undefined;
        return qWNew * ratioNew;
    },
    // QW WP savings
    building_HeatingDemand_Q_W_WP_Savings_AfterInsulation: () => {
        const qWWPCurrent = get().building_HeatingDemand_Q_W_WP_AfterGeneralData();
        const qWWPNew = get().building_HeatingDemand_Q_W_WP_AfterInsulation();
        if (qWWPCurrent === undefined || qWWPNew === undefined) return undefined;
        return qWWPCurrent - qWWPNew;
    },
    // neuer deckungsanteil von wärmepumpe (durch einsparung kann die wärmepumpe einen größeren anteil des bedarfs decken)
    building_HeatPump_CoverageRatio_AfterInsulation: () => {
        const qWNew = get().building_HeatingDemand_Q_W_AfterInsulation_BasedOn_Q_H_AfterInsulation();
        const qWWP = get().building_HeatingDemand_Q_W_WP_AfterGeneralData();
        if (qWNew === undefined || qWWP === undefined) return undefined;
        const result = qWWP / qWNew;
        // deckungsanteil kann maximal 100% sein
        return result > 1 ? 1 : result;
    },
    building_FinalEnergyDemand_Q_E_AfterInsulation: () => {
        // kWh/a
        const warmWaterOrigin = get().building_WarmWaterOrigin;
        const needsExtraWarmWater = warmWaterOrigin === WarmWaterOrigin.Exclusive; //TODO keine ahnung ob das so stimmt nur mit der einen origin
        const warmWaterObj = get().building_WarmWaterDemand_Q_WW;
        const warmWater = needsExtraWarmWater ? warmWaterObj[warmWaterObj.chosen]() : 0;
        const buildingType = get().building_Type;
        if (buildingType === null) return undefined;
        // const qLSavings = get().building_VentilationHeatLoss_Q_L_Savings_AfterGeneralData() ?? 0;
        if (warmWater === undefined) return undefined;
        const heatingDemand = get().building_HeatingDemand_Q_W_AfterInsulation_BasedOn_Q_H_AfterInsulation();
        const utilizedHoursObj = get().building_UtilizedHours;
        const utilizedHours = utilizedHoursObj[utilizedHoursObj.chosen]();
        if (heatingDemand === undefined || utilizedHours === undefined) return undefined;
        return heatingDemand + warmWater /* - qLSavings * utilizedHours */;
    },
    building_SpezificFinalEnergyDemand_Q_E_Spez_AfterInsulation: () => {
        // kWh/((m^2)*K)
        const finalEnergyDemand = get().building_FinalEnergyDemand_Q_E_AfterInsulation();
        const heatedAreaObj = get().building_Dimensions.area;
        const heatedArea = heatedAreaObj[heatedAreaObj.chosen]();
        if (finalEnergyDemand === undefined || heatedArea === undefined || heatedArea === 0) return undefined;
        return finalEnergyDemand / heatedArea;
    },
    // neuer wärmepumpe strombedarf
    building_HeatPump_Electricity_AfterInsulation: () => {
        const qWWPNew = get().building_HeatingDemand_Q_W_WP_AfterInsulation();
        const jazObj = get().building_HeatPump_JAZ;
        const jaz = jazObj[jazObj.chosen]();
        if (qWWPNew === undefined || jaz === undefined) return undefined;
        return qWWPNew / jaz;
    },
    // neuer Strombedarf (weil falls WP vorhanden)
    building_ElectricityUsage_AfterInsulation: () => {
        // kWh/a
        const basicEnergy = get().building_Basic_Electricity();
        const carEnergy = get().building_ElectricCar_Electricity() ?? 0;
        const heatPumpEnergy = get().building_HeatPump_Electricity_AfterInsulation() ?? 0;
        if (basicEnergy === undefined) return undefined;
        return basicEnergy + carEnergy + heatPumpEnergy;
    },
    // neuer CO2 Verbrauch
    building_CO2Emissions_Fuel_AfterInsulation: () => {
        // g/a
        const qwFuelNew = get().building_HeatingDemand_Q_W_Fuel_AfterInsulation();
        const heatGenerator = get().building_ExistingHeatGenerator;
        if (qwFuelNew === undefined || heatGenerator === null) return undefined;
        const energycarrier = mapExistingHeatGeneratorToEnergyCarrier(heatGenerator);
        const equivalentFuel = getCO2EmissionFactor(energycarrier).co2Equivalent;
        return qwFuelNew * equivalentFuel;
    },
    building_CO2Emissions_Electricity_AfterInsulation: () => {
        // g/a
        const electricity = get().building_ElectricityUsage_AfterInsulation();
        const equivalentElectricity = getCO2EmissionFactor(EnergyCarrier.EnergyFromGrid).co2Equivalent;
        if (electricity === undefined) return undefined;
        return electricity * equivalentElectricity;
    },
    building_CO2Emissions_AfterInsulation: () => {
        // g/a
        const fuelEmission = get().building_CO2Emissions_Fuel_AfterInsulation();
        const electricityEmission = get().building_CO2Emissions_Electricity_AfterInsulation();
        if (fuelEmission === undefined || electricityEmission === undefined) return undefined;
        return fuelEmission + electricityEmission;
    },
    // CO2 DIFF
    building_CO2Emissions_Savings_AfterInsulation: () => {
        // g/a
        const emissionsOld = get().building_CO2Emissions_AfterGeneralData();
        const emissionsNew = get().building_CO2Emissions_AfterInsulation();
        if (emissionsOld === undefined || emissionsNew === undefined) return undefined;
        return emissionsOld - emissionsNew;
    },
    // START OF PART 3
    building_HeatingDemand_Q_W_BeforeTechnology: () => {
        const basedOn = get().building_FinalEnergyDemand_BasedOn;
        const qW_GeneralDataObj = get().building_HeatingDemand_Q_W_AfterGeneralData;
        const qW_GeneralData = qW_GeneralDataObj[qW_GeneralDataObj.chosen]();
        const qW_AfterInsulation = get().building_HeatingDemand_Q_W_AfterInsulation_BasedOn_Q_H_AfterInsulation();
        if (basedOn === FinalEnergyDemand_Q_E_Calculation.BasedOnHeatingDemand) return qW_GeneralData;
        else if (basedOn === FinalEnergyDemand_Q_E_Calculation.BasedOnHeatingLoad) return qW_AfterInsulation;
        else return undefined;
    },
    building_HeatingLoad_Q_H_BeforeTechnology: () => {
        const basedOn = get().building_FinalEnergyDemand_BasedOn;
        const qH_GeneralDataObj = get().building_HeatingLoad_Q_H_AfterGeneralData;
        const qH_GeneralData = qH_GeneralDataObj[qH_GeneralDataObj.chosen]();
        const qH_AfterInsulation = get().building_HeatingLoad_Q_H_AfterInsulation();
        if (basedOn === FinalEnergyDemand_Q_E_Calculation.BasedOnHeatingDemand) return qH_GeneralData;
        else if (basedOn === FinalEnergyDemand_Q_E_Calculation.BasedOnHeatingLoad) return qH_AfterInsulation;
        else return undefined;
    },
    building_Photovoltaic: {
        alreadyHasPhotovoltaic: false,
        wantsPhotovoltaic: false,
        usableRoofAreaIfDifferentThanRoofArea: {
            Default: () => {
                const roofAreaObj = get().building_ConstructionParts[ConstructionPart.TopSide].area;
                return roofAreaObj[roofAreaObj.chosen]();
            },
            Custom: () => get().building_Photovoltaic.usableRoofAreaIfDifferentThanRoofArea._customValue ?? undefined,
            _customValue: null,
            chosen: DefaultCustom.Default,
        },
        roofYearOfRenovationIfDifferentThanYearOfConstruction: null, // kann auch in der zukunft liegen? - nein "geplant" machen wir nicht, weil "erneuern sie erst ihr dach" so schon als antwort gebenen werden kann.
        numberOfModules: () => {
            const wantsPhotovoltaic = get().building_Photovoltaic.wantsPhotovoltaic;
            const alreadyHasPhotovoltaic = get().building_Photovoltaic.alreadyHasPhotovoltaic;
            if (!wantsPhotovoltaic || alreadyHasPhotovoltaic) return undefined;
            const roofAreaObj = get().building_ConstructionParts[ConstructionPart.TopSide].area;
            const roofArea = roofAreaObj[roofAreaObj.chosen]();
            if (roofArea === undefined) return undefined;
            const density = roofArea * 0.8; // TODO das vielleicht auch auslagern?
            return Math.floor(density / 1.87 /* m^2*/);
        },
        usedAreaForModules: () => {
            const numberOfModules = get().building_Photovoltaic.numberOfModules();
            if (numberOfModules === undefined) return undefined;
            return numberOfModules * 1.87; /* m^2*/ // TODO vielleicht 1.87 auslagern in eigene datei? (Tabelle?)
        },
        kiloWattPeakOfModules: () => {
            const usedArea = get().building_Photovoltaic.usedAreaForModules();
            if (usedArea === undefined) return undefined;
            return (usedArea * 215) /* W/(m^2) */ / 1000;
        },
        kiloWattHoursPerYear: () => {
            const peak = get().building_Photovoltaic.kiloWattPeakOfModules();
            if (peak === undefined) return undefined;
            return (
                Object.values(Month)
                    .map((month) => getAverageYieldInKiloWattHours(month))
                    .reduce((sum, cur) => sum + cur) * peak
            );
        },
        degreeOfSelfSufficiency: () => {
            const solarYield = get().building_Photovoltaic.kiloWattHoursPerYear();
            const energyUsage = get().building_ElectricityUsage_AfterTechnology();
            const factor = 100; // TODO mystery factor. brauchen noch den Wert von Herr Giel
            // TODO sollte wahrscheinlich eigentlich in die ui gepackt werden, dass aus der komma zahl ein prozentwert wird
            if (solarYield === undefined || energyUsage === undefined) return undefined;
            return factor * (solarYield / energyUsage);
        },
        gridFeedIn: () => {
            const solarYield = get().building_Photovoltaic.kiloWattHoursPerYear();
            console.log("SOLARYIELD:", solarYield);
            if (solarYield === undefined) return 0;
            const energyUsage = get().building_ElectricityUsage_AfterTechnology();
            if (energyUsage === undefined) return undefined;
            return Math.max(0, solarYield - energyUsage); // TODO ist nur realistisch, wenn strom auf das ganze jahr perfekt gespeichert werden kann. geiches Problem wie oben mit degreeOfSelfSufficiency wo dann der Faktor zur Annäherung benutzt wird.
        },
        gridUsage: () => {
            const energyUsage = get().building_ElectricityUsage_AfterTechnology();
            if (energyUsage === undefined) return undefined;
            const solarYield = get().building_Photovoltaic.kiloWattHoursPerYear();
            if (solarYield === undefined) return energyUsage;
            else return Math.max(0, energyUsage - solarYield);
        },
    },
    building_Ventilation_Final: {
        // numberOfDevices: () => {
        //     const volume = get().building_Ventilation.volumeIfDifferentThanBuildingVolume ?? get().building_Dimensions.volume();

        // },
        qWDifferenceBecauseWRG: () => {
            // kWh/a
            // undefined wenn werte fehlen
            // 0 wenn man alle werte hat, aber keine lüftung einbaut
            const qLWO = get().building_VentilationHeatLoss_Q_L_WithoutWRG_AfterGeneralData();
            const qLW = get().building_VentilationHeatLoss_Q_L_WithWRG_AfterTechnology();
            if (qLWO === undefined) return undefined;
            const buildingType = get().building_Type;
            if (buildingType === null) return undefined;
            const utilizedHoursObj = get().building_UtilizedHours;
            const utilizedHours = utilizedHoursObj[utilizedHoursObj.chosen]();
            if (utilizedHours === undefined) return undefined;
            if (qLW === undefined) return 0;
            const qLDiff = qLWO - qLW;
            return qLDiff * utilizedHours;
        },
        co2EmissionsDifferenceOnlyBecauseWRG: () => {
            // g/a
            const qwWPNew = get().building_HeatingDemand_Q_W_WP_AfterInsulation() ?? 0;
            const qwFuelNew = get().building_HeatingDemand_Q_W_Fuel_AfterInsulation();
            const qwDiffBcWRG = get().building_Ventilation_Final.qWDifferenceBecauseWRG();
            if (qwFuelNew === undefined || qwDiffBcWRG === undefined) return undefined;
            const qwTemp = qwFuelNew - qwDiffBcWRG;
            // if (qwWPNew === undefined) return undefined;
            const qwWPSavings = qwTemp < 0 ? qwWPNew - (qwWPNew + qwTemp) : 0;
            const qwFuelSavings = qwTemp < 0 ? qwFuelNew : qwFuelNew - qwTemp;
            const heatGenerator = get().building_ExistingHeatGenerator;
            if (heatGenerator === null || qwDiffBcWRG === undefined) return undefined;
            const energycarrier = mapExistingHeatGeneratorToEnergyCarrier(heatGenerator);
            const equivalentFuel = getCO2EmissionFactor(energycarrier).co2Equivalent;
            const equivalentWP = getCO2EmissionFactor(EnergyCarrier.EnergyFromGrid).co2Equivalent;
            return qwWPSavings * equivalentWP + qwFuelSavings * equivalentFuel;
        },

        airExchangeRate: {
            _customValue: null,
            Default: () => 2,
            Custom: () => get().building_Ventilation_Final.airExchangeRate._customValue ?? undefined,
            chosen: DefaultCustom.Default,
        },
        wrgEfficiency: {
            _customValue: null,
            Default: () => 75,
            Custom: () => get().building_Ventilation_Final.wrgEfficiency._customValue ?? undefined,
            chosen: DefaultCustom.Default,
        },
        airVolumeFlow_V_Dot_AfterTechnology: () => {
            const volumeObj = get().building_Ventilation.volumeIfDifferentThanBuildingVolume;
            const volume = volumeObj[volumeObj.chosen]();
            if (volume === undefined) return undefined;
            const airExchangeObj = get().building_Ventilation_Final.airExchangeRate;
            const airExchange = airExchangeObj[airExchangeObj.chosen]();
            if (airExchange === undefined) return undefined;
            return volume / airExchange;
        },
    },
    building_VentilationHeatLoss_Q_L_WithoutWRG_AfterTechnology: () => {
        // kW
        const airVolumeFlow = get().building_Ventilation_Final.airVolumeFlow_V_Dot_AfterTechnology();
        // const specificThermalCapacity /* J/(kg*K) =  */ = 1010;
        // const airDensity /* kg/m^3 =  */ = 1.21;
        // const together /* ungefähr 0.34 (W*h)/((m^3)*K) */ =
        //     (specificThermalCapacity /* J/(kg*K) */ * airDensity) /* kg/m^3 =  */ / 60 / 60;
        if (airVolumeFlow === undefined) return undefined;
        return (
            (airVolumeFlow * 0.34 /* ungefähr `together` */ * 28) /* K */ / 1000 /* damit kW rauskommt und nicht W */
        );
    },
    building_VentilationHeatLoss_Q_L_WithWRG_AfterTechnology: () => {
        // kW
        const qL_WithoutWRG = get().building_VentilationHeatLoss_Q_L_WithoutWRG_AfterTechnology();
        const wrgEfficiencyObj = get().building_Ventilation_Final.wrgEfficiency;
        const wrgEfficiency = wrgEfficiencyObj[wrgEfficiencyObj.chosen]();
        if (qL_WithoutWRG === undefined || wrgEfficiency == undefined) return undefined;
        return qL_WithoutWRG * ((100 - wrgEfficiency) / 100);
    },
    // -- END VENTILATION
    // START NEW ENERGY SOURCE
    building_ExistingDistributionSystem: null,

    building_ExistingDistributionSystemFlowTemperature: {
        _customValue: null,
        Default: () => {
            const distributionSystem = get().building_ExistingDistributionSystem;
            if (distributionSystem === null) return undefined;
            const temperature = getHeatingSystemData(distributionSystem).flowTemperature;
            //Wert aus Tabelle
            return temperature;
        },
        Custom: () => {
            return get().building_ExistingDistributionSystemFlowTemperature._customValue ?? undefined;
        },
        chosen: DefaultCustom.Default,
    },
    building_ExistingDistributionSystemCustomReturnTemperature: 0,

    building_Technology_PreviousCO2Emissions: () => {
        //TODO falscher wert? AfterGeneralData richtig?
        const heatingDemand_Q_W = get().building_HeatingDemand_Q_W_AfterGeneralData;
        const heatingDemand = heatingDemand_Q_W[heatingDemand_Q_W.chosen]();
        if (heatingDemand === undefined) return undefined;
        const heatGenerator = get().building_ExistingHeatGenerator;
        if (heatGenerator === null) return undefined;
        const energycarrier = mapExistingHeatGeneratorToEnergyCarrier(heatGenerator);
        return heatingDemand * getCO2EmissionFactor(energycarrier).co2Equivalent;
        // QW * CO2 Äquivalent = CO2Emissionen
    },

    building_ExistingHeatGenerator: null,

    building_NewHeatGenerator: null,
    building_NewHeatPump_CoverageRatio: {
        _customValue: null,
        Default: () => 65,
        Custom: () => {
            return get().building_NewHeatPump_CoverageRatio._customValue ?? undefined;
        },
        chosen: DefaultCustom.Default,
    },
    building_NewHeatPumpType: null,
    building_NewHeatPump_JAZ: {
        _customValue: null,
        Default: () => {
            const heatPumpType = get().building_NewHeatPumpType;
            if (heatPumpType === null) return undefined;
            const jaz = getJAZ(heatPumpType);
            return jaz;
        },
        Custom: () => {
            return get().building_NewHeatPump_JAZ._customValue ?? undefined;
        },
        chosen: DefaultCustom.Default,
    },
    building_RestrictionsHeatPump: {
        restrictions: {
            brinewater: {
                [RestrictionsHeatPumpBrineWater.NoDrillingPossible]: false,
                [RestrictionsHeatPumpBrineWater.WaterProtectionArea]: false,
            },
            waterwater: {
                [RestrictionsHeatPumpWaterWater.GroundwaterAvailable]: false,
                [RestrictionsHeatPumpWaterWater.NoDrillingPossible]: false,
                [RestrictionsHeatPumpWaterWater.WaterProtectionArea]: false,
            },
        },
    },
    building_HeatingDemand_Q_W_WP_AfterTechnology: () => {
        const qW_AfterTechnology = get().building_HeatingDemand_Q_W_AfterTechnology();
        if (qW_AfterTechnology === undefined) return undefined;
        const newCoverageObj = get().building_NewHeatPump_CoverageRatio;
        const newCoverage = newCoverageObj[newCoverageObj.chosen]();
        if (newCoverage === undefined) return undefined;
        return qW_AfterTechnology * (newCoverage / 100);
    },
    building_NewHeatPump_Electricity: () => {
        const qWNewWP = get().building_HeatingDemand_Q_W_WP_AfterTechnology();
        if (qWNewWP === undefined) return undefined;
        const newJAZObj = get().building_NewHeatPump_JAZ;
        const newJAZ = newJAZObj[newJAZObj.chosen]();
        if (newJAZ === undefined) return undefined;
        return qWNewWP / newJAZ;
    },
    building_SecondNewHeatGenerator: null,
    // building_NewHeatGeneratorModeOfOperation: null,
    building_NewHeatGeneratorFuelHeating: null,
    building_bioFuelStorage: () => {
        // (m^3)/(kW)
        const qH_BeforeTechnology = get().building_HeatingLoad_Q_H_BeforeTechnology();
        if (qH_BeforeTechnology === undefined) return undefined;
        return qH_BeforeTechnology * 0.9;
    },
    // -- END BRENNSTOFFHEIZUNG
    building_HeatingDemand_Q_W_AfterTechnology: () => {
        const qW_Before = get().building_HeatingDemand_Q_W_BeforeTechnology();
        if (qW_Before === undefined) return undefined;
        const qw_Reduction_BecauseWRG = get().building_Ventilation_Final.qWDifferenceBecauseWRG();
        if (qw_Reduction_BecauseWRG === undefined) return undefined;
        return qW_Before - qw_Reduction_BecauseWRG;
    },
    building_ElectricityUsage_AfterTechnology: () => {
        const newHeatGenerator = get().building_NewHeatGenerator;
        const energyNewWP =
            newHeatGenerator === NewHeatGenerator.HybridSystem || newHeatGenerator === NewHeatGenerator.HeatPump
                ? get().building_NewHeatPump_Electricity()
                : 0;
        if (energyNewWP === undefined) return undefined;
        const energyCar = get().building_ElectricCar_Electricity() ?? 0;
        const energyGeneral = get().building_Basic_Electricity();
        if (energyGeneral === undefined) return undefined;
        return energyNewWP + energyCar + energyGeneral;
    },
    building_ElectricityFromGrid_AfterTechnology: () => {
        const usedElectricity = get().building_ElectricityUsage_AfterTechnology();
        if (usedElectricity === undefined) return undefined;
        const selfUsedElectricity = get().building_Photovoltaic.gridUsage();
        if (selfUsedElectricity === undefined) return undefined;
        return usedElectricity - selfUsedElectricity;
    },
    building_CO2Emissions_Fuel_AfterTechnology: () => {
        // g/a
        // glaube das ist ein bisschen viel umweg
        const newHeatGenerator = get().building_NewHeatGenerator;
        const usesNewHeatpump =
            newHeatGenerator === NewHeatGenerator.HeatPump || newHeatGenerator === NewHeatGenerator.HybridSystem;
        const ratioOld =
            get().building_HeatPumpType === null ? 0 : get().building_HeatPump_CoverageRatioInPercent_AfterGeneralData;
        const ratioNewObj = get().building_NewHeatPump_CoverageRatio;
        const ratioNew = get().building_NewHeatPumpType === null ? 0 : ratioNewObj[ratioNewObj.chosen]();
        const ratio = usesNewHeatpump ? ratioNew : ratioOld;
        console.log("RATIO:", ratio);
        if (ratio === undefined) return undefined; // Sollte logisch eigentlich nicht pasieren können
        const qW = get().building_HeatingDemand_Q_W_AfterTechnology();
        const secondHeatGenerator = get().building_SecondNewHeatGenerator;
        console.log("qW,secondHeatGenerator:", qW, secondHeatGenerator);
        if (qW === undefined) return undefined;
        if (secondHeatGenerator === null) return 0;
        const energycarrier = mapSecondNewHeatGeneratorToEnergyCarrier(secondHeatGenerator);
        const equivalentFuel = getCO2EmissionFactor(energycarrier).co2Equivalent;

        return qW * ((100 - ratio) / 100) * equivalentFuel;
    },
    building_CO2Emissions_Electricity_AfterTechnology: () => {
        // g/a
        const gridUsage = get().building_Photovoltaic.gridUsage();
        const gridFeedIn = get().building_Photovoltaic.gridFeedIn();
        const electricityGenerell = get().building_ElectricityUsage_AfterTechnology();
        console.log("gridUsage,electricityGridFeedin,electricityGenerell:", gridUsage, gridFeedIn, electricityGenerell);
        if (gridUsage === undefined || electricityGenerell === undefined) return undefined;
        const electricityPhotovoltaic = electricityGenerell - gridUsage;
        console.log("electricityPhotovoltaic:", electricityPhotovoltaic);
        if (electricityPhotovoltaic === undefined) return undefined;
        const equivalentElectricityGrid = getCO2EmissionFactor(EnergyCarrier.EnergyFromGrid).co2Equivalent;
        const equivalentElectricityPhotovoltaic = getCO2EmissionFactor(
            EnergyCarrier.EnergyFromPhotovoltaicsOrWind,
        ).co2Equivalent;
        return gridUsage * equivalentElectricityGrid + electricityPhotovoltaic * equivalentElectricityPhotovoltaic;
    },
    building_CO2Emissions_AfterTechnology: () => {
        // g/a
        const fuelEmission = get().building_CO2Emissions_Fuel_AfterTechnology();
        const electricityEmission = get().building_CO2Emissions_Electricity_AfterTechnology();
        console.log("===>fuelEmission,electricityEmission:", fuelEmission, electricityEmission);
        if (fuelEmission === undefined || electricityEmission === undefined) return undefined;
        return fuelEmission + electricityEmission;
    },

    building_PostalCode: null,
    email: {
        deliveryConsent: false,
        address: null,
    },
});

// event subscribtion for variables maybe? just like the dependency array of useEffect. so that every update function gets run on a variable change

type WithSelectors<S> = S extends { getState: () => infer T } ? S & { use: { [K in keyof T]: () => T[K] } } : never;

const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(_store: S) => {
    let store = _store as WithSelectors<typeof _store>;
    store.use = {};
    for (let k of Object.keys(store.getState())) {
        (store.use as any)[k] = () => store((s) => s[k as keyof typeof s]);
    }

    return store;
};

const isDevMode = process.env.NODE_ENV === "development";

type VariableStoreBase = {
    // reset: (key?: keyof VariableStore) => void;
    reset: () => void;
    merge: (newState: Partial<VariableStoreBase>) => void;
} & VariableStore;
export const useVariableStoreBase = create<VariableStoreBase>()(
    devtools(
        persist(
            (...a) => {
                const set = a[0];
                // const get = a[1];
                return {
                    ...initialState(...a),
                    // das mit dem `get` ist wie in excel weil da auch jede Zelle ihre Daten selbst nachschaut. `=C1+A3`. Also vielleicht reicht es ja sogar
                    reset() {
                        // reset(key) {
                        // funktioniert nicht mehr mit den slices
                        // if (key != undefined) {
                        // set({ [key]: initialState[key] });
                        // } else {
                        set(initialState(...a));
                        // }
                    },
                    merge(newState: Partial<VariableStoreBase>) {
                        set(merge(initialState(...a), newState));
                    },
                };
            },
            {
                name: "tinyHousePersist",
                merge: (persistedState, currentState) => {
                    return merge(currentState, persistedState as Partial<typeof currentState>) as typeof currentState;
                },
            },
        ),
        { enabled: isDevMode },
    ),
);

export const useVariableStore = createSelectors(useVariableStoreBase);

// enums müssen jetzt über "const initialState: VariableStore = {..." definiert werden, damit sie dort auch genutzt werden können
