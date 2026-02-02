import { StepKey } from "@/main";
import { Progress } from "@/components/ui/progress";
// import { useVariableStoreBase } from "@/zustand/useVariableStore";
import { useNavigate } from "react-router-dom";
import { StepsScaffolding } from "@/components/scaffolding/StepsScaffolding";

export function InfoHeatDemand() {
    const navigate = useNavigate();

    // const usingKiloWatts = useVariableStoreBase((state) => state.building_HeatingRequirement_UsingUnit);
    // const heatingLoadValue = useVariableStoreBase((state) => state.building_HeatingLoad_Value);
    // const includingHotWater = useVariableStoreBase((state) => state.building_HeatingRequirement_IncludingHotWater);
    // const hotWaterValue = useVariableStoreBase((state) => state.building_HeatingRequirement_HotWaterValue);

    return (
        <StepsScaffolding className="grid place-items-center" navigate={navigate} next={`/${StepKey.NewInsulation}`}>
            <div className="grid w-full grid-flow-row grid-cols-[auto_1fr] items-center gap-4">
                {/* {!includingHotWater && (
                    <>
                        <span>Berechnete Warmwasserenergie:</span>
                        <Progress id="calculatedHotWaterEnergy" value={hotWaterValue} title={`${hotWaterValue} kW`} />
                    </>
                )} */}
                {false && (
                    <>
                        <span>Reduktion der Energieeinsparung:</span>
                        <Progress id="reductionInEnergySaving" value={6} />
                    </>
                )}
                <span>Ermittelte Heizlast:</span>
                {/* <Progress id="calculatedHeatingLoad" value={100 - 2} title={`${heatingLoadValue} kW`} /> */}
                <span>Ermittelter Energiebedarf:</span>
                <Progress id="calculatedEnergyRequirement" value={50} />
            </div>
        </StepsScaffolding>
    );
}
