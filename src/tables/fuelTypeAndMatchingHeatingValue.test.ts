import { getEnergyForOneUnitInKWh } from "@/tables/fuelTypeAndMatchingHeatingValue";
import { ConsumptionTechnology, FuelType } from "@/zustand/useVariableStore";
import { expect, test, describe } from "vitest";

describe("Should return a number and not NaN.", () => {
    Object.values(FuelType).forEach((fuelType) => {
        Object.values(ConsumptionTechnology).forEach((technology) => {
            const result = getEnergyForOneUnitInKWh(fuelType, technology);
            test(`(fuelType: ${fuelType}, technology: ${technology}) => ${result};`, () => {
                expect.soft(result).toBeTypeOf("number");
                expect.soft(result).not.toBeNaN();
            });
        });
    });
});
