import "./styles/global.css";
import { svgs } from "./svg.js";
import { format, parse, parseISO, isToday } from "date-fns";

const APIKEY = "3HXW7VSTW8PT22AYJVU6ZKY35";
let city = "toronto";
let units = "metric";
let windSpeedUnit = "kph";

const celsiusToggle = document.querySelector(".celsius");
const fahrenheitToggle = document.querySelector(".fahrenheit");

celsiusToggle.addEventListener("click", () => {
    if (units == "us") {
        units = "metric";
        windSpeedUnit = "kph";
        celsiusToggle.classList.add("selected");
        fahrenheitToggle.classList.remove("selected");

        refreshPage();
        return;
    }
    return;
});

fahrenheitToggle.addEventListener("click", () => {
    if (units == "metric") {
        units = "us";
        windSpeedUnit = "mph";
        fahrenheitToggle.classList.add("selected");
        celsiusToggle.classList.remove("selected");

        refreshPage();
        return;
    }
    return;
});

const locationInput = document.querySelector(".location-input");
const searchIcon = document.querySelector(".search-icon");
const clearSearchIcon = document.querySelector(".clear-form-icon");

locationInput.addEventListener("input", () => {
    if (locationInput.value.trim() !== "") {
        clearSearchIcon.classList.add("visible");
    } else {
        clearSearchIcon.classList.remove("visible");
    }
});

clearSearchIcon.addEventListener("click", () => {
    locationInput.value = "";
    clearSearchIcon.classList.remove("visible");
    locationInput.focus();
});

locationInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        submitSearch();
        clearSearchIcon.classList.remove("visible");
        locationInput.value = "";
    }
});

searchIcon.addEventListener("click", (e) => {
    e.preventDefault();
    submitSearch();
    clearSearchIcon.classList.remove("visible");
    locationInput.value = "";
});

function submitSearch() {
    const cityInput = locationInput.value.trim();
    if (cityInput) {
        city = cityInput;
        refreshPage();
    }
}

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

async function refreshPage() {
    weatherData = await getWeatherData();

    updatePageInformation();
}

let weatherData = await getWeatherData();
console.log(weatherData);

const address = document.querySelector(".address");
const currentWeatherIcon = document.querySelector(".current-weather-icon-div");
const weatherIcon = svgs[weatherData.currentConditions.icon];
const currentTemp = document.querySelector(".current-temp");
const currentConditions = document.querySelector(".current-conditions");
const minTemp = document.querySelector(".min-temp-value");
const maxTemp = document.querySelector(".max-temp-value");
const feelsLike = document.querySelector(".feels-like-value");
const sunriseValue = document.querySelector(".sunrise-value");
const rainValue = document.querySelector(".rain-value");
const humidityValue = document.querySelector(".humidity-value");
const windSpeedValue = document.querySelector(".wind-speed-value");
const pressureValue = document.querySelector(".pressure-value");
const sunsetValue = document.querySelector(".sunset-value");
const windDirectionValue = document.querySelector(".wind-direction-value");
const uvValue = document.querySelector(".uv-value");
const hourlyWeatherDiv = document.querySelector(".hourly-weather");
const weeklyWeatherDiv = document.querySelector(".weekly-weather");

// * Date formatting
function formatToAmPm(timeStr) {
    const parsedTime = parse(timeStr, "HH:mm:ss", new Date());
    return format(parsedTime, "hh:mm a");
}

function formatHour(timeStr) {
    const parsedDate = parse(timeStr, "HH:mm:ss", new Date());
    return format(parsedDate, "h a");
}

function getDayOfWeek(dateStr) {
    const date = parseISO(dateStr);

    if (isToday(date)) {
        return "Today";
    }
    return format(date, "EEEE");
}

function convertToCelsius(temp) {
    return (temp - 32) / 1.8;
}

function getGradient(minTemp, maxTemp) {
    if (units == "us") {
        minTemp = convertToCelsius(minTemp);
        maxTemp = convertToCelsius(maxTemp);
    }

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

function clearPageInformation() {
    weeklyWeatherDiv.innerHTML = "";
    hourlyWeatherDiv.innerHTML = "";
}

function updatePageInformation() {
    clearPageInformation();

    currentWeatherIcon.innerHTML = weatherIcon;
    address.innerHTML = `${weatherData.resolvedAddress} - ${formatToAmPm(
        weatherData.currentConditions.datetime
    )}`;
    currentTemp.innerHTML = `${Math.round(
        weatherData.currentConditions.temp
    )}&deg;`;
    currentConditions.innerHTML = `${weatherData.currentConditions.conditions}`;

    minTemp.innerHTML = `${Math.round(weatherData.days[0].tempmin)}&deg`;
    maxTemp.innerHTML = `${Math.round(weatherData.days[0].tempmax)}&deg`;
    feelsLike.innerHTML = `${Math.round(
        weatherData.currentConditions.feelslike
    )}&deg;`;

    sunriseValue.innerHTML = formatToAmPm(
        weatherData.currentConditions.sunrise
    );
    sunsetValue.innerHTML = formatToAmPm(weatherData.currentConditions.sunset);
    rainValue.innerHTML = `${weatherData.currentConditions.precipprob}%`;
    humidityValue.innerHTML = `${Math.round(
        weatherData.currentConditions.humidity
    )}%`;
    pressureValue.innerHTML = `${weatherData.currentConditions.pressure} mb`;
    windSpeedValue.innerHTML = `${weatherData.currentConditions.windspeed} ${windSpeedUnit}`;
    windDirectionValue.innerHTML = `${weatherData.currentConditions.winddir}&deg;`;
    uvValue.innerHTML = `${weatherData.currentConditions.uvindex}`;

    const hoursToday = weatherData.days[0].hours;
    hoursToday.forEach((hour) => {
        const hourStr = hour.datetime.split(":")[0];
        const hourNum = parseInt(hourStr, 10);

        if (hourNum % 2 === 0) {
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

    const weeklyWeather = weatherData.days;

    for (let i = 0; i < 7; i++) {
        const day = weeklyWeather[i];
        const weekdayName = getDayOfWeek(day.datetime);
        const minTemp = Math.round(day.tempmin);
        const maxTemp = Math.round(day.tempmax);
        const logo = svgs[`${day.icon}`];
        weeklyWeatherDiv.innerHTML += `
            <div class="weekday-container-div">
                <div class="weekday-name">${weekdayName}</div>
                <div class="weekday-weather-logo-div">${logo}</div>
                <div class="weekday-temp">
                    <div class="temp-low">${minTemp}&deg;</div>
                    <div class="temp-bar"></div>
                    <div class=temp-high">${maxTemp}&deg;</div>
                </div>
            </div>
            `;

        const weekdayLogo = document.querySelectorAll(
            ".weekday-weather-logo-div > svg"
        );
        weekdayLogo.forEach((logo) => {
            logo.classList.add("weekday-weather-icon");
            logo.classList.remove("weather-icon");
        });

        const tempBars = document.querySelectorAll(".temp-bar");
        tempBars.forEach((bar, index) => {
            const day = weeklyWeather[index];
            const gradient = getGradient(day.tempmin, day.tempmax);
            bar.style.backgroundImage = gradient;
        });
    }
}

updatePageInformation();
