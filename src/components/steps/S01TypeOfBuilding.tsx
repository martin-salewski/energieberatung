import { StepKey } from "@/main";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BuildingType as BuildingTypeEnum, useVariableStoreBase } from "@/zustand/useVariableStore";
import { useNavigate } from "react-router-dom";
import { StepsScaffolding } from "@/components/scaffolding/StepsScaffolding";
import { Heading1, HeadingBold } from "@/components/ui/heading";

import EinfamilienhausImage from "@/assets/Einfamilienhaus.png";
import ReihenmittelhausImage from "@/assets/Reihenmittelhaus.png";
import ReihenendhausImage from "@/assets/Reihenendhaus.png";
import MehrfamilienhausImage from "@/assets/Mehrfamilienhaus.png";

const table: { [key in BuildingTypeEnum]: string } = {
    [BuildingTypeEnum.Einfamilienhaus]: EinfamilienhausImage,
    [BuildingTypeEnum.Mehrfamilienhaus]: MehrfamilienhausImage,
    [BuildingTypeEnum.Reihenendhaus]: ReihenendhausImage,
    [BuildingTypeEnum.Reihenmittelhaus]: ReihenmittelhausImage,
};

export function S01TypeOfBuilding() {
    const values: {
        text: BuildingTypeEnum;
        imagePath?: string;
    }[] = Object.values(BuildingTypeEnum).map((value) => ({ text: value, imagePath: table[value] }));
    const navigate = useNavigate();

    const handleCardClick = (value: BuildingTypeEnum) => {
        useVariableStoreBase.setState(() => ({ building_Type: value }));
        navigate(`/${StepKey.BasicBuildingData}`);
    };
    return (
        <StepsScaffolding
            className="grid place-items-center"
            navigate={navigate}
            title={<Heading1>Auswahl der Gebäudeart</Heading1>}
            last={null}
            next={null}
        >
            <div className="grid w-full grid-flow-row grid-cols-4 gap-4">
                {values.map((value) => (
                    <button
                        className="rounded-2xl focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        key={value.text}
                        onClick={() => handleCardClick(value.text)}
                    >
                        <Card className="h-full rounded-2xl">
                            <CardHeader>
                                <CardTitle>
                                    {value.text === BuildingTypeEnum.Einfamilienhaus ? (
                                        <HeadingBold>
                                            Einfamilien
                                            <br />
                                            Haus
                                        </HeadingBold>
                                    ) : value.text === BuildingTypeEnum.Mehrfamilienhaus ? (
                                        <HeadingBold>
                                            Mehrfamilien
                                            <br />
                                            Haus
                                        </HeadingBold>
                                    ) : value.text === BuildingTypeEnum.Reihenendhaus ? (
                                        <HeadingBold>
                                            Reihenend
                                            <br />
                                            Haus
                                        </HeadingBold>
                                    ) : value.text === BuildingTypeEnum.Reihenmittelhaus ? (
                                        <HeadingBold>
                                            Reihenmittel
                                            <br />
                                            Haus
                                        </HeadingBold>
                                    ) : (
                                        <></>
                                    )}
                                </CardTitle>
                            </CardHeader>
                            <CardContent /* className="mt-[-2rem]" */>
                                <img src={value.imagePath} alt={value.text} className="w-full object-cover" />
                            </CardContent>
                        </Card>
                    </button>
                ))}
            </div>
        </StepsScaffolding>
    );
}
