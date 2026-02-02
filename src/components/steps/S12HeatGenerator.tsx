import { useNavigate } from "react-router-dom";
import { StepsScaffolding } from "@/components/scaffolding/StepsScaffolding";
import { StepKey } from "@/main";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
    DefaultCustom,
    ExistingDistributionSystem,
    HeatPumpType,
    NewHeatGenerator,
    NewHeatGeneratorFuelHeating,
    RestrictionsHeatPumpBrineWater,
    RestrictionsHeatPumpWaterWater,
    SecondNewHeatGenerator,
    useVariableStore,
    useVariableStoreBase,
} from "@/zustand/useVariableStore";
import { Input, InputWithUnit } from "@/components/ui/input";
import { getMath } from "@/tables/mathFormulars";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CornerDownRight, TriangleAlert } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Heading1, Heading2 } from "@/components/ui/heading";
import { DivCheckbox, DivRadioGroupItem } from "@/components/scaffolding/Divs";

export function S12HeatGenerator() {
    const distribution = useVariableStore((state) => state.building_ExistingDistributionSystem);
    const flowTemperature = useVariableStore((state) =>
        state.building_ExistingDistributionSystemFlowTemperature[
            state.building_ExistingDistributionSystemFlowTemperature.chosen
        ](),
    );
    const [isHeatPump, setIsHeatPump] = useState<boolean>(false);
    const [isHybridSystem, setIsHybridSystem] = useState<boolean>(false);
    const [isFuelHeating, setIsFuelHeating] = useState<boolean>(false);

    const heatGenerator = useVariableStore((state) => state.building_NewHeatGenerator);
    const navigate = useNavigate();
    const canGoNext =
        (isHeatPump && heatGenerator === NewHeatGenerator.HeatPump) ||
        (isHybridSystem && heatGenerator === NewHeatGenerator.HybridSystem) ||
        (isFuelHeating && heatGenerator === NewHeatGenerator.FuelHeating);
    return (
        <StepsScaffolding
            className="grid grow-0 gap-4 md:grid-cols-[1fr_auto_3fr]"
            navigate={navigate}
            title={<Heading1>Wärmeerzeuger</Heading1>}
            last={`/${StepKey.TechnologySelection}`}
            next={canGoNext ? `/${StepKey.TechnologySelection}` : undefined}
            // preNext={nextStep}
        >
            {/* <div className="grid grid-cols-[1fr_1fr_1fr]"> */}
            <div className="grid h-min gap-2 md:gap-4">
                <Heading2>Wärmeverteilung</Heading2>
                <RadioGroup
                    id="distribution"
                    value={distribution ?? ""}
                    //className="grid-cols-[auto_1fr]"
                    disabled={false}
                >
                    {Object.values(ExistingDistributionSystem).map((type) => (
                        <DivRadioGroupItem key={type}>
                            <RadioGroupItem
                                id={type}
                                value={type}
                                onClick={() =>
                                    useVariableStoreBase.setState(() => ({
                                        building_ExistingDistributionSystem: type,
                                    }))
                                }
                            />
                            <Label htmlFor={type}>
                                {type === ExistingDistributionSystem.Radiator ? (
                                    "Heizkörper"
                                ) : type === ExistingDistributionSystem.LowTemperatureRadiator ? (
                                    "Niedertemperaturheizkörper"
                                ) : type === ExistingDistributionSystem.UnderfloorHeating ? (
                                    "Fußbodenheizung"
                                ) : (
                                    <></>
                                )}
                            </Label>
                        </DivRadioGroupItem>
                    ))}
                </RadioGroup>
                <div className="grid grid-cols-[1fr_auto] items-center gap-4">
                    <div>
                        <Label htmlFor="distributionSystem">Vorlauftemperatur:</Label>
                    </div>
                    <InputWithUnit
                        type="number"
                        id="distributionSystem"
                        disabled={false}
                        unit={getMath("C").formula}
                        //placeholder={customStandard === null ? "0" : `${customStandard}`}
                        value={flowTemperature ?? ""}
                        onChange={(value) => {
                            useVariableStoreBase.setState((state) => ({
                                building_ExistingDistributionSystemFlowTemperature: {
                                    ...state.building_ExistingDistributionSystemFlowTemperature,
                                    chosen: isNaN(value.target.valueAsNumber)
                                        ? DefaultCustom.Default
                                        : DefaultCustom.Custom,
                                    _customValue: isNaN(value.target.valueAsNumber) ? null : value.target.valueAsNumber,
                                },
                            }));
                        }}
                        unitTitle={getMath("C").title}
                    />
                </div>
                {flowTemperature !== undefined && flowTemperature !== null && flowTemperature > 55 ? (
                    <Alert>
                        <TriangleAlert className="h-4 w-4" />
                        <AlertDescription className="text-xs">
                            {/* Da die Vorlauftemperatur über 55 °C liegt, ist ein effizienter Betrieb der Wärmepumpe nicht
                            möglich. Daher wird empfohlen ein Hybrid-System zu verwenden. */}
                            Da die Vorlauftemperatur über 55 °C liegt, ist ein effizienter Betrieb der Wärmepumpe nicht
                            möglich Daher wird empfohlen ein Hybrid-System zu verwenden.
                        </AlertDescription>
                    </Alert>
                ) : (
                    <></>
                )}
                <Heading2>Wärmeerzeuger</Heading2>
                <RadioGroup
                    id="heatGenerator"
                    value={heatGenerator ?? ""}
                    //className="grid-cols-[auto_1fr]"
                    disabled={false}
                >
                    {Object.values(NewHeatGenerator).map((type) => (
                        <DivRadioGroupItem key={type}>
                            <RadioGroupItem
                                id={type}
                                value={type}
                                disabled={distribution === null}
                                onClick={() =>
                                    useVariableStoreBase.setState(() => ({
                                        building_NewHeatGenerator: type,
                                    }))
                                }
                            />
                            <Label htmlFor={type}>
                                {type === NewHeatGenerator.HeatPump ? (
                                    "Wärmepumpe"
                                ) : type === NewHeatGenerator.HybridSystem ? (
                                    "Hybrid-System (Öl/Gas + Wärmepumpe)"
                                ) : type === NewHeatGenerator.FuelHeating ? (
                                    "Brennstoffheizung"
                                ) : (
                                    <></>
                                )}
                            </Label>
                        </DivRadioGroupItem>
                    ))}
                </RadioGroup>
            </div>
            <Separator orientation="vertical" className="hidden lg:block" />
            <Separator orientation="horizontal" className="block lg:hidden" />
            <div className="grid h-min gap-2 md:gap-4">
                <Heading2>Technologie</Heading2>
                {heatGenerator === NewHeatGenerator.HeatPump ? (
                    <HeatGeneratorHeatPump setIsFilledOut={setIsHeatPump} />
                ) : heatGenerator === NewHeatGenerator.HybridSystem ? (
                    <HeatGeneratorHybridSystem setIsFilledOut={setIsHybridSystem} />
                ) : heatGenerator === NewHeatGenerator.FuelHeating ? (
                    <HeatGeneratorFuelHeating setIsFilledOut={setIsFuelHeating} />
                ) : undefined}
            </div>
            {/* </div> */}
            {/* <Separator orientation="vertical" className="hidden lg:block" />
            <Separator orientation="horizontal" className="block lg:hidden" /> */}
        </StepsScaffolding>
    );
}

