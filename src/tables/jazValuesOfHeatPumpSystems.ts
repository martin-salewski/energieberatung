import { HeatPumpType } from "@/zustand/useVariableStore";

//Table 07

export function getJAZ(building_HeatPumpType: HeatPumpType) {
    switch (building_HeatPumpType) {
        case HeatPumpType.AirWater:
            return 2.6;
        case HeatPumpType.WaterWater:
        case HeatPumpType.BrineWater:
            return 3.3;
        case HeatPumpType.AirAir:
            return 2.3;
    }
}
