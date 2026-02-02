// Table 12
export enum FlatRoofConstructionMethod {
    FlatSolid = "Oberste Geschossdecke, Massiv",
    FlatWoodBeams = "Oberste Geschossdecke, Holzbalken",
}
export enum AngledRoofConstructionMethod {
    Solid = "Dach, Massiv",
    Wood = "Dach, Holz",
}
export enum BottomSideConstructionMethod {
    Solid = "Bauteile gegen Erdreich oder Keller, Massiv",
    WoodBeams = "Bauteile gegen Erdreich oder Keller, Holzbalken",
}
export enum OuterWallConstructionMethod {
    Solid = "Außenwand, Massiv",
    Wood = "Außenwand, Holz",
}
export enum WindowConstructionMethod {
    WoodSinglePane = "Fenster, Holz, einfach verglast",
    WoodTwoPane = "Fenster, Holz, zwei Scheiben",
    PlasticWithIsolation = "Fenster, Kunststoff, Isolierverglasung",
    AluminumOrSteelWithIsolation = "Fenster, Aluminium, Stahl oder Isolierverglasung",
}
export enum ConstructionPart {
    TopSide = "Oberer Gebäudeabschluss",
    OuterWall = "Außenwand",
    Window = "Fenster",
    BottomSide = "Unterer Gebäudeabschluss",
}
export const ConstructionPartMapping = {
    [ConstructionPart.TopSide]: [AngledRoofConstructionMethod, FlatRoofConstructionMethod],
    [ConstructionPart.BottomSide]: [BottomSideConstructionMethod],
    [ConstructionPart.OuterWall]: [OuterWallConstructionMethod],
    [ConstructionPart.Window]: [WindowConstructionMethod],
};
export function getWorseHeatTransferCoefficient(constructionYear: number, constructionPart: ConstructionPart) {
    // TODO das ist mist, dass constructionMethod von type any ist
    return ConstructionPartMapping[constructionPart]
        .map((part) =>
            Object.values(part).map((constructionMethod) => ({
                number: getHeatTransferCoefficient(constructionYear, constructionMethod),
                method: constructionMethod,
            })),
        )
        .flat()
        .reduce((worstObj, currentObj) => {
            if (currentObj.number === undefined) return worstObj;
            else if (worstObj.number === undefined) return currentObj;
            else if (worstObj.number >= currentObj.number) return worstObj;
            else return currentObj;
        });
}
export function getHeatTransferCoefficient(
    constructionYear: number,
    component:
        | AngledRoofConstructionMethod
        | FlatRoofConstructionMethod
        | BottomSideConstructionMethod
        | OuterWallConstructionMethod
        | WindowConstructionMethod,
) {
    if (constructionYear < 1919) {
        switch (component) {
            case AngledRoofConstructionMethod.Solid:
                return 2.1;
            case AngledRoofConstructionMethod.Wood:
                return 2.6;
            case FlatRoofConstructionMethod.FlatSolid:
                return 2.6;
            case FlatRoofConstructionMethod.FlatWoodBeams:
                return 1.0;
            case BottomSideConstructionMethod.Solid:
                return 1.2;
            case BottomSideConstructionMethod.WoodBeams:
                return 1.0;
            case OuterWallConstructionMethod.Solid:
                return 1.7;
            case OuterWallConstructionMethod.Wood:
                return 2.0;
            case WindowConstructionMethod.WoodSinglePane:
                return 5.0;
            case WindowConstructionMethod.WoodTwoPane:
                return 2.7;
            case WindowConstructionMethod.PlasticWithIsolation:
                return 3.0;
            case WindowConstructionMethod.AluminumOrSteelWithIsolation:
                return 4.3;
        }
    } else if (constructionYear < 1949) {
        switch (component) {
            case AngledRoofConstructionMethod.Solid:
                return 2.1;
            case AngledRoofConstructionMethod.Wood:
                return 1.4;
            case FlatRoofConstructionMethod.FlatSolid:
                return 2.1;
            case FlatRoofConstructionMethod.FlatWoodBeams:
                return 1.0;
            case BottomSideConstructionMethod.Solid:
                return 1.2;
            case BottomSideConstructionMethod.WoodBeams:
                return 0.8;
            case OuterWallConstructionMethod.Solid:
                return 1.7;
            case OuterWallConstructionMethod.Wood:
                return 2.0;
            case WindowConstructionMethod.WoodSinglePane:
                return 5.0;
            case WindowConstructionMethod.WoodTwoPane:
                return 2.7;
            case WindowConstructionMethod.PlasticWithIsolation:
                return 3.0;
            case WindowConstructionMethod.AluminumOrSteelWithIsolation:
                return 4.3;
        }
    } else if (constructionYear < 1958) {
        switch (component) {
            case AngledRoofConstructionMethod.Solid:
                return 2.1;
            case AngledRoofConstructionMethod.Wood:
                return 1.4;
            case FlatRoofConstructionMethod.FlatSolid:
                return 2.1;
            case FlatRoofConstructionMethod.FlatWoodBeams:
                return 0.8;
            case BottomSideConstructionMethod.Solid:
                return 1.5;
            case BottomSideConstructionMethod.WoodBeams:
                return 0.8;
            case OuterWallConstructionMethod.Solid:
                return 1.4;
            case OuterWallConstructionMethod.Wood:
                return 1.4;
            case WindowConstructionMethod.WoodSinglePane:
                return 5.0;
            case WindowConstructionMethod.WoodTwoPane:
                return 2.7;
            case WindowConstructionMethod.PlasticWithIsolation:
                return 3.0;
            case WindowConstructionMethod.AluminumOrSteelWithIsolation:
                return 4.3;
        }
    } else if (constructionYear < 1969) {
        switch (component) {
            case AngledRoofConstructionMethod.Solid:
                return 1.3;
            case AngledRoofConstructionMethod.Wood:
                return 1.4;
            case FlatRoofConstructionMethod.FlatSolid:
                return 2.1;
            case FlatRoofConstructionMethod.FlatWoodBeams:
                return 0.7;
            case BottomSideConstructionMethod.Solid:
                return 1.0;
            case BottomSideConstructionMethod.WoodBeams:
                return 0.8;
            case OuterWallConstructionMethod.Solid:
                return 1.0;
            case OuterWallConstructionMethod.Wood:
                return 1.4;
            case WindowConstructionMethod.WoodSinglePane:
                return 5.0;
            case WindowConstructionMethod.WoodTwoPane:
                return 2.7;
            case WindowConstructionMethod.PlasticWithIsolation:
                return 3.0;
            case WindowConstructionMethod.AluminumOrSteelWithIsolation:
                return 4.3;
        }
    } else if (constructionYear < 1974) {
        switch (component) {
            case AngledRoofConstructionMethod.Solid:
                return 1.3;
            case AngledRoofConstructionMethod.Wood:
                return 0.8;
            case FlatRoofConstructionMethod.FlatSolid:
                return 0.6;
            case FlatRoofConstructionMethod.FlatWoodBeams:
                return 0.6;
            case BottomSideConstructionMethod.Solid:
                return 1.0;
            case BottomSideConstructionMethod.WoodBeams:
                return 0.6;
            case OuterWallConstructionMethod.Solid:
                return 0.8;
            case OuterWallConstructionMethod.Wood:
                return 0.6;
            case WindowConstructionMethod.WoodSinglePane:
                return 5.0;
            case WindowConstructionMethod.WoodTwoPane:
                return 2.7;
            case WindowConstructionMethod.PlasticWithIsolation:
                return 3.0;
            case WindowConstructionMethod.AluminumOrSteelWithIsolation:
                return 4.3;
        }
    } else if (constructionYear < 1978) {
        switch (component) {
            case AngledRoofConstructionMethod.Solid:
                return 1.3;
            case AngledRoofConstructionMethod.Wood:
                return 0.8;
            case FlatRoofConstructionMethod.FlatSolid:
                return 0.6;
            case FlatRoofConstructionMethod.FlatWoodBeams:
                return 0.6;
            case BottomSideConstructionMethod.Solid:
                return 1.0;
            case BottomSideConstructionMethod.WoodBeams:
                return 0.6;
            case OuterWallConstructionMethod.Solid:
                return 0.8;
            case OuterWallConstructionMethod.Wood:
                return 0.6;
            case WindowConstructionMethod.WoodSinglePane:
                return 5.0;
            case WindowConstructionMethod.WoodTwoPane:
                return 2.7;
            case WindowConstructionMethod.PlasticWithIsolation:
                return 3.0;
            case WindowConstructionMethod.AluminumOrSteelWithIsolation:
                return 4.3;
        }
    } else if (constructionYear < 1983) {
        switch (component) {
            case AngledRoofConstructionMethod.Solid:
                return 0.6;
            case AngledRoofConstructionMethod.Wood:
                return 0.7;
            case FlatRoofConstructionMethod.FlatSolid:
                return 0.6;
            case FlatRoofConstructionMethod.FlatWoodBeams:
                return 0.4;
            case BottomSideConstructionMethod.Solid:
                return 0.8;
            case BottomSideConstructionMethod.WoodBeams:
                return 0.6;
            case OuterWallConstructionMethod.Solid:
                return 0.6;
            case OuterWallConstructionMethod.Wood:
                return 0.5;
            case WindowConstructionMethod.WoodSinglePane:
                return undefined;
            case WindowConstructionMethod.WoodTwoPane:
                return 2.7;
            case WindowConstructionMethod.PlasticWithIsolation:
                return 3.0;
            case WindowConstructionMethod.AluminumOrSteelWithIsolation:
                return 4.3;
        }
    } else if (constructionYear < 1995) {
        switch (component) {
            case AngledRoofConstructionMethod.Solid:
                return 0.4;
            case AngledRoofConstructionMethod.Wood:
                return 0.5;
            case FlatRoofConstructionMethod.FlatSolid:
                return 0.3;
            case FlatRoofConstructionMethod.FlatWoodBeams:
                return 0.3;
            case BottomSideConstructionMethod.Solid:
                return 0.6;
            case BottomSideConstructionMethod.WoodBeams:
                return 0.4;
            case OuterWallConstructionMethod.Solid:
                return 0.5;
            case OuterWallConstructionMethod.Wood:
                return 0.4;
            case WindowConstructionMethod.WoodSinglePane:
                return undefined;
            case WindowConstructionMethod.WoodTwoPane:
                return 2.7;
            case WindowConstructionMethod.PlasticWithIsolation:
                return 3.0;
            case WindowConstructionMethod.AluminumOrSteelWithIsolation:
                return 3.2;
        }
    } else if (constructionYear < 2002) {
        switch (component) {
            case AngledRoofConstructionMethod.Solid:
                return 0.3;
            case AngledRoofConstructionMethod.Wood:
                return 0.3;
            case FlatRoofConstructionMethod.FlatSolid:
                return 0.3;
            case FlatRoofConstructionMethod.FlatWoodBeams:
                return 0.3;
            case BottomSideConstructionMethod.Solid:
                return 0.6;
            case BottomSideConstructionMethod.WoodBeams:
                return 0.4;
            case OuterWallConstructionMethod.Solid:
                return 0.3;
            case OuterWallConstructionMethod.Wood:
                return 0.4;
            case WindowConstructionMethod.WoodSinglePane:
                return undefined;
            case WindowConstructionMethod.WoodTwoPane:
                return 1.6;
            case WindowConstructionMethod.PlasticWithIsolation:
                return 1.9;
            case WindowConstructionMethod.AluminumOrSteelWithIsolation:
                return 1.9;
        }
    } else if (constructionYear < 2009) {
        switch (component) {
            case AngledRoofConstructionMethod.Solid:
                return 0.3;
            case AngledRoofConstructionMethod.Wood:
                return 0.3;
            case FlatRoofConstructionMethod.FlatSolid:
                return 0.3;
            case FlatRoofConstructionMethod.FlatWoodBeams:
                return 0.3;
            case BottomSideConstructionMethod.Solid:
                return 0.5;
            case BottomSideConstructionMethod.WoodBeams:
                return 0.5;
            case OuterWallConstructionMethod.Solid:
                return 0.45;
            case OuterWallConstructionMethod.Wood:
                return 0.45;
            case WindowConstructionMethod.WoodSinglePane:
                return undefined;
            case WindowConstructionMethod.WoodTwoPane:
                return 1.7;
            case WindowConstructionMethod.PlasticWithIsolation:
                return 1.7;
            case WindowConstructionMethod.AluminumOrSteelWithIsolation:
                return 1.7;
        }
    } else if (constructionYear < 2016) {
        switch (component) {
            case AngledRoofConstructionMethod.Solid:
                return 0.25;
            case AngledRoofConstructionMethod.Wood:
                return 0.25;
            case FlatRoofConstructionMethod.FlatSolid:
                return 0.3;
            case FlatRoofConstructionMethod.FlatWoodBeams:
                return 0.3;
            case BottomSideConstructionMethod.Solid:
                return 0.3;
            case BottomSideConstructionMethod.WoodBeams:
                return 0.3;
            case OuterWallConstructionMethod.Solid:
                return 0.35;
            case OuterWallConstructionMethod.Wood:
                return 0.35;
            case WindowConstructionMethod.WoodSinglePane:
                return undefined;
            case WindowConstructionMethod.WoodTwoPane:
                return 1.3;
            case WindowConstructionMethod.PlasticWithIsolation:
                return 1.3;
            case WindowConstructionMethod.AluminumOrSteelWithIsolation:
                return 1.3;
        }
    } else if (constructionYear >= 2016) {
        switch (component) {
            case AngledRoofConstructionMethod.Solid:
                return 0.2;
            case AngledRoofConstructionMethod.Wood:
                return 0.2;
            case FlatRoofConstructionMethod.FlatSolid:
                return 0.24;
            case FlatRoofConstructionMethod.FlatWoodBeams:
                return 0.24;
            case BottomSideConstructionMethod.Solid:
                return 0.3;
            case BottomSideConstructionMethod.WoodBeams:
                return 0.3;
            case OuterWallConstructionMethod.Solid:
                return 0.24;
            case OuterWallConstructionMethod.Wood:
                return 0.24;
            case WindowConstructionMethod.WoodSinglePane:
                return undefined;
            case WindowConstructionMethod.WoodTwoPane:
                return 1.3;
            case WindowConstructionMethod.PlasticWithIsolation:
                return 1.3;
            case WindowConstructionMethod.AluminumOrSteelWithIsolation:
                return 1.3;
        }
    }
}
