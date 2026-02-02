import { StepKey } from "@/main";
import { StepsScaffolding } from "../scaffolding/StepsScaffolding";
import { useNavigate } from "react-router-dom";
import { useVariableStore, useVariableStoreBase } from "@/zustand/useVariableStore";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Alert, AlertDescription } from "../ui/alert";
import { TriangleAlert } from "lucide-react";
import { Separator } from "../ui/separator";
import { Heading1, Heading2 } from "@/components/ui/heading";
import { DivCheckbox } from "@/components/scaffolding/Divs";

export function S11Photovoltaics() {
    const OBJkomma = {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    };
    const hasPhotovoltaics = useVariableStore((state) => state.building_Photovoltaic.alreadyHasPhotovoltaic);
    const wantsPhotovoltaic = useVariableStore((state) => state.building_Photovoltaic.wantsPhotovoltaic);
    const yearOfRenovation = useVariableStore(
        (state) => state.building_Photovoltaic.roofYearOfRenovationIfDifferentThanYearOfConstruction,
    );
    const modules = useVariableStore((state) => state.building_Photovoltaic.numberOfModules());
    const usedArea = useVariableStore((state) => state.building_Photovoltaic.usedAreaForModules());
    const selfSufficiency = useVariableStore((state) => state.building_Photovoltaic.degreeOfSelfSufficiency());
    const gridFeed = useVariableStore((state) => state.building_Photovoltaic.gridFeedIn());
    const wattPerYear = useVariableStore((state) => state.building_Photovoltaic.kiloWattHoursPerYear());
    const wattOfModule = useVariableStore((state) => state.building_Photovoltaic.kiloWattPeakOfModules());

    const navigate = useNavigate();
    const canGoNext = true;
    return (
        <StepsScaffolding
            className="grid grid-cols-[1fr_auto_1fr] gap-2 md:gap-4"
            navigate={navigate}
            title={<Heading1>Photovoltaik</Heading1>}
            last={`/${StepKey.TechnologySelection}`}
            next={canGoNext ? `/${StepKey.TechnologySelection}` : undefined}
            // preNext={nextStep}
        >
            <div className="grid h-min gap-2 md:gap-4">
                <Heading2>Planung</Heading2>
                <DivCheckbox>
                    <Checkbox
                        id={"hasPhotovoltaic"}
                        checked={hasPhotovoltaics}
                        disabled={false} // Falls vorher schon Photovoltaik ausgewählt anpassen?
                        onCheckedChange={(value) => {
                            if (value === true || value === false) {
                                useVariableStoreBase.setState((state) => ({
                                    building_Photovoltaic: {
                                        ...state.building_Photovoltaic,
                                        alreadyHasPhotovoltaic: value,
                                    },
                                }));
                            }
                        }}
                    />
                    <Label htmlFor={"hasPhotovoltaic"}>Vorhanden</Label>
                </DivCheckbox>
                {hasPhotovoltaics ? (
                    <Alert>
                        <TriangleAlert className="h-4 w-4" />
                        <AlertDescription>
                            Da sich das Tool nur auf die Neuinstallation von Photovoltaikanlagen konzentriert, sollte
                            bei einer bereits vorhandenen Photovoltaikanlage ein Fachmann dazugezogen werden.
                        </AlertDescription>
                    </Alert>
                ) : (
                    <>
                        <div className="grid grid-cols-[auto_1fr] items-center gap-4">
                            <Label htmlFor={"roofRenovationYear"}>Letzte Dachsanierung:</Label>
                            <Input
                                type="number"
                                id="roofRenovationYear"
                                step={1}
                                disabled={false}
                                // placeholder={heatPumpJaz === undefined ? "0" : `${heatPumpJaz}`}
                                value={yearOfRenovation ?? ""}
                                onChange={(value) => {
                                    useVariableStoreBase.setState((state) => ({
                                        building_Photovoltaic: {
                                            ...state.building_Photovoltaic,
                                            roofYearOfRenovationIfDifferentThanYearOfConstruction:
                                                value.target.valueAsNumber,
                                        },
                                    }));
                                }}
                            />
                        </div>
                        <DivCheckbox>
                            <Checkbox
                                id={"wantsPhotovoltaic"}
                                checked={wantsPhotovoltaic}
                                onCheckedChange={(value) => {
                                    if (value === true || value === false) {
                                        useVariableStoreBase.setState((state) => ({
                                            building_Photovoltaic: {
                                                ...state.building_Photovoltaic,
                                                wantsPhotovoltaic: value,
                                            },
                                        }));
                                    }
                                }}
                            />
                            <Label htmlFor={"wantsPhotovoltaic"}>Neuinstallation</Label>
                        </DivCheckbox>
                        {yearOfRenovation !== null && yearOfRenovation - new Date().getFullYear() < -25 ? (
                            <Alert>
                                <TriangleAlert className="h-4 w-4" />
                                <AlertDescription>
                                    Die letzte Dachsanierung liegt länger als 25 Jahre zurück, sodass die Lebensdauer
                                    der Photovoltaikanlage wahrscheinlich größer ist als die Lebensdauer des Daches.
                                    Daher wird empfohlen vor der Installation der Photovoltaikanlage das Dachzusanieren.
                                </AlertDescription>
                            </Alert>
                        ) : (
                            <div className="grid h-min gap-2 md:gap-4">
                                <Separator />
                                {modules !== undefined && (
                                    <h3>{`${modules}`} Photovoltaikmodule können verbaut werden.</h3>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
            {hasPhotovoltaics !== true && wantsPhotovoltaic && (
                <>
                    <Separator orientation="vertical" className="hidden lg:block" />
                    <div className="grid h-min gap-2 md:gap-4">
                        <Heading2>Ergebnis</Heading2>
                        <div className="grid grid-cols-[1fr_auto]">
                            <Label>Anzahl der Module:</Label>
                            <Label>{modules}</Label>
                        </div>
                        <Separator orientation="horizontal" />
                        <div className="grid grid-cols-[1fr_auto]">
                            <Label>Genutzte Dachfläche:</Label>
                            <Label>{usedArea?.toLocaleString(navigator.languages, OBJkomma)} m²</Label>
                        </div>
                        <Separator orientation="horizontal" />
                        <div className="grid grid-cols-[1fr_auto]">
                            <Label>Selbstversorgungsgrad:</Label>
                            <Label>{selfSufficiency?.toLocaleString(navigator.languages, OBJkomma)} %</Label>
                        </div>
                        <Separator orientation="horizontal" />
                        <div className="grid grid-cols-[1fr_auto]">
                            <Label>Netzeinspeisung:</Label>
                            <Label>{gridFeed?.toLocaleString(navigator.languages, OBJkomma)} kW</Label>
                        </div>
                        <Separator orientation="horizontal" />
                        <div className="grid grid-cols-[1fr_auto]">
                            <Label>kiloWatt pro Jahr:</Label>
                            <Label>{wattPerYear?.toLocaleString(navigator.languages, OBJkomma)} kW</Label>
                        </div>
                        <Separator orientation="horizontal" />
                        <div className="grid grid-cols-[1fr_auto]">
                            <Label>KiloWatt Peak pro Modul:</Label>
                            <Label>{wattOfModule?.toLocaleString(navigator.languages, OBJkomma)} kW</Label>
                        </div>
                    </div>
                </>
            )}
        </StepsScaffolding>
    );
}
