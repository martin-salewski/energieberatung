export enum Month {
    January = "January",
    February = "February",
    March = "March",
    April = "April",
    May = "May",
    June = "June",
    July = "July",
    August = "August",
    September = "September",
    October = "October",
    November = "November",
    December = "December",
}
const table: {
    [key in Month]: {
        yield: number;
        share: number;
    };
} = {
    [Month.January]: { yield: 22, share: 0.021 },
    [Month.February]: { yield: 56, share: 0.047 },
    [Month.March]: { yield: 98, share: 0.102 },
    [Month.April]: { yield: 109, share: 0.122 },
    [Month.May]: { yield: 123, share: 0.129 },
    [Month.June]: { yield: 135, share: 0.129 },
    [Month.July]: { yield: 132, share: 0.128 },
    [Month.August]: { yield: 121, share: 0.116 },
    [Month.September]: { yield: 99, share: 0.094 },
    [Month.October]: { yield: 55, share: 0.061 },
    [Month.November]: { yield: 25, share: 0.034 },
    [Month.December]: { yield: 16, share: 0.017 },
};
export function getAverageYieldInKiloWattHours(month: Month) {
    return table[month].yield;
}
export function getAverageYieldInShareOfYear(month: Month) {
    return table[month].share;
}
