export const MinutesPassed = (date) => {
    const date1 = new Date();
    const date2 = new Date(date);
    const diffTime = date2 - date1;
    return diffTime / (1000 * 60);
}

export const GetDateString = (date) => {
    let d = null;
    d = date ? new Date(date) : new Date();

    let month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear(),
        hours = d.getHours(),
        mins = d.getMinutes();
    if (month >= 1 & month <= 9)
        month = '0' + month.toString();
    if (day >= 0 & day <= 9)
        day = '0' + day.toString();
    if (hours >= 0 & hours <= 9)
        hours = '0' + hours.toString();
    if (mins >= 0 & mins <= 9)
        mins = '0' + mins.toString();

    return [year, month, day].join('-') + 'T' + [hours, mins].join(':');
}