import { StepKey } from "@/main";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { DefaultCustom, ExistingHeatGenerator, HeatPumpType, useVariableStoreBase } from "@/zustand/useVariableStore";
import { StepsScaffolding } from "@/components/scaffolding/StepsScaffolding";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { INPUT_PATTERN_FLOAT_POSITIVE } from "@/components/ui/input";
import { getMath } from "@/tables/mathFormulars";
import { useEffect, useRef } from "react";
import { mapFuelTypeToExistingHeatGenerator } from "@/tables/CO2EmissionFactorsOfVariousEnergySources";
import { Heading1, Heading2 } from "@/components/ui/heading";
import {
    DivCheckbox,
    DivGroup1,
    DivGroup2,
    DivGroup3,
    DivInput,
    DivRadioGroupItem,
} from "@/components/scaffolding/Divs";
import { Separator } from "@/components/ui/separator";
import { InputWithKeyboardDefaultCustom } from "@/components/inputs/InputWithKeyboardDefaultCustom";
import { setDotAsDecimalSeparator } from "@/components/Keyboard";
import { InputWithUnitWithKeyboardDefaultCustom } from "@/components/inputs/InputWithUnitWithKeyboardDefaultCustom";
import { OBJOptionalNachkomma } from "@/components/steps/Testing";

