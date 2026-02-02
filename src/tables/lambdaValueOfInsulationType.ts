// Table 14
export enum InsulationType {
    MineralWool = "Mineralwolle (Glas- und Steinwolle)",
    FoamGlas = "Schaumglas",
    PolyurethaneRigidFoam = "PUR (Polyurethan-Hartschaum)",
    PolystyrolRigidFoam = "EPS (Polystyrol-Hartschaum)",
    PolystyrolExtruderFoam = "XPS (Polystyrol-Extruderschaum)",
    Hemp = "Hanf",
    WoodFiber = "Holzfaser",
    VacuumInsulationPanels = "Vakuum-Isolationspaneele",
    CalciumSilicatePlates = "Kalziumsilikat-Platten",
}

export function getLambdaValue(insulationType: InsulationType) {
    const table: { [key in InsulationType]: number } = {
        // in W/(m*K)
        [InsulationType.MineralWool]: 0.035,
        [InsulationType.FoamGlas]: 0.048,
        [InsulationType.PolyurethaneRigidFoam]: 0.028,
        [InsulationType.PolystyrolRigidFoam]: 0.038,
        [InsulationType.PolystyrolExtruderFoam]: 0.035,
        [InsulationType.Hemp]: 0.043,
        [InsulationType.WoodFiber]: 0.048,
        [InsulationType.VacuumInsulationPanels]: 0.007,
        [InsulationType.CalciumSilicatePlates]: 0.062,
    };
    return table[insulationType];
}
