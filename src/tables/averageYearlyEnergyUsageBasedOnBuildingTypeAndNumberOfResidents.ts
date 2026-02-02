// Table 10
import { BuildingType } from "@/zustand/useVariableStore";

export function getAverageYearlyEnergyUsageWithAndWithout(buildingType: BuildingType, persons: number) {
    switch (buildingType) {
        case BuildingType.Einfamilienhaus:
        case BuildingType.Reihenmittelhaus:
        case BuildingType.Reihenendhaus: {
            if (persons <= 0) return { with: undefined, without: undefined };
            else if (persons <= 1) return { with: 2400, without: 2700 };
            else if (persons <= 2) return { with: 3000, without: 3500 };
            else if (persons <= 3) return { with: 3600, without: 4500 };
            else if (persons <= 4) return { with: 4000, without: 5100 };
            else if (persons <= 5) return { with: 5000, without: 6300 };
            else return { with: 5000 + (persons - 5) * 1000, without: 6300 + (persons - 5) * 1100 };
        }
        case BuildingType.Mehrfamilienhaus: {
            if (persons <= 0) return { with: undefined, without: undefined };
            else if (persons <= 1) return { with: 1400, without: 1700 };
            else if (persons <= 2) return { with: 2000, without: 2800 };
            else if (persons <= 3) return { with: 2600, without: 3600 };
            else if (persons <= 4) return { with: 2900, without: 4200 };
            else if (persons <= 5) return { with: 3000, without: 4500 };
            else return { with: 3000 + (persons - 5) * 1000, without: 4500 + (persons - 5) * 1100 };
        }
    }
}
