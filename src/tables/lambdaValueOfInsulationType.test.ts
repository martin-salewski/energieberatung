import { InsulationType, getLambdaValue } from "@/tables/lambdaValueOfInsulationType";
import { expect, test, describe } from "vitest";

describe("Should return a number and not NaN.", () => {
    Object.values(InsulationType).forEach((type) => {
        const result = getLambdaValue(type);
        test(`(type: ${type}) => ${result};`, () => {
            expect.soft(result).toBeTypeOf("number");
            expect.soft(result).not.toBeNaN();
        });
    });
});
