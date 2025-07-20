export function getGradient(minTemp, maxTemp) {
    const minHue = mapTempToHue(minTemp);
    const maxHue = mapTempToHue(maxTemp);

    return `linear-gradient(to right, hsl(${minHue}, 100%, 60%), hsl(${maxHue}, 100%, 60%))`;
}

function mapTempToHue(temp) {
    const min = 0;
    const max = 40;

    if (temp < min) {
        temp = min;
    } else if (temp > max) {
        temp = max;
    }
    const percent = (temp - min) / (max - min);

    return 220 - percent * 220;
}
