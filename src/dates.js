import { format, parse, parseISO, isToday } from "date-fns";

export function formatToAmPm(timeStr) {
    const parsedTime = parse(timeStr, "HH:mm:ss", new Date());
    return format(parsedTime, "hh:mm a");
}

export function formatHour(timeStr) {
    const parsedDate = parse(timeStr, "HH:mm:ss", new Date());
    return format(parsedDate, "h a");
}

export function getDayOfWeek(dateStr) {
    const date = parseISO(dateStr);

    if (isToday(date)) {
        return "Today";
    }
    return format(date, "EEEE");
}
