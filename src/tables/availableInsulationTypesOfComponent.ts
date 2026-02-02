// Table 14
// import { ConstructionPart } from "@/tables/HeatTransferCoefficientBasedOnComponentAndConstructionYear";
import { InsulationType } from "@/tables/lambdaValueOfInsulationType";
import { RoofType } from "@/zustand/useVariableStore";

export enum InsulationZone {
    AngeledAndFlatRoof,
    InvertedRoof,
    Outside,
    Inside,
    GroundCoveredWall,
    AboveFloorPanelsWithImpactSoundInsulationProperties,
}
export enum InsulationZoneType {
    RoofAngledOrFlat = "RoofAngledOrFlat",
    RoofInverted = "RoofInverted",
    TopFloorCeiling = "TopFloorCeiling",
    WallOutside = "WallOutside",
    WallInside = "WallInside",
    BasementCeiling = "BasementCeiling",
}
export function mapRoofTypeToInsulationZoneType(toBeMapped: RoofType) {
    switch (toBeMapped) {
        case RoofType.FlatRoof:
        case RoofType.PitchedRoof:
            return InsulationZoneType.RoofAngledOrFlat;
        case RoofType.InvertedRoof:
            return InsulationZoneType.RoofInverted;
        case RoofType.TopFloorCeiling:
            return InsulationZoneType.TopFloorCeiling;
    }
}
export function getAvailableInsulationTypes(type: InsulationZoneType) {
    const table: { [key in typeof type]: Set<InsulationType> } = {
        [InsulationZoneType.RoofInverted]: new Set([InsulationType.PolystyrolExtruderFoam]),
        [InsulationZoneType.TopFloorCeiling]: new Set([
            InsulationType.MineralWool,
            InsulationType.PolystyrolRigidFoam,
            InsulationType.Hemp,
        ]),
        [InsulationZoneType.RoofAngledOrFlat]: new Set([
            InsulationType.MineralWool,
            InsulationType.FoamGlas,
            InsulationType.PolyurethaneRigidFoam,
            InsulationType.PolystyrolRigidFoam,
            InsulationType.Hemp,
            InsulationType.WoodFiber,
        ]),
        [InsulationZoneType.WallOutside]: new Set([
            InsulationType.MineralWool,
            InsulationType.FoamGlas,
            InsulationType.PolyurethaneRigidFoam,
            InsulationType.PolystyrolRigidFoam,
            InsulationType.PolystyrolExtruderFoam,
            InsulationType.Hemp,
            InsulationType.WoodFiber,
        ]),
        [InsulationZoneType.WallInside]: new Set([
            InsulationType.MineralWool,
            InsulationType.FoamGlas,
            InsulationType.PolystyrolRigidFoam,
            InsulationType.Hemp,
            InsulationType.WoodFiber,
            InsulationType.VacuumInsulationPanels,
            InsulationType.CalciumSilicatePlates,
        ]),
        [InsulationZoneType.BasementCeiling]: new Set([
            InsulationType.MineralWool,
            InsulationType.PolystyrolRigidFoam,
            InsulationType.Hemp,
            InsulationType.VacuumInsulationPanels,
        ]),
    };
    return table[type];
}
export function getAvailableInsulationTypesFromTable(constructionPart: InsulationZone) {
    const table: { [key in InsulationZone]: Set<InsulationType> } = {
        [InsulationZone.AngeledAndFlatRoof]: new Set([
            InsulationType.MineralWool,
            InsulationType.FoamGlas,
            InsulationType.PolyurethaneRigidFoam,
            InsulationType.PolystyrolRigidFoam,
            InsulationType.Hemp,
            InsulationType.WoodFiber,
        ]),
        [InsulationZone.InvertedRoof]: new Set([InsulationType.PolystyrolExtruderFoam]),
        [InsulationZone.Outside]: new Set([
            InsulationType.MineralWool,
            InsulationType.FoamGlas,
            InsulationType.PolyurethaneRigidFoam,
            InsulationType.PolystyrolRigidFoam,
            InsulationType.PolystyrolExtruderFoam,
            InsulationType.Hemp,
            InsulationType.WoodFiber,
        ]),
        [InsulationZone.Inside]: new Set([
            InsulationType.MineralWool,
            InsulationType.FoamGlas,
            InsulationType.PolystyrolRigidFoam,
            InsulationType.Hemp,
            InsulationType.WoodFiber,
            InsulationType.VacuumInsulationPanels,
            InsulationType.CalciumSilicatePlates,
        ]),
        [InsulationZone.GroundCoveredWall]: new Set([
            InsulationType.FoamGlas,
            InsulationType.PolystyrolRigidFoam,
            InsulationType.PolystyrolExtruderFoam,
        ]),
        [InsulationZone.AboveFloorPanelsWithImpactSoundInsulationProperties]: new Set([
            InsulationType.MineralWool,
            InsulationType.PolystyrolRigidFoam,
            InsulationType.Hemp,
            InsulationType.VacuumInsulationPanels,
        ]),
    };
    return table[constructionPart];
}
