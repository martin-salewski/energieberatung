import { getUtilizedHours } from "@/tables/utilizationHoursBasedOnBuildingType";
import { BuildingType } from "@/zustand/useVariableStore";
import { expect, test, describe } from "vitest";

describe("Should return a number and not NaN.", () => {
    Object.values(BuildingType).forEach((type) => {
        const result = getUtilizedHours(type);
        test(`(type: ${type}) => ${result};`, () => {
            expect.soft(result).toBeTypeOf("number");
            expect.soft(result).not.toBeNaN();
        });
    });
});
