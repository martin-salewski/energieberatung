import { StepKey } from "@/main";
import { useNavigate } from "react-router-dom";
import { FinalEnergyDemand_Q_E_Calculation, useVariableStoreBase } from "@/zustand/useVariableStore";
import { StepsScaffolding } from "@/components/scaffolding/StepsScaffolding";
import {
    ChartConfig,
    ChartContainer,
    // ChartLegend,
    // ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, LabelList, PieChart, Pie, Label as LabelRe } from "recharts";
import { Heading1, Heading2 } from "@/components/ui/heading";

export function S06ResultsAfterGeneralData() {
    const navigate = useNavigate();
    const basedOn = useVariableStoreBase((state) => state.building_FinalEnergyDemand_BasedOn);
    const canGoNext = true;
    return (
        <StepsScaffolding
            className="grid grow-0 gap-2 pb-0 md:gap-4 lg:grid-cols-[1fr_1fr]"
            navigate={navigate}
            title={<Heading1>Aktuelle Kennzahlen</Heading1>}
            last={`/${StepKey.DataForElectricityCalculation}`}
            next={
                canGoNext
                    ? basedOn === FinalEnergyDemand_Q_E_Calculation.BasedOnHeatingLoad
                        ? `/${StepKey.NewInsulation}`
                        : basedOn === FinalEnergyDemand_Q_E_Calculation.BasedOnHeatingDemand
                          ? `/${StepKey.TechnologySelection}`
                          : undefined
                    : undefined
            }
            // preNext={nextStep}
        >
            {/* <div className="grid gap-2 md:gap-4"> */}
            <ChartQE />

            <ChartElectricity />

            <ChartCO2 />

            {/* </div> */}
        </StepsScaffolding>
    );
}

function ChartQE() {
    const qE = useVariableStoreBase((state) => state.building_FinalEnergyDemand_Q_E_AfterGeneralData());
    const basedOn = useVariableStoreBase((state) => state.building_FinalEnergyDemand_BasedOn);
    // Heizlast
    const qT = useVariableStoreBase((state) => {
        const buildingType = state.building_Type;
        const qT = state.building_TransmissionHeatLoss_Q_T_AfterGeneralData();
        if (buildingType === null) return undefined;
        if (qT === undefined) return undefined;
        const utilizedHoursObj = state.building_UtilizedHours;
        const utilizedHours = utilizedHoursObj[utilizedHoursObj.chosen]();
        if (utilizedHours === undefined) return undefined;
        return qT * utilizedHours;
    });
    // TODO Gibt es evtl gar nicht
    const qL = useVariableStoreBase((state) => {
        const buildingType = state.building_Type;
        const qLWO = state.building_VentilationHeatLoss_Q_L_AfterGeneralData();
        if (buildingType === null) return undefined;
        if (qLWO === undefined) return undefined;
        const utilizedHoursObj = state.building_UtilizedHours;
        const utilizedHours = utilizedHoursObj[utilizedHoursObj.chosen]();
        if (utilizedHours === undefined) return undefined;
        return qLWO * utilizedHours;
    });
    // const qLSavings = useVariableStoreBase((state) => {
    //     const buildingType = state.building_Type;
    //     const qLSavings = state.building_VentilationHeatLoss_Q_L_Savings_AfterGeneralData();
    //     if (buildingType === null) return undefined;
    //     if (qLSavings === undefined) return undefined;
    //     const utilizedHoursObj = state.building_UtilizedHours;
    //     const utilizedHours = utilizedHoursObj[utilizedHoursObj.chosen]();
    //     if (utilizedHours === undefined) return undefined;
    //     return qLSavings * utilizedHours;
    // });
    // const qLW = useVariableStoreBase((state) => {
    //     const buildingType = state.building_Type;
    //     const qlW = state.building_VentilationHeatLoss_Q_L_WithWRG();
    //     if (buildingType === null) return undefined;
    //     if (qlW === undefined) return undefined;
    //     const utilizedHoursObj = state.building_UtilizedHours;
    //     const utilizedHours = utilizedHoursObj[utilizedHoursObj.chosen]();
    //     if (utilizedHours === undefined) return undefined;
    //     return qlW * utilizedHours;
    // });

    // building_HeatingLoad_Q_H_CoveredByFuel_AfterGeneralData
    // building_HeatingLoad_Q_H_CoveredByWP_AfterGeneralData
    // Wärmebedarf

    const qH = useVariableStoreBase((state) =>
        state.building_HeatingLoad_Q_H_AfterGeneralData[state.building_HeatingLoad_Q_H_AfterGeneralData.chosen](),
    );
    const qW = useVariableStoreBase((state) =>
        state.building_HeatingDemand_Q_W_AfterGeneralData[state.building_HeatingDemand_Q_W_AfterGeneralData.chosen](),
    );
    const qWFuel = useVariableStoreBase((state) => state.building_HeatingDemand_Q_W_Fuel_AfterGeneralData());
    const qWWP = useVariableStoreBase((state) => state.building_HeatingDemand_Q_W_WP_AfterGeneralData());
    const usesWP = useVariableStoreBase((state) => state.building_HeatPumpType !== null);
    const onlyUsesWP = useVariableStoreBase(
        (state) =>
            state.building_HeatPumpType !== null &&
            state.building_HeatPump_CoverageRatioInPercent_AfterGeneralData >= 100,
    );

    const qWW = useVariableStoreBase((state) =>
        state.building_WarmWaterDemand_Q_WW[state.building_WarmWaterDemand_Q_WW.chosen](),
    );
    // const qWWOrigin = useVariableStoreBase((state) => state.building_WarmWaterOrigin);
    // const qESpez = useVariableStoreBase((state) =>
    //     state.building_SpezificFinalEnergyDemand_Q_E_Spez_AfterGeneralData(),
    // );

    // const qWWOrigin = useVariableStoreBase((state) => state.building_WarmWaterOrigin);
    const chartData: { label: string; [key: string]: unknown }[] = [{ label: "Endenergiebedarf", qE, qW, qH }];
    if (basedOn === FinalEnergyDemand_Q_E_Calculation.BasedOnHeatingLoad)
        // TODO ich glaube nicht, dass wir qL und qT berechnet haben, wenn der Weg über Wärmebedarf gegangen wird.
        chartData.push({ label: "Zusammensetzung", qL, qT, qWW });
    chartData.push({ label: "Gedeckt Durch", qWFuel, qWWP } /* , { label: "Rest", qL1: qL, qLW, qLSavings } */);

    const chartConfig = {
        qE: {
            label: "Endenergiebedarf",
        },
        qT: {
            label: "Transmissionswärmeverluste",
        },
        qL: {
            label: "Lüftungswärmeverluste",
        },
        qW: {
            label: "Wärmebedarf",
        },
        qWFuel: {
            label: "Deckung durch Brennstoff",
        },
        qWWP: {
            label: "Deckung durch Wärmepumpe",
        },
        qH: {
            label: "Heizast",
        },
        qWW: {
            label: "Warmwasserenergie",
        },
    } satisfies ChartConfig;
    const unit = " kWh/a";
    return (
        <div className="col-span-full grid">
            <Heading2>Jährlicher Endenergiebedarf</Heading2>
            <ChartContainer config={chartConfig} className="h-48 w-full">
                <BarChart layout="vertical" accessibilityLayer={true} data={chartData}>
                    <CartesianGrid vertical={true} />
                    <YAxis
                        dataKey="label"
                        type="category"
                        hide
                        // tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <XAxis type="number" scale={"sequential"} unit={unit} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    {/* <ChartLegend content={<ChartLegendContent />} /> */}
                    <LabelList position="top" dataKey={"qE"} />
                    <Bar dataKey="qT" stackId={"a"} fill="hsl(var(--chart-1))" unit={unit} />
                    <Bar dataKey="qL" stackId={"a"} fill="hsl(var(--chart-2))" unit={unit} />
                    <Bar dataKey="qWW" stackId={"a"} fill="hsl(var(--chart-3))" unit={unit} />
                    <Bar dataKey="qE" stackId={"a"} fill="hsl(var(--chart-4))" unit={unit} />
                    <Bar dataKey="qLSavings" stackId={"a"} fill="hsl(var(--chart-1))" unit={unit} />
                    {/* <Bar dataKey="qH" label fill="hsl(var(--chart-5))" /> */}
                    {!onlyUsesWP && <Bar dataKey="qWFuel" stackId={"a"} fill="hsl(var(--chart-5))" unit={unit} />}
                    {usesWP && <Bar dataKey="qWWP" stackId={"a"} fill="hsl(var(--chart-6))" unit={unit} />}
                    {/* <Bar dataKey="qW" label stackId={"c"} fill="hsl(var(--chart-4))" />
                    <Bar dataKey="qL1" label stackId={"d"} fill="hsl(var(--chart-2))" />
                    <Bar dataKey="qLW" label stackId={"e"} fill="hsl(var(--chart-3))" />
                    */}

                    {/* <Bar dataKey="qE" label fill="hsl(var(--chart-5))" /> */}
                </BarChart>
            </ChartContainer>
            {/* {process.env.NODE_ENV === "development" && (
                <>
                    <Label>
                        QESpez: {`${qESpez}`} ({getEnergyefficiencyclass(qESpez ?? Infinity).label})
                    </Label>
                    <Label>QE: {`${qE}`}</Label>
                    <Label>QT: {`${qT}`}</Label>
                    <Label>QL: {`${qL}`}</Label>
                    <Label>QLSavings: {`${qLSavings}`}</Label>
                    <Separator />

                    <Label>qW: {`${qW}`}</Label>
                    <Label>qWFuel: {`${qWFuel}`}</Label>
                    <Label>qWWP: {`${qWWP}`}</Label>

                    <Label>QWW: {`${qWW}`}</Label>
                    <Label>QWWOrigin: {`${qWWOrigin}`}</Label>
                </>
            )} */}
        </div>
    );
}

function ChartElectricity() {
    const basicElectricity = useVariableStoreBase((state) => state.building_Basic_Electricity());
    const carElectricity = useVariableStoreBase((state) => state.building_ElectricCar_Electricity());
    const carIsUsed = useVariableStoreBase((state) => state.building_ElectricCar.isUsed);
    const heatPumpEnergy = useVariableStoreBase((state) => state.building_HeatPump_Electricity());
    const combinedElectricity = useVariableStoreBase((state) => state.building_ElectricityUsage());

    const usesWP = useVariableStoreBase((state) => state.building_HeatPumpType !== null);
    const chartData = [
        { type: "basic", value: basicElectricity, fill: "var(--color-basic)" },

        // { browser: "edge", visitors: 173 },
        // { browser: "other", visitors: 190 },
    ];
    if (carIsUsed) chartData.push({ type: "car", value: carElectricity, fill: "var(--color-car)" });
    if (usesWP) chartData.push({ type: "heatpump", value: heatPumpEnergy, fill: "var(--color-heatpump)" });

    const chartConfig = {
        value: {
            label: "kWh/a",
        },
        basic: {
            label: "Allgemein",
            color: "hsl(var(--chart-1))",
        },
        car: {
            label: "Elektroauto",
            color: "hsl(var(--chart-2))",
        },
        heatpump: {
            label: "Wärmepumpe",
            color: "hsl(var(--chart-3))",
        },
        // edge: {
        //     label: "Edge",
        //     color: "hsl(var(--chart-4))",
        // },
        // other: {
        //     label: "Other",
        //     color: "hsl(var(--chart-5))",
        // },
    } satisfies ChartConfig;

    return (
        <div className="grid">
            <Heading2>Jährlicher Strombedarf</Heading2>
            <ChartContainer config={chartConfig} className="mx-auto aspect-square h-full max-h-72 w-full">
                <PieChart accessibilityLayer={true}>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    {/* <ChartLegend content={<ChartLegendContent />} /> */}
                    <Pie data={chartData} dataKey="value" nameKey="type" innerRadius={60} strokeWidth={5}>
                        <LabelRe
                            content={({ viewBox }) => {
                                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                    return (
                                        <text
                                            x={viewBox.cx}
                                            y={viewBox.cy}
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                        >
                                            <tspan
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                className="fill-foreground text-3xl font-bold"
                                            >
                                                {combinedElectricity?.toLocaleString(navigator.languages, {
                                                    minimumFractionDigits: 0,
                                                    maximumFractionDigits: 0,
                                                })}
                                            </tspan>
                                            <tspan
                                                x={viewBox.cx}
                                                y={(viewBox.cy || 0) + 24}
                                                className="fill-muted-foreground"
                                            >
                                                {chartConfig.value.label}
                                            </tspan>
                                        </text>
                                    );
                                }
                            }}
                        />
                    </Pie>
                </PieChart>
            </ChartContainer>
            {/* {process.env.NODE_ENV === "development" && (
                <>
                    <Label>basicElectricity: {`${basicElectricity}`}</Label>
                    <Label>carElectricity: {`${carElectricity}`}</Label>
                    <Label>heatPumpEnergy: {`${heatPumpEnergy}`}</Label>
                    <Label>combinedElectricity: {`${combinedElectricity}`}</Label>
                </>
            )} */}
        </div>
    );
}
function ChartCO2() {
    const OBJeinskomma = {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
    };
    const fuelEmissions = useVariableStoreBase((state) => state.building_CO2Emissions_Fuel_AfterGeneralData());
    const electricityEmissions = useVariableStoreBase((state) =>
        state.building_CO2Emissions_Electricity_AfterGeneralData(),
    );
    const emissions = useVariableStoreBase((state) => state.building_CO2Emissions_AfterGeneralData());
    const chartData = [
        {
            type: "fuel",
            value: fuelEmissions !== undefined ? fuelEmissions / 1_000_000 : undefined,
            fill: "var(--color-fuel)",
        },
        {
            type: "electricity",
            value: electricityEmissions !== undefined ? electricityEmissions / 1_000_000 : undefined,
            fill: "var(--color-electricity)",
        },
        // { type: "heatpump", value: heatPumpEnergy, fill: "var(--color-heatpump)" },
    ];

    const chartConfig = {
        value: {
            label: "Tonnen pro Jahr",
        },
        fuel: {
            label: "Brennstoff",
            color: "hsl(var(--chart-4))",
        },
        electricity: {
            label: "Strom",
            color: "hsl(var(--chart-5))",
        },
        // heatpump: {
        //     label: "Verbrauch der Wärmepumpe",
        //     color: "hsl(var(--chart-3))",
        // },
        // edge: {
        //     label: "Edge",
        //     color: "hsl(var(--chart-4))",
        // },
        // other: {
        //     label: "Other",
        //     color: "hsl(var(--chart-5))",
        // },
    } satisfies ChartConfig;

    return (
        <div className="grid">
            <Heading2>Jährlicher CO₂ Ausstoß</Heading2>
            <ChartContainer config={chartConfig} className="mx-auto aspect-square h-full max-h-72 w-full">
                <PieChart accessibilityLayer={true}>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    {/* <ChartLegend content={<ChartLegendContent />} /> */}
                    <Pie data={chartData} dataKey="value" nameKey="type" innerRadius={60} strokeWidth={5}>
                        <LabelRe
                            content={({ viewBox }) => {
                                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                    return (
                                        <text
                                            x={viewBox.cx}
                                            y={viewBox.cy}
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                        >
                                            <tspan
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                className="fill-foreground text-3xl font-bold"
                                            >
                                                {emissions !== undefined
                                                    ? (emissions / 1_000_000).toLocaleString(
                                                          navigator.languages,
                                                          OBJeinskomma,
                                                      )
                                                    : undefined}
                                            </tspan>
                                            <tspan
                                                x={viewBox.cx}
                                                y={(viewBox.cy || 0) + 24}
                                                className="fill-muted-foreground"
                                            >
                                                {chartConfig.value.label}
                                            </tspan>
                                        </text>
                                    );
                                }
                            }}
                        />
                    </Pie>
                </PieChart>
            </ChartContainer>
            {/* {process.env.NODE_ENV === "development" && (
                <>
                    <Label>fuelEmissions: {`${fuelEmissions}`}</Label>
                    <Label>electricityEmissions: {`${electricityEmissions}`}</Label>
                    <Label>emissions: {`${emissions}`}</Label>
                </>
            )} */}
        </div>
    );
}
