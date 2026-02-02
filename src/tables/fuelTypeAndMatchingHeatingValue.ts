// Table 02
import { ConsumptionTechnology, FuelType } from "@/zustand/useVariableStore";

export function getEnergyForOneUnitInKWh(fuelType: FuelType, technology: ConsumptionTechnology) {
    // Brennstoff | Heizwert (kWh) | Brennwert (kWh)
    const table: {
        [key in FuelType]: {
            [key1 in ConsumptionTechnology]: number;
        };
    } = {
        [FuelType.OilLight]: {
            [ConsumptionTechnology.HeatingAppliance]: 10.08,
            [ConsumptionTechnology.CondensingAppliance]: 10.57,
        },
        [FuelType.OilHeavy]: {
            [ConsumptionTechnology.HeatingAppliance]: 10.61,
            [ConsumptionTechnology.CondensingAppliance]: 11.27,
        },
        [FuelType.GasH]: {
            [ConsumptionTechnology.HeatingAppliance]: 10.75,
            [ConsumptionTechnology.CondensingAppliance]: 11.75,
        },
        [FuelType.GasL]: {
            [ConsumptionTechnology.HeatingAppliance]: 8.75,
            [ConsumptionTechnology.CondensingAppliance]: 9.75,
        },
        [FuelType.WoodPellets]: {
            [ConsumptionTechnology.HeatingAppliance]: 4.95,
            [ConsumptionTechnology.CondensingAppliance]: 5.4,
        },
        [FuelType.WoodLogs]: {
            [ConsumptionTechnology.HeatingAppliance]: 4.15,
            [ConsumptionTechnology.CondensingAppliance]: 4.45,
        },
        [FuelType.WoodChips]: {
            [ConsumptionTechnology.HeatingAppliance]: 4.0,
            [ConsumptionTechnology.CondensingAppliance]: 4.05,
        },
    };
    return table[fuelType][technology];
}
