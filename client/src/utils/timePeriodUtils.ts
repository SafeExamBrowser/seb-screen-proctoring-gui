
export function getTimestampFromPeriodSelection(timePeriod: number, amount: number): string{
    const now = new Date();

    switch (timePeriod){
        case 1: //days
            now.setDate(now.getDate() - amount);
        break;

        case 2: //weeks
            now.setDate(now.getDate() - 7 * amount);
        break;

        case 3: //months
            now.setMonth(now.getMonth() - amount);
        break;

        case 4: //years
            now.setFullYear(now.getFullYear() - amount);
        break;
    }

    console.log(now)
    console.log(now.getTime())

    return now.getTime().toString();
}