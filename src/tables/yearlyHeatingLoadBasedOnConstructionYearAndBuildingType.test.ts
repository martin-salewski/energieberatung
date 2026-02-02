import { getYearlyHeatingLoad } from "@/tables/yearlyHeatingLoadBasedOnConstructionYearAndBuildingType";
import { BuildingType } from "@/zustand/useVariableStore";
import { expect, test, describe } from "vitest";

const from = 0,
    to = 5000;

describe("Should return a number and not NaN.", () => {
    for (let i = from; i <= to; ++i) {
        Object.values(BuildingType).forEach((type) => {
            const result = getYearlyHeatingLoad(i, type);
            test(`(year: ${i}, type: ${type}) => ${result};`, () => {
                expect.soft(result).toBeTypeOf("number");
                expect.soft(result).not.toBeNaN();
            });
        });
    }
});