function HeatGeneratorHeatPump(props: { setIsFilledOut?: (isSet: boolean) => void }) {
    const heatPumpType = useVariableStore((state) => state.building_NewHeatPumpType);
    const heatPumpJaz = useVariableStore((state) =>
        state.building_NewHeatPump_JAZ[state.building_NewHeatPump_JAZ.chosen](),
    );
    const restrictionsbrinewater = useVariableStore(
        (state) => state.building_RestrictionsHeatPump.restrictions.brinewater,
    );
    const restrictionswaterwater = useVariableStore(
        (state) => state.building_RestrictionsHeatPump.restrictions.waterwater,
    );
    const isRestrictedBrineWater =
        restrictionsbrinewater["Gebäude befindet sich im Wasserschutzgebiet"] ||
        restrictionsbrinewater["Keine Bohrungen möglich (Platz, Bohrtiefe, Genehmigungen"];
    const isRestrictedWaterWater =
        restrictionswaterwater["Gebäude befindet sich im Wasserschutzgebiet"] ||
        restrictionswaterwater["Grundwasser zur Entnahme vorhanden"] ||
        restrictionswaterwater["Keine Bohrungen möglich (Platz, Bohrtiefe, Genehmigungen"];
    const heatGenerator = useVariableStore((state) => state.building_NewHeatGenerator);
    if (props.setIsFilledOut !== undefined) props.setIsFilledOut(heatPumpJaz !== undefined);
    return (
        <div className="grid h-min grid-cols-[1fr_auto_2fr] gap-2 md:gap-4">
            <div className="grid h-min gap-2 md:gap-4">
                {heatGenerator === NewHeatGenerator.HeatPump ? (
                    <Label htmlFor="heatPumpType">Art der Wärmepumpe</Label>
                ) : (
                    <Label htmlFor="heatPumpType">Alternativer Wärmeerzeuger</Label>
                )}
                <RadioGroup id="heatPumpType" value={heatPumpType ?? ""}>
                    {Object.values(HeatPumpType).map((entry) => (
                        <DivRadioGroupItem key={entry}>
                            <RadioGroupItem
                                id={entry}
                                value={entry}
                                onClick={() =>
                                    useVariableStoreBase.setState(() => ({
                                        building_NewHeatPumpType: entry,
                                    }))
                                }
                            />
                            <Label htmlFor={entry}>
                                {entry === HeatPumpType.AirWater ? (
                                    "Luft/Wasser"
                                ) : entry === HeatPumpType.BrineWater ? (
                                    "Sole/Wasser"
                                ) : entry === HeatPumpType.WaterWater ? (
                                    "Wasser/Wasser"
                                ) : entry === HeatPumpType.AirAir ? (
                                    "Luft/Luft"
                                ) : (
                                    <></>
                                )}
                            </Label>
                        </DivRadioGroupItem>
                    ))}
                </RadioGroup>
                <div className="grid h-min grid-cols-[1fr_auto] items-center gap-4">
                    <div className="grid grid-cols-[1fr_auto] items-center gap-2">
                        <CornerDownRight className="mb-2 size-5" />

                        <Label htmlFor="newjaz">Jahresarbeitszahl:</Label>
                    </div>

                    <Input
                        type="number"
                        id="newjaz"
                        step={0.1}
                        disabled={heatPumpType === null}
                        placeholder={heatPumpJaz === undefined ? "0" : `${heatPumpJaz}`}
                        value={heatPumpJaz ?? ""}
                        onChange={(value) => {
                            useVariableStoreBase.setState((state) => ({
                                building_NewHeatPump_JAZ: {
                                    ...state.building_NewHeatPump_JAZ,
                                    chosen: isNaN(value.target.valueAsNumber)
                                        ? DefaultCustom.Default
                                        : DefaultCustom.Custom,
                                    _customValue: isNaN(value.target.valueAsNumber) ? null : value.target.valueAsNumber,
                                },
                            }));
                        }}
                    />
                </div>
            </div>
            {heatPumpType === HeatPumpType.BrineWater || heatPumpType === HeatPumpType.WaterWater ? (
                <Separator orientation="vertical" className="hidden lg:block" />
            ) : undefined}
            <div className="grid h-min gap-2 md:gap-4">
                {heatPumpType === HeatPumpType.BrineWater ? (
                    <>
                        <Label>Vorhandene Einschränkungen bei der Installation der Wärmepumpe:</Label>
                        {Object.values(RestrictionsHeatPumpBrineWater).map((type) => {
                            return (
                                <DivCheckbox>
                                    <Checkbox
                                        id={`brinewater${type}`}
                                        checked={restrictionsbrinewater[type]}
                                        onCheckedChange={(value) => {
                                            if (value === true || value === false) {
                                                useVariableStoreBase.setState((state) => ({
                                                    building_RestrictionsHeatPump: {
                                                        ...state.building_RestrictionsHeatPump,
                                                        restrictions: {
                                                            ...state.building_RestrictionsHeatPump.restrictions,
                                                            brinewater: {
                                                                ...state.building_RestrictionsHeatPump.restrictions
                                                                    .brinewater,
                                                                [type]: value,
                                                            },
                                                        },
                                                    },
                                                }));
                                            }
                                        }}
                                    />
                                    <Label htmlFor={`brinewater${type}`}>
                                        {type === RestrictionsHeatPumpBrineWater.NoDrillingPossible ? (
                                            "Keine Bohrungen möglich (Platz, Bohrtiefe, Genehmigungen)"
                                        ) : type === RestrictionsHeatPumpBrineWater.WaterProtectionArea ? (
                                            "Gebäude befindet sich im Wasserschutzgebiet"
                                        ) : (
                                            <></>
                                        )}
                                    </Label>
                                </DivCheckbox>
                            );
                        })}
                    </>
                ) : heatPumpType === HeatPumpType.WaterWater ? (
                    <>
                        <Label>Vorhandene Einschränkungen bei der Installation der Wärmepumpe:</Label>
                        {Object.values(RestrictionsHeatPumpWaterWater).map((type) => {
                            return (
                                <DivCheckbox>
                                    <Checkbox
                                        id={`waterwater${type}`}
                                        checked={restrictionswaterwater[type]}
                                        onCheckedChange={(value) => {
                                            if (value === true || value === false) {
                                                useVariableStoreBase.setState((state) => ({
                                                    building_RestrictionsHeatPump: {
                                                        ...state.building_RestrictionsHeatPump,
                                                        restrictions: {
                                                            ...state.building_RestrictionsHeatPump.restrictions,
                                                            waterwater: {
                                                                ...state.building_RestrictionsHeatPump.restrictions
                                                                    .waterwater,
                                                                [type]: value,
                                                            },
                                                        },
                                                    },
                                                }));
                                            }
                                        }}
                                    />
                                    <Label htmlFor={`waterwater${type}`}>
                                        {type === RestrictionsHeatPumpWaterWater.GroundwaterAvailable ? (
                                            "Grundwasser zur Entnahme vorhanden"
                                        ) : type === RestrictionsHeatPumpWaterWater.NoDrillingPossible ? (
                                            "Keine Bohrungen möglich (Platz, Bohrtiefe, Genehmigungen)"
                                        ) : type === RestrictionsHeatPumpWaterWater.WaterProtectionArea ? (
                                            "Gebäude befindet sich im Wasserschutzgebiet"
                                        ) : (
                                            <></>
                                        )}
                                    </Label>
                                </DivCheckbox>
                            );
                        })}
                    </>
                ) : (
                    <></>
                )}
            </div>
            <div className="col-span-3">
                {isRestrictedBrineWater && heatPumpType === HeatPumpType.BrineWater && (
                    <Alert>
                        <TriangleAlert className="h-4 w-4" />
                        <AlertDescription>
                            Die Installation einer Sole/Wasser Wärmepumpe ist nicht möglich. Bitte eine andere
                            Wärmepumpe auswählen.
                        </AlertDescription>
                    </Alert>
                )}
                {isRestrictedWaterWater && heatPumpType === HeatPumpType.WaterWater && (
                    <Alert>
                        <TriangleAlert className="h-4 w-4" />
                        <AlertDescription>
                            Die Installation einer Wasser/Wasser Wärmepumpe ist nicht möglich. Bitte eine andere
                            Wärmepumpe auswählen.
                        </AlertDescription>
                    </Alert>
                )}
            </div>
        </div>
    );
}

