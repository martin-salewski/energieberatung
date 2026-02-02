import { ConstructionPart } from "@/tables/HeatTransferCoefficientBasedOnComponentAndConstructionYear";
import { BuildingType } from "@/zustand/useVariableStore";

export function getAverageArea(
    constructionPart: ConstructionPart,
    buildingType: BuildingType,
    areaOfOuterShell: number,
) {
    return areaOfOuterShell * getPercentageOfAverageArea(constructionPart, buildingType);
}
function getPercentageOfAverageArea(constructionPart: ConstructionPart, buildingType: BuildingType) {
    switch (constructionPart) {
        case ConstructionPart.TopSide: {
            switch (buildingType) {
                case BuildingType.Reihenmittelhaus:
                case BuildingType.Reihenendhaus:
                case BuildingType.Einfamilienhaus:
                    return 0.26;
                case BuildingType.Mehrfamilienhaus:
                    return 0.27;
            }
            break;
        }
        case ConstructionPart.OuterWall: {
            switch (buildingType) {
                case BuildingType.Reihenmittelhaus:
                case BuildingType.Reihenendhaus:
                case BuildingType.Einfamilienhaus:
                case BuildingType.Mehrfamilienhaus:
                    return 0.39;
            }
            break;
        }
        case ConstructionPart.Window: {
            switch (buildingType) {
                case BuildingType.Reihenmittelhaus:
                case BuildingType.Reihenendhaus:
                case BuildingType.Einfamilienhaus:
                    return 0.11;
                case BuildingType.Mehrfamilienhaus:
                    return 0.14;
            }
            break;
        }
        case ConstructionPart.BottomSide: {
            switch (buildingType) {
                case BuildingType.Reihenmittelhaus:
                case BuildingType.Reihenendhaus:
                case BuildingType.Einfamilienhaus:
                    return 0.24;
                case BuildingType.Mehrfamilienhaus:
                    return 0.27;
            }
            break;
        }
    }
}
