import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { INPUT_PATTERN_EMAIL_ADDRESS } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StepKey, basepath } from "@/main";
import {
    BuildingType as BuildingTypeEnum,
    DefaultCustom,
    FinalEnergyDemand_Q_E_Calculation,
    NewHeatGenerator,
    useVariableStoreBase,
} from "@/zustand/useVariableStore";
import { AtSign, Loader, Send } from "lucide-react";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import EinfamilienhausImage from "@/assets/Einfamilienhaus.png";
import MehrfamilienhausImage from "@/assets/Mehrfamilienhaus.png";
import ReihenmittelhausImage from "@/assets/Reihenmittelhaus.png";
import MainzerTrennlinie from "@/assets/MainzerTrennlinie.svg";
import HSMainzLogo from "@/assets/HSMainzLogo.svg";
import MainzerStiftungLogo from "@/assets/MainzerStiftungLogo.svg";

import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StepsScaffolding } from "@/components/scaffolding/StepsScaffolding";
import { Heading1 } from "@/components/ui/heading";
import { ConstructionPart } from "@/tables/HeatTransferCoefficientBasedOnComponentAndConstructionYear";
import { InputWithKeyboard } from "@/components/inputs/InputWithKeyboard";

const ZWEINACHKOMMASTELLEN = 2;
export const OBJohnekomma = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
};
export const OBJeinskomma = {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
};
export const OBJnachkomma = {
    minimumFractionDigits: ZWEINACHKOMMASTELLEN,
    maximumFractionDigits: ZWEINACHKOMMASTELLEN,
};
export const OBJOptionalNachkomma = {
    minimumFractionDigits: 0,
    maximumFractionDigits: ZWEINACHKOMMASTELLEN,
};
export function Testing() {
    const gebäudetyp = useVariableStoreBase((state) => state.building_Type);
    const postleitzahl = useVariableStoreBase((state) => state.building_PostalCode);
    const baujahr = useVariableStoreBase((state) => state.building_YearOfConstruction);
    const personenanzahl = useVariableStoreBase((state) => state.building_NumberOfResidents);
    const etagen = useVariableStoreBase((state) => state.building_Dimensions.numberOfLevels);
    const breite = useVariableStoreBase((state) => state.building_Dimensions.width);
    const tiefe = useVariableStoreBase((state) => state.building_Dimensions.depth);
    const höhe = useVariableStoreBase((state) => state.building_Dimensions.roomHeight);
    const fläche = useVariableStoreBase((state) =>
        state.building_Dimensions.area[state.building_Dimensions.area.chosen](),
    );
    const volumen = useVariableStoreBase((state) =>
        state.building_Dimensions.volume[state.building_Dimensions.volume.chosen](),
    );
    const table: { [key in BuildingTypeEnum]: string } = {
        [BuildingTypeEnum.Einfamilienhaus]: EinfamilienhausImage,
        [BuildingTypeEnum.Mehrfamilienhaus]: MehrfamilienhausImage,
        [BuildingTypeEnum.Reihenendhaus]: EinfamilienhausImage,
        [BuildingTypeEnum.Reihenmittelhaus]: ReihenmittelhausImage,
    };
    const dämmungVorhanden = useVariableStoreBase((state) => state.building_FinalEnergyDemand_BasedOn);
    //Keller
    const transmissionswaermeverlusteKellerdeckeVorher = useVariableStoreBase((state) =>
        state.building_TransmissionHeatLoss_Q_T_ForConstructionPart_AfterGeneralData(ConstructionPart.BottomSide),
    );
    const transmissionswaermeverlusteKellerdeckeNachher = useVariableStoreBase((state) =>
        state.building_TransmissionHeatLoss_Q_T_ForConstructionPart_AfterInsulation(ConstructionPart.BottomSide),
    );
    const transmissionswaermeverlusteKellerdeckeDifferenz =
        transmissionswaermeverlusteKellerdeckeVorher !== undefined &&
        transmissionswaermeverlusteKellerdeckeNachher !== undefined
            ? transmissionswaermeverlusteKellerdeckeVorher - transmissionswaermeverlusteKellerdeckeNachher
            : undefined;

    const transmissionswaermeverlusteKellerdeckeProzent =
        transmissionswaermeverlusteKellerdeckeVorher !== undefined &&
        transmissionswaermeverlusteKellerdeckeDifferenz !== undefined
            ? (transmissionswaermeverlusteKellerdeckeDifferenz / transmissionswaermeverlusteKellerdeckeVorher) * 100
            : undefined;
    const konstruktionstypKellerdecke = useVariableStoreBase(
        (state) => state.building_ConstructionParts[ConstructionPart.BottomSide].method,
    );
    const konstruktionstypKellerdeckeIndex = konstruktionstypKellerdecke?.toString().indexOf(",");
    const konstruktionstypKellerdeckeGekürzt =
        konstruktionstypKellerdeckeIndex !== undefined
            ? konstruktionstypKellerdecke?.substring(
                  konstruktionstypKellerdeckeIndex + 1,
                  konstruktionstypKellerdecke.length,
              )
            : undefined;
    const bauteilflaecheKellerdecke = useVariableStoreBase((state) =>
        state.building_ConstructionParts[ConstructionPart.BottomSide].area[
            state.building_ConstructionParts[ConstructionPart.BottomSide].area.chosen
        ]()?.toLocaleString(navigator.languages, OBJnachkomma),
    );
    const [sanierungsjahrKellerdecke, sanierungsjahrKellerdeckeChosen] = useVariableStoreBase((state) => [
        state.building_ConstructionParts[ConstructionPart.BottomSide].installationYearIfDifferentThanConstructionYear[
            state.building_ConstructionParts[ConstructionPart.BottomSide]
                .installationYearIfDifferentThanConstructionYear.chosen
        ](),
        state.building_ConstructionParts[ConstructionPart.BottomSide].installationYearIfDifferentThanConstructionYear
            .chosen,
    ]);
    const dämmdickeKellerdecke = useVariableStoreBase((state) =>
        state.building_ConstructionParts["Unterer Gebäudeabschluss"].insulationThickness(),
    );
    const dämmmaterialKellerdecke = useVariableStoreBase(
        (state) => state.building_ConstructionParts["Unterer Gebäudeabschluss"].insulationType,
    );
    const angestrebterstandardKellerdecke = useVariableStoreBase(
        (state) => state.building_ConstructionParts["Unterer Gebäudeabschluss"].targetedStandard,
    );
    //Außenwand
    const transmissionswaermeverlusteAußenwandVorher = useVariableStoreBase((state) =>
        state.building_TransmissionHeatLoss_Q_T_ForConstructionPart_AfterGeneralData(ConstructionPart.OuterWall),
    );
    const transmissionswaermeverlusteAußenwandNachher = useVariableStoreBase((state) =>
        state.building_TransmissionHeatLoss_Q_T_ForConstructionPart_AfterInsulation(ConstructionPart.OuterWall),
    );
    const transmissionswaermeverlusteAußenwandDifferenz =
        transmissionswaermeverlusteAußenwandVorher !== undefined &&
        transmissionswaermeverlusteAußenwandNachher !== undefined
            ? transmissionswaermeverlusteAußenwandVorher - transmissionswaermeverlusteAußenwandNachher
            : undefined;

    const transmissionswaermeverlusteAußenwandProzent =
        transmissionswaermeverlusteAußenwandVorher !== undefined &&
        transmissionswaermeverlusteAußenwandDifferenz !== undefined
            ? (transmissionswaermeverlusteAußenwandDifferenz / transmissionswaermeverlusteAußenwandVorher) * 100
            : undefined;

    const konstruktionstypAußenwand = useVariableStoreBase(
        (state) => state.building_ConstructionParts[ConstructionPart.OuterWall].method,
    );
    const konstruktionstypAußenwandIndex = konstruktionstypAußenwand?.toString().indexOf(",");
    const konstruktionstypAußenwandGekürzt =
        konstruktionstypAußenwandIndex !== undefined
            ? konstruktionstypAußenwand?.substring(konstruktionstypAußenwandIndex + 1, konstruktionstypAußenwand.length)
            : undefined;
    const bauteilflaecheAußenwand = useVariableStoreBase((state) =>
        state.building_ConstructionParts[ConstructionPart.OuterWall].area[
            state.building_ConstructionParts[ConstructionPart.OuterWall].area.chosen
        ]()?.toLocaleString(navigator.languages, OBJnachkomma),
    );
    const [sanierungsjahrAußenwand, sanierungsjahrAußenwandChosen] = useVariableStoreBase((state) => [
        state.building_ConstructionParts[ConstructionPart.OuterWall].installationYearIfDifferentThanConstructionYear[
            state.building_ConstructionParts[ConstructionPart.OuterWall].installationYearIfDifferentThanConstructionYear
                .chosen
        ](),
        state.building_ConstructionParts[ConstructionPart.OuterWall].installationYearIfDifferentThanConstructionYear
            .chosen,
    ]);
    const dämmdickeAußenwand = useVariableStoreBase((state) =>
        state.building_ConstructionParts["Außenwand"].insulationThickness(),
    );
    const dämmmaterialAußenwand = useVariableStoreBase(
        (state) => state.building_ConstructionParts["Außenwand"].insulationType,
    );
    const angestrebterstandardAußenwand = useVariableStoreBase(
        (state) => state.building_ConstructionParts["Außenwand"].targetedStandard,
    );
    //Fenster
    const transmissionswaermeverlusteFensterVorher = useVariableStoreBase((state) =>
        state.building_TransmissionHeatLoss_Q_T_ForConstructionPart_AfterGeneralData(ConstructionPart.Window),
    );
    const transmissionswaermeverlusteFensterNachher = useVariableStoreBase((state) =>
        state.building_TransmissionHeatLoss_Q_T_ForConstructionPart_AfterInsulation(ConstructionPart.Window),
    );
    const transmissionswaermeverlusteFensterDifferenz =
        transmissionswaermeverlusteFensterVorher !== undefined &&
        transmissionswaermeverlusteFensterNachher !== undefined
            ? transmissionswaermeverlusteFensterVorher - transmissionswaermeverlusteFensterNachher
            : undefined;

    const transmissionswaermeverlusteFensterProzent =
        transmissionswaermeverlusteFensterVorher !== undefined &&
        transmissionswaermeverlusteFensterDifferenz !== undefined
            ? (transmissionswaermeverlusteFensterDifferenz / transmissionswaermeverlusteFensterVorher) * 100
            : undefined;

    const konstruktionstypFenster = useVariableStoreBase(
        (state) => state.building_ConstructionParts[ConstructionPart.Window].method,
    );
    const konstruktionstypFensterIndex = konstruktionstypFenster?.toString().indexOf(",");
    const konstruktionstypFensterGekürzt =
        konstruktionstypFensterIndex !== undefined
            ? konstruktionstypFenster?.substring(konstruktionstypFensterIndex + 1, konstruktionstypFenster.length)
            : undefined;
    const bauteilflaecheFenster = useVariableStoreBase((state) =>
        state.building_ConstructionParts[ConstructionPart.Window].area[
            state.building_ConstructionParts[ConstructionPart.Window].area.chosen
        ]()?.toLocaleString(navigator.languages, OBJnachkomma),
    );
    const [sanierungsjahrFenster, sanierungsjahrFensterChosen] = useVariableStoreBase((state) => [
        state.building_ConstructionParts[ConstructionPart.Window].installationYearIfDifferentThanConstructionYear[
            state.building_ConstructionParts[ConstructionPart.Window].installationYearIfDifferentThanConstructionYear
                .chosen
        ](),
        state.building_ConstructionParts[ConstructionPart.Window].installationYearIfDifferentThanConstructionYear
            .chosen,
    ]);
    const angestrebterstandardFenster = useVariableStoreBase(
        (state) => state.building_ConstructionParts["Fenster"].targetedStandard,
    );
    //Dach
    const transmissionswaermeverlusteDachVorher = useVariableStoreBase((state) =>
        state.building_TransmissionHeatLoss_Q_T_ForConstructionPart_AfterGeneralData(ConstructionPart.TopSide),
    );
    const transmissionswaermeverlusteDachNachher = useVariableStoreBase((state) =>
        state.building_TransmissionHeatLoss_Q_T_ForConstructionPart_AfterInsulation(ConstructionPart.TopSide),
    );
    const transmissionswaermeverlusteDachDifferenz =
        transmissionswaermeverlusteDachVorher !== undefined && transmissionswaermeverlusteDachNachher !== undefined
            ? transmissionswaermeverlusteDachVorher - transmissionswaermeverlusteDachNachher
            : undefined;

    const transmissionswaermeverlusteDachProzent =
        transmissionswaermeverlusteDachVorher !== undefined && transmissionswaermeverlusteDachDifferenz !== undefined
            ? (transmissionswaermeverlusteDachDifferenz / transmissionswaermeverlusteDachVorher) * 100
            : undefined;

    const konstruktionstypDach = useVariableStoreBase(
        (state) => state.building_ConstructionParts[ConstructionPart.TopSide].method,
    );
    const konstruktionstypDachIndex = konstruktionstypDach?.toString().indexOf(",");
    const konstruktionstypDachGekürzt =
        konstruktionstypDachIndex !== undefined
            ? konstruktionstypDach?.substring(konstruktionstypDachIndex + 1, konstruktionstypDach.length)
            : undefined;
    const bauteilflaecheDach = useVariableStoreBase((state) =>
        state.building_ConstructionParts[ConstructionPart.TopSide].area[
            state.building_ConstructionParts[ConstructionPart.TopSide].area.chosen
        ]()?.toLocaleString(navigator.languages, OBJnachkomma),
    );
    const [sanierungsjahrDach, sanierungsjahrDachChosen] = useVariableStoreBase((state) => [
        state.building_ConstructionParts[ConstructionPart.TopSide].installationYearIfDifferentThanConstructionYear[
            state.building_ConstructionParts[ConstructionPart.TopSide].installationYearIfDifferentThanConstructionYear
                .chosen
        ](),
        state.building_ConstructionParts[ConstructionPart.TopSide].installationYearIfDifferentThanConstructionYear
            .chosen,
    ]);
    const dämmdickeDach = useVariableStoreBase((state) =>
        state.building_ConstructionParts["Oberer Gebäudeabschluss"].insulationThickness(),
    );
    const dämmmaterialDach = useVariableStoreBase(
        (state) => state.building_ConstructionParts["Oberer Gebäudeabschluss"].insulationType,
    );
    const angestrebterstandardDach = useVariableStoreBase(
        (state) => state.building_ConstructionParts["Oberer Gebäudeabschluss"].targetedStandard,
    );
    //Gesamt
    const transmissionswaermeverlusteGesamtVorher = useVariableStoreBase((state) =>
        state.building_TransmissionHeatLoss_Q_T_AfterGeneralData(),
    );

    const transmissionswaermeverlusteGesamtNachher = useVariableStoreBase((state) =>
        state.building_TransmissionHeatLoss_Q_T_AfterInsulation(),
    );

    const transmissionswaermeverlusteGesamtDifferenz =
        transmissionswaermeverlusteGesamtVorher !== undefined && transmissionswaermeverlusteGesamtNachher !== undefined
            ? transmissionswaermeverlusteGesamtVorher - transmissionswaermeverlusteGesamtNachher
            : undefined;

    const transmissionswaermeverlusteGesamtProzent =
        transmissionswaermeverlusteGesamtVorher !== undefined &&
        transmissionswaermeverlusteGesamtDifferenz !== undefined
            ? (transmissionswaermeverlusteGesamtDifferenz / transmissionswaermeverlusteGesamtVorher) * 100
            : undefined;
    //Wärmebedarf Dämmung
    const wärmebedarfVorher = useVariableStoreBase((state) =>
        state.building_HeatingDemand_Q_W_BasedOnHeatingLoad_AfterGeneralData(),
    );
    const wärmebedarfNachher = useVariableStoreBase((state) =>
        state.building_HeatingDemand_Q_W_AfterInsulation_BasedOn_Q_H_AfterInsulation(),
    );
    //Wärmeereuger
    const jazvorhanden = useVariableStoreBase((state) =>
        state.building_HeatPump_JAZ[state.building_HeatPump_JAZ.chosen](),
    );
    const wärmepumpenartvorhanden = useVariableStoreBase((state) => state.building_HeatPumpType);
    const deckungsanteilvorhanden = useVariableStoreBase(
        (state) => state.building_HeatPump_CoverageRatioInPercent_AfterGeneralData,
    );
    const wärmebedarfbrennstoff = useVariableStoreBase((state) =>
        state.building_HeatingDemand_Q_W_Fuel_AfterGeneralData(),
    );
    const wärmebedarfwärmepumpe = useVariableStoreBase((state) =>
        state.building_HeatingDemand_Q_W_WP_AfterGeneralData(),
    );
    const wärmebedarfgesamt = useVariableStoreBase((state) =>
        state.building_HeatingDemand_Q_W_AfterGeneralData[state.building_HeatingDemand_Q_W_AfterGeneralData.chosen](),
    );
    const neuerwärmeerzeuger = useVariableStoreBase((state) => state.building_NewHeatGenerator);
    const wärmeverteilung = useVariableStoreBase((state) => state.building_ExistingDistributionSystem);
    const wärmeverteilungVorlauftemperatur = useVariableStoreBase((state) =>
        state.building_ExistingDistributionSystemFlowTemperature[
            state.building_ExistingDistributionSystemFlowTemperature.chosen
        ](),
    );
    const deckungsanteilneu = useVariableStoreBase((state) => state.building_HeatPump_CoverageRatio_AfterInsulation());
    const wärmepumpenartneu = useVariableStoreBase((state) => state.building_NewHeatPumpType);
    const jazneu = useVariableStoreBase((state) =>
        state.building_NewHeatPump_JAZ[state.building_NewHeatPump_JAZ.chosen](),
    );
    const wärmeerzeugerneu = useVariableStoreBase((state) => state.building_NewHeatGenerator);
    const zweiterwärmeerzeuger = useVariableStoreBase((state) => state.building_SecondNewHeatGenerator);
    // const wärmeerzeugerneuBetriebsart = useVariableStoreBase((state) => state.building_NewHeatGeneratorModeOfOperation);
    const wärmeerzeugerneuBrennstoff = useVariableStoreBase((state) => state.building_NewHeatGeneratorFuelHeating);

    //Photovoltaik
    const photovoltaiksolleingebautwerden = useVariableStoreBase(
        (state) => state.building_Photovoltaic.wantsPhotovoltaic,
    );
    const dachfläche = useVariableStoreBase((state) =>
        state.building_ConstructionParts["Oberer Gebäudeabschluss"].area[
            state.building_ConstructionParts["Oberer Gebäudeabschluss"].area.chosen
        ](),
    );
    const letztedachsanierung = useVariableStoreBase(
        (state) => state.building_Photovoltaic.roofYearOfRenovationIfDifferentThanYearOfConstruction,
    );
    const anzahlmodule = useVariableStoreBase((state) => state.building_Photovoltaic.numberOfModules());
    const selbstversorgungsgradVar = useVariableStoreBase((state) =>
        state.building_Photovoltaic.degreeOfSelfSufficiency(),
    );
    const selbstversorgungsgrad = selbstversorgungsgradVar !== undefined ? selbstversorgungsgradVar * 100 : undefined;
    const einspeisung = useVariableStoreBase((state) => state.building_Photovoltaic.gridFeedIn());
    const kilowattprojahr = useVariableStoreBase((state) => state.building_Photovoltaic.kiloWattHoursPerYear());
    const kilowattpeak = useVariableStoreBase((state) => state.building_Photovoltaic.kiloWattPeakOfModules());

    //Lüftung
    const [lüftungsvolumen, _lüftungsvolumenChosen] = useVariableStoreBase((state) => [
        state.building_Ventilation.volumeIfDifferentThanBuildingVolume[
            state.building_Ventilation.volumeIfDifferentThanBuildingVolume.chosen
        ](),
        state.building_Ventilation.volumeIfDifferentThanBuildingVolume.chosen,
    ]);
    const luftwechselrate = useVariableStoreBase((state) =>
        state.building_Ventilation_Final.airExchangeRate[state.building_Ventilation_Final.airExchangeRate.chosen](),
    );
    const wrggrad = useVariableStoreBase((state) =>
        state.building_Ventilation_Final.wrgEfficiency[state.building_Ventilation_Final.wrgEfficiency.chosen](),
    );

    //const qtVorherDach = useVariableStoreBase((state) => state.building_TransmissionHeatLoss_Q_T_AfterGeneralDatabuilding_TransmissionHeatLoss_Q_T_ForConstructionPart_AfterGeneralData(constructionPart))

    const myState = useVariableStoreBase((state) => state);
    const mergeFunction = useVariableStoreBase((state) => state.merge);
    const address = useVariableStoreBase((state) => state.email.address);
    const consent = useVariableStoreBase((state) => state.email.deliveryConsent);

    const qWnachTechnologie = useVariableStoreBase((state) => state.building_HeatingDemand_Q_W_AfterTechnology());
    const qWErparnisGesamt =
        qWnachTechnologie !== undefined && wärmebedarfVorher !== undefined
            ? wärmebedarfVorher - qWnachTechnologie
            : undefined;

    const elektrizitätnachTechnologie = useVariableStoreBase((state) =>
        state.building_ElectricityUsage_AfterTechnology(),
    );
    const elektriztätVorher = useVariableStoreBase((state) => state.building_ElectricityUsage());
    const elektrizitätErsparnis =
        elektrizitätnachTechnologie !== undefined && elektriztätVorher !== undefined
            ? elektriztätVorher - elektrizitätnachTechnologie
            : undefined;

    const co2vorher = useVariableStoreBase((state) => state.building_CO2Emissions_AfterGeneralData());
    const co2vorherinT = co2vorher !== undefined ? co2vorher / 1000000 : undefined;
    const co2nachTechnologie = useVariableStoreBase((state) => state.building_CO2Emissions_AfterTechnology());
    const co2nachTechnologieinT = co2nachTechnologie !== undefined ? co2nachTechnologie / 1000000 : undefined;
    const co2erparnis =
        co2vorherinT !== undefined && co2nachTechnologieinT !== undefined
            ? co2vorherinT - co2nachTechnologieinT
            : undefined;

    // https://reactrouter.com/en/main/hooks/use-search-params
    const [searchParams, setSearchParams] = useSearchParams();
    if (searchParams.has("zustand")) {
        const store = searchParams.get("zustand");
        if (store !== null) {
            mergeFunction(JSON.parse(store));
        }
        setSearchParams("");
    }

    const [requestIsPending, setRequestIsPending] = useState<boolean>(false);
    const input = document.createElement("input");
    input.type = "email";
    input.required = true;
    input.value = address ?? "";

    const isValidAddress = input.checkValidity();

    const navigate = useNavigate();

    function handleClick() {
        if (requestIsPending) return;
        else {
            setRequestIsPending(true);
            fetch(`${basepath}create-pdf`, {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(myState),
            })
                // TODO ist nur zur dev
                .then(async (response) => {
                    if (response.ok) {
                        // if (process.env.NODE_ENV === "development") {
                        // Convert the response to a Blob
                        // const blob = await response.blob();
                        // // Create a URL for the Blob
                        // const blobUrl = URL.createObjectURL(blob);
                        // // Open the Blob URL in a new tab
                        // window.open(blobUrl);
                        // }
                    }
                })
                .finally(() => {
                    setRequestIsPending(false);
                });
        }
    }
    return (
        <>
            <StepsScaffolding
                className="grid place-items-center"
                navigate={navigate}
                //title={<Heading1>Wählen Sie die Gebäudeart aus</Heading1>}
                last={`/${StepKey.TechnologySelection}`}
                next={null}
            >
                <div id="header" className="my-8 grid w-full grid-cols-[85%_15%]">
                    <div>
                        <h1 className="mb-2 text-5xl font-semibold print:mb-0 print:text-4xl">Mainzer Energiehaus</h1>
                        <h2 className="mb-2 text-2xl print:text-xl">Ihre Ergebnisse des Energieberatungstools</h2>
                    </div>
                    <div className="grid grid-rows-2">
                        <img className="w-full" src={HSMainzLogo} />
                        <img className="w-full" src={MainzerStiftungLogo} />
                    </div>
                    <img className="col-span-2" src={MainzerTrennlinie} />
                </div>
                <div id="GrundlegendeDatenZumHaus">
                    <Heading1 className="mb-8 mt-8 print:mb-4 print:text-3xl">Datengrundlage</Heading1>
                    <div className="grid grid-cols-[20%_55%_20%] gap-x-[2.5%]">
                        <div id="ElementeLinks" className="text- text-left">
                            <div id="Element" className="mb-4 divide-y divide-solid">
                                <p className="text-xl font-semibold text-gray-700 print:text-base">{gebäudetyp}</p>
                                <p className="text-sm text-gray-600 print:text-xs">Gebäudetyp</p>
                            </div>
                            <div id="Element" className="mb-4 divide-y divide-solid">
                                <p className="text-xl font-semibold text-gray-700 print:text-base">{postleitzahl}</p>
                                <p className="text-sm text-gray-600 print:text-xs">Postleitzahl</p>
                            </div>
                            <div id="Element" className="mb-4 divide-y divide-solid">
                                <p className="text-xl font-semibold text-gray-700 print:text-base">{baujahr}</p>
                                <p className="text-sm text-gray-600 print:text-xs">Baujahr</p>
                            </div>
                            <div id="Element" className="mb-4 divide-y divide-solid">
                                <p className="text-xl font-semibold text-gray-700 print:text-base">{personenanzahl}</p>
                                <p className="text-sm text-gray-600 print:text-xs">Personenanzahl</p>
                            </div>
                            <div id="Element" className="mb-4 divide-y divide-solid">
                                <p className="text-xl font-semibold text-gray-700 print:text-base">{etagen}</p>
                                <p className="text-sm text-gray-600 print:text-xs">Etagen</p>
                            </div>
                        </div>
                        <div className="place-self-center">
                            {gebäudetyp !== null ? (
                                <img src={table[gebäudetyp]} className="align-middle"></img>
                            ) : undefined}
                        </div>
                        <div id="ElementeRechts" className="text-right">
                            <div id="Element" className="mb-4 divide-y divide-solid">
                                <p className="text-xl font-semibold text-gray-700 print:text-base">{breite} m</p>
                                <p className="text-sm text-gray-600 print:text-xs">Breite</p>
                            </div>
                            <div id="Element" className="mb-4 divide-y divide-solid">
                                <p className="text-xl font-semibold text-gray-700 print:text-base">{tiefe} m</p>
                                <p className="text-sm text-gray-600 print:text-xs">Tiefe</p>
                            </div>
                            <div id="Element" className="mb-4 divide-y divide-solid">
                                <p className="text-xl font-semibold text-gray-700 print:text-base">{höhe} m</p>
                                <p className="text-sm text-gray-600 print:text-xs">Höhe</p>
                            </div>
                            <div id="Element" className="mb-4 divide-y divide-solid">
                                <p className="text-xl font-semibold text-gray-700 print:text-base">{fläche} m²</p>
                                <p className="text-sm text-gray-600 print:text-xs">Fläche</p>
                            </div>
                            <div id="Element" className="mb-4 divide-y divide-solid">
                                <p className="text-xl font-semibold text-gray-700 print:text-base">{volumen} m³</p>
                                <p className="text-sm text-gray-600 print:text-xs">Volumen</p>
                            </div>
                        </div>
                    </div>
                </div>
                {dämmungVorhanden === FinalEnergyDemand_Q_E_Calculation.BasedOnHeatingLoad ? (
                    <>
                        <div id="DämmungVorherNachherTabelle" className="w-full">
                            <Heading1 className="mb-4 mt-8 print:mb-4 print:text-3xl">Außenhülle</Heading1>
                            <p className="mb-4 print:text-xs">Geplante Sanierungen der Bauteile</p>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-full text-xs print:text-[0.6rem]/none">
                                            Bauteil
                                        </TableHead>
                                        <TableHead className="text-center text-[0.5rem]/[0.6rem] print:text-[0.5rem]/[0.6rem]">
                                            angestrebter Standard
                                        </TableHead>
                                        <TableHead className="text-center text-[0.5rem]/[0.6rem] print:text-[0.5rem]/[0.6rem]">
                                            gewähltes Dämmmaterial
                                        </TableHead>
                                        <TableHead className="text-center text-[0.5rem]/[0.6rem] print:text-[0.5rem]/[0.6rem]">
                                            erforderliche Dämmdicke
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>
                                            <div className="grid grid-rows-2 gap-1">
                                                <span className="text-base/none print:text-xs/none">Kellerdecke</span>

                                                <span className="text-xs/none text-gray-400 print:text-[0.5rem]/none">
                                                    {konstruktionstypKellerdeckeGekürzt} | {bauteilflaecheKellerdecke}{" "}
                                                    m²{" "}
                                                    {sanierungsjahrKellerdecke !== null
                                                        ? " | " +
                                                          sanierungsjahrKellerdecke +
                                                          (sanierungsjahrKellerdeckeChosen === DefaultCustom.Default
                                                              ? " gebaut"
                                                              : " saniert")
                                                        : null}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center text-sm print:text-[0.5rem]/[0.6rem]">
                                            {angestrebterstandardKellerdecke === null
                                                ? "-"
                                                : angestrebterstandardKellerdecke}
                                        </TableCell>
                                        <TableCell className="text-center text-sm print:text-[0.5rem]/[0.6rem]">
                                            {dämmmaterialKellerdecke === null ? "-" : dämmmaterialKellerdecke}
                                        </TableCell>
                                        <TableCell className="text-center text-sm print:text-[0.5rem]/[0.6rem]">
                                            <span className="text-nowrap">
                                                {dämmdickeKellerdecke !== undefined
                                                    ? dämmdickeKellerdecke?.toLocaleString(
                                                          navigator.languages,
                                                          OBJeinskomma,
                                                      ) + " cm"
                                                    : "-"}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            <div className="grid grid-rows-2 gap-1">
                                                <span className="text-base/none print:text-xs/none">Außenwand</span>

                                                <span className="text-xs/none text-gray-400 print:text-[0.5rem]/none">
                                                    {konstruktionstypAußenwandGekürzt} | {bauteilflaecheAußenwand} m²{" "}
                                                    {sanierungsjahrAußenwand !== null
                                                        ? " | " +
                                                          sanierungsjahrAußenwand +
                                                          (sanierungsjahrAußenwandChosen === DefaultCustom.Default
                                                              ? " gebaut"
                                                              : " saniert")
                                                        : null}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center text-sm print:text-[0.5rem]/[0.6rem]">
                                            {angestrebterstandardAußenwand === null
                                                ? "-"
                                                : angestrebterstandardAußenwand}
                                        </TableCell>
                                        <TableCell className="text-center text-sm print:text-[0.5rem]/[0.6rem]">
                                            {dämmmaterialAußenwand === null ? "-" : dämmmaterialAußenwand}
                                        </TableCell>
                                        <TableCell className="text-center text-sm print:text-[0.5rem]/[0.6rem]">
                                            <span className="text-nowrap">
                                                {dämmdickeAußenwand !== undefined
                                                    ? dämmdickeAußenwand?.toLocaleString(
                                                          navigator.languages,
                                                          OBJeinskomma,
                                                      ) + " cm"
                                                    : "-"}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            <div className="grid grid-rows-2 gap-1">
                                                <span className="text-base/none print:text-xs/none">Fenster</span>
                                                <span className="text-xs/none text-gray-400 print:text-[0.5rem]/none">
                                                    {konstruktionstypFensterGekürzt} | {bauteilflaecheFenster} m²{" "}
                                                    {sanierungsjahrFenster !== null
                                                        ? " | " +
                                                          sanierungsjahrFenster +
                                                          (sanierungsjahrFensterChosen === DefaultCustom.Default
                                                              ? " gebaut"
                                                              : " saniert")
                                                        : null}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center text-sm print:text-[0.5rem]/[0.6rem]">
                                            {angestrebterstandardFenster === null ? "-" : angestrebterstandardFenster}
                                        </TableCell>
                                        <TableCell className="text-center text-sm print:text-[0.5rem]/[0.6rem]">
                                            -
                                        </TableCell>
                                        <TableCell className="text-center text-sm print:text-[0.5rem]/[0.6rem]">
                                            -
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            <div className="grid grid-rows-2 gap-1">
                                                <span className="text-base/none print:text-xs/none">Dach</span>
                                                <span className="text-xs/none text-gray-400 print:text-[0.5rem]/none">
                                                    {konstruktionstypDachGekürzt} | {bauteilflaecheDach} m²{" "}
                                                    {sanierungsjahrDach !== null
                                                        ? " | " +
                                                          sanierungsjahrDach +
                                                          (sanierungsjahrDachChosen === DefaultCustom.Default
                                                              ? " gebaut"
                                                              : " saniert")
                                                        : null}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center text-sm print:text-[0.5rem]/[0.6rem]">
                                            {angestrebterstandardDach === null ? "-" : angestrebterstandardDach}
                                        </TableCell>
                                        <TableCell className="text-center text-sm print:text-[0.5rem]/[0.6rem]">
                                            {dämmmaterialDach === null ? "-" : dämmmaterialDach}
                                        </TableCell>
                                        <TableCell className="text-center text-sm print:text-[0.5rem]/[0.6rem]">
                                            <span className="text-nowrap">
                                                {dämmdickeDach !== undefined
                                                    ? dämmdickeDach?.toLocaleString(navigator.languages, OBJeinskomma) +
                                                      " cm"
                                                    : "-"}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                        <div id="DämmungVorherNachherTabelle" className="w-full break-inside-avoid">
                            <p className="mb-4 print:text-xs">Ersparnisse durch die geplanten Sanierungen</p>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-full text-xs print:text-[0.6rem]/none">
                                            Bauteil
                                        </TableHead>
                                        <TableHead className="text-center text-[0.5rem]/[0.6rem] print:text-[0.5rem]/[0.6rem]">
                                            Transmissionswärmeverluste vor Sanierung
                                        </TableHead>
                                        <TableHead className="text-center text-[0.5rem]/[0.6rem] print:text-[0.5rem]/[0.6rem]">
                                            Transmissionswärmeverluste nach Sanierung
                                        </TableHead>
                                        <TableHead className="text-center text-[0.5rem]/[0.6rem] print:text-[0.5rem]/[0.6rem]">
                                            Transmissionswärmeverluste Ersparnis
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>
                                            <div className="grid grid-rows-2 gap-1">
                                                <span className="text-base/none print:text-xs/none">Kellderdecke</span>
                                                <span className="text-xs/none text-gray-400 print:text-[0.5rem]/none">
                                                    {konstruktionstypKellerdeckeGekürzt} | {bauteilflaecheKellerdecke}{" "}
                                                    m²{" "}
                                                    {sanierungsjahrKellerdecke !== null
                                                        ? " | " +
                                                          sanierungsjahrKellerdecke +
                                                          (sanierungsjahrKellerdeckeChosen === DefaultCustom.Default
                                                              ? " gebaut"
                                                              : " saniert")
                                                        : null}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center text-sm print:text-[0.5rem]/[0.6rem]">
                                            {transmissionswaermeverlusteKellerdeckeVorher === undefined
                                                ? "-"
                                                : transmissionswaermeverlusteKellerdeckeVorher?.toLocaleString(
                                                      undefined,
                                                      OBJnachkomma,
                                                  ) + " kW"}
                                        </TableCell>
                                        <TableCell className="text-center text-sm print:text-[0.5rem]/[0.6rem]">
                                            {transmissionswaermeverlusteKellerdeckeNachher === undefined
                                                ? "-"
                                                : transmissionswaermeverlusteKellerdeckeNachher?.toLocaleString(
                                                      undefined,
                                                      OBJnachkomma,
                                                  ) + " kW"}
                                        </TableCell>
                                        <TableCell className="text-center text-sm print:text-[0.5rem]/[0.6rem]">
                                            <span className="text-nowrap">
                                                {transmissionswaermeverlusteKellerdeckeDifferenz === undefined
                                                    ? "-"
                                                    : transmissionswaermeverlusteKellerdeckeDifferenz?.toLocaleString(
                                                          undefined,
                                                          OBJnachkomma,
                                                      ) +
                                                      " kW | " +
                                                      transmissionswaermeverlusteKellerdeckeProzent?.toLocaleString(
                                                          undefined,
                                                          OBJnachkomma,
                                                      ) +
                                                      " %"}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            <div className="grid grid-rows-2 gap-1">
                                                <span className="text-base/none print:text-xs/none">Außenwand</span>
                                                <span className="text-xs/none text-gray-400 print:text-[0.5rem]/none">
                                                    {konstruktionstypAußenwandGekürzt} | {bauteilflaecheAußenwand} m²{" "}
                                                    {sanierungsjahrAußenwand !== null
                                                        ? " | " +
                                                          sanierungsjahrAußenwand +
                                                          (sanierungsjahrAußenwandChosen === DefaultCustom.Default
                                                              ? " gebaut"
                                                              : " saniert")
                                                        : null}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center text-sm print:text-[0.5rem]/[0.6rem]">
                                            {transmissionswaermeverlusteAußenwandVorher === undefined
                                                ? "-"
                                                : transmissionswaermeverlusteAußenwandVorher?.toLocaleString(
                                                      undefined,
                                                      OBJnachkomma,
                                                  ) + " kW"}
                                        </TableCell>
                                        <TableCell className="text-center text-sm print:text-[0.5rem]/[0.6rem]">
                                            {transmissionswaermeverlusteAußenwandNachher === undefined
                                                ? "-"
                                                : transmissionswaermeverlusteAußenwandNachher?.toLocaleString(
                                                      undefined,
                                                      OBJnachkomma,
                                                  ) + " kW"}
                                        </TableCell>
                                        <TableCell className="text-center text-sm print:text-[0.5rem]/[0.6rem]">
                                            <span className="text-nowrap">
                                                {transmissionswaermeverlusteAußenwandDifferenz === undefined
                                                    ? "-"
                                                    : transmissionswaermeverlusteAußenwandDifferenz?.toLocaleString(
                                                          undefined,
                                                          OBJnachkomma,
                                                      ) +
                                                      " kW | " +
                                                      transmissionswaermeverlusteAußenwandProzent?.toLocaleString(
                                                          undefined,
                                                          OBJnachkomma,
                                                      ) +
                                                      " %"}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            <div className="grid grid-rows-2 gap-1">
                                                <span className="text-base/none print:text-xs/none">Fenster</span>
                                                <span className="text-xs/none text-gray-400 print:text-[0.5rem]/none">
                                                    {konstruktionstypFensterGekürzt} | {bauteilflaecheFenster} m²{" "}
                                                    {sanierungsjahrFenster !== null
                                                        ? " | " +
                                                          sanierungsjahrFenster +
                                                          (sanierungsjahrFensterChosen === DefaultCustom.Default
                                                              ? " gebaut"
                                                              : " saniert")
                                                        : null}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center text-sm print:text-[0.5rem]/[0.6rem]">
                                            {transmissionswaermeverlusteFensterVorher === undefined
                                                ? "-"
                                                : transmissionswaermeverlusteFensterVorher?.toLocaleString(
                                                      undefined,
                                                      OBJnachkomma,
                                                  ) + " kW"}
                                        </TableCell>
                                        <TableCell className="text-center text-sm print:text-[0.5rem]/[0.6rem]">
                                            {transmissionswaermeverlusteFensterNachher === undefined
                                                ? "-"
                                                : transmissionswaermeverlusteFensterNachher?.toLocaleString(
                                                      undefined,
                                                      OBJnachkomma,
                                                  ) + " kW"}
                                        </TableCell>
                                        <TableCell className="text-center text-sm print:text-[0.5rem]/[0.6rem]">
                                            <span className="text-nowrap">
                                                {transmissionswaermeverlusteFensterDifferenz === undefined
                                                    ? "-"
                                                    : transmissionswaermeverlusteFensterDifferenz?.toLocaleString(
                                                          undefined,
                                                          OBJnachkomma,
                                                      ) +
                                                      " kW | " +
                                                      transmissionswaermeverlusteFensterProzent?.toLocaleString(
                                                          undefined,
                                                          OBJnachkomma,
                                                      ) +
                                                      " %"}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            <div className="grid grid-rows-2 gap-1">
                                                <span className="text-base/none print:text-xs/none">Dach</span>
                                                <span className="text-xs/none text-gray-400 print:text-[0.5rem]/none">
                                                    {konstruktionstypDachGekürzt} | {bauteilflaecheDach} m²{" "}
                                                    {sanierungsjahrDach !== null
                                                        ? " | " +
                                                          sanierungsjahrDach +
                                                          (sanierungsjahrDachChosen === DefaultCustom.Default
                                                              ? " gebaut"
                                                              : " saniert")
                                                        : null}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center text-sm print:text-[0.5rem]/[0.6rem]">
                                            {transmissionswaermeverlusteDachVorher === undefined
                                                ? "-"
                                                : transmissionswaermeverlusteDachVorher?.toLocaleString(
                                                      undefined,
                                                      OBJnachkomma,
                                                  ) + " kW"}
                                        </TableCell>
                                        <TableCell className="text-center text-sm print:text-[0.5rem]/[0.6rem]">
                                            {transmissionswaermeverlusteDachNachher === undefined
                                                ? "-"
                                                : transmissionswaermeverlusteDachNachher?.toLocaleString(
                                                      undefined,
                                                      OBJnachkomma,
                                                  ) + " kW"}
                                        </TableCell>
                                        <TableCell className="text-center text-sm print:text-[0.5rem]/[0.6rem]">
                                            <span className="text-nowrap">
                                                {transmissionswaermeverlusteDachDifferenz === undefined
                                                    ? "-"
                                                    : transmissionswaermeverlusteDachDifferenz?.toLocaleString(
                                                          undefined,
                                                          OBJnachkomma,
                                                      ) +
                                                      " kW | " +
                                                      transmissionswaermeverlusteDachProzent?.toLocaleString(
                                                          undefined,
                                                          OBJnachkomma,
                                                      ) +
                                                      " %"}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                                <TableFooter className="font-semibold">
                                    <TableRow>
                                        <TableCell className="text-base/none print:text-xs/none">Gesamt</TableCell>
                                        <TableCell className="text-center text-sm print:text-[0.5rem]/[0.6rem]">
                                            {transmissionswaermeverlusteGesamtVorher === undefined
                                                ? "-"
                                                : transmissionswaermeverlusteGesamtVorher?.toLocaleString(
                                                      undefined,
                                                      OBJnachkomma,
                                                  ) + " kW"}
                                        </TableCell>
                                        <TableCell className="text-center text-sm print:text-[0.5rem]/[0.6rem]">
                                            {transmissionswaermeverlusteGesamtNachher === undefined
                                                ? "-"
                                                : transmissionswaermeverlusteGesamtNachher?.toLocaleString(
                                                      undefined,
                                                      OBJnachkomma,
                                                  ) + " kW"}
                                        </TableCell>
                                        <TableCell className="text-center text-sm print:text-[0.5rem]/[0.6rem]">
                                            <span className="text-nowrap">
                                                {transmissionswaermeverlusteGesamtDifferenz === undefined
                                                    ? "-"
                                                    : transmissionswaermeverlusteGesamtDifferenz?.toLocaleString(
                                                          undefined,
                                                          OBJnachkomma,
                                                      ) +
                                                      " kW | " +
                                                      transmissionswaermeverlusteGesamtProzent?.toLocaleString(
                                                          undefined,
                                                          OBJnachkomma,
                                                      ) +
                                                      " %"}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </div>
                        <p className="mt-8">
                            Der Wärmebedarf wird durch die Dämmung von{" "}
                            <span className="font-semibold">
                                {wärmebedarfVorher?.toLocaleString(navigator.languages, OBJohnekomma)} kWh/a
                            </span>{" "}
                            auf{" "}
                            <span className="font-semibold">
                                {wärmebedarfNachher?.toLocaleString(navigator.languages, OBJohnekomma)} kWh/a
                            </span>{" "}
                            reduziert.
                        </p>
                    </>
                ) : (
                    <>
                        <Heading1 className="mb-4 mt-8 print:mb-4 print:text-3xl">Vorjahresverbrauch</Heading1>
                        <p>Im vorherigen Jahr wurden ... verbraucht. Daraus ergibt sich ein Wärmebedarf von ...</p>
                    </>
                )}
                <div className="w-full break-inside-avoid">
                    <Heading1 className="mb-4 mt-8 print:mb-4 print:text-3xl">Wärmeerzeuger</Heading1>
                    {wärmepumpenartvorhanden !== null ? (
                        <>
                            <div id="InfosVorhandeneWärmepumpe" className="mb-8 grid grid-cols-2">
                                <p className="col-span-2 mb-8">Daten zu der eingabauten Wärmepumpe</p>
                                <p>Wärmepumpenart: {wärmepumpenartvorhanden}</p>
                                <p>JAZ: {jazvorhanden?.toLocaleString()}</p>
                                <p>Deckungsanteil: {deckungsanteilvorhanden}</p>
                            </div>

                            <div id="WärmebedarfUnterteiltWennWärmepumpeVorhandenTabelle">
                                <Table>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell className="">Wärmebedarf gedeckt durch Brennstoffe</TableCell>
                                            <TableCell className="text-center">
                                                {wärmebedarfbrennstoff?.toLocaleString(
                                                    navigator.languages,
                                                    OBJohnekomma,
                                                )}{" "}
                                                kW
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="">Wärmebedarf gedeckt durch Wärmepumpe</TableCell>
                                            <TableCell className="text-center">
                                                {wärmebedarfwärmepumpe?.toLocaleString(
                                                    navigator.languages,
                                                    OBJohnekomma,
                                                )}{" "}
                                                kW
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                    <TableFooter className="font-semibold">
                                        <TableRow>
                                            <TableCell className="">Gesamt</TableCell>

                                            <TableCell className="text-center">
                                                {wärmebedarfgesamt?.toLocaleString(navigator.languages, OBJohnekomma)}{" "}
                                                kW
                                            </TableCell>
                                        </TableRow>
                                    </TableFooter>
                                </Table>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* <p className="mb-8">Daten zum neuen Wärmeerzeuger</p> */}
                            {wärmeerzeugerneu === NewHeatGenerator.HeatPump ? (
                                <Table>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell className="">Vorlauftemperatur</TableCell>
                                            <TableCell className="text-right">
                                                {wärmeverteilungVorlauftemperatur} °C
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="">Art der Wärmeverteilung</TableCell>
                                            <TableCell className="text-right">{wärmeverteilung}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="">Art des Wärmeerzeugers</TableCell>
                                            <TableCell className="text-right">{neuerwärmeerzeuger}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="">Deckungsanteil</TableCell>
                                            <TableCell className="text-right">
                                                {deckungsanteilneu === undefined || deckungsanteilneu === 0
                                                    ? "100"
                                                    : deckungsanteilneu}{" "}
                                                %
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="">Art der Wärmepumpe</TableCell>
                                            <TableCell className="text-right">{wärmepumpenartneu}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="">Jahresarbeitszahl</TableCell>
                                            <TableCell className="text-right">{jazneu}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            ) : wärmeerzeugerneu === NewHeatGenerator.HybridSystem ? (
                                <Table>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell className="">Art des Wärmeerzeugers</TableCell>
                                            <TableCell className="text-right">{neuerwärmeerzeuger}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="">Konventioneller Wärmeerzeuger</TableCell>
                                            <TableCell className="text-right">{zweiterwärmeerzeuger}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="">Art der Wärmepumpe</TableCell>
                                            <TableCell className="text-right">{wärmepumpenartneu}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="">Deckungsanteil der Wärmepumpe</TableCell>
                                            <TableCell className="text-right">{deckungsanteilneu}%</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="">Jahresarbeitszahl der Wärmepumpe</TableCell>
                                            <TableCell className="text-right">{jazneu}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="">Art der Wärmeverteilung</TableCell>
                                            <TableCell className="text-right">{wärmeverteilung}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="">Vorlauftemperatur</TableCell>
                                            <TableCell className="text-right">
                                                {wärmeverteilungVorlauftemperatur} °C
                                            </TableCell>
                                        </TableRow>
                                        {/* <TableRow>
                                            <TableCell className="">Betriebsart</TableCell>
                                            <TableCell className="text-right">{wärmeerzeugerneuBetriebsart}</TableCell>
                                        </TableRow> */}
                                    </TableBody>
                                </Table>
                            ) : wärmeerzeugerneu === NewHeatGenerator.FuelHeating ? (
                                <Table>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell className="">Vorlauftemperatur</TableCell>
                                            <TableCell className="text-right">
                                                {wärmeverteilungVorlauftemperatur} °C
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="">Art der Wärmeverteilung</TableCell>
                                            <TableCell className="text-right">{wärmeverteilung}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="">Art des Wärmeerzeugers</TableCell>
                                            <TableCell className="text-right">{neuerwärmeerzeuger}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="">Betrieb durch</TableCell>
                                            <TableCell className="text-right">{wärmeerzeugerneuBrennstoff}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            ) : undefined}
                        </>
                    )}
                </div>
                <div id="Photovoltaik" className="w-full break-inside-avoid">
                    {photovoltaiksolleingebautwerden === true ? (
                        <>
                            <Heading1 className="mb-4 mt-8 print:mb-4 print:text-3xl">Photovoltaik</Heading1>
                            <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableCell className="">Dachfläche</TableCell>
                                        <TableCell className="text-right">
                                            {dachfläche?.toLocaleString(navigator.languages, OBJnachkomma)} m
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="">Letzte Sanierung des Daches</TableCell>
                                        <TableCell className="text-right">{letztedachsanierung}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="">Anzahl der Photovoltaikmodule</TableCell>
                                        <TableCell className="text-right">{anzahlmodule}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="">Autarkiegrad</TableCell>
                                        <TableCell className="text-right">
                                            {selbstversorgungsgrad?.toLocaleString(navigator.languages, OBJnachkomma)} %
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="">Einspeisung pro Jahr</TableCell>
                                        <TableCell className="text-right">
                                            {einspeisung?.toLocaleString(navigator.languages, OBJnachkomma)} kW
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="">Stromerzeugung</TableCell>
                                        <TableCell className="text-right">
                                            {kilowattprojahr?.toLocaleString(navigator.languages, OBJnachkomma)} kW
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="">Installierte Leistung</TableCell>
                                        <TableCell className="text-right">
                                            {kilowattpeak?.toLocaleString(navigator.languages, OBJnachkomma)} kWp
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </>
                    ) : undefined}
                </div>
                <div id="Lüftung" className="w-full break-inside-avoid">
                    <Heading1 className="mb-4 mt-8 print:mb-4 print:text-3xl">Lüftung</Heading1>
                    {/* <p className="mb-8">Daten zur Lüftung</p> */}
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell className="">Lüftungsvolumen</TableCell>
                                <TableCell className="text-right">{lüftungsvolumen} m³</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="">Kompletter Luftaustausch in</TableCell>
                                <TableCell className="text-right">{luftwechselrate} h</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="">Wärmerückgewinnungsgrad</TableCell>
                                <TableCell className="text-right">{wrggrad} %</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
                <div id="ZusammenfassungErsparnisse" className="w-full break-inside-avoid">
                    <Heading1 className="mb-4 mt-8 print:mb-4 print:text-3xl">Zusammenfassung der Ergebnisse</Heading1>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {/* w-full */}
                                <TableHead className="">Kategorie</TableHead>
                                <TableHead className="text-center text-[0.6rem]/[0.6rem]">
                                    Wert vor Sanierungen
                                </TableHead>
                                <TableHead className="text-center text-[0.6rem]/[0.6rem]">
                                    Wert nach Sanierungen
                                </TableHead>
                                <TableHead className="text-center text-[0.6rem]/[0.6rem]">Ersparnis</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className="">Wärmebedarf</TableCell>
                                <TableCell className="text-center">
                                    {wärmebedarfVorher?.toLocaleString(navigator.languages, OBJohnekomma)} kWh/a
                                </TableCell>
                                <TableCell className="text-center">
                                    {qWnachTechnologie?.toLocaleString(navigator.languages, OBJohnekomma)} kWh/a
                                </TableCell>
                                <TableCell className="text-center">
                                    {qWErparnisGesamt?.toLocaleString(navigator.languages, OBJohnekomma)} kWh/a
                                </TableCell>
                            </TableRow>
                            {/* <TableRow>
                                <TableCell className="">Endenergiebedarf</TableCell>
                                <TableCell className="text-center">{}</TableCell>
                            </TableRow> */}
                            <TableRow>
                                <TableCell className="">Stromverbrauch</TableCell>
                                <TableCell className="text-center">
                                    {elektriztätVorher?.toLocaleString(navigator.languages, OBJohnekomma)} kWh/a
                                </TableCell>
                                <TableCell className="text-center">
                                    {elektrizitätnachTechnologie?.toLocaleString(navigator.languages, OBJohnekomma)}{" "}
                                    kWh/a
                                </TableCell>
                                <TableCell className="text-center">
                                    {elektrizitätErsparnis?.toLocaleString(navigator.languages, OBJohnekomma)} kWh/a
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="">CO2 Verbrauch</TableCell>
                                <TableCell className="text-center">
                                    {co2vorherinT?.toLocaleString(navigator.languages, OBJnachkomma)} t/a
                                </TableCell>
                                <TableCell className="text-center">
                                    {co2nachTechnologieinT?.toLocaleString(navigator.languages, OBJnachkomma)} t/a
                                </TableCell>
                                <TableCell className="text-center">
                                    {co2erparnis?.toLocaleString(navigator.languages, OBJnachkomma)} t/a
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant={"default"} className="fixed bottom-16 right-16 print:hidden">
                            E-Mail versenden
                            <AtSign className="ml-2 h-4 w-4" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Ergebnisse verschicken (Optional)</DialogTitle>
                            <DialogDescription>
                                Die Ergebnisse können abfotografiert werden oder auch an diese E-Mail Adresse verschickt
                                werden.
                                <br />
                                Der E-Mail Versand wird momentan mit GMX abgewickelt. <br />
                                Alle Daten werden nur für den Versand gespeichert.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid items-center gap-4 sm:grid-cols-[auto_1fr]">
                                {/* <DivInputSubgrid> */}
                                <Label htmlFor="plz">E-Mail Adresse:</Label>
                                {/* <DivSmall> */}
                                <InputWithKeyboard
                                    id="mail"
                                    // className="w-9"
                                    classNamePopover="w-128"
                                    type="email"
                                    inputMode="email"
                                    currentLayout="text"
                                    required={true}
                                    pattern={INPUT_PATTERN_EMAIL_ADDRESS}
                                    placeholder={"muster@beispiel.de"}
                                    defaultValue={address ?? ""}
                                    onChangeCallback={(value: string, validity: ValidityState) => {
                                        if (validity.valid || validity.valueMissing) {
                                            useVariableStoreBase.setState((state) => ({
                                                email: {
                                                    ...state.email,
                                                    address: value === "" ? null : value,
                                                },
                                            }));
                                        }
                                    }}
                                />
                                {/* </DivSmall> */}
                                {/* </DivInputSubgrid> */}
                            </div>
                            <div className="grid grid-cols-[auto_1fr] gap-4">
                                <Checkbox
                                    id="consent"
                                    checked={consent}
                                    onCheckedChange={(value) =>
                                        (value === true || value === false) &&
                                        useVariableStoreBase.setState((state) => ({
                                            email: {
                                                ...state.email,
                                                deliveryConsent: value,
                                            },
                                        }))
                                    }
                                />
                                <Label htmlFor="consent">
                                    <p>
                                        Ich bin damit einverstanden, dass meine Ergebnisse für den Versand über GMX
                                        verschickt und dafür gespeichert werden.
                                    </p>
                                </Label>
                            </div>
                        </div>
                        <DialogFooter /* className="sm:justify-between" */>
                            <DialogClose asChild>
                                <Button variant={"secondary"}>Schließen</Button>
                            </DialogClose>
                            <Button
                                onClick={handleClick}
                                disabled={
                                    (import.meta.env.VITE_DEPLOY_TO ?? "CONTAINER") === "PAGES"
                                        ? true
                                        : requestIsPending || !consent || !isValidAddress
                                }
                            >
                                {(import.meta.env.VITE_DEPLOY_TO ?? "CONTAINER") === "PAGES" ? (
                                    <>nicht verfügbar</>
                                ) : (
                                    <>
                                        Absenden
                                        {requestIsPending ? (
                                            <Loader className="ml-2 h-4 w-4 animate-spin" />
                                        ) : (
                                            <Send className="ml-2 h-4 w-4" />
                                        )}
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </StepsScaffolding>
        </>
    );
}
