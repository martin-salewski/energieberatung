// Definition der Heizsysteme mit Vorlauf- und Rücklauftemperaturen
// export enum HeatingSystem {
//     Radiator = "Heizkörper (70/55)",
//     LowTemperatureRadiator = "Niedertemperaturheizkörper (70/55)",
//     FloorHeating = "Fußbodenheizung (35/30)",
// }

import { ExistingDistributionSystem } from "@/zustand/useVariableStore";

// Funktion, um die Vor- und Rücklauftemperaturen eines Heizsystems zu erhalten
export function getHeatingSystemData(heatingSystem: ExistingDistributionSystem) {
    // Tabelle mit den Vor- und Rücklauftemperaturen der Heizsysteme
    const heatingSystemData = {
        [ExistingDistributionSystem.Radiator]: {
            flowTemperature: 70, // Vorlauftemperatur in °C
            returnTemperature: 55, // Rücklauftemperatur in °C
        },
        [ExistingDistributionSystem.LowTemperatureRadiator]: {
            flowTemperature: 55, // Vorlauftemperatur in °C
            returnTemperature: 45, // Rücklauftemperatur in °C
        },
        [ExistingDistributionSystem.UnderfloorHeating]: {
            flowTemperature: 35, // Vorlauftemperatur in °C
            returnTemperature: 30, // Rücklauftemperatur in °C
        },
    };
    return heatingSystemData[heatingSystem];
}
