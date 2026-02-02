import { StepKey } from "@/main";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import {
    DefaultCustom,
    FinalEnergyDemand_Q_E_Calculation,
    WarmWaterOrigin,
    useVariableStoreBase,
} from "@/zustand/useVariableStore";
import { StepsScaffolding } from "@/components/scaffolding/StepsScaffolding";
import { Checkbox } from "@/components/ui/checkbox";
import { INPUT_PATTERN_FLOAT_POSITIVE, INPUT_PATTERN_PERCENTAGE, InputWithUnit } from "@/components/ui/input";
import { getMath } from "@/tables/mathFormulars";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Heading1, Heading2 } from "@/components/ui/heading";
import {
    DivCheckbox,
    DivCheckboxSubgrid,
    DivGroup1,
    DivGroup2,
    DivGroup2Subgrid,
    DivGroup3Subgrid,
    DivInputSubgrid,
    DivRadioGroupItem,
    DivSmall,
} from "@/components/scaffolding/Divs";
import { InputWithUnitWithKeyboard } from "@/components/inputs/InputWithUnitWithKeyboard";
import { setDotAsDecimalSeparator, setLocaleAsDecimalSeparator } from "@/components/Keyboard";
import { OBJOptionalNachkomma } from "@/components/steps/Testing";
import { InputWithUnitWithKeyboardDefaultCustom } from "@/components/inputs/InputWithUnitWithKeyboardDefaultCustom";

