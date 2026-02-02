import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";
import { S07NewInsulation } from "@/components/steps/S07NewInsulation";
import { ThemeProvider } from "@/components/theme-provider";
import { S00SplashScreen } from "@/components/steps/S00SplashScreen";
import { S01TypeOfBuilding } from "@/components/steps/S01TypeOfBuilding";
import { S02BasicBuildingData } from "@/components/steps/S02BasicBuildingData";
import { S03DataForHeatingCalculation } from "@/components/steps/S03DataForHeatingCalculation";
import { S04HeatingCalculation } from "@/components/steps/S04HeatingCalculation";
import { S05DataForElectricityCalculation } from "@/components/steps/S05DataForElectricityCalculation";
import { S06ResultsAfterGeneralData } from "@/components/steps/S06ResultsAfterGeneralData";
import { S10Ventilation } from "@/components/steps/S10Ventilation";
import { S08ResultsAfterInsulation } from "@/components/steps/S08ResultsAfterInsulation";
import { S11Photovoltaics } from "./components/steps/S11Photovoltaics";
import { S12HeatGenerator } from "./components/steps/S12HeatGenerator";
import { S09TechnologySelection } from "./components/steps/S09TechnologySelection";
import { Testing } from "@/components/steps/Testing";

export enum StepKey {
    SplashScreen = "SplashScreen",
    TypeOfBuilding = "TypeOfBuilding",
    BasicBuildingData = "BasicBuildingData",
    DataForHeatingCalculation = "DataForHeatingCalculation",
    HeatingCalculation = "HeatingCalculation",
    DataForElectricityCalculation = "DataForElectricityCalculation",
    ResultsAfterGeneralData = "ResultsAfterGeneralData",
    NewInsulation = "NewInsulation",
    ResultsAfterInsulation = "ResultsAfterInsulation",
    Testing = "Testing",
    Ventilation = "Ventilation",
    Photovoltaics = "Photovoltaics",
    HeatGenerator = "HeatGenerator",
    TechnologySelection = "TechnologySelection",
    Summary = "Summary",
}

// only for deployment
const maybeBaseURL = import.meta.env.BASE_URL;
export const basepath = tryBasepath();
function tryBasepath() {
    let basepath = "";
    try {
        basepath = new URL(maybeBaseURL).pathname;
    } catch (error) {
        basepath = maybeBaseURL;
    } finally {
        return basepath.endsWith("/") ? basepath : basepath + "/";
    }
}

const router = createBrowserRouter(
    [
        {
            path: `/${StepKey.SplashScreen}`,
            element: <S00SplashScreen />,
        },
        {
            path: `/${StepKey.TypeOfBuilding}`,
            element: <S01TypeOfBuilding />,
        },
        {
            path: `/${StepKey.BasicBuildingData}`,
            element: <S02BasicBuildingData />,
        },
        {
            path: `/${StepKey.DataForHeatingCalculation}`,
            element: <S03DataForHeatingCalculation />,
        },
        {
            path: `/${StepKey.HeatingCalculation}`,
            element: <S04HeatingCalculation />,
        },
        {
            path: `/${StepKey.DataForElectricityCalculation}`,
            element: <S05DataForElectricityCalculation />,
        },
        {
            path: `/${StepKey.ResultsAfterGeneralData}`,
            element: <S06ResultsAfterGeneralData />,
        },
        {
            path: `/${StepKey.NewInsulation}`,
            element: <S07NewInsulation />,
            // children: [
            //     { path: `${StepKey.DataRoof}`, element: <DataRoof /> },
            //     { path: `${StepKey.DataOuterWall}`, element: <DataOuterWall /> },
            //     { path: `${StepKey.DataWindows}`, element: <DataWindows /> },
            //     { path: `${StepKey.DataBasementCeiling}`, element: <DataBasementCeiling /> },
            // ],
        },
        {
            path: `/${StepKey.ResultsAfterInsulation}`,
            element: <S08ResultsAfterInsulation />,
        },
        {
            path: `/${StepKey.TechnologySelection}`,
            element: <S09TechnologySelection />,
        },
        {
            path: `/${StepKey.Ventilation}`,
            element: <S10Ventilation />,
        },
        {
            path: `/${StepKey.Photovoltaics}`,
            element: <S11Photovoltaics />,
        },
        {
            path: `/${StepKey.HeatGenerator}`,
            element: <S12HeatGenerator />,
        },
        // {
        //     path: `/${StepKey.DataPhotovoltaics}`,
        //     element: <DataPhotovoltaics />,
        // },
        {
            path: `/${StepKey.Testing}`,
            element: <Testing />,
        },
        {
            path: "/",
            element: <Navigate to={`/${StepKey.SplashScreen}`} replace={true} />,
        },
    ],
    {
        basename: basepath,
    },
);
router.routes.forEach((route) => console.log(JSON.stringify(route)));

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
            <RouterProvider router={router} />
        </ThemeProvider>
    </React.StrictMode>,
);
