import { ConstructionPart } from "@/tables/HeatTransferCoefficientBasedOnComponentAndConstructionYear";
import { BuildingType } from "@/zustand/useVariableStore";

export function getPercentageOfOuterShell(buildingType: BuildingType, constructionPart: ConstructionPart): number {
    const tableEFH: { [key in ConstructionPart]: number } = {
        [ConstructionPart.TopSide]: 0.26,
        [ConstructionPart.OuterWall]: 0.39,
        [ConstructionPart.Window]: 0.11,
        [ConstructionPart.BottomSide]: 0.24, // entspricht der Grundfläche
    };
    const tableMFH: { [key in ConstructionPart]: number } = {
        [ConstructionPart.TopSide]: 0.27,
        [ConstructionPart.OuterWall]: 0.39,
        [ConstructionPart.Window]: 0.14,
        [ConstructionPart.BottomSide]: 0.2, // entspricht der Grundfläche
    };
    switch (buildingType) {
        case BuildingType.Einfamilienhaus:
        case BuildingType.Reihenmittelhaus:
        case BuildingType.Reihenendhaus: {
            return tableEFH[constructionPart];
        }
        case BuildingType.Mehrfamilienhaus: {
            return tableMFH[constructionPart];
        }
    }
}
