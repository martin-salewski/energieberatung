// Table 03
import { BuildingType } from "@/zustand/useVariableStore";

export function getYearlyHeatingLoad(constructionYear: number, buildingType: BuildingType) {
    if (constructionYear <= 1968) {
        switch (buildingType) {
            case BuildingType.Einfamilienhaus:
                return 120;
            case BuildingType.Reihenendhaus:
                return 120;
            case BuildingType.Reihenmittelhaus:
                return 120;
            case BuildingType.Mehrfamilienhaus:
                return 120;
        }
    } else if (constructionYear <= 1973) {
        switch (buildingType) {
            case BuildingType.Einfamilienhaus:
                return 110;
            case BuildingType.Reihenendhaus:
                return 110;
            case BuildingType.Reihenmittelhaus:
                return 110;
            case BuildingType.Mehrfamilienhaus:
                return 110;
        }
    } else if (constructionYear <= 1977) {
        switch (buildingType) {
            case BuildingType.Einfamilienhaus:
                return 100;
            case BuildingType.Reihenendhaus:
                return 100;
            case BuildingType.Reihenmittelhaus:
                return 100;
            case BuildingType.Mehrfamilienhaus:
                return 75;
        }
    } else if (constructionYear <= 1982) {
        switch (buildingType) {
            case BuildingType.Einfamilienhaus:
                return 95;
            case BuildingType.Reihenendhaus:
                return 90;
            case BuildingType.Reihenmittelhaus:
                return 85;
            case BuildingType.Mehrfamilienhaus:
                return 65;
        }
    } else if (constructionYear <= 1994) {
        switch (buildingType) {
            case BuildingType.Einfamilienhaus:
                return 75;
            case BuildingType.Reihenendhaus:
                return 70;
            case BuildingType.Reihenmittelhaus:
                return 65;
            case BuildingType.Mehrfamilienhaus:
                return 60;
        }
    } else if (constructionYear <= 2001) {
        switch (buildingType) {
            case BuildingType.Einfamilienhaus:
                return 60;
            case BuildingType.Reihenendhaus:
                return 55;
            case BuildingType.Reihenmittelhaus:
                return 50;
            case BuildingType.Mehrfamilienhaus:
                return 45;
        }
    } else if (constructionYear <= 2008) {
        switch (buildingType) {
            case BuildingType.Einfamilienhaus:
                return 60;
            case BuildingType.Reihenendhaus:
                return 55;
            case BuildingType.Reihenmittelhaus:
                return 50;
            case BuildingType.Mehrfamilienhaus:
                return 45;
        }
    } else if (constructionYear <= 2015) {
        switch (buildingType) {
            case BuildingType.Einfamilienhaus:
                return 40;
            case BuildingType.Reihenendhaus:
                return 35;
            case BuildingType.Reihenmittelhaus:
                return 30;
            case BuildingType.Mehrfamilienhaus:
                return 30;
        }
    } else if (2016 <= constructionYear) {
        switch (buildingType) {
            case BuildingType.Einfamilienhaus:
                return 40;
            case BuildingType.Reihenendhaus:
                return 35;
            case BuildingType.Reihenmittelhaus:
                return 30;
            case BuildingType.Mehrfamilienhaus:
                return 30;
        }
    } else {
        throw new Error(`no exhaustive if chain with constructionYear=${constructionYear}.`);
    }
}