function HeatGeneratorHybridSystem(props: { setIsFilledOut?: (isSet: boolean) => void }) {
    const heatGenerator = useVariableStore((state) => state.building_SecondNewHeatGenerator);
    // const operationMode = useVariableStore((state) => state.building_NewHeatGeneratorModeOfOperation);
    const heatPumpJaz = useVariableStore((state) => state.building_NewHeatPump_JAZ);
    if (props.setIsFilledOut !== undefined)
        props.setIsFilledOut(/* operationMode !== null &&  */ heatGenerator !== null && heatPumpJaz !== null);
    return (
        <div className="grid h-min gap-2 md:gap-4">
            <div className="grid h-min gap-2 md:gap-4">
                <Label htmlFor="heatGenerator">Konventioneller Brennstoff</Label>
                <RadioGroup id="heatGenerator" value={heatGenerator ?? ""}>
                    {Object.values(SecondNewHeatGenerator).map((entry) => (
                        <DivRadioGroupItem key={entry}>
                            <RadioGroupItem
                                id={entry}
                                value={entry}
                                onClick={() =>
                                    useVariableStoreBase.setState(() => ({
                                        building_SecondNewHeatGenerator: entry,
                                    }))
                                }
                            />
                            <Label htmlFor={entry}>
                                {entry === SecondNewHeatGenerator.OilBoilder ? (
                                    "Öl-Kessel"
                                ) : entry === SecondNewHeatGenerator.GasBoiler ? (
                                    "Gas-Kessel"
                                ) : (
                                    <></>
                                )}
                            </Label>
                        </DivRadioGroupItem>
                    ))}
                </RadioGroup>
            </div>
            {/* <Separator orientation="vertical" className="hidden lg:block" />
            <div className="grid h-min gap-2 md:gap-4">
                <Label htmlFor="operationMode">Welche Betriebsweise soll eingesetzt werden</Label>
                <RadioGroup id="operationMode" value={operationMode ?? ""}>
                    {Object.values(ModeOfOperation).map((entry) => (
                        <DivRadioGroupItem key={entry}>
                            <RadioGroupItem
                                id={entry}
                                value={entry}
                                onClick={() =>
                                    useVariableStoreBase.setState(() => ({
                                        building_NewHeatGeneratorModeOfOperation: entry,
                                    }))
                                }
                            />
                            <Label htmlFor={entry}>
                                {entry === ModeOfOperation.ParallelOperation ? (
                                    "Parallelbetrieb"
                                ) : entry === ModeOfOperation.AlternativeOperation ? (
                                    "Alternativbetrieb"
                                ) : (
                                    <></>
                                )}
                            </Label>
                        </DivRadioGroupItem>
                    ))}
                </RadioGroup>
            </div> */}
            <div className="col-span-3">
                <HeatGeneratorHeatPump />
            </div>
        </div>
    );
}