export function S05DataForElectricityCalculation() {
    const needsFuel = useVariableStoreBase(
        (state) => state.building_HeatPump_CoverageRatioInPercent_AfterGeneralData < 100,
    );
    const fuelType = useVariableStoreBase((state) => state.building_PreviousYearFuelConsumption.type);
    const usedHeatGenerator = useVariableStoreBase((state) => state.building_ExistingHeatGenerator);
    const heatPumpType = useVariableStoreBase((state) => state.building_HeatPumpType);
    const [heatPumpJaz, heatPumpJazChosen] = useVariableStoreBase((state) => [
        state.building_HeatPump_JAZ[state.building_HeatPump_JAZ.chosen](),
        state.building_HeatPump_JAZ.chosen,
    ]);
    const usesElectricCar = useVariableStoreBase((state) => state.building_ElectricCar.isUsed);
    const [drivenValue, drivenValueChosen] = useVariableStoreBase((state) => [
        state.building_ElectricCar.value[state.building_ElectricCar.value.chosen](),
        state.building_ElectricCar.value.chosen,
    ]);
    useEffect(() => {
        if (fuelType === null) return undefined;
        useVariableStoreBase.setState(() => ({
            building_ExistingHeatGenerator: mapFuelTypeToExistingHeatGenerator(fuelType),
        }));
    }, [fuelType]);

    const inputRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        if (inputRef.current)
            inputRef.current.placeholder = (heatPumpJaz ?? 0).toLocaleString(navigator.languages, OBJOptionalNachkomma);
    }, [heatPumpType]);
    const navigate = useNavigate();
    const filledOutFuel = needsFuel ? usedHeatGenerator !== null : true;
    const filledOutHeatPump = heatPumpType !== null ? heatPumpType !== undefined : true;
    const canGoNext = filledOutFuel && filledOutHeatPump;
    return (
        <StepsScaffolding
            className="grid grow-0 gap-4 md:grid-cols-[auto_auto_1fr_auto_auto]"
            navigate={navigate}
            title={<Heading1>Einflussfaktoren</Heading1>}
            last={`/${StepKey.HeatingCalculation}`}
            next={canGoNext ? `/${StepKey.ResultsAfterGeneralData}` : undefined}
        >
            <DivGroup1>
                <DivGroup2>
                    <Heading2>Brennstoff</Heading2>
                    <DivCheckbox>
                        <Checkbox
                            id={"usesFuel"}
                            checked={needsFuel}
                            disabled={true}
                            // TODO weiß nciht ob das gebraucht wird: aria-readonly={true}
                        />
                        <Label htmlFor={"usesFuel"}>Brennstoff wird verwendet.</Label>
                    </DivCheckbox>
                    <DivGroup3>
                        <Label htmlFor="heatGeneratorType">Verwendeter Brennstoff:</Label>
                        <RadioGroup
                            id="heatGeneratorType"
                            value={usedHeatGenerator ?? ""}
                            disabled={needsFuel === false || fuelType !== null}
                        >
                            {Object.values(ExistingHeatGenerator).map((type) => (
                                <DivRadioGroupItem key={type}>
                                    <RadioGroupItem
                                        id={type}
                                        value={type}
                                        onClick={() => {
                                            useVariableStoreBase.setState(() => ({
                                                building_ExistingHeatGenerator: type,
                                            }));
                                        }}
                                    />
                                    <Label htmlFor={type}>{type}</Label>
                                </DivRadioGroupItem>
                            ))}
                        </RadioGroup>
                    </DivGroup3>
                </DivGroup2>
            </DivGroup1>
            <Separator orientation="vertical" />
            <DivGroup1>
                <DivGroup2>
                    <Heading2>Wärmepumpe</Heading2>
                    <DivCheckbox>
                        <Checkbox
                            id={"usesHeatPump"}
                            checked={heatPumpType !== null}
                            disabled={true}
                            // TODO weiß nciht ob das gebraucht wird: aria-readonly={true}
                        />
                        <Label htmlFor={"usesHeatPump"}>Wärmepumpe wird verwendet.</Label>
                    </DivCheckbox>
                    <DivGroup3>
                        <Label htmlFor="heatingPumpType">Verwendete Wärmepumpe:</Label>
                        <RadioGroup id="heatingPumpType" value={heatPumpType ?? ""} disabled={heatPumpType === null}>
                            {Object.values(HeatPumpType).map((type) => (
                                <DivRadioGroupItem key={type}>
                                    <RadioGroupItem
                                        id={type}
                                        value={type}
                                        onClick={() => {
                                            useVariableStoreBase.setState(() => ({
                                                building_HeatPumpType: type,
                                            }));
                                        }}
                                    />
                                    <Label htmlFor={type}>{type}</Label>
                                </DivRadioGroupItem>
                            ))}
                        </RadioGroup>
                        <DivInput>
                            <div>
                                <span>{"=>"}</span>
                                <Label htmlFor="jaz">Jahresarbeitszahl:</Label>
                            </div>
                            <InputWithKeyboardDefaultCustom
                                ref={inputRef}
                                id="jaz"
                                disabled={heatPumpType === null}
                                currentLayout="float"
                                inputMode="numeric"
                                value={heatPumpJaz}
                                defaultCustom={heatPumpJazChosen}
                                pattern={INPUT_PATTERN_FLOAT_POSITIVE}
                                onChangeCallback={(value: string, validity: ValidityState) => {
                                    console.log("INPUT:CHANGECALLBACK:", value, validity);
                                    if (value === "") {
                                        useVariableStoreBase.setState((state) => ({
                                            building_HeatPump_JAZ: {
                                                ...state.building_HeatPump_JAZ,
                                                _customValue: null,
                                                chosen: DefaultCustom.Default,
                                            },
                                        }));
                                    } else if (validity.valid || validity.valueMissing) {
                                        // ich glaube "validity.valueMissing" hier abzufragen ist unnötig oder falsch
                                        const parsed = parseFloat(setDotAsDecimalSeparator(value));
                                        useVariableStoreBase.setState((state) => ({
                                            building_HeatPump_JAZ: {
                                                ...state.building_HeatPump_JAZ,
                                                _customValue: isNaN(parsed) ? null : parsed,
                                                chosen: DefaultCustom.Custom,
                                            },
                                        }));
                                    }
                                }}
                            />
                        </DivInput>
                    </DivGroup3>
                </DivGroup2>
            </DivGroup1>
            <Separator orientation="vertical" />
            <DivGroup1>
                <DivGroup2>
                    <Heading2>Weitere Stromverbraucher</Heading2>
                    <DivCheckbox>
                        <Checkbox
                            id={"hasElectricCar"}
                            checked={usesElectricCar}
                            onCheckedChange={(value) =>
                                (value === true || value === false) &&
                                useVariableStoreBase.setState((state) => ({
                                    building_ElectricCar: {
                                        ...state.building_ElectricCar,
                                        isUsed: value,
                                    },
                                }))
                            }
                        />
                        <Label htmlFor={"hasElectricCar"}>ein Elektroauto ist vorhanden.</Label>
                    </DivCheckbox>
                    <DivGroup3>
                        <DivInput>
                            <Label htmlFor="driven">Gefahrene Kilometer pro Jahr:</Label>
                            <InputWithUnitWithKeyboardDefaultCustom
                                id="driven"
                                disabled={usesElectricCar === false}
                                currentLayout="float"
                                inputMode="numeric"
                                value={drivenValue}
                                defaultCustom={drivenValueChosen}
                                pattern={INPUT_PATTERN_FLOAT_POSITIVE}
                                onChangeCallback={(value: string, validity: ValidityState) => {
                                    console.log("INPUT:CHANGECALLBACK:", value, validity);
                                    if (value === "") {
                                        useVariableStoreBase.setState((state) => ({
                                            building_ElectricCar: {
                                                ...state.building_ElectricCar,
                                                value: {
                                                    ...state.building_ElectricCar.value,
                                                    _customValue: null,
                                                    chosen: DefaultCustom.Default,
                                                },
                                            },
                                        }));
                                    } else if (validity.valid || validity.valueMissing) {
                                        // ich glaube "validity.valueMissing" hier abzufragen ist unnötig oder falsch
                                        const parsed = parseFloat(setDotAsDecimalSeparator(value));
                                        useVariableStoreBase.setState((state) => ({
                                            building_ElectricCar: {
                                                ...state.building_ElectricCar,
                                                value: {
                                                    ...state.building_ElectricCar.value,
                                                    _customValue: isNaN(parsed) ? null : parsed,
                                                    chosen: DefaultCustom.Custom,
                                                },
                                            },
                                        }));
                                    }
                                }}
                                unit={getMath("km/a").formula}
                                unitTitle={getMath("km/a").title}
                            />
                        </DivInput>
                    </DivGroup3>
                </DivGroup2>
            </DivGroup1>
        </StepsScaffolding>
    );
}
