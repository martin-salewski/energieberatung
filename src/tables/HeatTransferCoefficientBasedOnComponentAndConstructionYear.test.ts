import {
    ConstructionPart,
    ConstructionPartMapping,
    getHeatTransferCoefficient,
} from "@/tables/HeatTransferCoefficientBasedOnComponentAndConstructionYear";
import { expect, test, describe } from "vitest";

const from = 0,
    to = 5000;

describe("Should return a number and not NaN.", () => {
    for (let year = from; year <= to; ++year) {
        Object.values(ConstructionPart).map((key) =>
            ConstructionPartMapping[key].map((part) =>
                Object.values(part).forEach((type) => {
                    const result = getHeatTransferCoefficient(year, type);
                    test(`(year: ${year}, type: ${key}/${type}) => ${result};`, () => {
                        if (
                            type === ConstructionPartMapping[ConstructionPart.Window][0].WoodSinglePane &&
                            year >= 1978
                        ) {
                            expect.soft(result).toBeUndefined();
                        } else {
                            expect.soft(result).toBeTypeOf("number");
                            expect.soft(result).not.toBeNaN();
                        }
                    });
                }),
            ),
        );
    }
});
