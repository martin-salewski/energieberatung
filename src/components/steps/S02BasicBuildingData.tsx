import { StepKey } from "@/main";
import {
    INPUT_PATTERN_FLOAT_POSITIVE,
    INPUT_PATTERN_INTEGER_POSITIVE,
    INPUT_PATTERN_POSTALCODE,
} from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { StepsScaffolding } from "@/components/scaffolding/StepsScaffolding";
import { Separator } from "@/components/ui/separator";
import { getMath } from "@/tables/mathFormulars";
import { DefaultCustom, useVariableStoreBase } from "@/zustand/useVariableStore";
import { useEffect, useState } from "react";
import { Heading1, Heading2 } from "@/components/ui/heading";
import {
    DivGroup1,
    DivGroup2,
    DivGroup2Subgrid,
    DivGroup3Subgrid,
    DivInputSubgrid,
    DivSmall,
} from "@/components/scaffolding/Divs";
import { setDotAsDecimalSeparator, setLocaleAsDecimalSeparator } from "@/components/Keyboard";
import { InputWithUnitWithKeyboard } from "@/components/inputs/InputWithUnitWithKeyboard";
import { InputWithUnitWithKeyboardDefaultCustom } from "@/components/inputs/InputWithUnitWithKeyboardDefaultCustom";
import { InputWithKeyboard } from "@/components/inputs/InputWithKeyboard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

