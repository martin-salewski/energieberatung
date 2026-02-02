// Table 13
import { DefaultCustom, InsulationStandard } from "@/zustand/useVariableStore";

export enum HeatTransferConstructionPart {
    AngledRoof,
    FlatRoofOrTopCeiling,
    BottomSide,
    Window,
    OuterWall,
}

export function getTargetedHeatTransferCoefficient(part: HeatTransferConstructionPart) {
    // W/((m^2)*K)
    const table: {
        [key in HeatTransferConstructionPart]: {
            [key1 in
                | InsulationStandard
                | Exclude<DefaultCustom, DefaultCustom.Default>]: key1 extends DefaultCustom.Custom
                ? { min: number; max: number }
                : number;
        };
    } = {
        [HeatTransferConstructionPart.AngledRoof]: {
            [InsulationStandard.GEG]: 0.24, // hierzu zählt denke ich auch das schrägdach :shrug:
            [InsulationStandard.BEG]: 0.14,
            [DefaultCustom.Custom]: {
                min: 0.1,
                max: 0.3,
            },
        },
        [HeatTransferConstructionPart.FlatRoofOrTopCeiling]: {
            [InsulationStandard.GEG]: 0.2, // und hier ist nur das Flachdach gemeint :shrug:
            [InsulationStandard.BEG]: 0.14,
            [DefaultCustom.Custom]: {
                min: 0.1,
                max: 0.3,
            },
        },
        // [ConstructionPart.TopCeiling]: {
        //     [InsulationStandard_Calculation.GEG]: 0.24, // hierzu zählt denke ich auch das schrägdach :shrug:
        //     [InsulationStandard_Calculation.BEG]: 0.14,
        //     [InsulationStandard_Calculation.Custom]: {
        //         min: 0.1,
        //         max: 0.3,
        //     },
        // },
        [HeatTransferConstructionPart.BottomSide]: {
            [InsulationStandard.GEG]: 0.24,
            [InsulationStandard.BEG]: 0.2, //0.3
            [DefaultCustom.Custom]: {
                min: 0.17,
                max: 0.32,
            },
        },
        [HeatTransferConstructionPart.OuterWall]: {
            [InsulationStandard.GEG]: 0.24,
            [InsulationStandard.BEG]: 0.2,
            [DefaultCustom.Custom]: {
                min: 0.1,
                max: 0.24,
            },
        },
        [HeatTransferConstructionPart.Window]: {
            [InsulationStandard.GEG]: 1.3,
            [InsulationStandard.BEG]: 0.95,
            [DefaultCustom.Custom]: {
                min: 0.7,
                max: 1.7,
            },
        },
    };
    return table[part];
}
