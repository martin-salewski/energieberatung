import {
    FinalEnergyDemand_Q_E_Calculation,
    TechnologySelection,
    useVariableStoreBase,
} from "@/zustand/useVariableStore";
import { StepsScaffolding } from "@/components/scaffolding/StepsScaffolding";
import { Heading1, HeadingBold } from "@/components/ui/heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { StepKey } from "@/main";
import Photovoltaik from "@/assets/photovoltaik.png";
import Lüftung from "@/assets/Lüftung.png";
import Wärmepumpe from "@/assets/Wärmepumpe.png";

const table: { [key in TechnologySelection]: string } = {
    [TechnologySelection.HeatGenerator]: Wärmepumpe,
    [TechnologySelection.Photovoltaic]: Photovoltaik,
    [TechnologySelection.Ventilation]: Lüftung,
};

export function S09TechnologySelection() {
    const values: {
        text: TechnologySelection;
        imagePath?: string;
    }[] = Object.values(TechnologySelection).map((value) => ({ text: value, imagePath: table[value] }));
    const navigate = useNavigate();
    const basedOn = useVariableStoreBase((state) => state.building_FinalEnergyDemand_BasedOn);

    const handleCardClick = (value: TechnologySelection) => {
        if (value === TechnologySelection.HeatGenerator) {
            navigate(`/${StepKey.HeatGenerator}`);
        } else if (value === TechnologySelection.Photovoltaic) {
            navigate(`/${StepKey.Photovoltaics}`);
        } else if (value === TechnologySelection.Ventilation) {
            navigate(`/${StepKey.Ventilation}`); // Anpassen nach dem Merge
        }
    };

    return (
        <StepsScaffolding
            className="grid place-items-center"
            navigate={navigate}
            title={<Heading1>Auswahl der neuen Technologie</Heading1>}
            last={
                basedOn === FinalEnergyDemand_Q_E_Calculation.BasedOnHeatingLoad
                    ? `/${StepKey.ResultsAfterInsulation}`
                    : basedOn === FinalEnergyDemand_Q_E_Calculation.BasedOnHeatingDemand
                      ? `/${StepKey.ResultsAfterGeneralData}`
                      : undefined
            }
            next={`/${StepKey.Testing}`}
        >
            <div className="grid w-full grid-flow-row grid-cols-3 gap-4">
                {values.map((value) => (
                    <button
                        key={value.text}
                        onClick={() => handleCardClick(value.text)}
                        className="rounded-2xl focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    >
                        <Card className="h-full rounded-2xl">
                            <CardHeader>
                                <CardTitle>
                                    <HeadingBold>{value.text}</HeadingBold>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <img src={value.imagePath} alt={value.text} className="w-full object-cover" />
                            </CardContent>
                        </Card>
                    </button>
                ))}
            </div>
        </StepsScaffolding>
    );
}