function HeatGeneratorFuelHeating(props: { setIsFilledOut?: (isSet: boolean) => void }) {
    const heatGenerator = useVariableStore((state) => state.building_NewHeatGeneratorFuelHeating);
    if (props.setIsFilledOut !== undefined) props.setIsFilledOut(heatGenerator !== null);
    return (
        <div className="grid h-min gap-2 md:gap-4">
            <Label htmlFor="operationMode">Art der Brennstoffheizung</Label>
            <RadioGroup id="operationMode" value={heatGenerator ?? ""}>
                {Object.values(NewHeatGeneratorFuelHeating).map((entry) => (
                    <DivRadioGroupItem key={entry}>
                        <RadioGroupItem
                            id={entry}
                            value={entry}
                            onClick={() =>
                                useVariableStoreBase.setState(() => ({
                                    building_NewHeatGeneratorFuelHeating: entry,
                                }))
                            }
                        />
                        <Label htmlFor={entry}>
                            {entry === NewHeatGeneratorFuelHeating.Hydrogen ? (
                                "100 % Wasserstoff aufrüstbarer Gaskessel"
                            ) : entry === NewHeatGeneratorFuelHeating.Biomass ? (
                                "Biomasse (Holz)"
                            ) : (
                                <></>
                            )}
                        </Label>
                    </DivRadioGroupItem>
                ))}
            </RadioGroup>
            {heatGenerator === NewHeatGeneratorFuelHeating.Hydrogen && (
                <Alert>
                    <TriangleAlert className="h-4 w-4" />
                    <AlertDescription>
                        Kommunen können auf Basis von Wärmeplänen klimaneutrale Gasnetze ausweisen. Dazu müssen sie und
                        die Gasnetzbetreiber einen gemeinsamen Fahrplan zur Neugestaltung oder Umstellung bestehender
                        Gasnetze entwickeln, der verbindliche Zwischenziele für 2035 und 2040 zur Erreichung der
                        Klimaziele enthält. Die Bundesnetzagentur prüft und genehmigt diesen Fahrplan, um eine
                        klimazielgerechte Umstellung zu gewährleisten. Ab Mitte 2026 bzw. 2028 dürfen Gasheizungen nur
                        dann neu eingebaut werden, wenn ein solcher genehmigter Fahrplan vorliegt und die Anlagen auf
                        100 % Wasserstoff umstellbar sind.
                    </AlertDescription>
                </Alert>
            )}
            {heatGenerator === NewHeatGeneratorFuelHeating.Biomass && (
                <Alert>
                    <TriangleAlert className="h-4 w-4" />
                    <AlertDescription>
                        Das Bundesministerium für Wirtschaft und Klima betont die begrenzte Verfügbarkeit von nachhaltig
                        erzeugter Biomasse und empfiehlt deren Einsatz nur in schwer sanierbaren oder denkmalgeschützten
                        Bestandsgebäuden, in denen alternative Lösungen nicht praktikabel sind. Aufgrund der
                        eingeschränkten Verfügbarkeit ist langfristig mit einem Preisanstieg zu rechnen.
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
}
