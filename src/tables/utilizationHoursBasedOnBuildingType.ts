import { BuildingType } from "@/zustand/useVariableStore";

export function getUtilizedHours(buildingType: BuildingType) {
    switch (buildingType) {
        case BuildingType.Einfamilienhaus:
        case BuildingType.Reihenendhaus:
        case BuildingType.Reihenmittelhaus:
            return 2100;
        case BuildingType.Mehrfamilienhaus:
            return 2000;
    }
}
