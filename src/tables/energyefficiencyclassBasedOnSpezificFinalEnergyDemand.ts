// Table 04
export function getEnergyefficiencyclass(specificFinalEnergyDemand: number) {
    if (specificFinalEnergyDemand < 0) throw new Error("specificFinalEnergyDemand is too low for a class.");
    else if (specificFinalEnergyDemand <= 25) return { label: "A+", colorCode: "#29FE00" };
    else if (specificFinalEnergyDemand <= 50) return { label: "A", colorCode: "#81FE0E" };
    else if (specificFinalEnergyDemand <= 75) return { label: "B", colorCode: "#C6FF01" };
    else if (specificFinalEnergyDemand <= 100) return { label: "C", colorCode: "#EFFF00" };
    else if (specificFinalEnergyDemand <= 125) return { label: "D", colorCode: "#FFFF00" };
    else if (specificFinalEnergyDemand <= 150) return { label: "E", colorCode: "#FFCC00" };
    else if (specificFinalEnergyDemand <= 200) return { label: "F", colorCode: "#FF9900" };
    else if (specificFinalEnergyDemand <= 250) return { label: "G", colorCode: "#FF6600" };
    else return { label: "H", colorCode: "#FF0000" };
}
