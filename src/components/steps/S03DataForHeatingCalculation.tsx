import { StepKey } from "@/main";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import {
    ConsumptionTechnology,
    DefaultCustom,
    FinalEnergyDemand_Q_E_Calculation,
    FuelType,
    useVariableStoreBase,
} from "@/zustand/useVariableStore";
import { StepsScaffolding } from "@/components/scaffolding/StepsScaffolding";
import { FormulaTable, getMath, getMathInline } from "@/tables/mathFormulars";
import { INPUT_PATTERN_FLOAT_POSITIVE, INPUT_PATTERN_INTEGER_POSITIVE } from "@/components/ui/input";
import {
    AngledRoofConstructionMethod,
    BottomSideConstructionMethod,
    ConstructionPart,
    ConstructionPartMapping,
    FlatRoofConstructionMethod,
    OuterWallConstructionMethod,
    WindowConstructionMethod,
    getWorseHeatTransferCoefficient,
} from "@/tables/HeatTransferCoefficientBasedOnComponentAndConstructionYear";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Heading1, Heading2, Heading3 } from "@/components/ui/heading";
import {
    DivGroup1,
    DivGroup2,
    DivGroup2Subgrid,
    DivInput,
    DivRadioGroupItem,
    DivSelectSubgrid,
    DivSmall,
} from "@/components/scaffolding/Divs";
import { cn } from "@/lib/utils";
import { InputWithUnitWithKeyboard } from "@/components/inputs/InputWithUnitWithKeyboard";
import { setDotAsDecimalSeparator, setLocaleAsDecimalSeparator } from "@/components/Keyboard";
import { InputWithUnitWithKeyboardDefaultCustom } from "@/components/inputs/InputWithUnitWithKeyboardDefaultCustom";
import { InputWithKeyboardDefaultCustom } from "@/components/inputs/InputWithKeyboardDefaultCustom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TriangleAlert } from "lucide-react";