export function S04HeatingCalculation() {
    const chosenPath = useVariableStoreBase((state) => state.building_FinalEnergyDemand_BasedOn);
    const warmWaterIsDecentralized = useVariableStoreBase(
        (state) => state.building_WarmWaterOrigin === WarmWaterOrigin.Decentralized,
    );
    const warmWaterOrigin = useVariableStoreBase((state) => state.building_WarmWaterOrigin);
    const [airExchangeRate, airExchangeRateChosen] = useVariableStoreBase((state) => [
        state.building_Ventilation.airExchangeRate[state.building_Ventilation.airExchangeRate.chosen](),
        state.building_Ventilation.airExchangeRate.chosen,
    ]);
    const [differentVolume, differentVolumeChosen] = useVariableStoreBase((state) => [
        state.building_Ventilation.volumeIfDifferentThanBuildingVolume[
            state.building_Ventilation.volumeIfDifferentThanBuildingVolume.chosen
        ](),
        state.building_Ventilation.volumeIfDifferentThanBuildingVolume.chosen,
    ]);
    const usesVentilationSystem = useVariableStoreBase(
        (state) => state.building_Ventilation.alreadyHasVentilationSystem,
    );
    const usesWRG = useVariableStoreBase((state) => state.building_Ventilation.usesWRG);
    const [wrgEfficiency, wrgEfficiencyChosen] = useVariableStoreBase((state) => [
        state.building_Ventilation.efficiencyinPercent[state.building_Ventilation.efficiencyinPercent.chosen](),
        state.building_Ventilation.efficiencyinPercent.chosen,
    ]);
    //TODO
    useEffect(() => {
        if (chosenPath === FinalEnergyDemand_Q_E_Calculation.BasedOnHeatingLoad && warmWaterOrigin === null) {
            useVariableStoreBase.setState(() => ({
                building_WarmWaterOrigin: WarmWaterOrigin.Exclusive,
            }));
        }
    }, [chosenPath]);

    const navigate = useNavigate();
    const [isHeatingDemandSet, setIsHeatingDemandSet] = useState<boolean>(false);
    const canGoNext =
        chosenPath === FinalEnergyDemand_Q_E_Calculation.BasedOnHeatingLoad
            ? isHeatingDemandSet
            : chosenPath === FinalEnergyDemand_Q_E_Calculation.BasedOnHeatingDemand
              ? isHeatingDemandSet && warmWaterOrigin !== null
              : false;
    return (
        <StepsScaffolding
            className="grid grow-0 gap-4 md:grid-cols-[1fr_auto_1fr]"
            navigate={navigate}
            title={<Heading1>Einflussfaktoren</Heading1>}
            last={`/${StepKey.DataForHeatingCalculation}`}
            next={canGoNext ? `/${StepKey.DataForElectricityCalculation}` : undefined}
        >
            <DivGroup1 className="grid sm:grid-cols-[1fr_auto]">
                <DivGroup2 className="col-span-full">
                    <Label htmlFor={"warmwater"}>
                        <Heading2>Warmwassererzeugung</Heading2>
                    </Label>
                    {chosenPath === FinalEnergyDemand_Q_E_Calculation.BasedOnHeatingLoad ? (
                        <DivCheckbox>
                            <Checkbox
                                id={"warmwaterCheck"}
                                checked={warmWaterIsDecentralized}
                                onCheckedChange={(value) =>
                                    (value === true || value === false) &&
                                    useVariableStoreBase.setState(() => ({
                                        building_WarmWaterOrigin: value
                                            ? WarmWaterOrigin.Decentralized
                                            : WarmWaterOrigin.Exclusive,
                                    }))
                                }
                            />
                            <Label htmlFor={"warmwaterCheck"}>dezentral erzeugt.</Label>
                        </DivCheckbox>
                    ) : chosenPath === FinalEnergyDemand_Q_E_Calculation.BasedOnHeatingDemand ? (
                        <RadioGroup value={warmWaterOrigin ?? ""} id="warmwater">
                            {Object.values(WarmWaterOrigin).map((entry) => (
                                <DivRadioGroupItem key={entry}>
                                    <RadioGroupItem
                                        id={entry}
                                        value={entry}
                                        onClick={() =>
                                            useVariableStoreBase.setState(() => ({
                                                building_WarmWaterOrigin: entry,
                                            }))
                                        }
                                    />
                                    <Label htmlFor={entry}>
                                        {entry === WarmWaterOrigin.Decentralized ? (
                                            <>dezentral</>
                                        ) : entry === WarmWaterOrigin.Exclusive ? (
                                            <>kein eigener Brennstoff</>
                                        ) : entry === WarmWaterOrigin.Inclusive ? (
                                            <>eigener Brennstoff</>
                                        ) : undefined}
                                    </Label>
                                </DivRadioGroupItem>
                            ))}
                        </RadioGroup>
                    ) : (
                        <></>
                    )}
                </DivGroup2>

                <DivGroup2Subgrid>
                    <Heading2>Lüftung</Heading2>
                    <DivInputSubgrid>
                        <Label htmlFor="exchangeRate">Austausch des Raumvolumens in:</Label>
                        <DivSmall>
                            <InputWithUnitWithKeyboardDefaultCustom
                                id="exchangeRate"
                                currentLayout="float"
                                inputMode="numeric"
                                value={airExchangeRate}
                                defaultCustom={airExchangeRateChosen}
                                pattern={INPUT_PATTERN_FLOAT_POSITIVE}
                                onChangeCallback={(value: string, validity: ValidityState) => {
                                    console.log("INPUT:CHANGECALLBACK:", value, validity);
                                    if (value === "") {
                                        useVariableStoreBase.setState((state) => ({
                                            building_Ventilation: {
                                                ...state.building_Ventilation,
                                                airExchangeRate: {
                                                    ...state.building_Ventilation.airExchangeRate,
                                                    _customValue: null,
                                                    chosen: DefaultCustom.Default,
                                                },
                                            },
                                        }));
                                    } else if (validity.valid || validity.valueMissing) {
                                        // ich glaube "validity.valueMissing" hier abzufragen ist unnötig oder falsch
                                        const parsed = parseFloat(setDotAsDecimalSeparator(value));
                                        useVariableStoreBase.setState((state) => ({
                                            building_Ventilation: {
                                                ...state.building_Ventilation,
                                                airExchangeRate: {
                                                    ...state.building_Ventilation.airExchangeRate,
                                                    _customValue: isNaN(parsed) ? null : parsed,
                                                    chosen: DefaultCustom.Custom,
                                                },
                                            },
                                        }));
                                    }
                                }}
                                unit={getMath("h").formula}
                                unitTitle={getMath("h").title}
                                className="sm:w-sm"
                            />
                        </DivSmall>
                    </DivInputSubgrid>
                    <DivCheckboxSubgrid>
                        <Checkbox
                            id={"ventilationSystem"}
                            checked={usesVentilationSystem}
                            onCheckedChange={(value) =>
                                (value === true || value === false) &&
                                useVariableStoreBase.setState((state) => ({
                                    building_Ventilation: {
                                        ...state.building_Ventilation,
                                        alreadyHasVentilationSystem: value,
                                        usesWRG: value === false ? false : state.building_Ventilation.usesWRG,
                                    },
                                }))
                            }
                        />

                        <Label htmlFor={"ventilationSystem"}>Lüftungsanlage vorhanden</Label>
                    </DivCheckboxSubgrid>
                    {usesVentilationSystem && (
                        <>
                            <DivGroup3Subgrid>
                                <DivInputSubgrid>
                                    <Label htmlFor="exchangeRate">Raumvolumen, welches ausgetauscht wird:</Label>
                                    <DivSmall>
                                        <InputWithUnitWithKeyboardDefaultCustom
                                            id="exchangeRate"
                                            currentLayout="float"
                                            inputMode="numeric"
                                            value={differentVolume}
                                            defaultCustom={differentVolumeChosen}
                                            pattern={INPUT_PATTERN_FLOAT_POSITIVE}
                                            onChangeCallback={(value: string, validity: ValidityState) => {
                                                console.log("INPUT:CHANGECALLBACK:", value, validity);
                                                if (value === "") {
                                                    useVariableStoreBase.setState((state) => ({
                                                        building_Ventilation: {
                                                            ...state.building_Ventilation,
                                                            volumeIfDifferentThanBuildingVolume: {
                                                                ...state.building_Ventilation
                                                                    .volumeIfDifferentThanBuildingVolume,
                                                                _customValue: null,
                                                                chosen: DefaultCustom.Default,
                                                            },
                                                        },
                                                    }));
                                                } else if (validity.valid || validity.valueMissing) {
                                                    // ich glaube "validity.valueMissing" hier abzufragen ist unnötig oder falsch
                                                    const parsed = parseFloat(setDotAsDecimalSeparator(value));
                                                    useVariableStoreBase.setState((state) => ({
                                                        building_Ventilation: {
                                                            ...state.building_Ventilation,
                                                            volumeIfDifferentThanBuildingVolume: {
                                                                ...state.building_Ventilation
                                                                    .volumeIfDifferentThanBuildingVolume,
                                                                _customValue: isNaN(parsed) ? null : parsed,
                                                                chosen: DefaultCustom.Custom,
                                                            },
                                                        },
                                                    }));
                                                }
                                            }}
                                            unit={getMath("(m^3)/(kW)").formula}
                                            unitTitle={getMath("(m^3)/(kW)").title}
                                            className="sm:w-sm"
                                        />
                                    </DivSmall>
                                </DivInputSubgrid>
                            </DivGroup3Subgrid>
                            <DivGroup3Subgrid>
                                <DivCheckboxSubgrid>
                                    <Checkbox
                                        id={"usesWRG"}
                                        checked={usesWRG}
                                        // disabled={usesVentilationSystem === false}
                                        onCheckedChange={(value) =>
                                            (value === true || value === false) &&
                                            useVariableStoreBase.setState((state) => ({
                                                building_Ventilation: {
                                                    ...state.building_Ventilation,
                                                    usesWRG: value,
                                                },
                                            }))
                                        }
                                    />
                                    <Label htmlFor={"usesWRG"}>Wärmerückgewinnung (WRG) vorhanden.</Label>
                                </DivCheckboxSubgrid>
                                {usesWRG && (
                                    <DivGroup3Subgrid>
                                        <DivInputSubgrid>
                                            <Label htmlFor="efficiency">Wärmerückgewinnungsgrad:</Label>
                                            <DivSmall>
                                                <InputWithUnitWithKeyboardDefaultCustom
                                                    id="efficiency"
                                                    // disabled={usesWRG === false}
                                                    currentLayout="float"
                                                    inputMode="numeric"
                                                    value={wrgEfficiency}
                                                    defaultCustom={wrgEfficiencyChosen}
                                                    pattern={INPUT_PATTERN_PERCENTAGE}
                                                    onChangeCallback={(value: string, validity: ValidityState) => {
                                                        console.log("INPUT:CHANGECALLBACK:", value, validity);
                                                        if (value === "") {
                                                            useVariableStoreBase.setState((state) => ({
                                                                building_Ventilation: {
                                                                    ...state.building_Ventilation,
                                                                    efficiencyinPercent: {
                                                                        ...state.building_Ventilation
                                                                            .efficiencyinPercent,
                                                                        _customValue: null,
                                                                        chosen: DefaultCustom.Default,
                                                                    },
                                                                },
                                                            }));
                                                        } else if (validity.valid || validity.valueMissing) {
                                                            // ich glaube "validity.valueMissing" hier abzufragen ist unnötig oder falsch
                                                            const parsed = parseFloat(setDotAsDecimalSeparator(value));
                                                            useVariableStoreBase.setState((state) => ({
                                                                building_Ventilation: {
                                                                    ...state.building_Ventilation,
                                                                    efficiencyinPercent: {
                                                                        ...state.building_Ventilation
                                                                            .efficiencyinPercent,
                                                                        _customValue: isNaN(parsed) ? null : parsed,
                                                                        chosen: DefaultCustom.Custom,
                                                                    },
                                                                },
                                                            }));
                                                        }
                                                    }}
                                                    unit={getMath("%").formula}
                                                    unitTitle={getMath("%").title}
                                                    className="sm:w-sm"
                                                />
                                            </DivSmall>
                                        </DivInputSubgrid>
                                    </DivGroup3Subgrid>
                                )}
                            </DivGroup3Subgrid>
                        </>
                    )}
                </DivGroup2Subgrid>
            </DivGroup1>
            <Separator orientation="vertical" />
            <CalculationHeatingDemand setIsHeatingDemandSet={setIsHeatingDemandSet} />
        </StepsScaffolding>
    );
}