export function S02BasicBuildingData() {
    const postalCode = useVariableStoreBase((state) => state.building_PostalCode);
    const constructionYear = useVariableStoreBase((state) => state.building_YearOfConstruction);
    const residents = useVariableStoreBase((state) => state.building_NumberOfResidents);

    const [isDimensionsSet, setIsDimensionsSet] = useState<boolean>(false);
    const navigate = useNavigate();
    const canGoNext = postalCode !== null && constructionYear !== null && residents !== null && isDimensionsSet;

    const depth = useVariableStoreBase((state) => state.building_Dimensions.depth);
    const width = useVariableStoreBase((state) => state.building_Dimensions.width);
    const roomHeight = useVariableStoreBase((state) => state.building_Dimensions.roomHeight);
    const numberOfLevels = useVariableStoreBase((state) => state.building_Dimensions.numberOfLevels);

    const [area, areaChosen] = useVariableStoreBase((state) => [
        state.building_Dimensions.area[state.building_Dimensions.area.chosen](),
        state.building_Dimensions.area.chosen,
    ]);
    const [volume, volumeChosen] = useVariableStoreBase((state) => [
        state.building_Dimensions.volume[state.building_Dimensions.volume.chosen](),
        state.building_Dimensions.volume.chosen,
    ]);
    const isReady = volume !== undefined && area !== undefined;
    useEffect(() => {
        if (setIsDimensionsSet !== undefined) setIsDimensionsSet(isReady);
    }, [isReady]);
    return (
        <StepsScaffolding
            navigate={navigate}
            title={<Heading1>Datengrundlage</Heading1>}
            last={`/${StepKey.TypeOfBuilding}`}
            next={canGoNext ? `/${StepKey.DataForHeatingCalculation}` : undefined}
            className="grid grow-0 gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr]"
        >
            <DivGroup1>
                <DivGroup2 className="grid-cols-[1fr_auto]">
                    <Heading2>Projektübersicht</Heading2>
                    <DivInputSubgrid>
                        <Label htmlFor="plz">Postleitzahl:</Label>
                        <DivSmall>
                            <InputWithKeyboard
                                id="plz"
                                inputMode="numeric"
                                currentLayout="int"
                                required={true}
                                pattern={INPUT_PATTERN_POSTALCODE}
                                // placeholder={"55122"}
                                defaultValue={postalCode ?? ""}
                                onChangeCallback={(value: string, validity: ValidityState) => {
                                    if (validity.valid || validity.valueMissing) {
                                        useVariableStoreBase.setState(() => ({
                                            building_PostalCode: value === "" ? null : value,
                                        }));
                                    }
                                }}
                            />
                        </DivSmall>
                    </DivInputSubgrid>
                    <DivInputSubgrid>
                        <Label htmlFor="year">Baujahr:</Label>
                        <DivSmall>
                            <InputWithKeyboard
                                id="year"
                                currentLayout="int"
                                inputMode="numeric"
                                required={true}
                                pattern={INPUT_PATTERN_INTEGER_POSITIVE}
                                // placeholder={"1970"}
                                defaultValue={
                                    constructionYear !== null
                                        ? setLocaleAsDecimalSeparator(constructionYear.toString())
                                        : ""
                                }
                                onChangeCallback={(value: string, validity: ValidityState) => {
                                    if (validity.valid || validity.valueMissing) {
                                        const parsed = parseFloat(setDotAsDecimalSeparator(value));
                                        useVariableStoreBase.setState(() => ({
                                            building_YearOfConstruction: isNaN(parsed) ? null : parsed,
                                        }));
                                    }
                                }}
                            />
                        </DivSmall>
                    </DivInputSubgrid>
                    <DivInputSubgrid>
                        <Label htmlFor="residents">Personen:</Label>
                        <DivSmall>
                            <InputWithKeyboard
                                id="residents"
                                currentLayout="int"
                                inputMode="numeric"
                                required={true}
                                pattern={INPUT_PATTERN_INTEGER_POSITIVE}
                                // placeholder={"0"}
                                defaultValue={
                                    residents !== null ? setLocaleAsDecimalSeparator(residents.toString()) : ""
                                }
                                onChangeCallback={(value: string, validity: ValidityState) => {
                                    if (validity.valid || validity.valueMissing) {
                                        const parsed = parseFloat(setDotAsDecimalSeparator(value));
                                        useVariableStoreBase.setState(() => ({
                                            building_NumberOfResidents: isNaN(parsed) ? null : parsed,
                                        }));
                                    }
                                }}
                            />
                        </DivSmall>
                    </DivInputSubgrid>
                </DivGroup2>
            </DivGroup1>
            <Separator orientation="vertical" className="hidden md:block" />
            <Separator orientation="horizontal" className="block md:hidden" />
            {/* <DimensionsCalculation setIsDimensionsSet={setIsDimensionsSet} /> */}
            <DivGroup1 className="grid-cols-[1fr_auto]">
                <DivGroup2Subgrid>
                    <Heading2>Maße</Heading2>
                    <DivGroup3Subgrid>
                        <DivInputSubgrid>
                            <Label htmlFor="length">Länge:</Label>
                            <DivSmall>
                                <InputWithUnitWithKeyboard
                                    id="length"
                                    currentLayout="float"
                                    inputMode="numeric"
                                    required={true}
                                    pattern={INPUT_PATTERN_FLOAT_POSITIVE}
                                    placeholder={"0"}
                                    defaultValue={depth !== null ? setLocaleAsDecimalSeparator(depth.toString()) : ""}
                                    onChangeCallback={(value: string, validity: ValidityState) => {
                                        console.log("firedChangeEvent:", value, validity);
                                        if (validity.valid || validity.valueMissing) {
                                            const parsed = parseFloat(setDotAsDecimalSeparator(value));
                                            useVariableStoreBase.setState((state) => ({
                                                building_Dimensions: {
                                                    ...state.building_Dimensions,
                                                    depth: isNaN(parsed) ? null : parsed,
                                                },
                                            }));
                                        }
                                    }}
                                    unit={getMath("m").formula}
                                    unitTitle={getMath("m").title}
                                />
                            </DivSmall>
                        </DivInputSubgrid>
                        <DivInputSubgrid>
                            <Label htmlFor="width">Breite:</Label>
                            <DivSmall>
                                <InputWithUnitWithKeyboard
                                    id="width"
                                    currentLayout="float"
                                    inputMode="numeric"
                                    required={true}
                                    pattern={INPUT_PATTERN_FLOAT_POSITIVE}
                                    placeholder={"0"}
                                    defaultValue={width !== null ? setLocaleAsDecimalSeparator(width.toString()) : ""}
                                    onChangeCallback={(value: string, validity: ValidityState) => {
                                        if (validity.valid || validity.valueMissing) {
                                            const parsed = parseFloat(setDotAsDecimalSeparator(value));
                                            useVariableStoreBase.setState((state) => ({
                                                building_Dimensions: {
                                                    ...state.building_Dimensions,
                                                    width: isNaN(parsed) ? null : parsed,
                                                },
                                            }));
                                        }
                                    }}
                                    unit={getMath("m").formula}
                                    unitTitle={getMath("m").title}
                                />
                            </DivSmall>
                        </DivInputSubgrid>
                        <DivInputSubgrid>
                            <Label htmlFor="roomHeight">Raumhöhe:</Label>
                            <DivSmall>
                                <InputWithUnitWithKeyboard
                                    id="roomHeight"
                                    currentLayout="float"
                                    inputMode="numeric"
                                    required={true}
                                    pattern={INPUT_PATTERN_FLOAT_POSITIVE}
                                    placeholder={"0"}
                                    defaultValue={
                                        roomHeight !== null ? setLocaleAsDecimalSeparator(roomHeight.toString()) : ""
                                    }
                                    onChangeCallback={(value: string, validity: ValidityState) => {
                                        if (validity.valid || validity.valueMissing) {
                                            const parsed = parseFloat(setDotAsDecimalSeparator(value));
                                            useVariableStoreBase.setState((state) => ({
                                                building_Dimensions: {
                                                    ...state.building_Dimensions,
                                                    roomHeight: isNaN(parsed) ? null : parsed,
                                                },
                                            }));
                                        }
                                    }}
                                    unit={getMath("m").formula}
                                    unitTitle={getMath("m").title}
                                />
                            </DivSmall>
                        </DivInputSubgrid>
                        <DivInputSubgrid>
                            <Label htmlFor="levels">Etagenanzahl:</Label>
                            <DivSmall>
                                <InputWithKeyboard
                                    id="levels"
                                    currentLayout="float"
                                    inputMode="numeric"
                                    required={true}
                                    pattern={INPUT_PATTERN_INTEGER_POSITIVE}
                                    placeholder={"0"}
                                    defaultValue={
                                        numberOfLevels !== null
                                            ? setLocaleAsDecimalSeparator(numberOfLevels.toString())
                                            : ""
                                    }
                                    onChangeCallback={(value: string, validity: ValidityState) => {
                                        if (validity.valid || validity.valueMissing) {
                                            const parsed = parseFloat(setDotAsDecimalSeparator(value));
                                            useVariableStoreBase.setState((state) => ({
                                                building_Dimensions: {
                                                    ...state.building_Dimensions,
                                                    numberOfLevels: isNaN(parsed) ? null : parsed,
                                                },
                                            }));
                                        }
                                    }}
                                />
                            </DivSmall>
                        </DivInputSubgrid>
                    </DivGroup3Subgrid>
                </DivGroup2Subgrid>
            </DivGroup1>
            <Separator orientation="vertical" className="hidden md:block" />
            <Separator orientation="horizontal" className="block md:hidden" />
            <DivGroup1>
                <div className="grid h-min gap-2">
                    <Heading2 className="">Ergebnis</Heading2>
                    {/* <span>(kann überschrieben werden)</span> */}
                    <div className="grid h-min grid-cols-[1fr_auto] items-baseline gap-2">
                        <Label htmlFor="area">Fläche:</Label>
                        <DivSmall>
                            <InputWithUnitWithKeyboardDefaultCustom
                                id="area"
                                currentLayout="float"
                                inputMode="numeric"
                                value={area}
                                defaultCustom={areaChosen}
                                pattern={INPUT_PATTERN_FLOAT_POSITIVE}
                                onChangeCallback={(value: string, validity: ValidityState) => {
                                    console.log("INPUT:CHANGECALLBACK:", value, validity);
                                    if (value === "") {
                                        useVariableStoreBase.setState((state) => ({
                                            building_Dimensions: {
                                                ...state.building_Dimensions,
                                                area: {
                                                    ...state.building_Dimensions.area,
                                                    _customValue: null,
                                                    chosen: DefaultCustom.Default,
                                                },
                                            },
                                        }));
                                    } else if (validity.valid || validity.valueMissing) {
                                        // ich glaube "validity.valueMissing" hier abzufragen ist unnötig oder falsch
                                        const parsed = parseFloat(setDotAsDecimalSeparator(value));
                                        useVariableStoreBase.setState((state) => ({
                                            building_Dimensions: {
                                                ...state.building_Dimensions,
                                                area: {
                                                    ...state.building_Dimensions.area,
                                                    _customValue: isNaN(parsed) ? null : parsed,
                                                    chosen: DefaultCustom.Custom,
                                                },
                                            },
                                        }));
                                    }
                                }}
                                unit={getMath("m^2").formula}
                                unitTitle={getMath("m^2").title}
                            />
                        </DivSmall>

                        <Label htmlFor="volume">Volumen:</Label>
                        <DivSmall>
                            <InputWithUnitWithKeyboardDefaultCustom
                                id="volume"
                                currentLayout="float"
                                inputMode="numeric"
                                value={volume}
                                defaultCustom={volumeChosen}
                                pattern={INPUT_PATTERN_FLOAT_POSITIVE}
                                onChangeCallback={(value: string, validity: ValidityState) => {
                                    console.log("INPUT:CHANGECALLBACK:", value, validity);
                                    if (value === "") {
                                        useVariableStoreBase.setState((state) => ({
                                            building_Dimensions: {
                                                ...state.building_Dimensions,
                                                volume: {
                                                    ...state.building_Dimensions.volume,
                                                    _customValue: null,
                                                    chosen: DefaultCustom.Default,
                                                },
                                            },
                                        }));
                                    } else if (validity.valid || validity.valueMissing) {
                                        // ich glaube "validity.valueMissing" hier abzufragen ist unnötig oder falsch
                                        const parsed = parseFloat(setDotAsDecimalSeparator(value));
                                        useVariableStoreBase.setState((state) => ({
                                            building_Dimensions: {
                                                ...state.building_Dimensions,
                                                volume: {
                                                    ...state.building_Dimensions.volume,
                                                    _customValue: isNaN(parsed) ? null : parsed,
                                                    chosen: DefaultCustom.Custom,
                                                },
                                            },
                                        }));
                                    }
                                }}
                                unit={getMath("m^3").formula}
                                unitTitle={getMath("m^3").title}
                            />
                        </DivSmall>
                    </div>
                    <Alert>
                        <Info className="h-4 w-4" />
                        <AlertDescription>
                            Flächen und Volumen werden automatisch berechnet, aber können bei Bedarf individuell
                            angepasst werden.
                        </AlertDescription>
                    </Alert>
                </div>
            </DivGroup1>
        </StepsScaffolding>
    );
}