export function S03DataForHeatingCalculation() {
    const calculationBasedOn = useVariableStoreBase((state) => state.building_FinalEnergyDemand_BasedOn);
    const navigate = useNavigate();
    const [isHeatingLoadSet, setIsHeatingLoadSet] = useState<boolean>(false);
    const [isHeatingDemandSet, setIsHeatingDemandSet] = useState<boolean>(false);

    const canGoNext =
        calculationBasedOn === FinalEnergyDemand_Q_E_Calculation.BasedOnHeatingDemand
            ? isHeatingDemandSet
            : calculationBasedOn === FinalEnergyDemand_Q_E_Calculation.BasedOnHeatingLoad
              ? isHeatingLoadSet
              : false;
    return (
        <StepsScaffolding
            className="grid grow-0 gap-8 pb-0 lg:grid-cols-[3fr_auto_6fr]"
            navigate={navigate}
            title={<Heading1>Berechnung des Energiebedarfs</Heading1>}
            last={`/${StepKey.BasicBuildingData}`}
            next={canGoNext ? `/${StepKey.HeatingCalculation}` : undefined}
        >
            <DivGroup1>
                <Label htmlFor="basedOn">
                    <Heading2>Basis:</Heading2>
                </Label>
                <RadioGroup id="basedOn" value={calculationBasedOn ?? ""} className="grid-cols-[auto_1fr]">
                    {Object.values(FinalEnergyDemand_Q_E_Calculation).map((entry) => (
                        <div key={entry} className="col-span-full grid h-min grid-cols-subgrid items-center">
                            <RadioGroupItem
                                id={entry}
                                value={entry}
                                onClick={() =>
                                    useVariableStoreBase.setState(() => ({
                                        building_FinalEnergyDemand_BasedOn: entry,
                                    }))
                                }
                            />
                            {entry === FinalEnergyDemand_Q_E_Calculation.BasedOnHeatingDemand ? (
                                <>
                                    <Label htmlFor={entry}>Wärmebedarf [{getMathInline("kWh/a")}],</Label>
                                    <div></div>
                                    <p className="text-sm">
                                        berechnet mit Vorjahresverbrauch
                                        {/* <span className="my-1 block rounded-md border border-mainz-green-dark bg-mainz-green px-2 py-1 text-sm">
                                            Gut geeignet um das Heizsystem anzupassen.
                                        </span>
                                        <span className="my-1 block rounded-md border border-mainz-red-dark bg-mainz-red px-2 py-1 text-sm">
                                            Schlecht geeignet um den Wärmebedarf zu reduzieren.
                                        </span> */}
                                    </p>
                                    {calculationBasedOn === FinalEnergyDemand_Q_E_Calculation.BasedOnHeatingDemand && (
                                        <Alert className="col-span-2 mt-2">
                                            <TriangleAlert className="h-4 w-4" />
                                            <AlertDescription>
                                                Anhand dieser Angaben ist keine Berechnung der Dämmung möglich.
                                            </AlertDescription>
                                        </Alert>
                                    )}
                                </>
                            ) : entry === FinalEnergyDemand_Q_E_Calculation.BasedOnHeatingLoad ? (
                                <>
                                    <Label htmlFor={entry}>Heizlast [{getMathInline("kW")}],</Label>
                                    <div></div>
                                    <p className="text-sm">
                                        berechnet mit Baujahr bzw. Sanierungsjahr
                                        {/* <span className="my-1 block rounded-md border border-mainz-green-dark bg-mainz-green px-2 py-1 text-sm">
                                            Gut geeignet um die Heizlast zu reduzieren.
                                        </span>
                                        <span className="my-1 block rounded-md border border-mainz-yellow-dark bg-mainz-yellow px-2 py-1 text-sm">
                                            In Ordnung geeignet um das Heizsystem anzupassen.
                                        </span> */}
                                    </p>
                                </>
                            ) : undefined}
                            {/* </div> */}
                        </div>
                    ))}
                </RadioGroup>
            </DivGroup1>
            <Separator orientation="vertical" className="hidden md:block" />
            <Separator orientation="horizontal" className="block md:hidden" />
            {calculationBasedOn === FinalEnergyDemand_Q_E_Calculation.BasedOnHeatingDemand ? (
                <PreviousYearConsumption setIsFilledOut={setIsHeatingDemandSet} />
            ) : calculationBasedOn === FinalEnergyDemand_Q_E_Calculation.BasedOnHeatingLoad ? (
                <YearOfConstruction setIsFilledOut={setIsHeatingLoadSet} />
            ) : (
                <></>
            )}
        </StepsScaffolding>
    );
}
function PreviousYearConsumption(props: { setIsFilledOut?: (isSet: boolean) => void }) {
    const fuelTypeToUnitMapping: { [key in FuelType]: keyof typeof FormulaTable } = {
        [FuelType.OilLight]: "l",
        [FuelType.OilHeavy]: "l",
        [FuelType.GasL]: "m^3",
        [FuelType.GasH]: "m^3",
        [FuelType.WoodPellets]: "kg",
        [FuelType.WoodLogs]: "kg",
        [FuelType.WoodChips]: "kg",
    };
    const chosenType = useVariableStoreBase((state) => state.building_PreviousYearFuelConsumption.type);
    const chosenTypeValue = useVariableStoreBase((state) => {
        const chosenType = state.building_PreviousYearFuelConsumption.type;
        if (chosenType === null) return null;
        return state.building_PreviousYearFuelConsumption[chosenType];
    });
    const technology = useVariableStoreBase((state) => state.building_ConsumptionTechnology);
    const hasFuel = chosenTypeValue !== null;
    const choseTechnology = technology !== null;
    const isReady = hasFuel && choseTechnology;
    useEffect(() => {
        if (props.setIsFilledOut !== undefined) props.setIsFilledOut(isReady);
    }, [isReady]);

    const usageRef = useRef<HTMLInputElement>(null);
    useLayoutEffect(() => {
        if (usageRef.current) usageRef.current.value = (chosenTypeValue ?? 0).toString();
    }, [chosenType]);
    return (
        <DivGroup1>
            <DivGroup2>
                <Label htmlFor="usedFuel">
                    <Heading2>Vorjahresverbrauch</Heading2>
                </Label>
                <RadioGroup id="usedFuel" value={chosenType ?? ""}>
                    {Object.values(FuelType).map((entry) => (
                        <DivRadioGroupItem key={entry}>
                            <RadioGroupItem
                                id={entry}
                                value={entry}
                                onClick={() =>
                                    useVariableStoreBase.setState((state) => ({
                                        building_PreviousYearFuelConsumption: {
                                            ...state.building_PreviousYearFuelConsumption,
                                            type: entry,
                                        },
                                    }))
                                }
                            />
                            <Label htmlFor={entry}>
                                {entry === FuelType.OilHeavy || entry === FuelType.OilLight ? (
                                    <>
                                        von {entry} in {getMathInline("l")}
                                    </>
                                ) : entry === FuelType.GasH || entry === FuelType.GasL ? (
                                    <>
                                        von {entry} in {getMathInline("m^3")}
                                    </>
                                ) : entry === FuelType.WoodChips ||
                                  entry === FuelType.WoodLogs ||
                                  entry === FuelType.WoodPellets ? (
                                    <>
                                        von {entry} in {getMathInline("kg")}
                                    </>
                                ) : undefined}
                            </Label>
                        </DivRadioGroupItem>
                    ))}
                </RadioGroup>
                <DivInput className="sm:grid-cols-[auto_1fr]">
                    <Label htmlFor="consumption">Verbrauch:</Label>
                    <DivSmall>
                        <InputWithUnitWithKeyboard
                            ref={usageRef}
                            id="consumption"
                            disabled={chosenType === null}
                            currentLayout="float"
                            inputMode="numeric"
                            required={true}
                            pattern={INPUT_PATTERN_FLOAT_POSITIVE}
                            placeholder={"0"}
                            defaultValue={
                                chosenTypeValue !== null ? setLocaleAsDecimalSeparator(chosenTypeValue.toString()) : ""
                            }
                            onChangeCallback={(value: string, validity: ValidityState) => {
                                if (chosenType === null) return undefined;
                                if (validity.valid || validity.valueMissing) {
                                    const parsed = parseFloat(setDotAsDecimalSeparator(value));
                                    useVariableStoreBase.setState((state) => ({
                                        building_PreviousYearFuelConsumption: {
                                            ...state.building_PreviousYearFuelConsumption,
                                            [chosenType]: isNaN(parsed) ? null : parsed,
                                        },
                                    }));
                                }
                            }}
                            unit={chosenType === null ? <></> : getMath(fuelTypeToUnitMapping[chosenType]).formula}
                            unitTitle={chosenType === null ? "" : getMath(fuelTypeToUnitMapping[chosenType]).title}
                        />
                    </DivSmall>
                </DivInput>
                <Label htmlFor="technology">
                    <Heading3>Technologie</Heading3>
                </Label>
                <RadioGroup id="technology" value={technology ?? ""}>
                    {Object.values(ConsumptionTechnology).map((entry) => (
                        <DivRadioGroupItem key={entry}>
                            <RadioGroupItem
                                id={entry}
                                value={entry}
                                onClick={() =>
                                    useVariableStoreBase.setState(() => ({
                                        building_ConsumptionTechnology: entry,
                                    }))
                                }
                            />
                            <Label htmlFor={entry}>
                                {entry === ConsumptionTechnology.CondensingAppliance
                                    ? "Brennwert"
                                    : entry === ConsumptionTechnology.HeatingAppliance
                                      ? "Heizwert"
                                      : undefined}
                            </Label>
                        </DivRadioGroupItem>
                    ))}
                </RadioGroup>
            </DivGroup2>
        </DivGroup1>
    );
}