function CalculationHeatingDemand(props: { setIsHeatingDemandSet?: (isSet: boolean) => void }) {
    const heatingDemandFuel = useVariableStoreBase((state) => state.building_HeatingDemand_Q_W_Fuel_AfterGeneralData());
    const usesHeatPump = useVariableStoreBase((state) => state.building_HeatPumpType !== null);
    const heatPumpValue = useVariableStoreBase((state) => state.building_HeatingDemand_Q_W_WP_AfterGeneralData());
    const heatPumpCoverage = useVariableStoreBase(
        (state) => state.building_HeatPump_CoverageRatioInPercent_AfterGeneralData,
    );
    const [utilizedHours, utilizedHoursChosen] = useVariableStoreBase((state) => [
        state.building_UtilizedHours[state.building_UtilizedHours.chosen](),
        state.building_UtilizedHours.chosen,
    ]);
    const [heatingDemand, heatingDemandChosen] = useVariableStoreBase((state) => [
        state.building_HeatingDemand_Q_W_AfterGeneralData[state.building_HeatingDemand_Q_W_AfterGeneralData.chosen](),
        state.building_HeatingDemand_Q_W_AfterGeneralData.chosen,
    ]);
    const isReady = heatingDemand !== undefined;
    useEffect(() => {
        if (props.setIsHeatingDemandSet !== undefined) props.setIsHeatingDemandSet(isReady);
    }, [isReady]);
    return (
        <DivGroup1 className="grid sm:grid-cols-[1fr_auto]">
            <DivGroup2Subgrid>
                <Heading2>Wärmepumpe</Heading2>
                <DivCheckboxSubgrid>
                    <Checkbox
                        id="heatpumpUsed"
                        checked={usesHeatPump}
                        onCheckedChange={() => {
                            useVariableStoreBase.setState((state) => ({
                                building_HeatPumpType: state.building_HeatPumpType === null ? undefined : null,
                            }));
                        }}
                    />
                    <Label htmlFor="heatpumpUsed">eine Wärmepumpe wird benutzt.</Label>
                </DivCheckboxSubgrid>
                <DivInputSubgrid>
                    <Label htmlFor="heatPumpCoverage">Deckungsanteil:</Label>
                    <DivSmall>
                        <InputWithUnitWithKeyboard
                            id="heatPumpCoverage"
                            disabled={usesHeatPump === false}
                            currentLayout="float"
                            inputMode="numeric"
                            required={true}
                            pattern={INPUT_PATTERN_PERCENTAGE}
                            placeholder={"0"}
                            defaultValue={
                                heatPumpCoverage !== null
                                    ? setLocaleAsDecimalSeparator(heatPumpCoverage.toString())
                                    : ""
                            }
                            onChangeCallback={(value: string, validity: ValidityState) => {
                                if (validity.valid || validity.valueMissing) {
                                    const parsed = parseFloat(setDotAsDecimalSeparator(value));
                                    useVariableStoreBase.setState(() => ({
                                        building_HeatPump_CoverageRatioInPercent_AfterGeneralData: isNaN(parsed)
                                            ? 0
                                            : parsed,
                                    }));
                                }
                            }}
                            unit={getMath("%").formula}
                            unitTitle={getMath("%").title}
                            className="sm:w-sm" // TODO warum ist das hier? wird das noch benötigt?
                        />
                    </DivSmall>
                </DivInputSubgrid>
            </DivGroup2Subgrid>

            <Heading2>Wärmebedarfsrechnung</Heading2>
            <DivGroup2Subgrid>
                <DivInputSubgrid>
                    <Label htmlFor="usedHours">Vollbenutzungsstunden:</Label>
                    <DivSmall>
                        <InputWithUnitWithKeyboardDefaultCustom
                            id="usedHours"
                            currentLayout="float"
                            inputMode="numeric"
                            value={utilizedHours}
                            defaultCustom={utilizedHoursChosen}
                            pattern={INPUT_PATTERN_FLOAT_POSITIVE}
                            onChangeCallback={(value: string, validity: ValidityState) => {
                                console.log("INPUT:CHANGECALLBACK:", value, validity);
                                if (value === "") {
                                    useVariableStoreBase.setState((state) => ({
                                        building_UtilizedHours: {
                                            ...state.building_UtilizedHours,
                                            _customValue: null,
                                            chosen: DefaultCustom.Default,
                                        },
                                    }));
                                } else if (validity.valid || validity.valueMissing) {
                                    // ich glaube "validity.valueMissing" hier abzufragen ist unnötig oder falsch
                                    const parsed = parseFloat(setDotAsDecimalSeparator(value));
                                    useVariableStoreBase.setState((state) => ({
                                        building_UtilizedHours: {
                                            ...state.building_UtilizedHours,
                                            _customValue: isNaN(parsed) ? null : parsed,
                                            chosen: DefaultCustom.Custom,
                                        },
                                    }));
                                }
                            }}
                            unit={getMath("h/a").formula}
                            unitTitle={getMath("h/a").title}
                            className="sm:w-sm"
                        />
                    </DivSmall>
                </DivInputSubgrid>
                <Separator decorative={true} className="col-span-full" />
                <DivInputSubgrid>
                    <Label htmlFor="heatingDemandFuel">Wärmebedarf (Brennstoffe):</Label>
                    <DivSmall>
                        <InputWithUnit
                            id="heatingDemandFuel"
                            disabled={true}
                            placeholder={"0"}
                            value={
                                heatingDemandFuel !== undefined
                                    ? heatingDemandFuel.toLocaleString(navigator.languages, OBJOptionalNachkomma)
                                    : ""
                            }
                            unit={getMath("kWh/a").formula}
                            unitTitle={getMath("kWh/a").title}
                            className="sm:w-sm"
                        />
                    </DivSmall>
                </DivInputSubgrid>
                <DivInputSubgrid>
                    <Label htmlFor="heatPumpValue">Wärmebedarf (Wärmepumpe):</Label>
                    <DivSmall>
                        <InputWithUnit
                            id="heatPumpValue"
                            disabled={true}
                            readOnly={true}
                            placeholder={"0"}
                            value={
                                heatPumpValue !== undefined
                                    ? heatPumpValue.toLocaleString(navigator.languages, OBJOptionalNachkomma)
                                    : ""
                            }
                            unit={getMath("kWh/a").formula}
                            unitTitle={getMath("kWh/a").title}
                        />
                    </DivSmall>
                </DivInputSubgrid>
                <Separator decorative={true} className="col-span-full" />
                <DivInputSubgrid>
                    <Label htmlFor="heatingDemand">Gesamt:</Label>
                    <DivSmall>
                        <InputWithUnitWithKeyboardDefaultCustom
                            id="heatingDemand"
                            currentLayout="float"
                            inputMode="numeric"
                            value={heatingDemand}
                            defaultCustom={heatingDemandChosen}
                            pattern={INPUT_PATTERN_FLOAT_POSITIVE}
                            onChangeCallback={(value: string, validity: ValidityState) => {
                                console.log("INPUT:CHANGECALLBACK:", value, validity);
                                if (value === "") {
                                    useVariableStoreBase.setState((state) => ({
                                        building_HeatingDemand_Q_W_AfterGeneralData: {
                                            ...state.building_HeatingDemand_Q_W_AfterGeneralData,
                                            _customValue: null,
                                            chosen: DefaultCustom.Default,
                                        },
                                    }));
                                } else if (validity.valid || validity.valueMissing) {
                                    // ich glaube "validity.valueMissing" hier abzufragen ist unnötig oder falsch
                                    const parsed = parseFloat(setDotAsDecimalSeparator(value));
                                    useVariableStoreBase.setState((state) => ({
                                        building_HeatingDemand_Q_W_AfterGeneralData: {
                                            ...state.building_HeatingDemand_Q_W_AfterGeneralData,
                                            _customValue: isNaN(parsed) ? null : parsed,
                                            chosen: DefaultCustom.Custom,
                                        },
                                    }));
                                }
                            }}
                            unit={getMath("kWh/a").formula}
                            unitTitle={getMath("kWh/a").title}
                            className="sm:w-sm"
                        />
                    </DivSmall>
                </DivInputSubgrid>
            </DivGroup2Subgrid>
        </DivGroup1>
    );
}
