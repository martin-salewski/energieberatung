import { StepKey } from "@/main";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { DefaultCustom, useVariableStoreBase } from "@/zustand/useVariableStore";
import { StepsScaffolding } from "@/components/scaffolding/StepsScaffolding";
import { INPUT_PATTERN_FLOAT_POSITIVE, INPUT_PATTERN_PERCENTAGE } from "@/components/ui/input";
import { getMath } from "@/tables/mathFormulars";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TriangleAlert } from "lucide-react";
import { Heading1, Heading2 } from "@/components/ui/heading";
import { DivInputSubgrid, DivSmall } from "@/components/scaffolding/Divs";
import { Separator } from "@/components/ui/separator";
import { InputWithUnitWithKeyboardDefaultCustom } from "@/components/inputs/InputWithUnitWithKeyboardDefaultCustom";
import { setDotAsDecimalSeparator } from "@/components/Keyboard";

export function S10Ventilation() {
    const OBJkomma = {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    };
    const OBJohnekomma = {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    };
    const navigate = useNavigate();
    const canGoNext = true;

    const hasVentilation = useVariableStoreBase((state) => state.building_Ventilation.alreadyHasVentilationSystem);
    const [ventilatedVolume, ventilatedVolumeChosen] = useVariableStoreBase((state) => [
        state.building_Ventilation.volumeIfDifferentThanBuildingVolume[
            state.building_Ventilation.volumeIfDifferentThanBuildingVolume.chosen
        ](),
        state.building_Ventilation.volumeIfDifferentThanBuildingVolume.chosen,
    ]);
    const [airExchangeRate, airExchangeRateChosen] = useVariableStoreBase((state) => [
        state.building_Ventilation_Final.airExchangeRate[state.building_Ventilation_Final.airExchangeRate.chosen](),
        state.building_Ventilation_Final.airExchangeRate.chosen,
    ]);
    const [wrgEfficiency, wrgEfficiencyChosen] = useVariableStoreBase((state) => [
        state.building_Ventilation_Final.wrgEfficiency[state.building_Ventilation_Final.wrgEfficiency.chosen](),
        state.building_Ventilation_Final.wrgEfficiency.chosen,
    ]);
    const qwSaving = useVariableStoreBase((state) => state.building_Ventilation_Final.qWDifferenceBecauseWRG());
    const co2Saving = useVariableStoreBase((state) =>
        state.building_Ventilation_Final.co2EmissionsDifferenceOnlyBecauseWRG(),
    );
    // const [usesDifferentVolume, setUsesDifferentVolume] = useState<boolean>(ventilatedVolume !== null);

    return (
        <>
            <StepsScaffolding
                className="grid gap-8 md:grid-cols-[1fr_auto_1fr]"
                navigate={navigate}
                title={<Heading1>Technische Gebäudeausrüstung</Heading1>}
                last={`/${StepKey.TechnologySelection}`}
                next={canGoNext ? `/${StepKey.TechnologySelection}` : undefined}
            >
                <>
                    {hasVentilation ? (
                        <Alert>
                            <TriangleAlert className="h-4 w-4" />
                            <AlertDescription>
                                Da schon eine Lüftungsanlage vorhanden ist, sollte mit einer Fachkraft gesprochen
                                werden, ob der Einbau einer Wärmerückgewinnung möglich und rentabel ist.
                            </AlertDescription>
                        </Alert>
                    ) : (
                        <div className="grid h-min gap-2 md:gap-4">
                            <div className="grid grid-cols-[auto_1fr] items-center gap-4">
                                <Heading2 className="col-span-2">Daten</Heading2>
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
                                <DivInputSubgrid>
                                    <Label htmlFor="efficiency">Neuer Wärmerückgewinnungsgrad:</Label>
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
                                                                ...state.building_Ventilation.efficiencyinPercent,
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
                                                                ...state.building_Ventilation.efficiencyinPercent,
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
                                {/* <div className="col-span-2 grid">
                                    <DivCheckbox>
                                        <Checkbox
                                            id="volumeDifferent"
                                            checked={usesDifferentVolume}
                                            onCheckedChange={(value) => {
                                                if (value === true || value === false) {
                                                    setUsesDifferentVolume(value);
                                                    if (value === false)
                                                        useVariableStoreBase.setState((state) => ({
                                                            building_Ventilation: {
                                                                ...state.building_Ventilation,
                                                                volumeIfDifferentThanBuildingVolume: {
                                                                    ...state.building_Ventilation
                                                                        .volumeIfDifferentThanBuildingVolume,
                                                                    chosen: value
                                                                        ? DefaultCustom.Custom
                                                                        : DefaultCustom.Default,
                                                                },
                                                            },
                                                        }));
                                                }
                                            }}
                                        />
                                        <Label htmlFor="volumeDifferent">
                                            Lüftungsvolumen weicht vom Gebäudevolumen ab
                                        </Label>
                                    </DivCheckbox>
                                </div> */}
                                <DivInputSubgrid>
                                    <Label htmlFor="exchangeRate">Abweichendes Lüftungsvolumen:</Label>
                                    <DivSmall>
                                        <InputWithUnitWithKeyboardDefaultCustom
                                            id="exchangeRate"
                                            currentLayout="float"
                                            inputMode="numeric"
                                            value={ventilatedVolume}
                                            defaultCustom={ventilatedVolumeChosen}
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
                            </div>
                        </div>
                    )}
                    <Separator orientation="vertical" className="hidden lg:block" />

                    <div className="grid h-min gap-2 md:gap-4">
                        <Heading2>Ergebnis</Heading2>
                        <div className="grid grid-cols-[1fr_auto]">
                            <Label>Wärmebedarf Einsparung:</Label>
                            <Label>{qwSaving?.toLocaleString(navigator.languages, OBJkomma)} kWh/a</Label>
                        </div>
                        <Separator orientation="horizontal" />
                        <div className="grid grid-cols-[1fr_auto]">
                            <Label>CO2 Einsparung:</Label>
                            <Label>{co2Saving?.toLocaleString(navigator.languages, OBJohnekomma)} g</Label>
                        </div>
                    </div>
                </>
            </StepsScaffolding>
        </>
    );
}