function YearOfConstruction(props: { setIsFilledOut?: (isSet: boolean) => void }) {
    const constructionPartsMethod = {
        [ConstructionPart.TopSide]: useVariableStoreBase(
            (state) => state.building_ConstructionParts[ConstructionPart.TopSide].method,
        ),
        [ConstructionPart.BottomSide]: useVariableStoreBase(
            (state) => state.building_ConstructionParts[ConstructionPart.BottomSide].method,
        ),
        [ConstructionPart.OuterWall]: useVariableStoreBase(
            (state) => state.building_ConstructionParts[ConstructionPart.OuterWall].method,
        ),
        [ConstructionPart.Window]: useVariableStoreBase(
            (state) => state.building_ConstructionParts[ConstructionPart.Window].method,
        ),
    };
    const [areaTopSide, areaTopSideChosen] = useVariableStoreBase((state) => [
        state.building_ConstructionParts[ConstructionPart.TopSide].area[
            state.building_ConstructionParts[ConstructionPart.TopSide].area.chosen
        ](),
        state.building_ConstructionParts[ConstructionPart.TopSide].area.chosen,
    ]);
    const [areaBottomSide, areaBottomSideChosen] = useVariableStoreBase((state) => [
        state.building_ConstructionParts[ConstructionPart.BottomSide].area[
            state.building_ConstructionParts[ConstructionPart.BottomSide].area.chosen
        ](),
        state.building_ConstructionParts[ConstructionPart.BottomSide].area.chosen,
    ]);
    const [areaOuterWall, areaOuterWallChosen] = useVariableStoreBase((state) => [
        state.building_ConstructionParts[ConstructionPart.OuterWall].area[
            state.building_ConstructionParts[ConstructionPart.OuterWall].area.chosen
        ](),
        state.building_ConstructionParts[ConstructionPart.OuterWall].area.chosen,
    ]);
    const [areaWindow, areaWindowChosen] = useVariableStoreBase((state) => [
        state.building_ConstructionParts[ConstructionPart.Window].area[
            state.building_ConstructionParts[ConstructionPart.Window].area.chosen
        ](),
        state.building_ConstructionParts[ConstructionPart.Window].area.chosen,
    ]);
    const constructionPartsArea = {
        [ConstructionPart.TopSide]: { value: areaTopSide, chosen: areaTopSideChosen },
        [ConstructionPart.BottomSide]: { value: areaBottomSide, chosen: areaBottomSideChosen },
        [ConstructionPart.OuterWall]: { value: areaOuterWall, chosen: areaOuterWallChosen },
        [ConstructionPart.Window]: { value: areaWindow, chosen: areaWindowChosen },
    };
    const [renovationTopSide, renovationTopSideChosen] = useVariableStoreBase((state) => [
        state.building_ConstructionParts[ConstructionPart.TopSide].installationYearIfDifferentThanConstructionYear[
            state.building_ConstructionParts[ConstructionPart.TopSide].installationYearIfDifferentThanConstructionYear
                .chosen
        ](),
        state.building_ConstructionParts[ConstructionPart.TopSide].installationYearIfDifferentThanConstructionYear
            .chosen,
    ]);
    const [renovationBottomSide, renovationBottomSideChosen] = useVariableStoreBase((state) => [
        state.building_ConstructionParts[ConstructionPart.BottomSide].installationYearIfDifferentThanConstructionYear[
            state.building_ConstructionParts[ConstructionPart.BottomSide]
                .installationYearIfDifferentThanConstructionYear.chosen
        ](),
        state.building_ConstructionParts[ConstructionPart.BottomSide].installationYearIfDifferentThanConstructionYear
            .chosen,
    ]);
    const [renovationOuterWall, renovationOuterWallChosen] = useVariableStoreBase((state) => [
        state.building_ConstructionParts[ConstructionPart.OuterWall].installationYearIfDifferentThanConstructionYear[
            state.building_ConstructionParts[ConstructionPart.OuterWall].installationYearIfDifferentThanConstructionYear
                .chosen
        ](),
        state.building_ConstructionParts[ConstructionPart.OuterWall].installationYearIfDifferentThanConstructionYear
            .chosen,
    ]);
    const [renovationWindow, renovationWindowChosen] = useVariableStoreBase((state) => [
        state.building_ConstructionParts[ConstructionPart.Window].installationYearIfDifferentThanConstructionYear[
            state.building_ConstructionParts[ConstructionPart.Window].installationYearIfDifferentThanConstructionYear
                .chosen
        ](),
        state.building_ConstructionParts[ConstructionPart.Window].installationYearIfDifferentThanConstructionYear
            .chosen,
    ]);
    const constructionPartsRenovationYear = {
        [ConstructionPart.TopSide]: {
            value: renovationTopSide,
            chosen: renovationTopSideChosen,
        },
        [ConstructionPart.BottomSide]: {
            value: renovationBottomSide,
            chosen: renovationBottomSideChosen,
        },
        [ConstructionPart.OuterWall]: {
            value: renovationOuterWall,
            chosen: renovationOuterWallChosen,
        },
        [ConstructionPart.Window]: {
            value: renovationWindow,
            chosen: renovationWindowChosen,
        },
    };
    const buildingYear = useVariableStoreBase((state) => state.building_YearOfConstruction);
    useEffect(() => {
        // lauft zweimal
        // erstes mal setzt er die selects
        // zweites mal, weil sich durch das erste mal die selects geändert haben. sieht er dass nichts mehr nicht ausgefüllt ist und ändert nichts

        Object.values(ConstructionPart).forEach((key) => {
            const value = constructionPartsMethod[key];
            if (value === null) {
                console.log("effect:settingMethod");

                useVariableStoreBase.setState((state) => ({
                    building_ConstructionParts: {
                        ...state.building_ConstructionParts,
                        [key]: {
                            ...state.building_ConstructionParts[key],
                            method: getWorseHeatTransferCoefficient(buildingYear ?? -Infinity, key).method,
                        },
                    },
                }));
            }
        });
    }, [constructionPartsMethod, buildingYear]);
    const hasAllConstructionPartsFilledOut = useVariableStoreBase((state) =>
        Object.values(ConstructionPart)
            .map((part) => state.building_ConstructionParts[part].method !== null)
            .reduce((sum, cur) => sum && cur),
    );
    const hasAllConstructionPartsAreaFilledOut = useVariableStoreBase((state) =>
        Object.values(ConstructionPart)
            .map(
                (part) =>
                    state.building_ConstructionParts[part].area[
                        state.building_ConstructionParts[part].area.chosen
                    ]() !== null,
            )
            .reduce((sum, cur) => sum && cur),
    );
    const isReady = hasAllConstructionPartsFilledOut && hasAllConstructionPartsAreaFilledOut;
    useEffect(() => {
        if (props.setIsFilledOut !== undefined) props.setIsFilledOut(isReady);
    }, [isReady]);
    return (
        <DivGroup1 className="sm:grid-cols-[1fr_auto_auto_auto]">
            <Heading3>Basierend auf dem Baujahr des Hauses:</Heading3>
            {Object.values(ConstructionPart).map((entry, index) => (
                <DivGroup2Subgrid
                    key={entry}
                    className={cn("gap-4", index === 0 ? "sm:grid-rows-[auto_auto]" : "sm:grid-rows-[auto]")}
                >
                    <Label className={cn(index === 0 && "row-start-2", "row-span-full flex items-baseline")}>
                        {entry}
                    </Label>
                    <DivSelectSubgrid>
                        <Label htmlFor={`${entry}Construction`} className={cn(index !== 0 && "sm:sr-only")}>
                            Konstruktionsart
                        </Label>
                        <Select
                            value={constructionPartsMethod[entry] ?? ""}
                            onValueChange={(value) => {
                                useVariableStoreBase.setState((state) => ({
                                    building_ConstructionParts: {
                                        ...state.building_ConstructionParts,
                                        [entry]: {
                                            ...state.building_ConstructionParts[entry],
                                            method: value,
                                        },
                                    },
                                }));
                            }}
                        >
                            <SelectTrigger id={`${entry}Construction`}>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {ConstructionPartMapping[entry].map((myEntry) => {
                                    return (
                                        <SelectGroup>
                                            <SelectLabel>
                                                {myEntry === FlatRoofConstructionMethod
                                                    ? "Flachdach oder Oberste Geschossdecke"
                                                    : myEntry === AngledRoofConstructionMethod
                                                      ? "Spitzdach"
                                                      : myEntry === BottomSideConstructionMethod
                                                        ? "Bauteile gegen Erdreich oder Keller"
                                                        : myEntry === OuterWallConstructionMethod
                                                          ? "Außenwand"
                                                          : myEntry === WindowConstructionMethod
                                                            ? "Fenster"
                                                            : ""}
                                            </SelectLabel>
                                            {Object.values(myEntry).map((mapping: string) => (
                                                <SelectItem key={mapping} value={mapping}>
                                                    {mapping.substring(mapping.indexOf(",") + 1, mapping.length)}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    );
                                })}
                            </SelectContent>
                        </Select>
                    </DivSelectSubgrid>
                    <DivSelectSubgrid>
                        <Label htmlFor={`${entry}Area`} className={cn(index !== 0 && "sm:sr-only")}>
                            Bauteilfläche
                        </Label>
                        <InputWithUnitWithKeyboardDefaultCustom
                            id={`${entry}Area`}
                            currentLayout="float"
                            inputMode="numeric"
                            value={constructionPartsArea[entry].value}
                            defaultCustom={constructionPartsArea[entry].chosen}
                            pattern={INPUT_PATTERN_FLOAT_POSITIVE}
                            onChangeCallback={(value: string, validity: ValidityState) => {
                                console.log("INPUT:CHANGECALLBACK:", value, validity);
                                if (value === "") {
                                    useVariableStoreBase.setState((state) => ({
                                        building_ConstructionParts: {
                                            ...state.building_ConstructionParts,
                                            [entry]: {
                                                ...state.building_ConstructionParts[entry],
                                                area: {
                                                    ...state.building_ConstructionParts[entry].area,
                                                    _customValue: null,
                                                    chosen: DefaultCustom.Default,
                                                },
                                            },
                                        },
                                    }));
                                } else if (validity.valid || validity.valueMissing) {
                                    // ich glaube "validity.valueMissing" hier abzufragen ist unnötig oder falsch
                                    const parsed = parseFloat(setDotAsDecimalSeparator(value));
                                    useVariableStoreBase.setState((state) => ({
                                        building_ConstructionParts: {
                                            ...state.building_ConstructionParts,
                                            [entry]: {
                                                ...state.building_ConstructionParts[entry],
                                                area: {
                                                    ...state.building_ConstructionParts[entry].area,
                                                    _customValue: isNaN(parsed) ? null : parsed,
                                                    chosen: DefaultCustom.Custom,
                                                },
                                            },
                                        },
                                    }));
                                }
                            }}
                            unit={getMath("m^2").formula}
                            unitTitle={getMath("m^2").title}
                        />
                    </DivSelectSubgrid>
                    <DivSelectSubgrid>
                        <Label htmlFor={`${entry}Renovation`} className={cn(index !== 0 && "sm:sr-only")}>
                            Sanierungsjahr
                        </Label>
                        <InputWithKeyboardDefaultCustom
                            id={`${entry}Renovation`}
                            currentLayout="int"
                            inputMode="numeric"
                            value={constructionPartsRenovationYear[entry].value}
                            defaultCustom={constructionPartsRenovationYear[entry].chosen}
                            formatFunction={(value) => (value ?? 0).toString()}
                            pattern={INPUT_PATTERN_INTEGER_POSITIVE}
                            onChangeCallback={(value: string, validity: ValidityState) => {
                                console.log("INPUT:CHANGECALLBACK:", value, validity);
                                if (value === "") {
                                    useVariableStoreBase.setState((state) => ({
                                        building_ConstructionParts: {
                                            ...state.building_ConstructionParts,
                                            [entry]: {
                                                ...state.building_ConstructionParts[entry],
                                                installationYearIfDifferentThanConstructionYear: {
                                                    ...state.building_ConstructionParts[entry]
                                                        .installationYearIfDifferentThanConstructionYear,
                                                    _customValue: null,
                                                    chosen: DefaultCustom.Default,
                                                },
                                            },
                                        },
                                    }));
                                } else if (validity.valid || validity.valueMissing) {
                                    // ich glaube "validity.valueMissing" hier abzufragen ist unnötig oder falsch
                                    const parsed = parseFloat(setDotAsDecimalSeparator(value));
                                    useVariableStoreBase.setState((state) => ({
                                        building_ConstructionParts: {
                                            ...state.building_ConstructionParts,
                                            [entry]: {
                                                ...state.building_ConstructionParts[entry],
                                                installationYearIfDifferentThanConstructionYear: {
                                                    ...state.building_ConstructionParts[entry]
                                                        .installationYearIfDifferentThanConstructionYear,
                                                    _customValue: isNaN(parsed) ? null : parsed,
                                                    chosen: DefaultCustom.Custom,
                                                },
                                            },
                                        },
                                    }));
                                }
                            }}
                            // onChange={(value) => {
                            //     useVariableStoreBase.setState((state) => ({
                            //         building_ConstructionParts: {
                            //             ...state.building_ConstructionParts,
                            //             [entry]: {
                            //                 ...state.building_ConstructionParts[entry],
                            //                 installationYearIfDifferentThanConstructionYear: isNaN(
                            //                     value.target.valueAsNumber,
                            //                 )
                            //                     ? null
                            //                     : value.target.valueAsNumber,
                            //             },
                            //         },
                            //     }));
                            // }}
                        />
                    </DivSelectSubgrid>
                </DivGroup2Subgrid>
            ))}
        </DivGroup1>
    );
}
