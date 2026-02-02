import { ExistingHeatGenerator, FuelType, SecondNewHeatGenerator } from "@/zustand/useVariableStore";

// Table 15
export enum EnergyCarrier {
    HeatingOil = "Heizöl",
    NaturalGas = "Erdgas",
    Wood = "Holz",
    EnergyFromGrid = "netzbezogen",
    EnergyFromPhotovoltaicsOrWind = "Photovoltaik/Windkraft",
}

// Tabelle der Primärenergiefaktoren und CO₂-Äquivalente

export function mapFuelTypeToExistingHeatGenerator(fuelType: FuelType) {
    const table: { [key in FuelType]: ExistingHeatGenerator } = {
        [FuelType.OilLight]: ExistingHeatGenerator.Oil,
        [FuelType.OilHeavy]: ExistingHeatGenerator.Oil,
        [FuelType.GasL]: ExistingHeatGenerator.Gas,
        [FuelType.GasH]: ExistingHeatGenerator.Gas,
        [FuelType.WoodPellets]: ExistingHeatGenerator.SolidFuel,
        [FuelType.WoodLogs]: ExistingHeatGenerator.SolidFuel,
        [FuelType.WoodChips]: ExistingHeatGenerator.SolidFuel,
    };
    return table[fuelType];
}
export function mapExistingHeatGeneratorToEnergyCarrier(existingHeatGenerator: ExistingHeatGenerator) {
    const table = {
        [ExistingHeatGenerator.Oil]: EnergyCarrier.HeatingOil,
        [ExistingHeatGenerator.Gas]: EnergyCarrier.NaturalGas,
        [ExistingHeatGenerator.SolidFuel]: EnergyCarrier.Wood,
    };
    return table[existingHeatGenerator];
}
export function mapSecondNewHeatGeneratorToEnergyCarrier(secondNewHeatGenerator: SecondNewHeatGenerator) {
    const table = {
        [SecondNewHeatGenerator.OilBoilder]: EnergyCarrier.HeatingOil,
        [SecondNewHeatGenerator.GasBoiler]: EnergyCarrier.NaturalGas,
    };
    return table[secondNewHeatGenerator];
}
export function getCO2EmissionFactor(energyCarrier: EnergyCarrier) {
    const table: {
        [key in EnergyCarrier]: { primaryEnergyFactor: number; co2Equivalent: number };
    } = {
        [EnergyCarrier.HeatingOil]: {
            primaryEnergyFactor: 1.1,
            co2Equivalent: 310, // g/kWh
        },
        [EnergyCarrier.NaturalGas]: {
            primaryEnergyFactor: 1.1,
            co2Equivalent: 240, // g/kWh
        },
        [EnergyCarrier.Wood]: {
            primaryEnergyFactor: 0.2,
            co2Equivalent: 20, // g/kWh
        },
        [EnergyCarrier.EnergyFromGrid]: {
            primaryEnergyFactor: 1.8,
            co2Equivalent: 560, // g/kWh
        },
        [EnergyCarrier.EnergyFromPhotovoltaicsOrWind]: {
            primaryEnergyFactor: 0,
            co2Equivalent: 0, // g/kWh
        },
    };
    return table[energyCarrier];
}
