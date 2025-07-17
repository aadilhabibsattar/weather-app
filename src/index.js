import "./styles/global.css";
import { svgs } from "./svg.js";
import { format, parse } from "date-fns";

const APIKEY = "3HXW7VSTW8PT22AYJVU6ZKY35";
let city = "dhaka";
let units = "metric";

const locationDropdownToggle = document.querySelector(
    ".location-dropdown-toggle"
);
const locationDropdown = document.querySelector(".location-dropdown");

locationDropdownToggle.addEventListener("click", () => {
    locationDropdown.classList.toggle("hidden");
});

async function fetchWeatherData() {
    return await fetch(
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=${units}&key=${APIKEY}&contentType=json`,
        { mode: "cors" }
    );
}

async function getWeatherData() {
    try {
        const response = await fetchWeatherData();
        if (!response.ok) {
            throw new Error("Resposne not OK");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}

const weatherData = await getWeatherData();
console.log(weatherData);

const address = document.querySelector(".address");
const currentWeatherIcon = document.querySelector(".current-weather-icon-div");
const weatherIcon = svgs[weatherData.currentConditions.icon];
const currentTemp = document.querySelector(".current-temp");
const currentConditions = document.querySelector(".current-conditions");
const minTemp = document.querySelector(".min-temp-value");
const maxTemp = document.querySelector(".max-temp-value");
const feelsLike = document.querySelector(".feels-like-value");

currentWeatherIcon.innerHTML += weatherIcon;
address.innerHTML += `${weatherData.resolvedAddress} - ${formatToAmPm(
    weatherData.currentConditions.datetime
)}`;
currentTemp.innerHTML += `${Math.round(
    weatherData.currentConditions.temp
)}&deg;`;
currentConditions.innerHTML += `${weatherData.currentConditions.conditions}`;

minTemp.innerHTML += `${Math.round(weatherData.days[0].tempmin)}&deg`;
maxTemp.innerHTML += `${Math.round(weatherData.days[0].tempmax)}&deg`;
feelsLike.innerHTML += `${Math.round(
    weatherData.currentConditions.feelslike
)}&deg;`;

const sunriseValue = document.querySelector(".sunrise-value");
const rainValue = document.querySelector(".rain-value");
const humidityValue = document.querySelector(".humidity-value");
const windSpeedValue = document.querySelector(".wind-speed-value");
const pressureValue = document.querySelector(".pressure-value");
const sunsetValue = document.querySelector(".sunset-value");
const windDirectionValue = document.querySelector(".wind-direction-value");
const uvValue = document.querySelector(".uv-value");

sunriseValue.innerHTML += formatToAmPm(weatherData.currentConditions.sunrise);
sunsetValue.innerHTML += formatToAmPm(weatherData.currentConditions.sunset);
rainValue.innerHTML += `${weatherData.currentConditions.precipprob}%`;
humidityValue.innerHTML += `${Math.round(
    weatherData.currentConditions.humidity
)}%`;
pressureValue.innerHTML += `${weatherData.currentConditions.pressure} mb`;
windSpeedValue.innerHTML += `${weatherData.currentConditions.windspeed} mph`;
windDirectionValue.innerHTML += `${weatherData.currentConditions.winddir}&deg;`;
uvValue.innerHTML += `${weatherData.currentConditions.uvindex}`;

function formatToAmPm(timeStr) {
    const parsedTime = parse(timeStr, "HH:mm:ss", new Date());
    return format(parsedTime, "hh:mm a");
}

function formatHour(timeStr) {
    const parsedDate = parse(timeStr, "HH:mm:ss", new Date());
    return format(parsedDate, "h a");
}

const hourlyWeatherDiv = document.querySelector(".hourly-weather");
const hoursToday = weatherData.days[0].hours;

hoursToday.forEach((hour) => {
    const hourStr = hour.datetime.split(":")[0];
    const hourNum = parseInt(hourStr, 10);

    if (hourNum % 2 === 0 && hourNum != 0) {
        const hourTime = formatHour(hour.datetime);
        const hourIcon = hour.icon;
        const hourTemp = hour.temp;

        addHourlyInfoToPage(hourTime, hourIcon, hourTemp);
    }
});

function addHourlyInfoToPage(hourTime, hourIcon, hourTemp) {
    hourlyWeatherDiv.innerHTML += `
    <div class="hour">
        <div class="hour-time hour-text">${hourTime}</div>
        <div class="hour-weather-icon">${svgs[hourIcon]}</div>
        <div class="hour-temp hour-text">${Math.round(hourTemp)}&deg;</div>
    </div>
    `;

    const hours = hourlyWeatherDiv.querySelectorAll(".hour");
    const lastHour = hours[hours.length - 1];

    const iconDiv = lastHour.querySelector(".hour-weather-icon svg");
    if (iconDiv) {
        iconDiv.classList.add("hour-icon");
    }
}
