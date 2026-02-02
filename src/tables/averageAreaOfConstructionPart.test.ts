import { ConstructionPart } from "@/tables/HeatTransferCoefficientBasedOnComponentAndConstructionYear";
import { getAverageArea } from "@/tables/averageAreaOfConstructionPart";
import { BuildingType } from "@/zustand/useVariableStore";
import { expect, test, describe } from "vitest";

describe("Should return a number and not NaN.", () => {
    Object.values(ConstructionPart).forEach((constructionPart) => {
        Object.values(BuildingType).forEach((buildingType) => {
            const result = getAverageArea(constructionPart, buildingType, 100);
            test(`(constructionPart: ${constructionPart}, buildingType: ${buildingType}) => ${result};`, () => {
                expect.soft(result).toBeTypeOf("number");
                expect.soft(result).not.toBeNaN();
            });
        });
    });
});
