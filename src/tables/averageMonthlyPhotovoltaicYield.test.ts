import {
    Month,
    getAverageYieldInKiloWattHours,
    getAverageYieldInShareOfYear,
} from "@/tables/averageMonthlyPhotovoltaicYield";
import { expect, test, describe } from "vitest";

describe("Should return a number and not NaN.", () => {
    Object.values(Month).forEach((month) => {
        const result = getAverageYieldInKiloWattHours(month);
        test(`(Month: ${month}) => ${result};`, () => {
            expect.soft(result).toBeTypeOf("number");
            expect.soft(result).not.toBeNaN();
        });
    });
});
describe("Should be 100% = 1", () => {
    let result = 0;
    Object.values(Month).forEach((month) => {
        result += getAverageYieldInKiloWattHours(month);
    });
    test(`=> ${result};`, () => {
        expect.soft(result).toEqual(992);
    });
});
describe("Should return a number and not NaN.", () => {
    Object.values(Month).forEach((month) => {
        const result = getAverageYieldInShareOfYear(month);
        test(`(Month: ${month}) => ${result};`, () => {
            expect.soft(result).toBeTypeOf("number");
            expect.soft(result).not.toBeNaN();
        });
    });
});
describe("Should be 100% = 1", () => {
    let result = 0;
    Object.values(Month).forEach((month) => {
        result += getAverageYieldInShareOfYear(month);
    });
    test(`=> ${result};`, () => {
        expect.soft(result).toEqual(1);
    });
});
